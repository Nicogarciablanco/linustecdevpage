export interface TurnstileApi {
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
let loadAttempt = 0
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
  const callbackName = `__linustecTurnstileLoaded${++loadAttempt}`
  let settled = false
  const timer = window.setTimeout(() => fail('timeout'), loadTimeoutMs)
  function fail(
    reason: 'timeout' | 'script-error' | 'api-unavailable' | 'append-error',
  ) {
    if (settled) return
    settled = true
    window.clearTimeout(timer)
    Reflect.deleteProperty(window, callbackName)
    script.remove()
    scriptPromise = null
    console.warn('Turnstile load:', reason)
    rejectLoad(new Error('Turnstile unavailable'))
  }
  Reflect.set(window, callbackName, () => {
    if (settled) return
    const api = window.turnstile
    if (!api || typeof api.render !== 'function') {
      fail('api-unavailable')
      return
    }
    settled = true
    window.clearTimeout(timer)
    Reflect.deleteProperty(window, callbackName)
    resolveLoad(api)
  })
  script.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${callbackName}`
  script.async = true
  script.onerror = () => fail('script-error')
  try {
    document.head.appendChild(script)
  } catch {
    fail('append-error')
  }
  return pending
}
