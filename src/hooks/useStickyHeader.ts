import { useEffect, useState } from 'react'

export function useStickyHeader(trigger: HTMLElement | null) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    if (!trigger) return
    // Sit just beyond the 105px anchor offset so the 1px trigger fully exits the root.
    const activationOffset = 112
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setIsSticky(entry.boundingClientRect.top <= activationOffset)
      },
      { threshold: 0, rootMargin: `-${activationOffset}px 0px 0px 0px` },
    )
    observer.observe(trigger)
    return () => observer.disconnect()
  }, [trigger])

  return isSticky
}
