import {
  calculateReturns,
  calculateVolatility,
  calculateSharpeRatio,
  calculateMaxDrawdown,
  calculateBeta,
  calculateCorrelation,
  calculateExpectedReturn,
} from '@/lib/calculations/portfolio'

import type { HistoricalPrice } from '@/lib/types'

describe('Portfolio calculations', () => {
  it('calculates simple returns', () => {
    const prices = [100, 105, 110, 108, 115]
    expect(calculateReturns(prices)).toEqual([0.05, 0.0476, -0.0182, 0.0648])
  })

  it('calculates volatility with annualization', () => {
    const returns = [0.01, -0.005, 0.007, 0.002]
    expect(calculateVolatility(returns)).toBeCloseTo(0.104096, 6)
  })

  it('calculates Sharpe ratio using annualized values', () => {
    const returns = [0.01, -0.005, 0.007, 0.002]
    const sharpe = calculateSharpeRatio(returns, 0.02, 252)
    expect(sharpe).toBeCloseTo(8.2808, 4)
  })

  it('returns 0 Sharpe ratio when volatility is zero', () => {
    const returns = [0.01, 0.01, 0.01]
    expect(calculateSharpeRatio(returns, 0.01)).toBe(0)
  })

  it('calculates maximum drawdown', () => {
    const values = [100, 120, 110, 90, 95, 100, 85, 95]
    expect(calculateMaxDrawdown(values)).toBeCloseTo(-0.2917, 4)
  })

  it('returns 0 drawdown for monotonic growth', () => {
    expect(calculateMaxDrawdown([1, 2, 3, 4])).toBe(0)
  })

  it('calculates beta against a benchmark', () => {
    const asset = [0.012, 0.008, -0.004, 0.01, 0.006]
    const benchmark = [0.01, 0.007, -0.002, 0.008, 0.005]
    expect(calculateBeta(asset, benchmark)).toBeCloseTo(1.3474, 4)
  })

  it('calculates correlation coefficients', () => {
    const asset = [0.012, 0.008, -0.004, 0.01, 0.006]
    const benchmark = [0.01, 0.007, -0.002, 0.008, 0.005]
    expect(calculateCorrelation(asset, benchmark)).toBeCloseTo(0.9983, 4)
  })

  it('calculates expected annual return from price history', () => {
    const prices: HistoricalPrice[] = [
      { symbol: 'AAA', date: '2024-01-01', open: 100, high: 100, low: 100, close: 100, adjClose: 100, volume: 0 },
      { symbol: 'AAA', date: '2024-01-02', open: 101, high: 101, low: 101, close: 101, adjClose: 101, volume: 0 },
      { symbol: 'AAA', date: '2024-01-03', open: 102.5, high: 102.5, low: 102.5, close: 102.5, adjClose: 102.5, volume: 0 },
    ]

    expect(calculateExpectedReturn(prices)).toBeCloseTo(3.1113, 4)
  })
})
