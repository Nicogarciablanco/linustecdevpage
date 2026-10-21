import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { ThemeProvider } from 'styled-components'
import { App } from '../app/App'
import { theme } from '../app/styles/theme'
import { planContent } from '../data/plans'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  delete window.turnstile
  document
    .querySelectorAll('script[src*="turnstile"]')
    .forEach((script) => script.remove())
})

it('loads Turnstile at review and retries a widget error without reloading api.js', async () => {
  vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'public-test-site-key')
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn()
      disconnect = vi.fn()
    },
  )
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
  vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(1))
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
  const fetcher = vi.fn()
  vi.stubGlobal('fetch', fetcher)
  let widgetOptions: Record<string, unknown> = {}
  let widgetCount = 0
  const renderWidget = vi.fn(
    (_container: HTMLElement, options: Record<string, unknown>) => {
      widgetOptions = options
      return `widget-${++widgetCount}`
    },
  )
  const resetWidget = vi.fn()
  const removeWidget = vi.fn()
  const warnings = vi.spyOn(console, 'warn').mockImplementation(() => {})
  window.turnstile = {
    render: renderWidget,
    reset: resetWidget,
    remove: removeWidget,
  }
  const insert = vi.spyOn(document.head, 'appendChild')
  const insertedScripts = () =>
    insert.mock.calls.filter(([node]) => node instanceof HTMLScriptElement)
  const currentScript = () =>
    document.querySelector<HTMLScriptElement>(
      'script[src*="turnstile/v0/api.js"]',
    )

  render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>,
  )
  expect(insertedScripts()).toHaveLength(0)
  expect(currentScript()).toBeNull()

  fireEvent.click(
    screen.getAllByRole('button', { name: 'Configurar plan' })[0]!,
  )
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(insertedScripts()).toHaveLength(0)
  fireEvent.click(screen.getByRole('button', { name: 'Completar solicitud' }))
  expect(screen.getByLabelText('Tu nombre')).toBeInTheDocument()
  expect(insertedScripts()).toHaveLength(0)

  for (const [label, value] of [
    ['Tu nombre', 'Nicolás Pérez'],
    ['Negocio o actividad', 'Estudio Sur'],
    ['Correo electrónico', 'nico@example.com'],
    ['WhatsApp', '11 5555 4444'],
    ['¿Qué necesitás?', 'Carta y pedidos'],
    ['Enlace al material', 'https://drive.google.com/drive/folders/example'],
  ] as const)
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  fireEvent.click(screen.getByRole('button', { name: 'Ver resumen' }))
  expect(insertedScripts()).toHaveLength(1)
  const script = currentScript()!
  const callbackName = new URL(script.src).searchParams.get('onload')!
  expect(renderWidget).not.toHaveBeenCalled()
  await act(async () => {
    fireEvent.load(script)
    expect(renderWidget).not.toHaveBeenCalled()
    ;(Reflect.get(window, callbackName) as () => void)()
    await Promise.resolve()
  })
  expect(renderWidget).toHaveBeenCalledTimes(1)
  expect(widgetOptions.retry).toBe('never')
  expect(Reflect.get(window, callbackName)).toBeUndefined()
  await act(async () => {
    ;(widgetOptions.callback as (token: string) => void)('first-token')
  })
  expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeEnabled()
  await act(async () => {
    ;(widgetOptions['error-callback'] as (code: string) => void)('600010')
  })
  expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeDisabled()
  expect(resetWidget).not.toHaveBeenCalled()
  expect(warnings).toHaveBeenCalledWith('Turnstile error:', '600010')
  expect(JSON.stringify(warnings.mock.calls)).not.toContain('first-token')
  expect(screen.getByRole('alert')).toHaveTextContent(
    planContent.submission.verificationError,
  )

  fireEvent.click(
    screen.getByRole('button', {
      name: planContent.submission.retryVerification,
    }),
  )
  await waitFor(() => expect(renderWidget).toHaveBeenCalledTimes(2))
  expect(insertedScripts()).toHaveLength(1)
  expect(removeWidget).toHaveBeenCalledWith('widget-1')
  await act(async () => {
    ;(widgetOptions.callback as (token: string) => void)('fresh-token')
  })
  expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeEnabled()
  expect(fetcher).not.toHaveBeenCalled()

  fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
  expect(screen.getByLabelText('Tu nombre')).toHaveValue('Nicolás Pérez')
  fireEvent.click(screen.getByRole('button', { name: 'Ver resumen' }))
  await waitFor(() => expect(renderWidget).toHaveBeenCalledTimes(3))
  expect(insertedScripts()).toHaveLength(1)
  expect(fetcher).not.toHaveBeenCalled()
})
