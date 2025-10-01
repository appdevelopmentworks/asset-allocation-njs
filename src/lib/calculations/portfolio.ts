import type { HistoricalPrice, OptimizationResult, Portfolio } from '@/lib/types'

export function calculateExpectedReturn(prices: HistoricalPrice[]): number {
  if (!prices.length) {
    return 0
  }

  const returns = prices
    .map((entry, index) => {
      if (index === 0) return null
      const previous = prices[index - 1]
      return Math.log(entry.close / previous.close)
    })
    .filter((value): value is number => value !== null)

  const average = returns.reduce((total, value) => total + value, 0) / returns.length

  return Number((average * 252).toFixed(4))
}

export function createEmptyOptimizationResult(portfolio: Portfolio): OptimizationResult {
  return {
    strategy: 'max_sharpe',
    weights: portfolio.assets.map(() => 0),
    expectedReturn: 0,
    risk: 0,
    sharpeRatio: 0,
    portfolio,
  }
}
