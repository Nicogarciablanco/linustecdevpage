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
    let errorResetAttempted = false
    onToken('')
    onUnavailable(false)
    function resetWidget(reportError: boolean) {
      if (cancelled) return
      onToken('')
      if (reportError) onUnavailable(true)
      if (!api || widget === undefined) return
      if (reportError && errorResetAttempted) return
      if (reportError) errorResetAttempted = true
      try {
        api.reset(widget)
      } catch {
        onUnavailable(true)
      }
    }
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
              errorResetAttempted = false
              onUnavailable(false)
              onToken(token)
            }
          },
          'expired-callback': () => resetWidget(false),
          'error-callback': () => resetWidget(true),
          'timeout-callback': () => resetWidget(true),
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
