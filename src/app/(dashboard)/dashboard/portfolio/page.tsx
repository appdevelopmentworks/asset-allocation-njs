'use client'

import { useMemo, useState } from 'react'
import { MetricCard } from '@/components/ui/metric-card'
import { SectionCard } from '@/components/ui/section-card'
import { SimulationControls } from '@/components/forms/simulation-controls'
import { PortfolioEditor } from '@/components/forms/portfolio-editor'
import { ReportExportButton } from '@/components/ui/report-export-button'
import { AllocationPieChart } from '@/components/charts/allocation-pie-chart'
import { useOptimization } from '@/lib/hooks/use-optimization'
import { mockOptimizationSummaries, mockPerformanceMetrics } from '@/lib/constants/mock-data'
import type { OptimizationStrategy, Portfolio } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useLocale } from '@/components/providers/locale-provider'
import { usePortfolio } from '@/components/providers/portfolio-provider'

const strategyOptions: Array<{ value: OptimizationStrategy; label: string; description: string }> =
  [
    {
      value: 'max_sharpe',
      label: '最大シャープレシオ',
      description: 'リスクに対するリターン効率を最大化します。',
    },
    {
      value: 'min_variance',
      label: '最小分散',
      description: 'ボラティリティを抑え、安定性を最優先します。',
    },
    {
      value: 'max_return',
      label: '最大リターン',
      description: 'リスク許容度を高め、リターン最大化を狙います。',
    },
    {
      value: 'risk_parity',
      label: 'リスクパリティ',
      description: 'リスク寄与度を均等化して資産クラスの偏りを抑えます。',
    },
  ]

const totalValue = (portfolio: Portfolio) =>
  portfolio.assets.reduce((sum, asset) => sum + (asset.value ?? 0), 0)

