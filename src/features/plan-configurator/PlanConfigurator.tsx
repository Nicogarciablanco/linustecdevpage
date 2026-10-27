import { ArrowRight, Close } from '@carbon/icons-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { PrimaryButton } from '../../components/ui/Button'
import { calculateBudgetWithCoupon, planContent } from '../../data/plans'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import type { Plan, PlanRequestDraft, RequestContact } from '../../types/plan'
import type { SubmissionErrorCode } from '../../types/consultation'
import { Turnstile } from './Turnstile'
import { SubmissionError, submitConsultation } from './submitConsultation'
import { PlanOptions } from './PlanOptions'
import { RequestForm } from './RequestForm'
import type { FormErrors } from './RequestForm'
import { RequestSummary, SelectionSummary } from './RequestSummary'
import {
  CloseButton,
  ConfigGrid,
  Dialog,
  DialogContent,
  DialogCopy,
  DialogFooter,
  DialogTitle,
  DialogTop,
  SecondaryButton,
  StepList,
} from './PlanConfigurator.styles'

type Step = 'options' | 'extraPrompt' | 'quote' | 'details' | 'review'
const tokenMaxAgeMs = 285_000
type VerificationToken = { value: string; receivedAt: number }
const emptyContact: RequestContact = {
  name: '',
  business: '',
  email: '',
  phone: '',
  message: '',
  domain: 'register',
}

function validate(contact: RequestContact, custom: boolean): FormErrors {
  const errors: FormErrors = {}
  if (!contact.name.trim()) errors.name = planContent.form.name.error
  if (custom && !contact.business.trim())
    errors.business = planContent.form.business.error
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))
    errors.email = planContent.form.email.error
  if (contact.phone.replace(/\D/g, '').length < 8)
    errors.phone = planContent.form.phone.error
  if (custom && !contact.message.trim())
    errors.message = planContent.form.message.error
  return errors
}

