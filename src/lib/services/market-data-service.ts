import type { TimeRange } from '@/lib/types'

export interface MarketDataRequest {
  symbols: string[]
  range?: TimeRange
}

export interface MarketDataMeta {
  source: 'synthetic' | 'external'
  fromCache: boolean
  range: TimeRange
}

export interface MarketDataResult {
  returns: Record<string, number[]>
  meta: MarketDataMeta
}

export interface MarketDataProvider {
  getReturns: (request: MarketDataRequest) => Promise<MarketDataResult>
}

const RANGE_TO_MONTHS: Record<TimeRange, number> = {
  '1Y': 12,
  '3Y': 36,
  '5Y': 60,
  '10Y': 120,
  MAX: 180,
}

const DEFAULT_RANGE: TimeRange = '5Y'
const DEFAULT_TTL_MS = 1000 * 60 * 5

const createCacheKey = (symbols: string[], range: TimeRange) =>
  `${range}:${symbols.slice().sort().join(',')}`

export function createCachedMarketDataProvider(
  provider: MarketDataProvider,
  ttlMs = DEFAULT_TTL_MS,
): MarketDataProvider {
  const cache = new Map<string, { expiresAt: number; result: MarketDataResult }>()

  return {
    async getReturns(request: MarketDataRequest): Promise<MarketDataResult> {
      const range = request.range ?? DEFAULT_RANGE
      const cacheKey = createCacheKey(request.symbols, range)
      const now = Date.now()
      const cached = cache.get(cacheKey)

      if (cached && cached.expiresAt > now) {
        return {
          returns: cached.result.returns,
          meta: { ...cached.result.meta, fromCache: true },
        }
      }

      const fresh = await provider.getReturns({ ...request, range })
      cache.set(cacheKey, {
        expiresAt: now + ttlMs,
        result: { ...fresh, meta: { ...fresh.meta, fromCache: false } },
      })

      return fresh
    },
  }
}

export function createSyntheticMarketDataProvider(): MarketDataProvider {
  return {
    async getReturns(request: MarketDataRequest): Promise<MarketDataResult> {
      const range = request.range ?? DEFAULT_RANGE
      const months = RANGE_TO_MONTHS[range] ?? RANGE_TO_MONTHS[DEFAULT_RANGE]

      const returns = request.symbols.reduce<Record<string, number[]>>((acc, symbol) => {
        acc[symbol] = generateSyntheticReturns(symbol, months)
        return acc
      }, {})

      return {
        returns,
        meta: {
          source: 'synthetic',
          fromCache: false,
          range,
        },
      }
    },
  }
}

export function generateSyntheticReturns(symbol: string, months: number) {
  const random = mulberry32(hashString(symbol))
  const series: number[] = []
  let drift = (random() - 0.5) * 0.02

  for (let index = 0; index < months; index += 1) {
    const shock = (random() - 0.5) * 0.04
    const value = 0.006 + drift + shock
    series.push(value)
    drift *= 0.98
  }

  return series
}

function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash) || 1
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
