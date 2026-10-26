import type { PlanId, RequestContact } from './plan'

export interface ConsultationPayload {
  requestId: string
  planId: PlanId
  selectedChoiceIds: string[]
  selectedExtraIds: string[]
  contact: RequestContact
  turnstileToken: string
}

export type SubmissionErrorCode =
  | 'unavailable'
  | 'invalid_data'
  | 'invalid_token'
  | 'too_large'
  | 'rate_limited'
  | 'mail_unconfirmed'
  | 'forbidden'

export type ConsultationResponse =
  { ok: true; id: string } | { ok: false; code: SubmissionErrorCode }
