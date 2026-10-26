import { consultationPolicy } from '../../src/data/consultationPolicy.ts'
import {
  formatPrice,
  plans,
  planContent,
  totalPrice,
} from '../../src/data/plans.ts'
import type { ConsultationPayload } from '../../src/types/consultation.ts'

export interface ConsultationEnv {
  SITE_ORIGIN?: string
  MAIL_PROVIDER?: string
  RESEND_API_KEY?: string
  MAIL_FROM?: string
  MAIL_TO?: string
  TURNSTILE_SECRET_KEY?: string
  UPSTASH_REDIS_REST_URL?: string
  UPSTASH_REDIS_REST_TOKEN?: string
  RATE_LIMIT_SECRET?: string
}

export type Config = Required<ConsultationEnv>
export type Fetch = typeof fetch

export function readConfig(env: ConsultationEnv): Config | null {
  const keys: (keyof ConsultationEnv)[] = [
    'SITE_ORIGIN',
    'MAIL_PROVIDER',
    'RESEND_API_KEY',
    'MAIL_FROM',
    'MAIL_TO',
    'TURNSTILE_SECRET_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'RATE_LIMIT_SECRET',
  ]
  if (keys.some((key) => typeof env[key] !== 'string' || !env[key]?.trim()))
    return null
  try {
    const origin = new URL(env.SITE_ORIGIN!)
    const redis = new URL(env.UPSTASH_REDIS_REST_URL!)
    const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
    if (
      origin.origin !== env.SITE_ORIGIN ||
      !['https:', 'http:'].includes(origin.protocol) ||
      (origin.protocol === 'http:' &&
        !['localhost', '127.0.0.1'].includes(origin.hostname))
    )
      return null
    if (
      redis.protocol !== 'https:' ||
      redis.username ||
      redis.password ||
      redis.pathname !== '/' ||
      redis.search ||
      redis.hash ||
      !redis.hostname.endsWith('.upstash.io')
    )
      return null
    if (
      env.MAIL_PROVIDER !== 'resend' ||
      !email.test(env.MAIL_FROM!) ||
      !email.test(env.MAIL_TO!) ||
      env.RATE_LIMIT_SECRET!.length < 32
    )
      return null
    return env as Config
  } catch {
    return null
  }
}

export async function digest(value: string) {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value),
  )
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

async function counter(
  config: Config,
  key: string,
  limit: number,
  seconds: number,
  fetcher: Fetch,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const script = `
    local n=tonumber(redis.call('GET',KEYS[1]) or '0')
    if n>=tonumber(ARGV[1]) then return {0,math.max(redis.call('TTL',KEYS[1]),1)} end
    if redis.call('INCR',KEYS[1])==1 then redis.call('EXPIRE',KEYS[1],ARGV[2]) end
    return {1,0}
  `
  const response = await fetcher(config.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      'EVAL',
      script,
      '1',
      key,
      String(limit),
      String(seconds),
    ]),
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error('Rate limit unavailable')
  const body: unknown = await response.json()
  const result =
    body && typeof body === 'object' && 'result' in body ? body.result : null
  if (
    !Array.isArray(result) ||
    result.length !== 2 ||
    ![0, 1].includes(result[0]) ||
    !Number.isInteger(result[1]) ||
    result[1] < 0 ||
    result[1] > seconds
  )
    throw new Error('Invalid rate limit response')
  return { allowed: result[0] === 1, retryAfter: result[1] }
}

export async function checkRateLimit(
  config: Config,
  ip: string,
  fetcher: Fetch,
) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(config.RATE_LIMIT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(ip),
  )
  const identifier = Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
  return counter(
    config,
    `linustec:${await digest(config.SITE_ORIGIN)}:ip:${identifier}`,
    5,
    900,
    fetcher,
  )
}

export function checkDeliveryLimit(config: Config, fetcher: Fetch) {
  return digest(config.SITE_ORIGIN).then((origin) =>
    counter(config, `linustec:${origin}:verified`, 60, 3600, fetcher),
  )
}

