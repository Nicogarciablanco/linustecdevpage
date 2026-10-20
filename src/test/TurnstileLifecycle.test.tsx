import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { ThemeProvider } from 'styled-components'
import { theme } from '../app/styles/theme'
import { plans, planContent } from '../data/plans'
import { PlanConfigurator } from '../features/plan-configurator/PlanConfigurator'
import { loadTurnstile } from '../features/plan-configurator/turnstileLoader'

function openReview() {
  render(
    <ThemeProvider theme={theme}>
      <PlanConfigurator
        plan={plans.find((plan) => plan.id === 'medida')!}
        opener={null}
        onClose={vi.fn()}
      />
    </ThemeProvider>,
  )
  for (const [label, value] of [
    ['Tu nombre', 'Nicolás Pérez'],
    ['Negocio o actividad', 'Estudio Sur'],
    ['Correo electrónico', 'nico@example.com'],
    ['WhatsApp', '11 5555 4444'],
    ['¿Qué necesitás?', 'Proyecto con funciones propias.'],
    ['Enlace al material', 'https://drive.google.com/drive/folders/example'],
  ] as const)
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  fireEvent.click(screen.getByRole('button', { name: 'Ver resumen' }))
}

function installDialogMethods() {
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
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  delete window.turnstile
  document
    .querySelectorAll('script[src*="turnstile"]')
    .forEach((script) => script.remove())
})

it('submits on cold load, then replaces expired, errored and stale tokens', async () => {
  vi.useFakeTimers()
  vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'public-test-site-key')
  installDialogMethods()
  const fetcher = vi
    .fn()
    .mockImplementation(() =>
      Promise.resolve(Response.json({ ok: true, id: 'provider-confirmed-id' })),
    )
  vi.stubGlobal('fetch', fetcher)
  const loading = loadTurnstile()
  let ready: (() => void) | undefined
  let options: Record<string, unknown> = {}
  const reset = vi.fn()
  const renderWidget = vi.fn(
    (_container: HTMLElement, settings: Record<string, unknown>) => {
      options = settings
      return 'widget-1'
    },
  )
  window.turnstile = {
    ready: (callback) => {
      ready = callback
    },
    render: renderWidget,
    reset,
    remove: vi.fn(),
  }
  openReview()
  expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeDisabled()
  await act(async () => {
    await vi.advanceTimersByTimeAsync(16_000)
    fireEvent.load(
      document.querySelector('script[src*="turnstile/v0/api.js"]')!,
    )
    expect(renderWidget).not.toHaveBeenCalled()
    ready!()
    await loading
  })
  await act(async () => {
    ;(options.callback as (token: string) => void)('first-token')
  })
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    await Promise.resolve()
  })
  expect(fetcher).toHaveBeenCalledTimes(1)
  expect(JSON.parse(fetcher.mock.calls[0]![1].body).turnstileToken).toBe(
    'first-token',
  )
  expect(screen.getByRole('status')).toHaveTextContent(
    planContent.submission.success,
  )
  cleanup()
  openReview()
  await act(async () => {
    await Promise.resolve()
  })
  expect(options.sitekey).toBe('public-test-site-key')
  await act(async () => {
    ;(options.callback as (token: string) => void)('second-token')
  })
  expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeEnabled()
  await act(async () => {
    ;(options['expired-callback'] as () => void)()
  })
  expect(reset).toHaveBeenCalledWith('widget-1')
  expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeDisabled()
  await act(async () => {
    ;(options.callback as (token: string) => void)('third-token')
  })
  await act(async () => {
    ;(options['error-callback'] as () => void)()
  })
  expect(reset).toHaveBeenCalledTimes(2)
  expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeDisabled()
  expect(screen.getByRole('alert')).toHaveTextContent(
    planContent.submission.verificationError,
  )
  await act(async () => {
    ;(options.callback as (token: string) => void)('fresh-token')
  })
  expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeEnabled()
  vi.setSystemTime(Date.now() + 285_001)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    await Promise.resolve()
  })
  expect(fetcher).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeDisabled()
  await act(async () => {
    ;(options.callback as (token: string) => void)('current-token')
  })
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    await Promise.resolve()
  })
  expect(fetcher).toHaveBeenCalledTimes(2)
  expect(JSON.parse(fetcher.mock.calls[1]![1].body).turnstileToken).toBe(
    'current-token',
  )
  expect(screen.getByRole('status')).toHaveTextContent(
    planContent.submission.success,
  )
})
