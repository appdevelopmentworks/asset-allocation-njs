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
  'relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/95 via-slate-850/95 to-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-sm'

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

      <section className="relative overflow-hidden rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_70%_40%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-300">
              Portfolio Pulse
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">{portfolio.name}</h1>
            <p className="max-w-2xl text-base text-slate-200">
              ポートフォリオは{' '}
              {new Date(portfolio.updatedAt).toLocaleString(locale === 'ja' ? 'ja-JP' : 'en-US')}{' '}
              に最終更新されました。 ローカルストレージに保存される個人向け設定を表示しています。
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-200 shadow-lg">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50"
                  aria-hidden
                />
                {dataSourceLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-500/20 px-4 py-2 text-sm font-bold text-cyan-200 shadow-lg">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50"
                  aria-hidden
                />
                {rangeLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-fuchsia-400/30 bg-fuchsia-500/20 px-4 py-2 text-sm font-bold text-fuchsia-200 shadow-lg">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-fuchsia-400 shadow-lg shadow-fuchsia-500/50"
                  aria-hidden
                />
                {portfolio.assets.length} assets
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-slate-600/50 bg-gradient-to-br from-slate-700/80 to-slate-800/80 px-6 py-4 shadow-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-indigo-900/50">
              {selectedSummary ? (selectedSummary.sharpeRatio ?? 0).toFixed(2) : '--'}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                Sharpe Ratio
              </p>
              <p className="text-base font-bold text-white">
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
        <div className={`${glassPanel} p-4 text-xs text-white/90`}>
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

      <SectionCard
        title="資産配分"
        description={
          isUsingOptimizedAllocation
            ? `${strategyOptions.find((option) => option.value === selectedStrategy)?.label ??
            '最適化'
            } の推奨配分です。`
            : '現在のポートフォリオに保存されている配分です。'
        }
      >
        <div className="overflow-hidden rounded-lg border border-slate-700/50">
          <table className="min-w-full divide-y divide-slate-700/50 text-base">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">ティッカー</th>
                <th className="px-6 py-4 text-left font-bold">名称</th>
                <th className="px-6 py-4 text-right font-bold">配分</th>
                <th className="px-6 py-4 text-right font-bold">評価額 (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 bg-slate-800/60">
              {displayedAllocations.map((allocation) => (
                <tr key={allocation.symbol} className="transition-colors hover:bg-slate-700/40">
                  <td className="px-6 py-4 font-bold text-indigo-300">{allocation.symbol}</td>
                  <td className="px-6 py-4 text-white">{allocation.name}</td>
                  <td className="px-6 py-4 text-right font-bold text-white">
                    {(allocation.weight * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-right text-slate-200">
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
        footer={
          <div className="flex flex-col gap-4 text-xs font-bold text-white">
            <p
              role={statusRole}
              className={`flex items-center gap-2 ${error ? 'text-rose-400' : 'text-emerald-400'
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${error ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
              />
              {statusMessage}
            </p>
            <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
              <span className="text-slate-300">
                {locale === 'ja' ? '最終更新' : 'Last updated'}:{' '}
                {new Date().toLocaleTimeString()}
              </span>
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500">
                {locale === 'ja' ? 'レポートをエクスポート' : 'Export Report'}
              </button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="w-full max-w-xs space-y-4">
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-200">
              最適化戦略を選択
              <select
                value={selectedStrategy}
                onChange={(event) =>
                  setSelectedStrategy(event.target.value as OptimizationStrategy)
                }
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {strategyOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="rounded-lg border bg-background/70 p-4 text-xs text-slate-200">
              {strategyOptions.find((option) => option.value === selectedStrategy)?.description}
            </p>

            {selectedSummary ? (
              <div className="rounded-lg border bg-primary/10 p-4 text-sm">
                <p className="text-sm font-semibold text-white">
                  {strategyOptions.find((option) => option.value === selectedStrategy)?.label ??
                    '戦略'}
                  の概要
                </p>
                <dl className="mt-3 space-y-2 text-xs text-slate-200">
                  <div className="flex items-center justify-between">
                    <dt>期待リターン</dt>
                    <dd className="font-semibold text-white">
                      {(selectedSummary.expectedReturn * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>ボラティリティ</dt>
                    <dd className="font-semibold text-white">
                      {(selectedSummary.risk * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>シャープレシオ</dt>
                    <dd className="font-semibold text-white">
                      {selectedSummary.sharpeRatio.toFixed(2)}
                    </dd>
                  </div>
                </dl>
                {selectedSummary.description ? (
                  <p className="mt-3 text-xs text-slate-200">
                    {selectedSummary.description}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-muted p-4 text-xs text-slate-200">
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
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      {locale === 'ja' ? '期待リターン' : 'Expected Return'}
                    </p>
                    <p className="text-lg font-bold text-white">
                      {(scenario.expectedReturn * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      {locale === 'ja' ? 'リスク' : 'Risk'}
                    </p>
                    <p className="text-lg font-bold text-white">
                      {(scenario.risk * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">シャープレシオ</dt>
                    <dd className="font-medium text-white">
                      {scenario.sharpeRatio.toFixed(2)}
                    </dd>
                  </div>
                  {scenario.description ? (
                    <p className="mt-3 text-xs text-slate-200">{scenario.description}</p>
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
            <dt className="font-bold text-indigo-300">対数リターン</dt>
            <dd className="text-white">
              {portfolio.settings.useLogReturns ? '使用する' : '使用しない'}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-indigo-300">
              {locale === 'ja' ? '通貨' : 'Currency'}
            </dt>
            <dd className="text-white">{portfolio.baseCurrency}</dd>
          </div>
          <div>
            <dt className="font-bold text-indigo-300">
              {locale === 'ja' ? 'リバランス' : 'Rebalance'}
            </dt>
            <dd className="text-white">{locale === 'ja' ? '四半期ごと' : 'Quarterly'}</dd>
          </div>
          <div>
            <dt className="font-bold text-indigo-300">
              {locale === 'ja' ? '配当再投資' : 'Dividend Reinvestment'}
            </dt>
            <dd className="text-white">{locale === 'ja' ? '有効' : 'Enabled'}</dd>
          </div>
        </dl>
      </SectionCard>
    </div >
  )
}
