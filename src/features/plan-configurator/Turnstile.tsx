import { useEffect, useRef } from 'react'
import { consultationPolicy } from '../../data/consultationPolicy'

interface TurnstileApi {
  ready: (callback: () => void) => void
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  remove: (widgetId: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const timer = window.setTimeout(() => fail(), 15000)
    function fail() {
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
      window.turnstile.ready(() => {
        window.clearTimeout(timer)
        resolve(window.turnstile!)
      })
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

export function Turnstile({
  siteKey,
  resetKey,
  onToken,
  onUnavailable,
}: {
  siteKey: string
  resetKey: number
  onToken: (token: string) => void
  onUnavailable: (unavailable: boolean) => void
}) {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let cancelled = false
    let widget: string | undefined
    let api: TurnstileApi | undefined
    onToken('')
    onUnavailable(false)
    void loadTurnstile()
      .then((loaded) => {
        if (cancelled || !container.current) return
        api = loaded
        widget = loaded.render(container.current, {
          sitekey: siteKey,
          action: consultationPolicy.action,
          size: 'compact',
          theme: 'light',
          callback: (token: string) => {
            if (!cancelled) {
              onUnavailable(false)
              onToken(token)
            }
          },
          'expired-callback': () => {
            if (!cancelled) onToken('')
          },
          'error-callback': () => {
            if (!cancelled) {
              onToken('')
              onUnavailable(true)
            }
          },
          'timeout-callback': () => {
            if (!cancelled) {
              onToken('')
              onUnavailable(true)
            }
          },
        })
      })
      .catch(() => {
        if (!cancelled) onUnavailable(true)
      })
    return () => {
      cancelled = true
      if (api && widget !== undefined) api.remove(widget)
    }
  }, [siteKey, resetKey, onToken, onUnavailable])
  return <div ref={container} />
}