export async function verifyTurnstile(
  config: Config,
  token: string,
  ip: string,
  fetcher: Fetch,
): Promise<boolean> {
  const response = await fetcher(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: new URLSearchParams({
        secret: config.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
      signal: AbortSignal.timeout(8000),
    },
  )
  if (!response.ok) {
    console.warn('Turnstile Siteverify:', `http-${response.status}`)
    throw new Error('Turnstile unavailable')
  }
  const result: unknown = await response.json()
  if (!result || typeof result !== 'object') {
    console.warn('Turnstile Siteverify:', 'malformed-response')
    return false
  }
  if (!('success' in result) || result.success !== true) {
    const raw = 'error-codes' in result ? result['error-codes'] : undefined
    const codes = Array.isArray(raw)
      ? raw
          .filter(
            (code): code is string =>
              typeof code === 'string' && /^[a-z0-9-]{1,64}$/.test(code),
          )
          .slice(0, 8)
      : []
    console.warn('Turnstile Siteverify:', codes.join(',') || 'unknown-error')
    return false
  }
  if (
    !('hostname' in result) ||
    result.hostname !== new URL(config.SITE_ORIGIN).hostname
  ) {
    console.warn('Turnstile Siteverify:', 'hostname-mismatch')
    return false
  }
  if (!('action' in result) || result.action !== consultationPolicy.action) {
    console.warn('Turnstile Siteverify:', 'action-mismatch')
    return false
  }
  return true
}

export function emailText(data: ConsultationPayload): string {
  const plan = plans.find((item) => item.id === data.planId)!
  const choices = plan.choices.filter((item) =>
    data.selectedChoiceIds.includes(item.id),
  )
  const extras = plan.extras.filter((item) =>
    data.selectedExtraIds.includes(item.id),
  )
  return [
    `Consulta LinusTec — ${plan.name}`,
    `Referencia: ${data.requestId}`,
    `Base: ${formatPrice(plan.price)}`,
    ...choices.map((choice) => `${choice.name}: ${planContent.included}`),
    `${planContent.extrasLabel}: ${extras.length ? extras.map((extra) => extra.name).join(', ') : planContent.noExtras}`,
    ...extras.map((extra) => `${extra.name}: + ${formatPrice(extra.price)}`),
    `${planContent.totalLabel}: ${formatPrice(totalPrice([plan.price, ...extras.map((extra) => extra.price)]))}`,
    '',
    `${planContent.form.name.label}: ${data.contact.name}`,
    `${planContent.form.business.label}: ${data.contact.business}`,
    `${planContent.form.email.label}: ${data.contact.email}`,
    `${planContent.form.phone.label}: ${data.contact.phone}`,
    `${planContent.form.domainLabel}: ${planContent.domainOptions.find((option) => option.value === data.contact.domain)!.label}`,
    '',
    data.contact.message,
    '',
    `${plan.boundaryLabel}: ${plan.boundary}`,
    planContent.startCondition,
  ].join('\n')
}

export async function sendMail(
  config: Config,
  data: ConsultationPayload,
  fetcher: Fetch,
): Promise<string> {
  const payload = {
    from: config.MAIL_FROM,
    to: [config.MAIL_TO],
    reply_to: data.contact.email,
    subject: `Consulta LinusTec: ${plans.find((plan) => plan.id === data.planId)!.label}`,
    text: emailText(data),
  }
  // Retries with the same request and content reuse Resend's 24-hour idempotency key.
  const idempotencyKey = `linustec-${await digest(JSON.stringify({ requestId: data.requestId, payload }))}`
  const response = await fetcher('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error('Mail not confirmed')
  const result: unknown = await response.json()
  if (
    !result ||
    typeof result !== 'object' ||
    !('id' in result) ||
    typeof result.id !== 'string' ||
    !result.id.length ||
    result.id.length > 100
  )
    throw new Error('Mail not confirmed')
  return result.id
}
