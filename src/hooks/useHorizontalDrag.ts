import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

export function useHorizontalDrag() {
  const [isDragging, setIsDragging] = useState(false)
  const drag = useRef<{ x: number; scrollLeft: number } | null>(null)

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    if (
      event.target instanceof Element &&
      event.target.closest(
        'a, button, input, textarea, select, [contenteditable="true"]',
      )
    )
      return
    const target = event.currentTarget
    drag.current = { x: event.clientX, scrollLeft: target.scrollLeft }
    setIsDragging(true)
    target.setPointerCapture(event.pointerId)
  }
  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (!drag.current) return
    event.currentTarget.scrollLeft =
      drag.current.scrollLeft - (event.clientX - drag.current.x)
  }
  function onPointerEnd(event: ReactPointerEvent<HTMLElement>) {
    if (!drag.current) return
    drag.current = null
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }
  return { isDragging, onPointerDown, onPointerMove, onPointerEnd }
}
