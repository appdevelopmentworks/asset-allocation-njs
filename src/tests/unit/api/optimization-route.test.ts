import { TextDecoder, TextEncoder } from 'util'
import { mockPortfolio } from '@/lib/constants/mock-data'
import type { OptimizationStrategy } from '@/lib/types'

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder
}

let GET: typeof import('@/app/api/optimization/route').GET
let POST: typeof import('@/app/api/optimization/route').POST

beforeAll(async () => {
  const {
    Request: NodeRequest,
    Response: NodeResponse,
    Headers: NodeHeaders,
  } = await import('undici')

  if (typeof globalThis.Request === 'undefined') {
    globalThis.Request = NodeRequest as typeof Request
  }
  if (typeof globalThis.Response === 'undefined') {
    globalThis.Response = NodeResponse as typeof Response
  }
  if (typeof globalThis.Headers === 'undefined') {
    globalThis.Headers = NodeHeaders as typeof Headers
  }

  const route = await import('@/app/api/optimization/route')
  GET = route.GET
  POST = route.POST
})

const createRequest = (url: string, body?: unknown) =>
  ({
    url,
    json: async () => body,
  }) as unknown as Request

describe('/api/optimization route', () => {
  it('accepts a POST payload with portfolio data', async () => {
    const strategy: OptimizationStrategy = 'max_return'
    const response = await POST(
      createRequest('http://localhost/api/optimization', {
        strategy,
        portfolio: mockPortfolio,
      }),
    )
    expect(response.status).toBe(200)

    const body = (await response.json()) as {
      summary?: { strategy: OptimizationStrategy; weights?: unknown[] }
    }
    expect(body.summary?.strategy).toBe(strategy)
    expect(body.summary?.weights).toHaveLength(mockPortfolio.assets.length)
  })

  it('rejects invalid strategies on GET', async () => {
    const response = await GET(createRequest('http://localhost/api/optimization?strategy=unknown'))
    expect(response.status).toBe(400)
    const data = (await response.json()) as { error?: string }
    expect(data.error).toBe('Invalid strategy')
  })
})
