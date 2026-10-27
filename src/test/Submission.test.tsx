import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { PlanConfigurator } from '../features/plan-configurator/PlanConfigurator'
import { plans, planContent } from '../data/plans'
import { theme } from '../app/styles/theme'

vi.mock('../features/plan-configurator/Turnstile', () => ({
  Turnstile: ({
    onToken,
    resetKey,
  }: {
    onToken: (token: string) => void
    resetKey: number
  }) => (
    <button type="button" onClick={() => onToken(`test-token-${resetKey}`)}>
      Completar verificación de prueba
    </button>
  ),
}))
beforeEach(() => {
  vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'public-test-key-not-a-secret')
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute('open')
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    value: vi.fn(),
  })
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

function review() {
  const onClose = vi.fn()
  render(
    <ThemeProvider theme={theme}>
      <PlanConfigurator
        plan={plans.find((plan) => plan.id === 'medida')!}
        opener={null}
        onClose={onClose}
      />
    </ThemeProvider>,
  )
  for (const [label, value] of [
    ['Tu nombre', 'Nicolás Pérez'],
    ['Negocio o actividad', 'Estudio Sur'],
    ['Correo electrónico', 'nico@example.com'],
    ['WhatsApp', '11 5555 4444'],
    ['¿Qué necesitás?', 'Proyecto con funciones propias.'],
  ] as const)
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  fireEvent.click(screen.getByRole('button', { name: 'Ver resumen' }))
  fireEvent.click(
    screen.getByRole('button', { name: 'Completar verificación de prueba' }),
  )
  return onClose
}

