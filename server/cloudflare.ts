import { handleConsultation } from './consultations/handler.ts'
import type { ConsultationEnv } from './consultations/services.ts'

// Call only from Pages/Workers: Cloudflare supplies this header at its edge.
function cloudflareIp(request: Request) {
  const value = request.headers.get('CF-Connecting-IP')
  let ip: string | null = null
  if (value && /^[a-f\d:.]{3,64}$/i.test(value)) {
    if (value.includes(':')) {
      try {
        ip = new URL(`http://[${value}]/`).hostname.slice(1, -1)
      } catch {
        /* Reject malformed IP. */
      }
    } else {
      const parts = value.split('.')
      if (
        parts.length === 4 &&
        parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
      )
        ip = parts.map(Number).join('.')
    }
  }
  return ip
}

export function handleCloudflareConsultation(
  request: Request,
  env: ConsultationEnv,
) {
  return handleConsultation(request, env, cloudflareIp(request))
}
