import {
  calculateBudgetWithCoupon,
  formatPrice,
  planContent,
} from '../../data/plans'
import type { Plan, PlanRequestDraft } from '../../types/plan'
import { SummaryPanel, ReviewPanel } from './PlanConfigurator.styles'

export function SelectionSummary({
  plan,
  request,
}: {
  plan: Plan
  request: PlanRequestDraft
}) {
  const extras = plan.extras.filter((extra) =>
    request.selectedExtraIds.includes(extra.id),
  )
  const budget = calculateBudgetWithCoupon(
    plan,
    request.selectedExtraIds,
    request.couponCode,
  )
  const money = (amount: number) => formatPrice({ status: 'defined', amount })
  return (
    <SummaryPanel aria-label={planContent.selectionHeading}>
      <h3>{planContent.selectionHeading}</h3>
      <div className="row">
        <span>{plan.name}</span>
        <strong>{formatPrice(plan.price)}</strong>
      </div>
      {plan.choices
        .filter((choice) => request.selectedChoiceIds.includes(choice.id))
        .map((choice) => (
          <div className="row" key={choice.id}>
            <span>{choice.name}</span>
            <strong>{planContent.included}</strong>
          </div>
        ))}
      {extras.length === 0 && (
        <div className="row">
          <span>{planContent.extrasLabel}</span>
          <strong>{planContent.noExtras}</strong>
        </div>
      )}
      {extras.map((extra) => (
        <div className="row" key={extra.id}>
          <span>{extra.name}</span>
          <strong>+ {formatPrice(extra.price)}</strong>
        </div>
      ))}
      <div className="total">
        {budget ? (
          <>
            {request.couponCode && (
              <>
                <div className="row">
                  <span>{planContent.subtotalLabel}</span>
                  <strong>{money(budget.subtotal)}</strong>
                </div>
                <div className="row">
                  <span>
                    {planContent.discountLabel} · {request.couponCode}
                  </span>
                  <strong>−{money(budget.discount)}</strong>
                </div>
              </>
            )}
            <div className="grand-total">
              <span>{planContent.totalLabel}</span>
              <strong>{money(budget.total)}</strong>
            </div>
            <div className="row deposit">
              <span>{planContent.depositLabel}</span>
              <strong>{money(budget.deposit)}</strong>
            </div>
            <p className="deposit-note">{planContent.depositNote}</p>
          </>
        ) : (
          <strong>{planContent.quotePrice}</strong>
        )}
      </div>
      <p>{planContent.startCondition}</p>
    </SummaryPanel>
  )
}

export function RequestSummary({
  plan,
  request,
  receipt,
}: {
  plan: Plan
  request: PlanRequestDraft
  receipt?: File | null
}) {
  return (
    <ReviewPanel>
      <h3>{planContent.reviewHeading}</h3>
      <SelectionSummary plan={plan} request={request} />
      <dl>
        <div>
          <dt>{planContent.form.name.label}</dt>
          <dd>{request.contact.name}</dd>
        </div>
        {plan.id === 'medida' && (
          <div>
            <dt>{planContent.form.business.label}</dt>
            <dd>{request.contact.business}</dd>
          </div>
        )}
        <div>
          <dt>{planContent.form.email.label}</dt>
          <dd>{request.contact.email}</dd>
        </div>
        <div>
          <dt>{planContent.form.phone.label}</dt>
          <dd>{request.contact.phone}</dd>
        </div>
        {plan.id === 'medida' && (
          <div>
            <dt>{planContent.form.domainLabel}</dt>
            <dd>
              {
                planContent.domainOptions.find(
                  (option) => option.value === request.contact.domain,
                )?.label
              }
            </dd>
          </div>
        )}
        {plan.id === 'medida' && (
          <div>
            <dt>{planContent.form.message.label}</dt>
            <dd>{request.contact.message}</dd>
          </div>
        )}
        {receipt && (
          <div>
            <dt>{planContent.form.receipt.label}</dt>
            <dd>{receipt.name}</dd>
          </div>
        )}
      </dl>
      <p className="review-note">
        {planContent.reviewNote} {planContent.startCondition}
      </p>
    </ReviewPanel>
  )
}