export function PlanConfigurator({
  plan,
  opener,
  onClose,
}: {
  plan: Plan
  opener: HTMLButtonElement | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [step, setStep] = useState<Step>(
    plan.id === 'medida' ? 'details' : 'extraPrompt',
  )
  const [fromPrompt, setFromPrompt] = useState(false)
  const [selectedChoices, setSelectedChoices] = useState<string[]>(
    plan.defaultChoices,
  )
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [contact, setContact] = useState<RequestContact>(emptyContact)
  const [receipt, setReceipt] = useState<File | null>(null)
  const [couponInput, setCouponInput] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [quoteError, setQuoteError] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submission, setSubmission] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle')
  const [submissionError, setSubmissionError] =
    useState<SubmissionErrorCode | null>(null)
  const [token, setToken] = useState<VerificationToken | null>(null)
  const tokenRef = useRef<VerificationToken | null>(null)
  const [verificationError, setVerificationError] = useState(false)
  const [widgetReset, setWidgetReset] = useState(0)
  const requestId = useRef<string | null>(null)
  const sending = useRef(false)
  const controller = useRef<AbortController | null>(null)
  const mounted = useRef(true)
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? ''
  useBodyScrollLock(true)

  const updateToken = useCallback((value: string) => {
    const next = value ? { value, receivedAt: Date.now() } : null
    tokenRef.current = next
    setToken(next)
  }, [])

  const resetVerification = useCallback(() => {
    updateToken('')
    setWidgetReset((value) => value + 1)
  }, [updateToken])

  useEffect(() => {
    if (!token) return
    const timer = window.setTimeout(() => {
      if (tokenRef.current === token) resetVerification()
    }, tokenMaxAgeMs)
    return () => window.clearTimeout(timer)
  }, [token, resetVerification])

  const request: PlanRequestDraft = {
    planId: plan.id,
    selectedChoiceIds: selectedChoices,
    selectedExtraIds: selectedExtras,
    contact,
    ...(couponCode ? { couponCode } : {}),
    status: 'draft',
  }

  useEffect(() => {
    mounted.current = true
    const dialog = dialogRef.current
    dialog?.showModal()
    titleRef.current?.focus()
    return () => {
      mounted.current = false
      controller.current?.abort()
      if (dialog?.open) dialog.close()
      opener?.focus()
    }
  }, [opener])

  useEffect(() => {
    titleRef.current?.focus()
    dialogRef.current?.scrollTo({ top: 0 })
  }, [step])

  function close() {
    if (!sending.current) onClose()
  }

  function applyCoupon() {
    const next = couponInput.trim()
    setCouponCode('')
    setQuoteError('')
    if (!next) return
    if (!calculateBudgetWithCoupon(plan, selectedExtras, next)) {
      setQuoteError(planContent.couponInvalid)
      return
    }
    setCouponCode(next)
  }

  async function send() {
    if (sending.current || submission === 'sent' || !siteKey) return
    if (plan.id !== 'medida' && !receipt) {
      setSubmissionError('invalid_receipt')
      setStep('details')
      return
    }
    const currentToken = tokenRef.current
    if (!currentToken) return
    if (Date.now() - currentToken.receivedAt >= tokenMaxAgeMs) {
      resetVerification()
      return
    }
    sending.current = true
    updateToken('')
    setSubmission('sending')
    setSubmissionError(null)
    requestId.current ??= crypto.randomUUID()
    const abort = new AbortController()
    controller.current = abort
    const timeout = window.setTimeout(() => abort.abort(), 35000)
    try {
      await submitConsultation(
        request,
        requestId.current,
        currentToken.value,
        abort.signal,
        receipt,
      )
      if (mounted.current) setSubmission('sent')
    } catch (error) {
      if (mounted.current) {
        setSubmission('error')
        setSubmissionError(
          error instanceof SubmissionError ? error.code : 'mail_unconfirmed',
        )
        resetVerification()
      }
    } finally {
      window.clearTimeout(timeout)
      sending.current = false
    }
  }

  function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return
    const { left, right, top, bottom } =
      event.currentTarget.getBoundingClientRect()
    if (
      event.clientX <= left ||
      event.clientX >= right ||
      event.clientY <= top ||
      event.clientY >= bottom
    )
      close()
  }

  function goNext() {
    if (step === 'options') {
      setStep('quote')
      return
    }
    if (step === 'extraPrompt') {
      setStep('quote')
      return
    }
    if (step === 'quote') {
      setStep('details')
      return
    }
    if (step === 'details') {
      const nextErrors = validate(contact, plan.id === 'medida')
      if (plan.id !== 'medida' && !receipt)
        nextErrors.receipt = planContent.form.receipt.error
      setErrors(nextErrors)
      const first = Object.keys(nextErrors)[0]
      if (first) {
        document.getElementById(`request-${first}`)?.focus()
        return
      }
      setStep('review')
      return
    }
    void send()
  }

  const custom = plan.id === 'medida'
  const steps: { id: Step; name: string }[] = custom
    ? [
        { id: 'details', name: `01 · ${planContent.steps.customDetails}` },
        { id: 'review', name: `02 · ${planContent.steps.review}` },
      ]
    : [
        {
          id: fromPrompt ? 'options' : 'extraPrompt',
          name: `01 · ${planContent.steps.options}`,
        },
        { id: 'quote', name: `02 · ${planContent.steps.quote}` },
        { id: 'details', name: `03 · ${planContent.steps.details}` },
        { id: 'review', name: `04 · ${planContent.steps.review}` },
      ]

  return (
    <Dialog
      id="plan-dialog"
      ref={dialogRef}
      aria-labelledby="plan-dialog-title"
      onClick={onBackdropClick}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          close()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
    >
      <DialogContent aria-busy={submission === 'sending'}>
        <DialogTop>
          <div>
            <p>
              {step === 'review'
                ? planContent.dialog.review
                : step === 'extraPrompt'
                  ? planContent.extrasPrompt
                  : custom
                    ? planContent.dialog.details
                    : step === 'options'
                      ? planContent.dialog.options
                      : planContent.dialog.details}
            </p>
            <DialogTitle id="plan-dialog-title" ref={titleRef} tabIndex={-1}>
              {plan.name}
            </DialogTitle>
          </div>
          <CloseButton
            type="button"
            aria-label={planContent.dialog.close}
            onClick={close}
            disabled={submission === 'sending'}
          >
            <Close size={20} aria-hidden="true" />
          </CloseButton>
        </DialogTop>
        <StepList aria-label={planContent.dialog.stepsLabel}>
          {steps.map((item) => (
            <li
              key={item.id}
              aria-current={step === item.id ? 'step' : undefined}
            >
              {item.name}
            </li>
          ))}
        </StepList>
        {step === 'options' && (
          <ConfigGrid>
            <div>
              <DialogCopy>{plan.summary}</DialogCopy>
              <PlanOptions
                plan={plan}
                selectedChoices={selectedChoices}
                selectedExtras={selectedExtras}
                onChoiceChange={(id, checked) =>
                  setSelectedChoices((current) =>
                    plan.choiceMode === 'single'
                      ? [id]
                      : checked
                        ? [...current, id]
                        : current.filter((item) => item !== id),
                  )
                }
                onExtraChange={(id, checked) => {
                  setCouponCode('')
                  setCouponInput('')
                  setQuoteError('')
                  setSelectedExtras((current) => {
                    const group = plan.extras.find(
                      (extra) => extra.id === id,
                    )?.group
                    return checked
                      ? [
                          ...current.filter(
                            (item) =>
                              !group ||
                              plan.extras.find((extra) => extra.id === item)
                                ?.group !== group,
                          ),
                          id,
                        ]
                      : current.filter((item) => item !== id)
                  })
                }}
              />
            </div>
            <SelectionSummary plan={plan} request={request} />
          </ConfigGrid>
        )}
        {step === 'details' && (
          <RequestForm
            contact={contact}
            errors={errors}
            setContact={setContact}
            setErrors={setErrors}
            requiresReceipt={!custom}
            receipt={receipt}
            onReceipt={setReceipt}
          />
        )}
        {step === 'extraPrompt' && (
          <div>
            <h3>{planContent.extrasPrompt}</h3>
            <DialogCopy>{planContent.extrasPromptCopy}</DialogCopy>
            <SecondaryButton
              type="button"
              onClick={() => {
                setFromPrompt(true)
                setStep('options')
              }}
            >
              {planContent.addExtras}
            </SecondaryButton>
          </div>
        )}
        {step === 'quote' && (
          <div>
            <SelectionSummary plan={plan} request={request} />
            <div className="coupon-field">
              <label htmlFor="coupon-code">{planContent.couponLabel}</label>
              <input
                id="coupon-code"
                value={couponInput}
                maxLength={32}
                autoComplete="off"
                onChange={(event) =>
                  setCouponInput(event.target.value.toUpperCase())
                }
              />
              <SecondaryButton type="button" onClick={applyCoupon}>
                {planContent.couponApply}
              </SecondaryButton>
            </div>
            {quoteError && <p role="alert">{quoteError}</p>}
            <p>
              {planContent.paymentHeading}:{' '}
              <strong>{planContent.paymentAlias}</strong>
            </p>
            <p>{planContent.paymentNote}</p>
          </div>
        )}
        {step === 'review' && (
          <>
            <RequestSummary plan={plan} request={request} receipt={receipt} />
            {!custom && <p>{planContent.paymentNote}</p>}
            {submission === 'sent' ? (
              <p role="status">
                {custom
                  ? planContent.submission.customSuccess
                  : planContent.submission.success}
              </p>
            ) : (
              <div className="submission-verification">
                {siteKey ? (
                  <Turnstile
                    siteKey={siteKey}
                    resetKey={widgetReset}
                    onToken={updateToken}
                    onUnavailable={setVerificationError}
                  />
                ) : (
                  <p role="status">{planContent.submission.unavailable}</p>
                )}
                {verificationError && (
                  <>
                    <p role="alert">
                      {planContent.submission.verificationError}
                    </p>
                    <SecondaryButton
                      type="button"
                      disabled={submission === 'sending'}
                      onClick={resetVerification}
                    >
                      {planContent.submission.retryVerification}
                    </SecondaryButton>
                  </>
                )}
                {submissionError && (
                  <p role="alert">
                    {planContent.submission.errors[submissionError]}
                  </p>
                )}
                {submission === 'sending' && (
                  <p role="status">{planContent.submission.sending}</p>
                )}
              </div>
            )}
          </>
        )}
        <DialogFooter>
          <p>
            {step === 'review'
              ? submission === 'sent'
                ? custom
                  ? planContent.submission.customSent
                  : planContent.submission.sent
                : planContent.reviewNote
              : custom
                ? planContent.customNote
                : planContent.standardNote}
          </p>
          <div>
            {step !== (custom ? 'details' : 'extraPrompt') &&
              submission !== 'sent' && (
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setSubmission('idle')
                    setSubmissionError(null)
                    updateToken('')
                    setStep(
                      step === 'review'
                        ? 'details'
                        : step === 'details'
                          ? custom
                            ? 'details'
                            : 'quote'
                          : step === 'quote'
                            ? fromPrompt
                              ? 'options'
                              : 'extraPrompt'
                            : 'extraPrompt',
                    )
                  }}
                  disabled={submission === 'sending'}
                >
                  {planContent.dialog.back}
                </SecondaryButton>
              )}
            <PrimaryButton
              type="button"
              onClick={goNext}
              disabled={
                submission === 'sending' ||
                submission === 'sent' ||
                (step === 'review' && (!siteKey || !token))
              }
            >
              {step === 'options'
                ? planContent.dialog.next
                : step === 'details'
                  ? planContent.dialog.reviewNext
                  : step === 'extraPrompt'
                    ? planContent.skipExtras
                    : step === 'quote'
                      ? planContent.dialog.next
                      : submission === 'sent'
                        ? custom
                          ? planContent.submission.customSent
                          : planContent.submission.sent
                        : submission === 'sending'
                          ? planContent.submission.sending
                          : custom
                            ? planContent.submission.customSend
                            : planContent.submission.send}
              {submission !== 'sent' && (
                <ArrowRight size={16} aria-hidden="true" />
              )}
            </PrimaryButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
