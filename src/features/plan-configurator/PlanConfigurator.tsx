import { ArrowRight, Close } from '@carbon/icons-react'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { PrimaryButton } from '../../components/ui/Button'
import { planContent } from '../../data/plans'
import { validMaterialUrl } from '../../data/consultationPolicy'
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

type Step = 'options' | 'details' | 'review'
const emptyContact: RequestContact = {
  name: '',
  business: '',
  email: '',
  phone: '',
  message: '',
  domain: 'register',
}

function validate(contact: RequestContact, materialUrl: string): FormErrors {
  const errors: FormErrors = {}
  if (!contact.name.trim()) errors.name = planContent.form.name.error
  if (!contact.business.trim())
    errors.business = planContent.form.business.error
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))
    errors.email = planContent.form.email.error
  if (contact.phone.replace(/\D/g, '').length < 8)
    errors.phone = planContent.form.phone.error
  if (!contact.message.trim()) errors.message = planContent.form.message.error
  if (!validMaterialUrl(materialUrl))
    errors.materialUrl = planContent.form.materialUrl.error
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
    plan.id === 'medida' ? 'details' : 'options',
  )
  const [selectedChoices, setSelectedChoices] = useState<string[]>(
    plan.defaultChoices,
  )
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [contact, setContact] = useState<RequestContact>(emptyContact)
  const [materialUrl, setMaterialUrl] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submission, setSubmission] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle')
  const [submissionError, setSubmissionError] =
    useState<SubmissionErrorCode | null>(null)
  const [token, setToken] = useState('')
  const [verificationError, setVerificationError] = useState(false)
  const [widgetReset, setWidgetReset] = useState(0)
  const requestId = useRef<string | null>(null)
  const sending = useRef(false)
  const controller = useRef<AbortController | null>(null)
  const mounted = useRef(true)
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? ''
  useBodyScrollLock(true)

  const request: PlanRequestDraft = {
    planId: plan.id,
    selectedChoiceIds: selectedChoices,
    selectedExtraIds: selectedExtras,
    contact,
    materialUrl,
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

  async function send() {
    if (sending.current || submission === 'sent' || !token || !siteKey) return
    sending.current = true
    setSubmission('sending')
    setSubmissionError(null)
    requestId.current ??= crypto.randomUUID()
    const abort = new AbortController()
    controller.current = abort
    const timeout = window.setTimeout(() => abort.abort(), 35000)
    try {
      await submitConsultation(request, requestId.current, token, abort.signal)
      if (mounted.current) setSubmission('sent')
    } catch (error) {
      if (mounted.current) {
        setSubmission('error')
        setSubmissionError(
          error instanceof SubmissionError ? error.code : 'mail_unconfirmed',
        )
        setToken('')
        setWidgetReset((value) => value + 1)
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
      setStep('details')
      return
    }
    if (step === 'details') {
      const nextErrors = validate(contact, materialUrl)
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
        { id: 'options', name: `01 · ${planContent.steps.options}` },
        { id: 'details', name: `02 · ${planContent.steps.details}` },
        { id: 'review', name: `03 · ${planContent.steps.review}` },
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
                onExtraChange={(id, checked) =>
                  setSelectedExtras((current) =>
                    checked
                      ? [...current, id]
                      : current.filter((item) => item !== id),
                  )
                }
              />
            </div>
            <SelectionSummary plan={plan} request={request} />
          </ConfigGrid>
        )}
        {step === 'details' && (
          <RequestForm
            plan={plan}
            contact={contact}
            materialUrl={materialUrl}
            errors={errors}
            setContact={setContact}
            setErrors={setErrors}
            setMaterialUrl={setMaterialUrl}
          />
        )}
        {step === 'review' && (
          <>
            <RequestSummary plan={plan} request={request} />
            {submission === 'sent' ? (
              <p role="status">{planContent.submission.success}</p>
            ) : (
              <div className="submission-verification">
                {siteKey ? (
                  <Turnstile
                    siteKey={siteKey}
                    resetKey={widgetReset}
                    onToken={setToken}
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
                      onClick={() => setWidgetReset((value) => value + 1)}
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
                ? planContent.submission.sent
                : planContent.reviewNote
              : custom
                ? planContent.customNote
                : planContent.standardNote}
          </p>
          <div>
            {step !== (custom ? 'details' : 'options') &&
              submission !== 'sent' && (
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setSubmission('idle')
                    setSubmissionError(null)
                    setToken('')
                    setStep(step === 'review' ? 'details' : 'options')
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
                  : submission === 'sent'
                    ? planContent.submission.sent
                    : submission === 'sending'
                      ? planContent.submission.sending
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
