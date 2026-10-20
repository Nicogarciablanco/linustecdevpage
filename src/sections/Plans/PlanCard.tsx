import { ArrowRight } from '@carbon/icons-react'
import { useRef } from 'react'
import type { PointerEvent } from 'react'
import { formatPrice, planContent } from '../../data/plans'
import type { Plan } from '../../types/plan'
import { PlanArticle, PlanButton, PlanInclusions } from './Plans.styles'

type Props = {
  plan: Plan
  selected: boolean
  onSelect: (button: HTMLButtonElement) => void
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
  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <PlanArticle
      {...pointerHandlers}
      aria-labelledby={`plan-title-${plan.id}`}
      onClick={(event) => {
        if ((event.target as Element).closest('button, details')) return
        if (buttonRef.current) onSelect(buttonRef.current)
      }}
    >
      <div className="plan-overview">
        <span className="number">
          {plan.number} / {plan.label}
        </span>
        <h3 id={`plan-title-${plan.id}`}>{plan.headline}</h3>
        <p className="audience">{plan.audience}</p>
        <div className="price">
          <span>{plan.priceLabel}</span>
          <strong>{formatPrice(plan.price)}</strong>
        </div>
        <PlanButton
          ref={buttonRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={selected}
          aria-controls={selected ? 'plan-dialog' : undefined}
          onClick={(event) => onSelect(event.currentTarget)}
        >
          {plan.id === 'medida'
            ? planContent.customConfigure
            : planContent.configure}
          <ArrowRight size={16} aria-hidden="true" />
        </PlanButton>
      </div>
      <div className="plan-details">
        <details>
          <summary>{planContent.disclosures.included}</summary>
          <div className="disclosure-content">
            <p className="base-label">{plan.inclusionLabel}</p>
            <PlanInclusions>
              {plan.inclusions.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </li>
              ))}
            </PlanInclusions>
          </div>
        </details>
        <details>
          <summary>{planContent.disclosures.extras}</summary>
          <div className="disclosure-content">
            <div className="boundary">
              <strong>{plan.boundaryLabel}</strong>
              <p>{plan.boundary}</p>
            </div>
            {plan.extras.length > 0 && (
              <ul className="extras-list">
                {plan.extras.map((extra) => (
                  <li key={extra.id}>
                    <div>
                      <strong>{extra.name}</strong>
                      <p>{extra.description}</p>
                    </div>
                    <b>+ {formatPrice(extra.price)}</b>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
        <details>
          <summary>{planContent.disclosures.material}</summary>
          <ul className="material-list disclosure-content">
            {plan.material.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
      </div>
    </PlanArticle>
  )
}