describe('consultation submission UI', () => {
  it('sends a priced request with its receipt and confirms manual payment review', async () => {
    let sentBody = ''
    const fetcher = vi.fn(async (url: string, init?: RequestInit) => {
      if (url !== '/api/consultations') throw new Error('Unexpected request')
      sentBody = String(init?.body)
      return Response.json({ ok: true, id: 'provider-confirmed-id' })
    })
    vi.stubGlobal('fetch', fetcher)
    const receipt = new File(['%PDF-1.4\n'], 'comprobante.pdf', {
      type: 'application/pdf',
    })
    Object.defineProperty(receipt, 'arrayBuffer', {
      value: async () => new TextEncoder().encode('%PDF-1.4\n').buffer,
    })
    render(
      <ThemeProvider theme={theme}>
        <PlanConfigurator plan={plans[0]!} opener={null} onClose={vi.fn()} />
      </ThemeProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Seguir sin extras' }))
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Completar solicitud' }),
      ).toBeEnabled(),
    )
    expect(screen.getByText(planContent.paymentAlias)).toBeInTheDocument()
    expect(screen.queryByText('LinusTec Prueba')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Tu selección')).toHaveTextContent('110.000')
    fireEvent.click(screen.getByRole('button', { name: 'Completar solicitud' }))
    for (const [label, value] of [
      ['Tu nombre', 'Nicolás Pérez'],
      ['Correo electrónico', 'nico@example.com'],
      ['WhatsApp', '11 5555 4444'],
    ] as const)
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    fireEvent.change(screen.getByLabelText('Comprobante de la transferencia'), {
      target: { files: [receipt] },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ver resumen' }))
    expect(screen.getByText('comprobante.pdf')).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: 'Completar verificación de prueba' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Enviar solicitud y comprobante' }),
    )
    await waitFor(() =>
      expect(
        screen.getByText(planContent.submission.success),
      ).toBeInTheDocument(),
    )
    const payload = JSON.parse(sentBody)
    expect(payload.receipt).toEqual({
      mediaType: 'application/pdf',
      content: btoa('%PDF-1.4\n'),
    })
    expect(payload).not.toHaveProperty('total')
    expect(payload).not.toHaveProperty('materialUrl')
  })
  it('sends the first consultation without requesting materials', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        Response.json({ ok: true, id: 'provider-confirmed-id' }),
      )
    vi.stubGlobal('fetch', fetcher)
    review()
    expect(
      screen.queryByLabelText('Enlace al material'),
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1))
    const payload = JSON.parse(fetcher.mock.calls[0]![1].body)
    expect(payload).not.toHaveProperty('materialUrl')
    expect(payload.planId).toBe('medida')
  })
  it('shows success only after a provider-confirmed response and prevents parallel submissions', async () => {
    let resolve!: (response: Response) => void
    const fetcher = vi.fn(
      () =>
        new Promise<Response>((done) => {
          resolve = done
        }),
    )
    vi.stubGlobal('fetch', fetcher)
    const onClose = review()
    const button = screen.getByRole('button', { name: 'Enviar consulta' })
    fireEvent.click(button)
    fireEvent.click(button)
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1))
    expect(
      screen.queryByText(planContent.submission.customSuccess),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Cerrar configurador' }),
    ).toBeDisabled()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
    resolve(Response.json({ ok: true, id: 'provider-confirmed-id' }))
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        planContent.submission.customSuccess,
      ),
    )
    expect(
      screen.getByRole('button', { name: 'Consulta enviada' }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Cerrar configurador' }),
    ).not.toBeDisabled()
  })
  it('retains the draft and reuses the request ID on a failed send and retry', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({ ok: false, code: 'mail_unconfirmed' }, { status: 502 }),
      )
      .mockResolvedValueOnce(
        Response.json({ ok: true, id: 'provider-confirmed-id' }),
      )
    vi.stubGlobal('fetch', fetcher)
    review()
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        planContent.submission.errors.mail_unconfirmed,
      ),
    )
    expect(screen.getByText('Nicolás Pérez')).toBeInTheDocument()
    expect(
      screen.getByText('Proyecto con funciones propias.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Enviar consulta' }),
    ).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(screen.getByLabelText('Tu nombre')).toHaveValue('Nicolás Pérez')
    fireEvent.click(screen.getByRole('button', { name: 'Ver resumen' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Completar verificación de prueba' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        planContent.submission.customSuccess,
      ),
    )
    const first = JSON.parse(fetcher.mock.calls[0]![1].body)
    const second = JSON.parse(fetcher.mock.calls[1]![1].body)
    expect(first.requestId).toBe(second.requestId)
    expect(first.contact).toEqual(second.contact)
    expect(first.turnstileToken).not.toBe(second.turnstileToken)
  })
  it('retries after Siteverify rejects a spent token without reloading', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({ ok: false, code: 'invalid_token' }, { status: 400 }),
      )
      .mockResolvedValueOnce(
        Response.json({ ok: true, id: 'provider-confirmed-id' }),
      )
    vi.stubGlobal('fetch', fetcher)
    review()
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        planContent.submission.errors.invalid_token,
      ),
    )
    expect(
      screen.getByRole('button', { name: 'Enviar consulta' }),
    ).toBeDisabled()
    fireEvent.click(
      screen.getByRole('button', { name: 'Completar verificación de prueba' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        planContent.submission.customSuccess,
      ),
    )
    const first = JSON.parse(fetcher.mock.calls[0]![1].body)
    const second = JSON.parse(fetcher.mock.calls[1]![1].body)
    expect(first.turnstileToken).not.toBe(second.turnstileToken)
  })
  it.each([
    Response.json({ ok: true }),
    Response.json({ ok: false, code: 'invalid_token' }, { status: 400 }),
    Response.json({ ok: false, code: 'rate_limited' }, { status: 429 }),
    new Response('<html>proxy error</html>', { status: 502 }),
  ])(
    'does not show success for malformed responses or rejection',
    async (response) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
      review()
      fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
      await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
      expect(
        screen.queryByText(planContent.submission.customSuccess),
      ).not.toBeInTheDocument()
      expect(screen.getByText('nico@example.com')).toBeInTheDocument()
    },
  )
})
