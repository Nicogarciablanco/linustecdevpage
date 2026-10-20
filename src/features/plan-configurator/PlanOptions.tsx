import { formatPrice, planContent } from '../../data/plans'
import type { Plan } from '../../types/plan'
import { CheckOption, ChoiceList, FieldTitle } from './PlanConfigurator.styles'

export function PlanOptions({
  plan,
  selectedChoices,
  selectedExtras,
  onChoiceChange,
  onExtraChange,
}: {
  plan: Plan
  selectedChoices: string[]
  selectedExtras: string[]
  onChoiceChange: (id: string, checked: boolean) => void
  onExtraChange: (id: string, checked: boolean) => void
}) {
  return (
    <div>
      <FieldTitle>{planContent.includedOptions}</FieldTitle>
      <p>{planContent.includedOptionsNote}</p>
      <ChoiceList>
        {plan.choices.map((choice) => (
          <CheckOption key={choice.id}>
            <input
              type={plan.choiceMode === 'single' ? 'radio' : 'checkbox'}
              name={`${plan.id}-choice`}
              checked={selectedChoices.includes(choice.id)}
              onChange={(event) =>
                onChoiceChange(choice.id, event.target.checked)
              }
            />
            <span>
              <strong>{choice.name}</strong>
              {choice.description && <small>{choice.description}</small>}
            </span>
            <b>{planContent.included}</b>
          </CheckOption>
        ))}
      </ChoiceList>
      <FieldTitle>{planContent.extrasHeading}</FieldTitle>
      <ChoiceList>
        {plan.extras.map((extra) => (
          <CheckOption key={extra.id}>
            <input
              type="checkbox"
              name={`${plan.id}-extra-${extra.id}`}
              checked={selectedExtras.includes(extra.id)}
              onChange={(event) =>
                onExtraChange(extra.id, event.target.checked)
              }
            />
            <span>
              <strong>{extra.name}</strong>
              <small>{extra.description}</small>
            </span>
            <b>+ {formatPrice(extra.price)}</b>
          </CheckOption>
        ))}
      </ChoiceList>
    </div>
  )
}
