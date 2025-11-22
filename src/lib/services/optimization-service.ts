import {
  optimizeMaxReturn,
  optimizeMaxSharpe,
  optimizeMinVariance,
  optimizeRiskParity,
} from '@/lib/calculations/optimization'
import { mockPortfolio } from '@/lib/constants/mock-data'
import type {
  OptimizationStrategy,
  OptimizationSummary,
  Portfolio,
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

export interface OptimizationSummaryResponse {
  summaries: OptimizationSummary[]
  summary?: OptimizationSummary
}

export function getOptimizationSummaries(
  strategy?: OptimizationStrategy,
  portfolio: Portfolio = mockPortfolio,
): OptimizationSummaryResponse {
  const assets = portfolio.assets
  if (!assets.length) {
    return { summaries: [] }
  }

  const returnMatrix = assets.map((asset) => generateSyntheticReturns(asset.asset.symbol))
  const meanVector = returnMatrix.map((series) => average(series))
  const covariance = covarianceMatrix(returnMatrix)

  const summaries = STRATEGIES.map((definition) => {
    const weights = definition.optimizer(returnMatrix, { minWeight: 0.05, maxWeight: 0.6 })
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
    return { summaries }
  }

  return {
    summaries,
    summary: summaries.find((item) => item.strategy === strategy),
  }
}

function generateSyntheticReturns(symbol: string, months = MONTHS) {
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

function quadraticForm(weights: number[], matrix: number[][]) {
  let total = 0
  for (let i = 0; i < weights.length; i += 1) {
    for (let j = 0; j < weights.length; j += 1) {
      total += weights[i] * weights[j] * (matrix[i]?.[j] ?? 0)
    }
  }
  return total
}
