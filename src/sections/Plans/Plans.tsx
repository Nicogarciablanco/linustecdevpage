import { ArrowRight, Checkmark } from '@carbon/icons-react'
import {
  Container,
  DisplayHeading,
  SectionCopy,
  SectionHead,
} from '../../components/ui/Layout'
import { plans } from '../../data/plans'
import type { PlanId } from '../../types/plan'
import { PlanButton, PlanCard, PlanGrid, PlansSection } from './Plans.styles'

export function Plans({
  onSelect,
  selectedId,
}: {
  onSelect: (id: PlanId, button: HTMLButtonElement) => void
  selectedId: PlanId | null
}) {
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
            <PlanCard key={plan.id} $featured={!!plan.featured}>
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
                onClick={(event) => onSelect(plan.id, event.currentTarget)}
              >
                Configurar plan <ArrowRight size={16} aria-hidden="true" />
              </PlanButton>
            </PlanCard>
          ))}
        </PlanGrid>
      </Container>
    </PlansSection>
  )
}
