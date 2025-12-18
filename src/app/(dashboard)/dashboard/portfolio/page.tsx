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

const glassPanel =
  'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/50 to-slate-800/50 shadow-xl shadow-black/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md'

export default function PortfolioPage() {
  const { locale } = useLocale()
  const { portfolio, replacePortfolio, resetPortfolio, simulation, setSimulation } = usePortfolio()
  const [selectedStrategy, setSelectedStrategy] = useState<OptimizationStrategy>('max_sharpe')
  const { summaries, summary, isLoading, error, meta, refresh } = useOptimization({
    strategy: selectedStrategy,
    portfolio,
  })

  const optimizationSummaries = summaries?.length ? summaries : mockOptimizationSummaries

  const availableAssets = useMemo(
    () => portfolio.assets.map(({ asset }) => ({ symbol: asset.symbol, name: asset.name })),
    [portfolio.assets],
  )

  const portfolioValue = useMemo(() => totalValue(portfolio), [portfolio])

  const selectedSummary = useMemo(() => {
    if (summary) return summary
    return optimizationSummaries.find((item) => item.strategy === selectedStrategy)
  }, [optimizationSummaries, selectedStrategy, summary])

  const isUsingOptimizedAllocation = Boolean(selectedSummary?.weights?.length)

  const symbolLookup = useMemo(
    () => new Map(portfolio.assets.map((item) => [item.asset.symbol, item.asset])),
    [portfolio.assets],
  )

  const displayedAllocations = useMemo(() => {
    if (selectedSummary?.weights?.length) {
      return selectedSummary.weights.map((entry) => {
        const asset = symbolLookup.get(entry.symbol)
        return {
          symbol: entry.symbol,
          name: ('name' in entry ? entry.name : undefined) ?? asset?.name ?? entry.symbol,
          weight: entry.weight,
          value: portfolioValue * entry.weight,
          asset,
        }
      })
    }

    return portfolio.assets.map(({ asset, weight, value }) => ({
      symbol: asset.symbol,
      name: asset.name,
      weight,
      value: value ?? weight * portfolioValue,
      asset,
    }))
  }, [portfolio.assets, portfolioValue, selectedSummary?.weights, symbolLookup])

  const statusMessage = useMemo(() => {
    if (isLoading) {
      return locale === 'ja' ? '最適化結果を取得しています…' : 'Fetching optimization results…'
    }
    if (error) {
      return locale === 'ja'
        ? 'データ取得に失敗したためモック値を表示しています。'
        : 'Using mock values because fetching failed.'
    }
    if (meta?.source === 'synthetic') {
      return locale === 'ja'
        ? 'シミュレーションデータを表示しています。外部API接続前のプレースホルダーです。'
        : 'Showing simulated data as a placeholder before wiring up external APIs.'
    }
    if (meta?.fromCache) {
      return locale === 'ja'
        ? 'キャッシュ済みの市場データで最適化結果を表示しています。'
        : 'Displaying optimization results computed from cached market data.'
    }
    return locale === 'ja'
      ? '外部データを反映した最新の最適化結果です。'
      : 'Latest optimization results with external data applied.'
  }, [error, isLoading, locale, meta?.fromCache, meta?.source])

  const statusRole: 'alert' | 'status' = error ? 'alert' : 'status'

  const dataSourceLabel = useMemo(() => {
    if (meta?.source === 'synthetic') {
      return locale === 'ja' ? 'シミュレーションデータ' : 'Simulated data'
    }
    if (meta?.fromCache) {
      return locale === 'ja' ? 'キャッシュ済み市場データ' : 'Cached market data'
    }
    if (meta?.source) {
      return locale === 'ja' ? '外部市場データ' : 'External market data'
    }
    return locale === 'ja' ? 'データ準備中' : 'Data pending'
  }, [locale, meta?.fromCache, meta?.source])

  const rangeLabel = useMemo(() => {
    if (!meta?.range) {
      return locale === 'ja' ? 'レンジ未設定' : 'Range not set'
    }
    return locale === 'ja' ? `レンジ: ${meta.range}` : `Range: ${meta.range}`
  }, [locale, meta?.range])

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
    <div className="relative space-y-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(236,72,153,0.12),transparent_28%),radial-gradient(circle_at_40%_80%,rgba(94,234,212,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950/70" />

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-800/70 p-6 text-slate-50 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.06),transparent_30%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300/80">
              Portfolio Pulse
            </p>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{portfolio.name}</h1>
            <p className="max-w-2xl text-sm text-slate-200/80">
              ポートフォリオは{' '}
              {new Date(portfolio.updatedAt).toLocaleString(locale === 'ja' ? 'ja-JP' : 'en-US')}{' '}
              に最終更新されました。 ローカルストレージに保存される個人向け設定を表示しています。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden />
                {dataSourceLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100">
                <span className="h-2 w-2 rounded-full bg-cyan-300" aria-hidden />
                {rangeLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100">
                <span className="h-2 w-2 rounded-full bg-fuchsia-300" aria-hidden />
                {portfolio.assets.length} assets
              </span>
            </div>
          </div>
          <div
            className={`${glassPanel} flex items-center gap-3 px-4 py-3 text-xs text-slate-100 shadow-inner`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold text-white shadow-md">
              {selectedSummary ? (selectedSummary.sharpeRatio ?? 0).toFixed(2) : '--'}
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-200/80">
                Sharpe Ratio
              </p>
              <p className="text-sm font-semibold text-white">
                {(selectedSummary?.expectedReturn ?? mockPerformanceMetrics.expectedReturn) * 100 >=
                0
                  ? '+'
                  : ''}
                {(
                  (selectedSummary?.expectedReturn ?? mockPerformanceMetrics.expectedReturn) * 100
                ).toFixed(1)}
                % • {(selectedSummary?.risk ?? mockPerformanceMetrics.volatility * 100).toFixed(1)}%
                vol
              </p>
            </div>
          </div>
        </div>
      </section>

      <PortfolioEditor portfolio={portfolio} onSave={replacePortfolio} onReset={resetPortfolio} />

      <SimulationControls
        availableAssets={availableAssets}
        defaultSettings={simulation}
        onApply={setSimulation}
      />

      {simulation ? (
        <div className={`${glassPanel} p-4 text-xs text-slate-200`}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_30%)]" />
          <div className="relative space-y-1">
            <p className="text-sm font-semibold text-white">{simulationSnapshotTitle}</p>
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
        </div>
      ) : null}

      <div className={`${glassPanel} p-4`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_30%)]" />
        <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
          <MetricCard
            title="シャープレシオ"
            value={mockPerformanceMetrics.sharpeRatio.toFixed(2)}
          />
        </div>
      </div>

      <SectionCard
        title="資産配分"
        description={
          isUsingOptimizedAllocation
            ? `${
                strategyOptions.find((option) => option.value === selectedStrategy)?.label ??
                '最適化'
              } の推奨配分です。`
            : '現在のポートフォリオに保存されている配分です。'
        }
        className="border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-800/60 text-slate-100 shadow-2xl"
      >
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ティッカー</th>
                <th className="px-4 py-3 text-left font-semibold">名称</th>
                <th className="px-4 py-3 text-right font-semibold">配分</th>
                <th className="px-4 py-3 text-right font-semibold">評価額 (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/5">
              {displayedAllocations.map((allocation) => (
                <tr key={allocation.symbol} className="transition hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold">{allocation.symbol}</td>
                  <td className="px-4 py-3 text-slate-300">{allocation.name}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-100">
                    {(allocation.weight * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300">
                    {allocation.value
                      ? allocation.value.toLocaleString('en-US', { maximumFractionDigits: 0 })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 h-72 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
          <AllocationPieChart
            assets={displayedAllocations.map((item) => ({
              weight: item.weight,
              asset: item.asset ?? { symbol: item.symbol },
            }))}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="最適化シナリオ"
        description="最大シャープレシオ、最小分散、最大リターンの3つのシナリオを比較します。"
        aria-busy={isLoading}
        className="border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-800/60 text-slate-100 shadow-2xl"
        footer={
          <div className="flex flex-col gap-3 text-xs text-slate-200">
            <p
              role={statusRole}
              aria-live="polite"
              className={cn(
                'flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 shadow-sm backdrop-blur',
                error ? 'text-red-200' : 'text-slate-200',
              )}
            >
              {isLoading ? (
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary"
                />
              ) : (
                <span
                  aria-hidden
                  className={cn(
                    'inline-block h-2 w-2 rounded-full',
                    error ? 'bg-destructive' : 'bg-primary/70',
                  )}
                />
              )}
              <span>{statusMessage}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:justify-between">
              {error ? (
                <button
                  type="button"
                  onClick={() => refresh()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locale === 'ja' ? '再取得' : 'Retry'}
                </button>
              ) : null}
              <ReportExportButton data={exportPayload} filename="portfolio-report.json" />
            </div>
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
                <p className="text-sm font-semibold text-white">
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
                    'rounded-xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30',
                    isActive && 'border-primary/70 ring-1 ring-primary/50 bg-primary/10',
                  )}
                >
                  <p className="text-sm font-semibold text-white">
                    {strategyOptions.find((option) => option.value === scenario.strategy)?.label ??
                      scenario.strategy}
                  </p>
                  <dl className="mt-3 space-y-2 text-xs text-slate-300">
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
                    <p className="mt-3 text-xs text-slate-300">{scenario.description}</p>
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
        className="border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-800/60 text-slate-100 shadow-2xl"
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