export default function PortfolioPage() {
  const { locale } = useLocale()
  const { portfolio, replacePortfolio, resetPortfolio, simulation, setSimulation } = usePortfolio()
  const [selectedStrategy, setSelectedStrategy] = useState<OptimizationStrategy>('max_sharpe')
  const { summaries, summary, isLoading, error } = useOptimization({ strategy: selectedStrategy })

  const optimizationSummaries = summaries ?? mockOptimizationSummaries

  const availableAssets = useMemo(
    () => portfolio.assets.map(({ asset }) => ({ symbol: asset.symbol, name: asset.name })),
    [portfolio.assets],
  )

  const portfolioValue = useMemo(() => totalValue(portfolio), [portfolio])

  const selectedSummary = useMemo(() => {
    if (summary) return summary
    return optimizationSummaries.find((item) => item.strategy === selectedStrategy)
  }, [optimizationSummaries, selectedStrategy, summary])

  const optimizationFooterNote = isLoading
    ? locale === 'ja'
      ? '最適化結果を取得しています…'
      : 'Fetching optimization results…'
    : error
      ? locale === 'ja'
        ? 'データ取得に失敗したためモック値を表示しています。'
        : 'Using mock values because fetching failed.'
      : locale === 'ja'
        ? '最新の最適化結果を表示中。'
        : 'Showing the latest optimization results.'

  const exportPayload = useMemo(
    () => ({
      portfolio,
      optimization: optimizationSummaries,
      simulation,
    }),
    [optimizationSummaries, portfolio, simulation],
  )

  const simulationSnapshotTitle =
    locale === 'ja' ? 'シミュレーションスナップショット' : 'Simulation Snapshot'
  const simulationLabels = {
    assets: locale === 'ja' ? '資産' : 'Assets',
    range: locale === 'ja' ? '期間' : 'Range',
    trials: locale === 'ja' ? '回数' : 'Trials',
    rebalance: locale === 'ja' ? 'リバランス' : 'Rebalance',
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{portfolio.name}</h1>
        <p className="text-sm text-muted-foreground">
          ポートフォリオは{' '}
          {new Date(portfolio.updatedAt).toLocaleString(locale === 'ja' ? 'ja-JP' : 'en-US')}{' '}
          に最終更新されました。
          このアプリはブラウザのローカルストレージに保存される個人利用向けの設定を表示しています。
        </p>
      </header>

      <PortfolioEditor portfolio={portfolio} onSave={replacePortfolio} onReset={resetPortfolio} />

      <SimulationControls
        availableAssets={availableAssets}
        defaultSettings={simulation}
        onApply={setSimulation}
      />

      {simulation ? (
        <div className="rounded-lg border bg-background/60 p-4 text-xs text-muted-foreground">
          <p className="text-sm font-semibold text-foreground">{simulationSnapshotTitle}</p>
          <p className="mt-2">
            {simulationLabels.assets}:{' '}
            {simulation.assets.length ? simulation.assets.join(', ') : '—'}
          </p>
          <p>
            {simulationLabels.range}: {simulation.range}
          </p>
          <p>
            {simulationLabels.trials}: {simulation.trials.toLocaleString()}
          </p>
          <p>
            {simulationLabels.rebalance}: {simulation.rebalance}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="ポートフォリオ評価額"
          value={`$${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
        />
        <MetricCard
          title="期待リターン"
          value={`${(mockPerformanceMetrics.expectedReturn * 100).toFixed(1)}%`}
          change={{ value: '+0.3%', trend: 'up' }}
        />
        <MetricCard
          title="ボラティリティ"
          value={`${(mockPerformanceMetrics.volatility * 100).toFixed(1)}%`}
          change={{ value: '-0.1%', trend: 'down' }}
        />
        <MetricCard title="シャープレシオ" value={mockPerformanceMetrics.sharpeRatio.toFixed(2)} />
      </div>

      <SectionCard
        title="資産配分"
        description="Yahoo Finance から取得した価格データを元に、最適化アルゴリズムで算出された配分比率を表示します。"
      >
        <div className="overflow-hidden rounded-lg border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  ティッカー
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">名称</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">配分</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  評価額 (USD)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card/60">
              {portfolio.assets.map(({ asset, weight, value }) => (
                <tr key={asset.id} className="transition hover:bg-muted/40">
                  <td className="px-4 py-3 font-semibold">{asset.symbol}</td>
                  <td className="px-4 py-3 text-muted-foreground">{asset.name}</td>
                  <td className="px-4 py-3 text-right font-medium">{(weight * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {value ? value.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 h-72">
          <AllocationPieChart assets={portfolio.assets} />
        </div>
      </SectionCard>

      <SectionCard
        title="最適化シナリオ"
        description="最大シャープレシオ、最小分散、最大リターンの3つのシナリオを比較します。"
        footer={
          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>{optimizationFooterNote}</span>
            <ReportExportButton data={exportPayload} filename="portfolio-report.json" />
          </div>
        }
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="w-full max-w-xs space-y-4">
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              最適化戦略を選択
              <select
                value={selectedStrategy}
                onChange={(event) =>
                  setSelectedStrategy(event.target.value as OptimizationStrategy)
                }
                className="rounded-lg border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              >
                {strategyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="rounded-lg border bg-background/70 p-4 text-xs text-muted-foreground">
              {strategyOptions.find((option) => option.value === selectedStrategy)?.description}
            </p>

            {selectedSummary ? (
              <div className="rounded-lg border bg-primary/10 p-4 text-sm">
                <p className="text-sm font-semibold text-foreground">
                  {strategyOptions.find((option) => option.value === selectedStrategy)?.label ??
                    '戦略'}
                  の概要
                </p>
                <dl className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <dt>期待リターン</dt>
                    <dd className="font-semibold text-foreground">
                      {(selectedSummary.expectedReturn * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>ボラティリティ</dt>
                    <dd className="font-semibold text-foreground">
                      {(selectedSummary.risk * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>シャープレシオ</dt>
                    <dd className="font-semibold text-foreground">
                      {selectedSummary.sharpeRatio.toFixed(2)}
                    </dd>
                  </div>
                </dl>
                {selectedSummary.description ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {selectedSummary.description}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-muted p-4 text-xs text-muted-foreground">
                選択した戦略のデータが見つかりません。別の戦略をお試しください。
              </div>
            )}
          </div>

          <div className="grid flex-1 gap-4 md:grid-cols-2">
            {optimizationSummaries.map((scenario) => {
              const isActive = scenario.strategy === selectedStrategy

              return (
                <div
                  key={scenario.strategy}
                  className={cn(
                    'rounded-lg border bg-background/60 p-4 transition hover:shadow-sm',
                    isActive && 'border-primary ring-1 ring-primary/40 bg-primary/5',
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">
                    {strategyOptions.find((option) => option.value === scenario.strategy)?.label ??
                      scenario.strategy}
                  </p>
                  <dl className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <dt>期待リターン</dt>
                      <dd className="font-medium text-foreground">
                        {(scenario.expectedReturn * 100).toFixed(1)}%
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>ボラティリティ</dt>
                      <dd className="font-medium text-foreground">
                        {(scenario.risk * 100).toFixed(1)}%
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>シャープレシオ</dt>
                      <dd className="font-medium text-foreground">
                        {scenario.sharpeRatio.toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                  {scenario.description ? (
                    <p className="mt-3 text-xs text-muted-foreground">{scenario.description}</p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="設定概要"
        description="リバランス頻度や配当再投資など、ポートフォリオの基本設定です。設定画面で編集可能になる予定です。"
      >
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              リバランス頻度
            </dt>
            <dd className="mt-1 font-medium text-foreground">
              {portfolio.settings.rebalanceFrequency === 'monthly'
                ? '毎月'
                : portfolio.settings.rebalanceFrequency === 'quarterly'
                  ? '四半期ごと'
                  : '毎年'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              期間設定
            </dt>
            <dd className="mt-1 font-medium text-foreground">{portfolio.settings.timeRange}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              配当再投資
            </dt>
            <dd className="mt-1 font-medium text-foreground">
              {portfolio.settings.includeDividends ? '有効' : '無効'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              対数リターン
            </dt>
            <dd className="mt-1 font-medium text-foreground">
              {portfolio.settings.useLogReturns ? '使用する' : '使用しない'}
            </dd>
          </div>
        </dl>
      </SectionCard>
    </div>
  )
}
