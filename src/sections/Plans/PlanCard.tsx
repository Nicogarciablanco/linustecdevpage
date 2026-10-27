import { ArrowRight } from '@carbon/icons-react'
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
  onSelect: (button: HTMLButtonElement) => void
}

export function PlanCard({ plan, selected, onSelect }: Props) {
  return (
    <PlanArticle aria-labelledby={`plan-title-${plan.id}`}>
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
          {plan.id === 'medida' ? (
            <PlanSecondaryButton
              type="button"
              aria-haspopup="dialog"
              aria-expanded={selected}
              aria-controls={selected ? 'plan-dialog' : undefined}
              onClick={(event) => onSelect(event.currentTarget)}
            >
              {planContent.customAction}
            </PlanSecondaryButton>
          ) : (
            <PlanButton
              type="button"
              aria-haspopup="dialog"
              aria-expanded={selected}
              aria-controls={selected ? 'plan-dialog' : undefined}
              onClick={(event) => onSelect(event.currentTarget)}
            >
              {planContent.baseAction}{' '}
              <ArrowRight size={16} aria-hidden="true" />
            </PlanButton>
          )}
        </div>
      </div>
      <div className="plan-details">
        <p className="base-label">{plan.inclusionLabel}</p>
        <PlanInclusions>
          {plan.inclusions.map((item) => (
            <li key={item.title}>{item.title}</li>
          ))}
        </PlanInclusions>
      </div>
      <a className="plan-detail-link" href={`/planes/${plan.id}`}>
        {planContent.detailAction} <ArrowRight size={16} aria-hidden="true" />
      </a>
    </PlanArticle>
  )
}
