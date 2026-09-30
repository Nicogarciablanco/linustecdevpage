import { useLayoutEffect, useState } from 'react'

export function useStickyHeader(trigger: HTMLElement | null) {
  const [isSticky, setIsSticky] = useState(false)

  useLayoutEffect(() => {
    if (!trigger) return
    const activationOffset = 112
    let frame: number | null = null

    const sync = () => {
      if (frame !== null && frame >= 0) cancelAnimationFrame(frame)
      frame = null
      setIsSticky(
        window.scrollY > 0 &&
          trigger.getBoundingClientRect().top <= activationOffset,
      )
    }

    const scheduleSync = () => {
      if (frame !== null) return
      frame = -1
      const nextFrame = requestAnimationFrame(() => {
        frame = null
        sync()
      })
      if (frame !== null) frame = nextFrame
    }

    const observer = new IntersectionObserver(sync, {
      threshold: 0,
      rootMargin: `-${activationOffset}px 0px 0px 0px`,
    })

    sync()
    observer.observe(trigger)
    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)
    window.addEventListener('pageshow', sync)
    window.addEventListener('hashchange', scheduleSync)
    window.addEventListener('popstate', scheduleSync)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
      window.removeEventListener('pageshow', sync)
      window.removeEventListener('hashchange', scheduleSync)
      window.removeEventListener('popstate', scheduleSync)
      if (frame !== null && frame >= 0) cancelAnimationFrame(frame)
    }
  }, [trigger])

  return isSticky
}
