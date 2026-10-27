import { consultationPolicy } from '../../src/data/consultationPolicy.ts'
import { calculateBudgetWithCoupon, plans } from '../../src/data/plans.ts'
import type {
  ConsultationResponse,
  SubmissionErrorCode,
} from '../../src/types/consultation.ts'
import { validReceipt, validatePayload } from './validation.ts'
import {
  checkDeliveryLimit,
  checkRateLimit,
  readConfig,
  sendMail,
  verifyTurnstile,
} from './services.ts'
import type { ConsultationEnv, Fetch } from './services.ts'

function json(
  body: ConsultationResponse,
  status: number,
  extra: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extra,
    },
  })
}
function failure(
  code: SubmissionErrorCode,
  status: number,
  extra?: Record<string, string>,
) {
  return json({ ok: false, code }, status, extra)
}

export async function boundedJson(
  request: Request,
  maxBytes: number = consultationPolicy.maxBodyBytes,
): Promise<unknown> {
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Invalid body')
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > maxBytes) {
        await reader.cancel()
        throw new RangeError('Body too large')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
}

// The adapter must supply a platform-authenticated IP, never a value from the JSON body.
export async function handleConsultation(
  request: Request,
  env: ConsultationEnv,
  ip: string | null,
  fetcher: Fetch = fetch,
): Promise<Response> {
  if (request.method !== 'POST')
    return failure('invalid_data', 405, { Allow: 'POST' })
  const config = readConfig(env)
  if (!config || !ip) return failure('unavailable', 503)
  if (request.headers.get('Origin') !== config.SITE_ORIGIN)
    return failure('forbidden', 403)
  if (
    request.headers.get('Content-Type')?.split(';')[0]?.trim().toLowerCase() !==
    'application/json'
  )
    return failure('invalid_data', 415)
  const length = request.headers.get('Content-Length')
  if (
    length &&
    (!/^\d+$/.test(length) || Number(length) > consultationPolicy.maxBodyBytes)
  )
    return failure('too_large', 413)
  try {
    const rate = await checkRateLimit(config, ip, fetcher)
    if (!rate.allowed)
      return failure('rate_limited', 429, {
        'Retry-After': String(rate.retryAfter),
      })
  } catch {
    return failure('unavailable', 503)
  }
  let data
  let raw: unknown
  try {
    raw = await boundedJson(request)
    data = validatePayload(raw)
  } catch (error) {
    return failure(
      error instanceof RangeError ? 'too_large' : 'invalid_data',
      error instanceof RangeError ? 413 : 400,
    )
  }
  if (!data) {
    if (
      raw &&
      typeof raw === 'object' &&
      !Array.isArray(raw) &&
      'planId' in raw &&
      raw.planId !== 'medida' &&
      plans.some((plan) => plan.id === raw.planId) &&
      (!('receipt' in raw) || !validReceipt(raw.receipt))
    )
      return failure('invalid_receipt', 400)
    return failure('invalid_data', 400)
  }
  if (data.planId !== 'medida') {
    try {
      const plan = plans.find((item) => item.id === data.planId)!
      if (
        !calculateBudgetWithCoupon(plan, data.selectedExtraIds, data.couponCode)
      )
        return failure('invalid_coupon', 400)
    } catch {
      return failure('unavailable', 503)
    }
  }
  try {
    if (!(await verifyTurnstile(config, data.turnstileToken, ip, fetcher)))
      return failure('invalid_token', 400)
  } catch {
    return failure('unavailable', 503)
  }
  try {
    const rate = await checkDeliveryLimit(config, fetcher)
    if (!rate.allowed)
      return failure('rate_limited', 429, {
        'Retry-After': String(rate.retryAfter),
      })
  } catch {
    return failure('unavailable', 503)
  }
  try {
    const id = await sendMail(config, data, fetcher)
    return json({ ok: true, id }, 200)
  } catch {
    return failure('mail_unconfirmed', 502)
  }
}
