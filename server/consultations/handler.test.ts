// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { handleConsultation } from './handler.ts'
import type { ConsultationEnv } from './services.ts'
import { consultationPolicy } from '../../src/data/consultationPolicy.ts'
import worker from '../worker.ts'
import { onRequest } from '../../functions/api/consultations.ts'

afterEach(() => vi.unstubAllGlobals())

const env: ConsultationEnv = {
  SITE_ORIGIN: 'https://linustec.example',
  MAIL_PROVIDER: 'resend',
  RESEND_API_KEY: 'test-not-a-real-key',
  MAIL_FROM: 'web@linustec.example',
  MAIL_TO: 'inbox@linustec.example',
  TURNSTILE_SECRET_KEY: 'test-not-a-real-secret',
  UPSTASH_REDIS_REST_URL: 'https://test.upstash.io',
  UPSTASH_REDIS_REST_TOKEN: 'test-not-a-real-token',
  RATE_LIMIT_SECRET: 'test-only-salt-at-least-32-characters',
}
const payload = () => ({
  requestId: 'ce479da2-acda-4d98-82fa-91da7390a281',
  planId: 'gastronomico',
  selectedChoiceIds: ['retiro'],
  selectedExtraIds: ['tables'],
  contact: {
    name: 'Nicolás Pérez',
    business: 'Café Sur',
    email: 'nico@example.com',
    phone: '+54 11 5555 4444',
    message: 'Quiero una carta con pedidos.',
    domain: 'register',
  },
  turnstileToken: 'test-token-not-valid-in-production',
})
function request(
  body: unknown = payload(),
  headers: Record<string, string> = {},
) {
  return new Request('https://linustec.example/api/consultations', {
    method: 'POST',
    headers: {
      Origin: env.SITE_ORIGIN!,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  })
}
function services(
  overrides: {
    rate?: unknown
    deliveryRate?: unknown
    turnstile?: unknown
    mail?: unknown
    mailStatus?: number
    down?: 'rate' | 'turnstile' | 'mail'
  } = {},
) {
  return vi.fn<typeof fetch>(async (input, options) => {
    const url = String(input)
    if (url.includes('upstash.io')) {
      if (overrides.down === 'rate') throw new Error('offline')
      const command = JSON.parse(options?.body as string) as string[]
      return Response.json(
        (command[3]?.endsWith(':verified')
          ? overrides.deliveryRate
          : overrides.rate) ?? { result: [1, 0] },
      )
    }
    if (url.includes('siteverify')) {
      if (overrides.down === 'turnstile') throw new Error('offline')
      return Response.json(
        overrides.turnstile ?? {
          success: true,
          hostname: 'linustec.example',
          action: consultationPolicy.action,
        },
      )
    }
    if (url === 'https://api.resend.com/emails') {
      if (overrides.down === 'mail')
        throw new Error('timeout; acceptance unknown')
      return Response.json(overrides.mail ?? { id: 'provider-confirmed-id' }, {
        status: overrides.mailStatus ?? 200,
      })
    }
    throw new Error('Unexpected URL')
  })
}
const ip = '192.0.2.1'

describe('consultation server', () => {
  it('fails closed without configuration or authenticated IP', async () => {
    const fetcher = services()
    expect((await handleConsultation(request(), {}, ip, fetcher)).status).toBe(
      503,
    )
    expect(
      (
        await handleConsultation(
          request(),
          { ...env, RESEND_API_KEY: undefined },
          ip,
          fetcher,
        )
      ).status,
    ).toBe(503)
    expect(
      (await handleConsultation(request(), env, null, fetcher)).status,
    ).toBe(503)
    expect(fetcher).not.toHaveBeenCalled()
  })
  it('rejects other origins, methods and content types', async () => {
    const fetcher = services()
    expect(
      (
        await handleConsultation(
          request(payload(), { Origin: 'https://attacker.example' }),
          env,
          ip,
          fetcher,
        )
      ).status,
    ).toBe(403)
    expect(
      (
        await handleConsultation(
          new Request('https://linustec.example/api/consultations'),
          env,
          ip,
          fetcher,
        )
      ).status,
    ).toBe(405)
    expect(
      (
        await handleConsultation(
          request(payload(), { 'Content-Type': 'text/plain' }),
          env,
          ip,
          fetcher,
        )
      ).status,
    ).toBe(415)
    expect(fetcher).not.toHaveBeenCalled()
  })
  it('limits the body before parsing, including without Content-Length', async () => {
    const fetcher = services()
    expect(
      (
        await handleConsultation(
          request(payload(), {
            'Content-Length': String(consultationPolicy.maxBodyBytes + 1),
          }),
          env,
          ip,
          fetcher,
        )
      ).status,
    ).toBe(413)
    expect(fetcher).not.toHaveBeenCalled()
    const large = new Request('https://linustec.example/api/consultations', {
      method: 'POST',
      headers: { Origin: env.SITE_ORIGIN!, 'Content-Type': 'application/json' },
      body: 'x'.repeat(consultationPolicy.maxBodyBytes + 1),
    })
    expect((await handleConsultation(large, env, ip, fetcher)).status).toBe(413)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
  it.each([
    { planId: 'hotel' },
    { selectedExtraIds: ['catalogpanel'] },
    { selectedChoiceIds: ['retiro', 'retiro'] },
    {
      contact: {
        ...payload().contact,
        email: 'nico@example.com\r\nBcc:other@example.com',
      },
    },
    { contact: { ...payload().contact, message: '' } },
    { contact: { ...payload().contact, message: 'x'.repeat(6001) } },
    { materialUrl: 'https://files.example.com/shared' },
    { mailTo: 'attacker@example.com' },
    { files: [] },
  ])(
    'rejects invalid or manipulated data before token verification: %o',
    async (patch) => {
      const fetcher = services()
      const response = await handleConsultation(
        request({ ...payload(), ...patch }),
        env,
        ip,
        fetcher,
      )
      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ ok: false, code: 'invalid_data' })
      expect(fetcher).toHaveBeenCalledTimes(1)
    },
  )
  it.each([
    {
      turnstile: { success: false, 'error-codes': ['invalid-input-response'] },
      diagnostic: 'invalid-input-response',
    },
    {
      turnstile: { success: false, 'error-codes': ['timeout-or-duplicate'] },
      diagnostic: 'timeout-or-duplicate',
    },
    {
      turnstile: {
        success: true,
        hostname: 'attacker.example',
        action: consultationPolicy.action,
      },
      diagnostic: 'hostname-mismatch',
    },
    {
      turnstile: {
        success: true,
        hostname: 'linustec.example',
        action: 'another-form',
      },
      diagnostic: 'action-mismatch',
    },
  ])(
    'rejects invalid, expired, replayed or wrong-context Turnstile tokens: %o',
    async ({ turnstile, diagnostic }) => {
      const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const fetcher = services({ turnstile })
      const response = await handleConsultation(request(), env, ip, fetcher)
      expect(await response.json()).toEqual({
        ok: false,
        code: 'invalid_token',
      })
      expect(response.status).toBe(400)
      expect(fetcher).toHaveBeenCalledTimes(2)
      expect(warning).toHaveBeenCalledWith('Turnstile Siteverify:', diagnostic)
      expect(JSON.stringify(warning.mock.calls)).not.toContain(
        payload().turnstileToken,
      )
      expect(JSON.stringify(warning.mock.calls)).not.toContain(
        env.TURNSTILE_SECRET_KEY,
      )
      warning.mockRestore()
    },
  )
  it('returns 429 without verifying or sending when the shared limit is exceeded', async () => {
    const fetcher = services({ rate: { result: [0, 900] } })
    const response = await handleConsultation(request(), env, ip, fetcher)
    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBe('900')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
  it('consumes the global quota only after successful Turnstile verification', async () => {
    const fetcher = services({ deliveryRate: { result: [0, 3600] } })
    const response = await handleConsultation(request(), env, ip, fetcher)
    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBe('3600')
    expect(fetcher.mock.calls.map(([url]) => String(url))).toEqual([
      env.UPSTASH_REDIS_REST_URL,
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      env.UPSTASH_REDIS_REST_URL,
    ])
  })
  it.each(['rate', 'turnstile'] as const)(
    'fails closed if %s is unavailable',
    async (down) => {
      const fetcher = services({ down })
      expect(
        (await handleConsultation(request(), env, ip, fetcher)).status,
      ).toBe(503)
      expect(
        fetcher.mock.calls.some(([url]) => String(url).includes('resend')),
      ).toBe(false)
    },
  )
  it.each([{ mailStatus: 403 }, { mail: {} }, { down: 'mail' as const }])(
    'never confirms mail on provider failure: %o',
    async (override) => {
      const response = await handleConsultation(
        request(),
        env,
        ip,
        services(override),
      )
      expect(response.status).toBe(502)
      expect(await response.json()).toEqual({
        ok: false,
        code: 'mail_unconfirmed',
      })
    },
  )
  it('sends to the server-configured destination only, using authoritative plan data and plain text', async () => {
    const fetcher = services()
    const data = payload()
    const response = await handleConsultation(request(data), env, ip, fetcher)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      ok: true,
      id: 'provider-confirmed-id',
    })
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    const sent = JSON.parse(
      fetcher.mock.calls.find(([url]) => String(url).includes('resend'))![1]!
        .body as string,
    )
    expect(sent.to).toEqual([env.MAIL_TO])
    expect(sent.from).toBe(env.MAIL_FROM)
    expect(sent.reply_to).toBe(data.contact.email)
    expect(sent.text).toContain('Extras: Reservas de mesas')
    expect(sent.text).toContain('Reservas de mesas: + AR$***')
    expect(sent.text).not.toContain('Enlace al material')
    expect(sent.html).toBeUndefined()
    expect(sent.attachments).toBeUndefined()
    const rateCommand = fetcher.mock.calls[0]![1]!.body as string
    expect(rateCommand).not.toContain(ip)
  })
  it('reuses the provider idempotency key for retries with a renewed token', async () => {
    const fetcher = services()
    await handleConsultation(request(), env, ip, fetcher)
    await handleConsultation(
      request({ ...payload(), turnstileToken: 'new-token' }),
      env,
      ip,
      fetcher,
    )
    const headers = fetcher.mock.calls
      .filter(([url]) => String(url).includes('resend'))
      .map(([, options]) => options!.headers as Record<string, string>)
    expect(headers[0]!['Idempotency-Key']).toBe(headers[1]!['Idempotency-Key'])
  })
  it('routes Cloudflare Pages and Workers to the same API, never to the assets fallback', async () => {
    const fetcher = services()
    vi.stubGlobal('fetch', fetcher)
    const pagesRequest = request(payload(), { 'CF-Connecting-IP': ip })
    expect((await onRequest({ request: pagesRequest, env })).status).toBe(200)
    const assets = {
      fetch: vi.fn().mockResolvedValue(new Response('<html>home</html>')),
    }
    expect(
      (
        await worker.fetch(request(payload(), { 'CF-Connecting-IP': ip }), {
          ...env,
          ASSETS: assets,
        })
      ).status,
    ).toBe(200)
    expect(assets.fetch).not.toHaveBeenCalled()
    expect(
      (
        await worker.fetch(new Request('https://linustec.example/'), {
          ...env,
          ASSETS: assets,
        })
      ).status,
    ).toBe(200)
    expect(assets.fetch).toHaveBeenCalledTimes(1)
    expect(
      (
        await worker.fetch(
          new Request('https://linustec.example/api/unknown'),
          { ...env, ASSETS: assets },
        )
      ).status,
    ).toBe(404)
    expect((await onRequest({ request: request(), env })).status).toBe(503)
  })
})
