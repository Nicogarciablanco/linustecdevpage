import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

export function useHorizontalDrag() {
  const [isDragging, setIsDragging] = useState(false)
  const drag = useRef<{ x: number; scrollLeft: number; moved: boolean } | null>(
    null,
  )
  const suppressClick = useRef(false)

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    if (
      event.target instanceof Element &&
      event.target.closest(
        'a:not([data-project-card-link]), button, input, textarea, select, [contenteditable="true"]',
      )
    )
      return
    const target = event.currentTarget
    suppressClick.current = false
    drag.current = {
      x: event.clientX,
      scrollLeft: target.scrollLeft,
      moved: false,
    }
  }
  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (!drag.current) return
    const delta = event.clientX - drag.current.x
    if (!drag.current.moved && Math.abs(delta) > 4) {
      drag.current.moved = true
      event.currentTarget.style.removeProperty('scroll-snap-type')
      event.currentTarget.setPointerCapture(event.pointerId)
      setIsDragging(true)
    }
    if (!drag.current.moved) return
    event.currentTarget.scrollLeft = drag.current.scrollLeft - delta
  }
  function onPointerEnd(event: ReactPointerEvent<HTMLElement>) {
    if (!drag.current) return
    const wasDragged = drag.current.moved
    suppressClick.current = wasDragged
    drag.current = null
    if (wasDragged) setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function onClickCapture(event: React.MouseEvent<HTMLElement>) {
    if (!suppressClick.current) return
    suppressClick.current = false
    if (event.detail === 0) return
    event.preventDefault()
    event.stopPropagation()
  }

  return {
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerEnd,
    onClickCapture,
  }
}
