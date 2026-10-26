import { ArrowRight } from '@carbon/icons-react'
import { useRef } from 'react'
import type { PointerEvent } from 'react'
import { formatPrice, planContent } from '../../data/plans'
import type { Plan } from '../../types/plan'
import {
  PlanArticle,
  PlanButton,
  PlanInclusions,
  PlanSecondaryButton,
} from './Plans.styles'

type Props = {
  plan: Plan
  selected: boolean
  onSelect: (button: HTMLButtonElement, entry: 'base' | 'customize') => void
  onPointerEnter: (event: PointerEvent<HTMLElement>) => void
  onPointerMove: (event: PointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
  onPointerCancel: () => void
}

export function PlanCard({
  plan,
  selected,
  onSelect,
  ...pointerHandlers
}: Props) {
  const customizeRef = useRef<HTMLButtonElement>(null)
  return (
    <PlanArticle
      {...pointerHandlers}
      aria-labelledby={`plan-title-${plan.id}`}
      onClick={(event) => {
        if ((event.target as Element).closest('button')) return
        if (customizeRef.current) onSelect(customizeRef.current, 'customize')
      }}
    >
      <div className="plan-overview">
        <span className="number">
          {plan.number} / {plan.label}
        </span>
        <h3 id={`plan-title-${plan.id}`}>{plan.headline}</h3>
        <p className="audience">{plan.audience}</p>
        <div className="price">
          <strong>{formatPrice(plan.price)}</strong>
        </div>
        <div className="plan-actions">
          {plan.id !== 'medida' && (
            <PlanButton
              type="button"
              aria-haspopup="dialog"
              aria-expanded={selected}
              aria-controls={selected ? 'plan-dialog' : undefined}
              onClick={(event) => onSelect(event.currentTarget, 'base')}
            >
              {planContent.baseAction}{' '}
              <ArrowRight size={16} aria-hidden="true" />
            </PlanButton>
          )}
          <PlanSecondaryButton
            ref={customizeRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={selected}
            aria-controls={selected ? 'plan-dialog' : undefined}
            onClick={(event) => onSelect(event.currentTarget, 'customize')}
          >
            {plan.id === 'medida'
              ? planContent.customAction
              : planContent.customizeAction}
          </PlanSecondaryButton>
        </div>
      </div>
      <div className="plan-details">
        <p className="base-label">{plan.inclusionLabel}</p>
        <PlanInclusions>
          {plan.inclusions.map((item) => (
            <li key={item.title}>{item.title}</li>
          ))}
        </PlanInclusions>
        <div className="boundary">
          <strong>{plan.boundaryLabel}</strong>
          <p>{plan.boundary}</p>
        </div>
      </div>
    </PlanArticle>
  )
}
