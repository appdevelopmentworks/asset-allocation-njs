'use client'

import { useMemo } from 'react'
import { SectionCard } from '@/components/ui/section-card'
import { EfficientFrontierChart } from '@/components/charts/efficient-frontier-chart'
import { CorrelationHeatmap } from '@/components/charts/correlation-heatmap'
import { BacktestChart, type BacktestPoint } from '@/components/charts/backtest-chart'
import {
  mockCorrelationMatrix,
  mockEfficientFrontier,
  mockOptimalPoint,
  mockRiskMetrics,
} from '@/lib/constants/mock-data'
import { useLocale } from '@/components/providers/locale-provider'
import { usePortfolio } from '@/components/providers/portfolio-provider'
import type { Portfolio, SimulationSettings } from '@/lib/types'

const stressTestScenarios = [
  {
    title: '金利 100bp 上昇',
    impact: '-3.1%',
    note: '債券と高PER株が下落。ゴールドが一部ヘッジ。',
  },
  {
    title: '株式市場 -10%',
    impact: '-6.5%',
    note: 'ディフェンシブ資産が下支え。暗号資産が追加ダメージ。',
  },
  {
    title: 'ドル円 +5%',
    impact: '+1.8%',
    note: 'ドル建て資産の評価益。為替ヘッジが機能。',
  },
]

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
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

function generateBacktestSeries(
  portfolio: Portfolio,
  simulation: SimulationSettings,
): BacktestPoint[] {
  const monthsMap: Record<SimulationSettings['range'], number> = {
    '1Y': 12,
    '3Y': 36,
    '5Y': 60,
    '10Y': 120,
    MAX: 180,
  }

  const months = monthsMap[simulation.range] ?? 60
  const seedSource = `${portfolio.id}|${simulation.assets.join(',')}|${simulation.range}|${simulation.trials}|${simulation.rebalance}`
  const random = mulberry32(hashString(seedSource))

  const weightLookup = new Map(
    portfolio.assets.map((item) => [item.asset.symbol, item.weight ?? 0]),
  )

  const totalWeight = simulation.assets.reduce(
    (sum, symbol) => sum + (weightLookup.get(symbol) ?? 0),
    0,
  )

  const normalizedWeights = simulation.assets.map((symbol) => {
    const raw = weightLookup.get(symbol) ?? 0
    if (!totalWeight) return 0
    return raw / totalWeight
  })

  const start = new Date()
  start.setUTCDate(1)
  start.setUTCHours(0, 0, 0, 0)
  start.setUTCMonth(start.getUTCMonth() - months + 1)

  let portfolioValue = 1
  let benchmarkValue = 1

  const series: BacktestPoint[] = []

  for (let index = 0; index < months; index += 1) {
    const date = new Date(start)
    date.setUTCMonth(start.getUTCMonth() + index)

    const baseReturn = 0.003 + random() * 0.01
    const weightAdjustment = normalizedWeights.reduce((sum, weight, idx) => {
      if (weight === 0) return sum
      const factor = 0.002 * (idx + 1)
      return sum + weight * factor
    }, 0)

    const volatility = 0.015 + random() * 0.01
    const monthlyReturn = baseReturn + weightAdjustment + (random() - 0.5) * volatility
    const benchmarkReturn = 0.0025 + (random() - 0.5) * 0.01

    portfolioValue *= 1 + monthlyReturn
    benchmarkValue *= 1 + benchmarkReturn

    series.push({
      date: date.toISOString().slice(0, 10),
      portfolio: portfolioValue - 1,
      benchmark: benchmarkValue - 1,
    })
  }

  return series
}

export default function AnalysisPage() {
  const { t } = useLocale()
  const { portfolio, simulation } = usePortfolio()

  const correlation = useMemo(() => {
    const symbols = portfolio.assets.length
      ? portfolio.assets.map(({ asset }) => asset.symbol)
      : mockCorrelationMatrix.symbols

    const lookup = (symbolA: string, symbolB: string) => {
      const indexA = mockCorrelationMatrix.symbols.indexOf(symbolA)
      const indexB = mockCorrelationMatrix.symbols.indexOf(symbolB)
      if (indexA === -1 || indexB === -1) {
        return symbolA === symbolB ? 1 : 0.2
      }
      return mockCorrelationMatrix.matrix[indexA][indexB]
    }

    const matrix = symbols.map((row) => symbols.map((column) => lookup(row, column)))

    return {
      symbols,
      matrix,
    }
  }, [portfolio.assets])

  const backtestSeries = useMemo(() => {
    return generateBacktestSeries(portfolio, simulation)
  }, [portfolio, simulation])
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">高度分析</h1>
        <p className="text-sm text-muted-foreground">
          リスク・リターンの詳細分析、ストレステスト、バックテスト結果などを集約するページです。現時点ではモック指標を表示しています。
        </p>
      </header>

      <SectionCard
        title={t('analysis.efficientFrontier.title')}
        description={t('analysis.efficientFrontier.description')}
      >
        <div className="h-72">
          <EfficientFrontierChart points={mockEfficientFrontier} optimalPoint={mockOptimalPoint} />
        </div>
      </SectionCard>

      <SectionCard
        title={t('analysis.correlation.title')}
        description={t('analysis.correlation.description')}
      >
        <div className="h-72">
          <CorrelationHeatmap symbols={correlation.symbols} matrix={correlation.matrix} />
        </div>
      </SectionCard>

      <SectionCard
        title="リスク指標"
        description="VaR、CVaR、最大ドローダウンなど、ポートフォリオのリスク特性を表す主要指標です。"
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          {mockRiskMetrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border bg-background/70 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {metric.label}
              </dt>
              <dd className="mt-2 text-lg font-semibold text-foreground">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <SectionCard
        title="ストレステストシナリオ"
        description="市場ショックに対するポートフォリオ影響をシミュレーションします。後続の実装で Monte Carlo やヒストリカルシナリオに置き換えます。"
      >
        <ul className="space-y-4">
          {stressTestScenarios.map((scenario) => (
            <li key={scenario.title} className="rounded-lg border bg-background/60 p-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-foreground">{scenario.title}</p>
                <span className="text-sm font-semibold text-rose-500">{scenario.impact}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{scenario.note}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="バックテスト (プレースホルダー)"
        description={t('analysis.backtest.placeholder')}
      >
        <div className="h-72">
          <BacktestChart series={backtestSeries} />
        </div>
      </SectionCard>
    </div>
  )
}
