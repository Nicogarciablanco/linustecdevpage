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
  if (window.turnstile) {
    const api = window.turnstile
    scriptPromise = new Promise((resolve, reject) => {
      let settled = false
      const timer = window.setTimeout(() => fail(), loadTimeoutMs)
      function fail() {
        if (settled) return
        settled = true
        scriptPromise = null
        reject(new Error('Turnstile unavailable'))
      }
      queueMicrotask(() => {
        try {
          api.ready(() => {
            if (settled) return
            settled = true
            window.clearTimeout(timer)
            resolve(api)
          })
        } catch {
          window.clearTimeout(timer)
          fail()
        }
      })
    })
    return scriptPromise
  }
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    let settled = false
    const timer = window.setTimeout(() => fail(), loadTimeoutMs)
    function fail() {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      script.remove()
      scriptPromise = null
      reject(new Error('Turnstile unavailable'))
    }
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onerror = fail
    script.onload = () => {
      if (!window.turnstile) {
        fail()
        return
      }
      try {
        window.turnstile.ready(() => {
          if (settled) return
          settled = true
          window.clearTimeout(timer)
          resolve(window.turnstile!)
        })
      } catch {
        fail()
      }
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}
