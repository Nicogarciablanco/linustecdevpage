import { ArrowUpRight } from '@carbon/icons-react'
import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import {
  Container,
  DisplayHeading,
  SectionCopy,
  SectionHead,
} from '../../components/ui/Layout'
import { planContent, plans } from '../../data/plans'
import { loadTurnstile } from '../../features/plan-configurator/turnstileLoader'
import type { PlanId } from '../../types/plan'
import { PlanCard } from './PlanCard'
import { PlanCursor, PlanGrid, PlansSection } from './Plans.styles'

export function Plans({
  onSelect,
  selectedId,
}: {
  onSelect: (id: PlanId, button: HTMLButtonElement) => void
  selectedId: PlanId | null
}) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorFrame = useRef<number | null>(null)
  const cursorPosition = useRef({ x: 0, y: 0 })
  const activeCard = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim())
      void loadTurnstile().catch(() => {
        // The configurator offers a retry if this early load fails.
      })
  }, [])

  useEffect(
    () => () => {
      if (cursorFrame.current !== null)
        window.cancelAnimationFrame(cursorFrame.current)
    },
    [],
  )

  function hideCursor() {
    if (cursorFrame.current !== null) {
      window.cancelAnimationFrame(cursorFrame.current)
      cursorFrame.current = null
    }
    if (activeCard.current) {
      activeCard.current.dataset.cursorActive = 'false'
      activeCard.current = null
    }
    if (cursorRef.current) cursorRef.current.dataset.visible = 'false'
  }

  function moveCursor(event: PointerEvent<HTMLElement>) {
    if (activeCard.current !== event.currentTarget) return
    cursorPosition.current.x = event.clientX
    cursorPosition.current.y = event.clientY
    if (cursorFrame.current !== null) return
    cursorFrame.current = -1
    const frame = window.requestAnimationFrame(() => {
      cursorFrame.current = null
      const cursor = cursorRef.current
      if (!cursor) return
      const { x, y } = cursorPosition.current
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      cursor.dataset.visible = 'true'
    })
    if (cursorFrame.current !== null) cursorFrame.current = frame
  }

  function showCursor(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType !== 'mouse' ||
      window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)')
        .matches
    ) {
      hideCursor()
      return
    }
    activeCard.current = event.currentTarget
    activeCard.current.dataset.cursorActive = 'true'
    moveCursor(event)
  }

  return (
    <PlansSection id="planes">
      <Container>
        <SectionHead>
          <div>
            <DisplayHeading>
              {planContent.heading}{' '}
              <span className="accent">{planContent.headingAccent}</span>
            </DisplayHeading>
            <SectionCopy>{planContent.introduction}</SectionCopy>
          </div>
        </SectionHead>
        <PlanGrid>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedId === plan.id}
              onPointerEnter={showCursor}
              onPointerMove={moveCursor}
              onPointerLeave={hideCursor}
              onPointerCancel={hideCursor}
              onSelect={(button) => {
                hideCursor()
                onSelect(plan.id, button)
              }}
            />
          ))}
        </PlanGrid>
        <p className="plans-note">{planContent.priceNote}</p>
        <PlanCursor ref={cursorRef} aria-hidden="true" data-visible="false">
          <ArrowUpRight size={24} aria-hidden="true" />
        </PlanCursor>
      </Container>
    </PlansSection>
  )
}
