import { handleCloudflareConsultation } from '../../server/cloudflare.ts'
import type { ConsultationEnv } from '../../server/consultations/services.ts'

// Cloudflare Pages supplies CF-Connecting-IP; never trust this header on another host.
export function onRequest(context: { request: Request; env: ConsultationEnv }) {
  return handleCloudflareConsultation(context.request, context.env)
}
