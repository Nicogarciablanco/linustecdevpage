import { ArrowRight, ArrowUpRight, Checkmark } from '@carbon/icons-react'
import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import {
  Container,
  DisplayHeading,
  SectionCopy,
  SectionHead,
} from '../../components/ui/Layout'
import { plans } from '../../data/plans'
import type { PlanId } from '../../types/plan'
import {
  PlanButton,
  PlanCard,
  PlanCursor,
  PlanGrid,
  PlansSection,
} from './Plans.styles'

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
              Elegí un plan. Adaptalo a{' '}
              <span className="accent">tu negocio.</span>
            </DisplayHeading>
            <SectionCopy>
              Los planes se configuran online. Elegís una base, sumás extras y
              definís una primera versión de lo que necesitás.
            </SectionCopy>
          </div>
        </SectionHead>
        <PlanGrid>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              onPointerEnter={showCursor}
              onPointerMove={moveCursor}
              onPointerLeave={hideCursor}
              onPointerCancel={hideCursor}
            >
              <span className="number">
                {plan.number} / {plan.label}
              </span>
              <h3>{plan.headline}</h3>
              <p>{plan.audience}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Checkmark size={16} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <PlanButton
                type="button"
                aria-haspopup="dialog"
                aria-expanded={selectedId === plan.id}
                aria-controls={
                  selectedId === plan.id ? 'plan-dialog' : undefined
                }
                onClick={(event) => {
                  hideCursor()
                  onSelect(plan.id, event.currentTarget)
                }}
              >
                Configurar plan <ArrowRight size={16} aria-hidden="true" />
              </PlanButton>
            </PlanCard>
          ))}
        </PlanGrid>
        <PlanCursor ref={cursorRef} aria-hidden="true" data-visible="false">
          <ArrowUpRight size={24} aria-hidden="true" />
        </PlanCursor>
      </Container>
    </PlansSection>
  )
}
