import { handleCloudflareConsultation } from './cloudflare.ts'
import type { ConsultationEnv } from './consultations/services.ts'

interface WorkerEnv extends ConsultationEnv {
  ASSETS?: { fetch: (request: Request) => Promise<Response> }
}

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const path = new URL(request.url).pathname
    if (path === '/api/consultations')
      return handleCloudflareConsultation(request, env)
    if (path.startsWith('/api/'))
      return Promise.resolve(new Response('Not found', { status: 404 }))
    if (path.startsWith('/planes/'))
      return (
        env.ASSETS?.fetch(new Request(new URL('/', request.url))) ??
        Promise.resolve(new Response('Assets unavailable', { status: 503 }))
      )
    return (
      env.ASSETS?.fetch(request) ??
      Promise.resolve(new Response('Assets unavailable', { status: 503 }))
    )
  },
}
