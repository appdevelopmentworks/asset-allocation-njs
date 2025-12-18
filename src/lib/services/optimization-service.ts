import {
  optimizeMaxReturn,
  optimizeMaxSharpe,
  optimizeMinVariance,
  optimizeRiskParity,
} from '@/lib/calculations/optimization'
import { mockPortfolio } from '@/lib/constants/mock-data'
import {
  createCachedMarketDataProvider,
  createSyntheticMarketDataProvider,
  generateSyntheticReturns,
  type MarketDataMeta,
  type MarketDataProvider,
} from '@/lib/services/market-data-service'
import type {
  OptimizationStrategy,
  OptimizationSummary,
  Portfolio,
  TimeRange,
} from '@/lib/types'

interface StrategyDefinition {
  strategy: OptimizationStrategy
  label: string
  description: string
  optimizer: typeof optimizeMaxSharpe
}

const STRATEGIES: StrategyDefinition[] = [
  {
    strategy: 'max_sharpe',
    label: '最大シャープレシオ',
    description:
      'リスク当たりリターンが最も高くなるよう株式・債券・オルタナティブをバランス調整します。',
    optimizer: optimizeMaxSharpe,
  },
  {
    strategy: 'min_variance',
    label: '最小分散',
    description: 'ボラティリティ抑制を最優先し、防御的な比率へ寄せたポートフォリオ。',
    optimizer: optimizeMinVariance,
  },
  {
    strategy: 'max_return',
    label: '最大リターン',
    description: '期待リターンが高いアセットへ積極的に配分し、攻めのポートフォリオを構築します。',
    optimizer: optimizeMaxReturn,
  },
  {
    strategy: 'risk_parity',
    label: 'リスクパリティ',
    description: '各資産のリスク寄与度を均等にし、単一アセットへの偏りを軽減します。',
    optimizer: optimizeRiskParity,
  },
]

const MONTHS = 120
const RANGE_TO_MONTHS: Record<TimeRange, number> = {
  '1Y': 12,
  '3Y': 36,
  '5Y': 60,
  '10Y': 120,
  MAX: MONTHS,
}
const DEFAULT_RANGE: TimeRange = '5Y'
const defaultMarketDataProvider = createCachedMarketDataProvider(createSyntheticMarketDataProvider())

export interface OptimizationSummaryResponse {
  summaries: OptimizationSummary[]
  summary?: OptimizationSummary
  meta: MarketDataMeta
}

export interface GetOptimizationOptions {
  marketDataProvider?: MarketDataProvider
  range?: TimeRange
}

export async function getOptimizationSummaries(
  strategy?: OptimizationStrategy,
  portfolio: Portfolio = mockPortfolio,
  options: GetOptimizationOptions = {},
): Promise<OptimizationSummaryResponse> {
  const assets = portfolio?.assets ?? []
  const symbols = assets.map((asset) => asset.asset.symbol).filter(Boolean)
  const range = options.range ?? portfolio.settings?.timeRange ?? DEFAULT_RANGE
  const provider = options.marketDataProvider ?? defaultMarketDataProvider
  const months = RANGE_TO_MONTHS[range] ?? MONTHS

  if (!symbols.length) {
    return {
      summaries: [],
      meta: {
        source: 'synthetic',
        fromCache: false,
        range,
      },
    }
  }

  let result: Awaited<ReturnType<MarketDataProvider['getReturns']>>

  try {
    result = await provider.getReturns({ symbols, range })
  } catch (error) {
    if (provider !== defaultMarketDataProvider) {
      result = await defaultMarketDataProvider.getReturns({ symbols, range })
    } else {
      throw error
    }
  }

  const returnMatrix = symbols.map(
    (symbol) => result.returns[symbol] ?? generateSyntheticReturns(symbol, months),
  )

  const hasMissingSeries = returnMatrix.some((series) => !series.length)
  const normalized = returnMatrix.map((series) =>
    series.length ? series : generateFallbackSeries(months),
  )
  const meanVector = normalized.map((series) => average(series))
  const covariance = covarianceMatrix(normalized)
  const meta: MarketDataMeta = {
    ...result.meta,
    source: hasMissingSeries ? 'synthetic' : result.meta.source,
    range,
  }

  const summaries = STRATEGIES.map((definition) => {
    const weights = definition.optimizer(normalized, { minWeight: 0.05, maxWeight: 0.6 })
    const stats = calculateStats(weights, meanVector, covariance)

    return {
      strategy: definition.strategy,
      expectedReturn: Number(stats.expectedReturn.toFixed(6)),
      risk: Number(stats.risk.toFixed(6)),
      sharpeRatio: Number(stats.sharpeRatio.toFixed(4)),
      description: definition.description,
      weights: weights.map((weight, index) => ({
        symbol: assets[index]?.asset.symbol ?? `ASSET-${index + 1}`,
        name: assets[index]?.asset.name,
        weight: Number(weight.toFixed(6)),
      })),
    } satisfies OptimizationSummary
  })

  if (!strategy) {
    return {
      summaries,
      meta,
    }
  }

  return {
    summaries,
    summary: summaries.find((item) => item.strategy === strategy),
    meta,
  }
}

function average(values: number[]): number {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function covarianceMatrix(assetReturns: number[][]): number[][] {
  const size = assetReturns.length
  const result = Array.from({ length: size }, () => Array(size).fill(0))

  for (let i = 0; i < size; i += 1) {
    for (let j = i; j < size; j += 1) {
      const seriesA = assetReturns[i]
      const seriesB = assetReturns[j]
      const length = Math.min(seriesA.length, seriesB.length)
      if (length <= 1) continue

      const meanA = average(seriesA)
      const meanB = average(seriesB)
      let sum = 0
      for (let index = 0; index < length; index += 1) {
        sum += (seriesA[index] - meanA) * (seriesB[index] - meanB)
      }
      const covariance = sum / (length - 1)
      result[i][j] = covariance
      result[j][i] = covariance
    }
  }

  return result
}

function calculateStats(weights: number[], meanVector: number[], covariance: number[][]) {
  const expectedReturn = weights.reduce((sum, weight, index) => sum + weight * meanVector[index], 0)
  const risk = Math.sqrt(Math.max(0, quadraticForm(weights, covariance)))
  const sharpeRatio = risk ? expectedReturn / risk : 0
  return { expectedReturn, risk, sharpeRatio }
}

function generateFallbackSeries(length = MONTHS) {
  return Array.from({ length }, () => 0.005)
}

function quadraticForm(weights: number[], matrix: number[][]) {
  let total = 0
  for (let i = 0; i < weights.length; i += 1) {
    for (let j = 0; j < weights.length; j += 1) {
      total += weights[i] * weights[j] * (matrix[i]?.[j] ?? 0)
    }
  }
  return total
}
