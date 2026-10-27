import type { PlanRequestDraft } from '../../types/plan'
import type {
  ConsultationPayload,
  SubmissionErrorCode,
} from '../../types/consultation'
import { consultationPolicy } from '../../data/consultationPolicy'

export class SubmissionError extends Error {
  constructor(public code: SubmissionErrorCode) {
    super(code)
  }
}

export async function submitConsultation(
  draft: PlanRequestDraft,
  requestId: string,
  turnstileToken: string,
  signal: AbortSignal,
  receiptFile: File | null = null,
): Promise<string> {
  let receipt: ConsultationPayload['receipt']
  if (draft.planId !== 'medida') {
    if (
      !receiptFile ||
      receiptFile.size > consultationPolicy.maxReceiptBytes ||
      !['application/pdf', 'image/png', 'image/jpeg'].includes(receiptFile.type)
    )
      throw new SubmissionError('invalid_receipt')
    const bytes = new Uint8Array(await receiptFile.arrayBuffer())
    let binary = ''
    for (let offset = 0; offset < bytes.length; offset += 8192)
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
    receipt = {
      mediaType: receiptFile.type as NonNullable<
        ConsultationPayload['receipt']
      >['mediaType'],
      content: btoa(binary),
    }
  }
  const payload: ConsultationPayload = {
    requestId,
    planId: draft.planId,
    selectedChoiceIds: draft.selectedChoiceIds,
    selectedExtraIds: draft.selectedExtraIds,
    contact: draft.contact,
    ...(draft.couponCode ? { couponCode: draft.couponCode } : {}),
    ...(receipt ? { receipt } : {}),
    turnstileToken,
  }
  const response = await fetch('/api/consultations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'same-origin',
    redirect: 'error',
    signal,
  })
  let result: unknown
  try {
    result = await response.json()
  } catch {
    throw new SubmissionError('unavailable')
  }
  if (
    response.ok &&
    result &&
    typeof result === 'object' &&
    'ok' in result &&
    result.ok === true &&
    'id' in result &&
    typeof result.id === 'string' &&
    result.id.length > 0
  )
    return result.id
  const codes: SubmissionErrorCode[] = [
    'unavailable',
    'invalid_data',
    'invalid_coupon',
    'invalid_receipt',
    'invalid_token',
    'too_large',
    'rate_limited',
    'mail_unconfirmed',
    'forbidden',
  ]
  if (
    result &&
    typeof result === 'object' &&
    'code' in result &&
    codes.includes(result.code as SubmissionErrorCode)
  )
    throw new SubmissionError(result.code as SubmissionErrorCode)
  throw new SubmissionError('mail_unconfirmed')
}
