import { useEffect, useRef } from 'react'
import { consultationPolicy } from '../../data/consultationPolicy'
import { loadTurnstile } from './turnstileLoader'
import type { TurnstileApi } from './turnstileLoader'

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
    function resetExpiredWidget() {
      if (cancelled) return
      onToken('')
      if (!api || widget === undefined) return
      try {
        api.reset(widget)
      } catch {
        onUnavailable(true)
      }
    }
    function reportWidgetError(code?: unknown) {
      if (cancelled) return
      onToken('')
      onUnavailable(true)
      const errorCode =
        typeof code === 'number' && Number.isInteger(code) ? String(code) : code
      if (typeof errorCode === 'string' && /^\d{3,6}$/.test(errorCode))
        console.warn('Turnstile error:', errorCode)
    }
    void loadTurnstile()
      .then((loaded) => {
        if (cancelled || !container.current) return
        api = loaded
        try {
          widget = loaded.render(container.current, {
            sitekey: siteKey,
            action: consultationPolicy.action,
            size: 'compact',
            theme: 'light',
            retry: 'never',
            'refresh-expired': 'manual',
            'refresh-timeout': 'manual',
            callback: (token: string) => {
              if (!cancelled) {
                onUnavailable(false)
                onToken(token)
              }
            },
            'expired-callback': resetExpiredWidget,
            'error-callback': (code: unknown) => reportWidgetError(code),
            'timeout-callback': () => reportWidgetError(),
          })
        } catch {
          console.warn('Turnstile widget:', 'render-error')
          onUnavailable(true)
        }
      })
      .catch(() => {
        if (!cancelled) onUnavailable(true)
      })
    return () => {
      cancelled = true
      if (api && widget !== undefined) {
        try {
          api.remove(widget)
        } catch {
          // Turnstile may already have discarded a failed widget.
        }
      }
    }
  }, [siteKey, resetKey, onToken, onUnavailable])
  return <div ref={container} />
}
