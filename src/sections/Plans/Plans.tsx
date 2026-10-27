import {
  Container,
  DisplayHeading,
  SectionCopy,
  SectionHead,
} from '../../components/ui/Layout'
import { planContent, plans } from '../../data/plans'
import type { PlanId } from '../../types/plan'
import { Process } from '../Process/Process'
import { PlanCard } from './PlanCard'
import { PlanGrid, PlansSection } from './Plans.styles'

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
              {planContent.heading}
              <br />
              {planContent.headingSecondLine}{' '}
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
              onSelect={(button) => onSelect(plan.id, button)}
            />
          ))}
        </PlanGrid>
        <Process />
      </Container>
    </PlansSection>
  )
}
