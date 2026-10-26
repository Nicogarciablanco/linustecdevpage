import type { PlanRequestDraft } from '../../types/plan'
import type {
  ConsultationPayload,
  SubmissionErrorCode,
} from '../../types/consultation'

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
): Promise<string> {
  const payload: ConsultationPayload = {
    requestId,
    planId: draft.planId,
    selectedChoiceIds: draft.selectedChoiceIds,
    selectedExtraIds: draft.selectedExtraIds,
    contact: draft.contact,
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
