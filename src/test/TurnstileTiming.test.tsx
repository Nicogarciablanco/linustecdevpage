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

it('loads Turnstile at review, retries a failed load and reuses the successful script', async () => {
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
  let ready: (() => void) | undefined
  let widgetOptions: Record<string, unknown> = {}
  const renderWidget = vi.fn(
    (_container: HTMLElement, options: Record<string, unknown>) => {
      widgetOptions = options
      return 'widget-1'
    },
  )
  window.turnstile = {
    ready: (callback) => {
      ready = callback
    },
    render: renderWidget,
    reset: vi.fn(),
    remove: vi.fn(),
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
  const failedScript = currentScript()!
  expect(renderWidget).not.toHaveBeenCalled()
  await act(async () => {
    fireEvent.error(failedScript)
  })
  expect(failedScript.isConnected).toBe(false)
  expect(screen.getByRole('alert')).toHaveTextContent(
    planContent.submission.verificationError,
  )

  fireEvent.click(
    screen.getByRole('button', {
      name: planContent.submission.retryVerification,
    }),
  )
  expect(insertedScripts()).toHaveLength(2)
  const retryScript = currentScript()!
  expect(retryScript).not.toBe(failedScript)
  expect(
    document.querySelectorAll('script[src*="turnstile/v0/api.js"]'),
  ).toHaveLength(1)
  await act(async () => {
    fireEvent.load(retryScript)
    ready!()
    await Promise.resolve()
  })
  expect(renderWidget).toHaveBeenCalledTimes(1)
  await act(async () => {
    ;(widgetOptions.callback as (token: string) => void)('fresh-token')
  })
  expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeEnabled()
  expect(fetcher).not.toHaveBeenCalled()

  fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
  expect(screen.getByLabelText('Tu nombre')).toHaveValue('Nicolás Pérez')
  fireEvent.click(screen.getByRole('button', { name: 'Ver resumen' }))
  await waitFor(() => expect(renderWidget).toHaveBeenCalledTimes(2))
  expect(insertedScripts()).toHaveLength(2)
  expect(fetcher).not.toHaveBeenCalled()
})
