import { mockPortfolio } from '@/lib/constants/mock-data'
import {
  createCachedMarketDataProvider,
  type MarketDataProvider,
} from '@/lib/services/market-data-service'
import { getOptimizationSummaries } from '@/lib/services/optimization-service'

describe('optimization-service', () => {
  it('falls back to synthetic market data when the provider fails', async () => {
    const failingProvider: MarketDataProvider = {
      getReturns: jest.fn(async () => {
        throw new Error('network unavailable')
      }),
    }

    const result = await getOptimizationSummaries('max_sharpe', mockPortfolio, {
      marketDataProvider: failingProvider,
    })

    expect(result.summaries.length).toBeGreaterThan(0)
    expect(result.meta.source).toBe('synthetic')
  })

  it('reuses cached responses for identical symbol/range requests', async () => {
    const baseProvider: MarketDataProvider = {
      getReturns: jest.fn(async ({ symbols, range }) => ({
        returns: symbols.reduce<Record<string, number[]>>((acc, symbol) => {
          acc[symbol] = Array(12).fill(0.01)
          return acc
        }, {}),
        meta: {
          source: 'external' as const,
          fromCache: false,
          range: range ?? '5Y',
        },
      })),
    }

    const cachedProvider = createCachedMarketDataProvider(baseProvider, 1000 * 60 * 10)

    await cachedProvider.getReturns({ symbols: ['AAA', 'BBB'], range: '1Y' })
    await cachedProvider.getReturns({ symbols: ['BBB', 'AAA'], range: '1Y' })

    expect(baseProvider.getReturns).toHaveBeenCalledTimes(1)
  })
})
