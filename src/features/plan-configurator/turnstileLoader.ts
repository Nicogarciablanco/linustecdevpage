export interface TurnstileApi {
  ready: (callback: () => void) => void
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null
const loadTimeoutMs = 30_000

export function loadTurnstile(): Promise<TurnstileApi> {
  if (scriptPromise) return scriptPromise
  let resolveLoad!: (api: TurnstileApi) => void
  let rejectLoad!: (error: Error) => void
  const pending = new Promise<TurnstileApi>((resolve, reject) => {
    resolveLoad = resolve
    rejectLoad = reject
  })
  scriptPromise = pending
  const script = document.createElement('script')
  let settled = false
  const timer = window.setTimeout(() => fail(), loadTimeoutMs)
  function fail() {
    if (settled) return
    settled = true
    window.clearTimeout(timer)
    script.remove()
    scriptPromise = null
    rejectLoad(new Error('Turnstile unavailable'))
  }
  script.src =
    'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
  script.async = true
  script.onerror = fail
  script.onload = () => {
    if (settled || !window.turnstile) {
      fail()
      return
    }
    const api = window.turnstile
    try {
      api.ready(() => {
        if (settled) return
        settled = true
        window.clearTimeout(timer)
        resolveLoad(api)
      })
    } catch {
      fail()
    }
  }
  try {
    document.head.appendChild(script)
  } catch {
    fail()
  }
  return pending
}
