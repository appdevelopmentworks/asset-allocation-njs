import type { HistoricalPrice, OptimizationResult, Portfolio } from '@/lib/types'

const DEFAULT_PRECISION = 4

const isFiniteNumber = (value: number): value is number => Number.isFinite(value)

interface ReturnOptions {
  useLog?: boolean
  precision?: number
}

export function calculateReturns(prices: number[], options?: ReturnOptions): number[] {
  if (prices.length <= 1) {
    return []
  }

  const { useLog = false, precision = DEFAULT_PRECISION } = options ?? {}
  const returns: number[] = []

  for (let index = 1; index < prices.length; index += 1) {
    const previous = prices[index - 1]
    const current = prices[index]

    if (!isFiniteNumber(previous) || !isFiniteNumber(current) || previous === 0) {
      continue
    }

    const raw = useLog ? Math.log(current / previous) : (current - previous) / previous
    if (!isFiniteNumber(raw)) {
      continue
    }

    returns.push(Number(raw.toFixed(precision)))
  }

  return returns
}

interface VolatilityOptions {
  annualize?: boolean
  useSample?: boolean
  precision?: number
}

export function calculateVolatility(
  returns: number[],
  periodsPerYear = 252,
  options?: VolatilityOptions,
): number {
  const { annualize = true, useSample = true, precision } = options ?? {}
  const valid = returns.filter(isFiniteNumber)

  if (valid.length <= 1) {
    return 0
  }

  const mean = valid.reduce((sum, value) => sum + value, 0) / valid.length
  const denominator = useSample ? valid.length - 1 : valid.length

  if (denominator <= 0) {
    return 0
  }

  const variance =
    valid.reduce((sum, value) => sum + (value - mean) ** 2, 0) / denominator

  if (!isFiniteNumber(variance) || variance <= 0) {
    return 0
  }

  let volatility = Math.sqrt(variance)
  if (annualize) {
    volatility *= Math.sqrt(Math.max(periodsPerYear, 1))
  }

  if (precision != null) {
    return Number(volatility.toFixed(precision))
  }

  return volatility
}

interface SharpeOptions extends VolatilityOptions {
  precision?: number
}

export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate = 0.02,
  periodsPerYear = 252,
  options?: SharpeOptions,
): number {
  const { annualize = true, useSample = true, precision = DEFAULT_PRECISION } = options ?? {}
  const valid = returns.filter(isFiniteNumber)

  if (!valid.length) {
    return 0
  }

  const mean = valid.reduce((sum, value) => sum + value, 0) / valid.length
  const volatility = calculateVolatility(valid, periodsPerYear, {
    annualize,
    useSample,
  })

  if (!volatility) {
    return 0
  }

  const annualizedReturn = annualize ? mean * periodsPerYear : mean
  const adjustedRiskFree = annualize ? riskFreeRate : riskFreeRate / periodsPerYear
  const sharpe = (annualizedReturn - adjustedRiskFree) / volatility

  if (!isFiniteNumber(sharpe)) {
    return 0
  }

  return Number(sharpe.toFixed(precision))
}

export function calculateMaxDrawdown(values: number[]): number {
  const series = values.filter(isFiniteNumber)
  if (!series.length) {
    return 0
  }

  let peak = series[0]
  let maxDrawdown = 0

  for (const value of series) {
    if (value > peak) {
      peak = value
    }

    if (peak === 0) {
      continue
    }

    const drawdown = (value - peak) / peak
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown
    }
  }

  return Number(maxDrawdown.toFixed(DEFAULT_PRECISION))
}

export function calculateBeta(assetReturns: number[], benchmarkReturns: number[]): number {
  const pairs = zipReturns(assetReturns, benchmarkReturns)
  if (pairs.length <= 1) {
    return 0
  }

  const assetMean = average(pairs.map(([asset]) => asset))
  const benchmarkMean = average(pairs.map(([, benchmark]) => benchmark))

  const covariance =
    pairs.reduce(
      (sum, [asset, benchmark]) => sum + (asset - assetMean) * (benchmark - benchmarkMean),
      0,
    ) /
    (pairs.length - 1)

  const benchmarkVariance =
    pairs.reduce((sum, [, benchmark]) => sum + (benchmark - benchmarkMean) ** 2, 0) /
    (pairs.length - 1)

  if (!benchmarkVariance) {
    return 0
  }

  return Number((covariance / benchmarkVariance).toFixed(DEFAULT_PRECISION))
}

export function calculateCorrelation(seriesA: number[], seriesB: number[]): number {
  const pairs = zipReturns(seriesA, seriesB)
  if (pairs.length <= 1) {
    return 0
  }

  const valuesA = pairs.map(([value]) => value)
  const valuesB = pairs.map(([, value]) => value)
  const meanA = average(valuesA)
  const meanB = average(valuesB)

  const covariance =
    pairs.reduce((sum, [a, b]) => sum + (a - meanA) * (b - meanB), 0) /
    (pairs.length - 1)
  const stdA = Math.sqrt(
    valuesA.reduce((sum, value) => sum + (value - meanA) ** 2, 0) / (pairs.length - 1),
  )
  const stdB = Math.sqrt(
    valuesB.reduce((sum, value) => sum + (value - meanB) ** 2, 0) / (pairs.length - 1),
  )

  if (!stdA || !stdB) {
    return 0
  }

  return Number((covariance / (stdA * stdB)).toFixed(DEFAULT_PRECISION))
}

export function calculateExpectedReturn(prices: HistoricalPrice[]): number {
  if (prices.length <= 1) {
    return 0
  }

  const closes = prices
    .map((entry) => entry.close)
    .filter((value): value is number => isFiniteNumber(value) && value > 0)

  if (closes.length <= 1) {
    return 0
  }

  const returns = calculateReturns(closes, { useLog: true, precision: 10 })
  if (!returns.length) {
    return 0
  }

  const averageReturn = returns.reduce((sum, value) => sum + value, 0) / returns.length
  return Number((averageReturn * 252).toFixed(DEFAULT_PRECISION))
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

function zipReturns(a: number[], b: number[]): Array<[number, number]> {
  const length = Math.min(a.length, b.length)
  const pairs: Array<[number, number]> = []

  for (let index = 0; index < length; index += 1) {
    const valueA = a[index]
    const valueB = b[index]
    if (isFiniteNumber(valueA) && isFiniteNumber(valueB)) {
      pairs.push([valueA, valueB])
    }
  }

  return pairs
}

function average(values: number[]): number {
  if (!values.length) {
    return 0
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length
}
