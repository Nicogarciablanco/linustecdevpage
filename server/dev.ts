import { createServer } from 'node:http'
import { Readable } from 'node:stream'
import { handleConsultation } from './consultations/handler.ts'

createServer(async (incoming, outgoing) => {
  if (incoming.url !== '/api/consultations') {
    outgoing.writeHead(404).end()
    return
  }
  try {
    const headers = new Headers()
    for (const [name, value] of Object.entries(incoming.headers)) {
      if (value)
        headers.set(name, Array.isArray(value) ? value.join(',') : value)
    }
    const init: RequestInit & { duplex?: 'half' } = {
      method: incoming.method,
      headers,
    }
    if (!['GET', 'HEAD'].includes(incoming.method ?? 'GET')) {
      init.body = Readable.toWeb(incoming) as ReadableStream<Uint8Array>
      init.duplex = 'half'
    }
    const request = new Request('http://127.0.0.1:8788/api/consultations', init)
    const response = await handleConsultation(
      request,
      process.env,
      incoming.socket.remoteAddress ?? null,
    )
    outgoing.writeHead(response.status, Object.fromEntries(response.headers))
    outgoing.end(new Uint8Array(await response.arrayBuffer()))
  } catch {
    outgoing
      .writeHead(503, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      })
      .end(JSON.stringify({ ok: false, code: 'unavailable' }))
  }
}).listen(8788, '127.0.0.1', () => {
  console.info('API local: http://127.0.0.1:8788')
})
