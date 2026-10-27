import type { Dispatch, SetStateAction } from 'react'
import { planContent } from '../../data/plans'
import { consultationPolicy } from '../../data/consultationPolicy'
import type { RequestContact } from '../../types/plan'
import { FormGrid, FormLabel } from './PlanConfigurator.styles'

export type FormErrors = Partial<
  Record<keyof RequestContact | 'receipt', string>
>

export function RequestForm({
  contact,
  errors,
  setContact,
  setErrors,
  requiresReceipt = false,
  receipt,
  onReceipt,
}: {
  contact: RequestContact
  errors: FormErrors
  setContact: Dispatch<SetStateAction<RequestContact>>
  setErrors: Dispatch<SetStateAction<FormErrors>>
  requiresReceipt?: boolean
  receipt?: File | null
  onReceipt?: (file: File | null) => void
}) {
  function update(field: keyof RequestContact, value: string) {
    setContact((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  return (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
      <FormGrid>
        <FormLabel>
          {planContent.form.name.label}
          <input
            id="request-name"
            maxLength={consultationPolicy.maxLengths.name}
            aria-label={planContent.form.name.label}
            autoComplete="name"
            required
            value={contact.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'error-name' : undefined}
            placeholder={planContent.form.name.placeholder}
          />
          {errors.name && <small id="error-name">{errors.name}</small>}
        </FormLabel>
        {!requiresReceipt && (
          <FormLabel>
            {planContent.form.business.label}
            <input
              id="request-business"
              maxLength={consultationPolicy.maxLengths.business}
              aria-label={planContent.form.business.label}
              required
              value={contact.business}
              onChange={(event) => update('business', event.target.value)}
              aria-invalid={!!errors.business}
              aria-describedby={errors.business ? 'error-business' : undefined}
              placeholder={planContent.form.business.placeholder}
            />
            {errors.business && (
              <small id="error-business">{errors.business}</small>
            )}
          </FormLabel>
        )}
        <FormLabel>
          {planContent.form.email.label}
          <input
            id="request-email"
            maxLength={consultationPolicy.maxLengths.email}
            aria-label={planContent.form.email.label}
            type="email"
            autoComplete="email"
            required
            value={contact.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'error-email' : undefined}
            placeholder={planContent.form.email.placeholder}
          />
          {errors.email && <small id="error-email">{errors.email}</small>}
        </FormLabel>
        <FormLabel>
          {planContent.form.phone.label}
          <input
            id="request-phone"
            maxLength={consultationPolicy.maxLengths.phone}
            aria-label={planContent.form.phone.label}
            type="tel"
            autoComplete="tel"
            required
            value={contact.phone}
            onChange={(event) => update('phone', event.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'error-phone' : undefined}
            placeholder={planContent.form.phone.placeholder}
          />
          {errors.phone && <small id="error-phone">{errors.phone}</small>}
        </FormLabel>
        {!requiresReceipt && (
          <FormLabel className="wide">
            {planContent.form.message.label}
            <textarea
              id="request-message"
              maxLength={consultationPolicy.maxLengths.message}
              aria-label={planContent.form.message.label}
              required
              value={contact.message}
              onChange={(event) => update('message', event.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'error-message' : undefined}
              placeholder={planContent.form.message.placeholder}
            />
            {errors.message && (
              <small id="error-message">{errors.message}</small>
            )}
          </FormLabel>
        )}
        {!requiresReceipt && (
          <FormLabel>
            {planContent.form.domainLabel}
            <select
              value={contact.domain}
              onChange={(event) => update('domain', event.target.value)}
            >
              {planContent.domainOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormLabel>
        )}
        {requiresReceipt && (
          <FormLabel className="wide">
            {planContent.form.receipt.label}
            <input
              id="request-receipt"
              type="file"
              aria-label={planContent.form.receipt.label}
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              required
              aria-invalid={!!errors.receipt}
              aria-describedby={
                errors.receipt ? 'error-receipt' : 'receipt-help'
              }
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] ?? null
                if (
                  !file ||
                  !['application/pdf', 'image/png', 'image/jpeg'].includes(
                    file.type,
                  ) ||
                  file.size === 0 ||
                  file.size > consultationPolicy.maxReceiptBytes
                ) {
                  onReceipt?.(null)
                  setErrors((current) => ({
                    ...current,
                    receipt: planContent.form.receipt.error,
                  }))
                  event.currentTarget.value = ''
                  return
                }
                onReceipt?.(file)
                setErrors((current) => ({ ...current, receipt: undefined }))
              }}
            />
            <span id="receipt-help">{planContent.form.receipt.help}</span>
            {receipt && <span>{receipt.name}</span>}
            {errors.receipt && (
              <small id="error-receipt">{errors.receipt}</small>
            )}
          </FormLabel>
        )}
      </FormGrid>
    </form>
  )
}
