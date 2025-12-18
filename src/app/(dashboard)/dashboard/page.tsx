'use client'

import { MetricCard } from '@/components/ui/metric-card'
import { SectionCard } from '@/components/ui/section-card'

import { useEffect, useMemo, useState } from 'react'
import { PriceTrendChart } from '@/components/charts/price-trend-chart'
import {
  mockActivityLog,
  mockAssetSummaries,
  mockPerformanceMetrics,
} from '@/lib/constants/mock-data'
import { useLocale } from '@/components/providers/locale-provider'
import { usePortfolio } from '@/components/providers/portfolio-provider'

type RangeValue = '1y' | '3y' | '5y' | '10y' | 'max'

const rangeOptions: Array<{ value: RangeValue; label: string }> = [
  { value: '1y', label: '1年' },
  { value: '3y', label: '3年' },
  { value: '5y', label: '5年' },
  { value: '10y', label: '10年' },
  { value: 'max', label: '最大' },
]

const glassPanel =
  'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/50 to-slate-800/50 shadow-xl shadow-black/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md'

export default function DashboardHomePage() {
  const { t, locale } = useLocale()
  const { portfolio } = usePortfolio()
  const [selectedRange, setSelectedRange] = useState<RangeValue>('1y')
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [selectedComparisons, setSelectedComparisons] = useState<string[]>([])

  const assetOptions = useMemo(
    () =>
      portfolio.assets.map(({ asset }) => ({
        symbol: asset.symbol,
        label: `${asset.symbol} · ${asset.name}`,
      })),
    [portfolio.assets],
  )

  const [selectedAsset, setSelectedAsset] = useState(
    assetOptions[0]?.symbol ?? portfolio.assets[0]?.asset.symbol ?? '',
  )

  useEffect(() => {
    if (!assetOptions.length) {
      setSelectedAsset('')
      return
    }

    if (!assetOptions.find((option) => option.symbol === selectedAsset)) {
      setSelectedAsset(assetOptions[0].symbol)
    }
  }, [assetOptions, selectedAsset])

  useEffect(() => {
    setSelectedComparisons((prev) =>
      prev.filter((symbol) => assetOptions.some((option) => option.symbol === symbol)),
    )
  }, [assetOptions])

  const chartSymbol = selectedAsset || assetOptions[0]?.symbol || 'VOO'

  useEffect(() => {
    setSelectedComparisons((prev) => prev.filter((symbol) => symbol !== chartSymbol))
  }, [chartSymbol])

  const handleComparisonToggle = (checked: boolean) => {
    setIsComparisonMode(checked)

    if (checked) {
      setSelectedComparisons((prev) => {
        if (prev.length) {
          return prev
        }

        const fallback = assetOptions
          .map((option) => option.symbol)
          .filter((symbol) => symbol !== chartSymbol)

        return fallback.length ? [fallback[0]] : []
      })
    }
  }

  const toggleComparisonSymbol = (symbol: string) => {
    setSelectedComparisons((prev) =>
      prev.includes(symbol) ? prev.filter((item) => item !== symbol) : [...prev, symbol],
    )
  }

  const selectedAssetEntry = useMemo(
    () => portfolio.assets.find(({ asset }) => asset.symbol === selectedAsset),
    [portfolio.assets, selectedAsset],
  )

  const assetSummary = useMemo(() => {
    const fallback = {
      name: selectedAssetEntry?.asset.name ?? selectedAsset,
      allocation: selectedAssetEntry?.weight ?? 0,
      expectedReturn: mockPerformanceMetrics.expectedReturn,
      volatility: mockPerformanceMetrics.volatility,
      sharpeRatio: mockPerformanceMetrics.sharpeRatio,
      yearToDate: 0,
      description: selectedAssetEntry
        ? locale === 'ja'
          ? `${selectedAssetEntry.asset.name} の詳細指標は後で設定できます。`
          : `Detailed metrics for ${selectedAssetEntry.asset.name} can be configured later.`
        : locale === 'ja'
          ? 'データ準備中です。'
          : 'Data will appear once configured.',
    }

    return selectedAsset ? { ...fallback, ...(mockAssetSummaries[selectedAsset] ?? {}) } : fallback
  }, [locale, selectedAsset, selectedAssetEntry])

  const allocation = selectedAssetEntry?.weight ?? assetSummary.allocation ?? 0

  const metrics = useMemo(() => {
    const ytdPercent = assetSummary.yearToDate * 100
    const trend: 'up' | 'down' | 'neutral' =
      ytdPercent === 0 ? 'neutral' : ytdPercent > 0 ? 'up' : 'down'
    const formattedYtd = `${ytdPercent > 0 ? '+' : ''}${ytdPercent.toFixed(1)}%`

    return [
      {
        title: '年率期待リターン',
        value: `${(assetSummary.expectedReturn * 100).toFixed(1)}%`,
        change: { value: `YTD ${formattedYtd}`, trend },
      },
      {
        title: '年間ボラティリティ',
        value: `${(assetSummary.volatility * 100).toFixed(1)}%`,
      },
      {
        title: 'シャープレシオ',
        value: assetSummary.sharpeRatio.toFixed(2),
      },
    ]
  }, [
    assetSummary.expectedReturn,
    assetSummary.sharpeRatio,
    assetSummary.volatility,
    assetSummary.yearToDate,
  ])

  const assetSelectorLabel = locale === 'ja' ? '資産' : 'Asset'
  const rangeSelectorLabel = locale === 'ja' ? '期間' : 'Range'

  const rangeLabelText = (value: RangeValue) => {
    if (locale === 'ja') {
      switch (value) {
        case '1y':
          return '1年'
        case '3y':
          return '3年'
        case '5y':
          return '5年'
        case '10y':
          return '10年'
        default:
          return '最大'
      }
    }

    switch (value) {
      case '1y':
        return '1 Year'
      case '3y':
        return '3 Years'
      case '5y':
        return '5 Years'
      case '10y':
        return '10 Years'
      default:
        return 'Max'
    }
  }

  const selectedRangeLabel = rangeLabelText(selectedRange)
  const comparisonCandidates = useMemo(
    () => assetOptions.filter((option) => option.symbol !== chartSymbol),
    [assetOptions, chartSymbol],
  )

  useEffect(() => {
    if (!comparisonCandidates.length && isComparisonMode) {
      setIsComparisonMode(false)
      setSelectedComparisons([])
    }
  }, [comparisonCandidates.length, isComparisonMode])

  const comparisonSymbols = useMemo(() => {
    if (!chartSymbol) {
      return []
    }

    if (!isComparisonMode) {
      return [chartSymbol]
    }

    const extras = selectedComparisons.filter(
      (symbol) => symbol !== chartSymbol && symbol.length > 0,
    )
    return [chartSymbol, ...extras]
  }, [chartSymbol, isComparisonMode, selectedComparisons])

  const symbolLabel = (symbol: string) =>
    assetOptions.find((option) => option.symbol === symbol)?.label || symbol

  const comparisonLabels = comparisonSymbols.map(symbolLabel)
  const chartContextLabel = comparisonLabels.join(locale === 'ja' ? '／' : ' / ')
  const priceSectionDescription = `${t('dashboard.price.description')} (${chartContextLabel || chartSymbol}, ${selectedRangeLabel})`
  const comparisonToggleLabel = t('dashboard.price.comparisonToggle')
  const comparisonLabel = t('dashboard.price.comparisonLabel')
  const comparisonHelperText = t('dashboard.price.comparisonHelper')
  const comparisonEmptyText = t('dashboard.price.comparisonEmpty')

  return (
    <div className="relative space-y-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(236,72,153,0.1),transparent_28%),radial-gradient(circle_at_40%_80%,rgba(94,234,212,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-slate-950 via-slate-950/92 to-slate-950/80" />
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{t('dashboard.overview.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('dashboard.overview.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {assetSelectorLabel}
            <select
              value={selectedAsset}
              onChange={(event) => setSelectedAsset(event.target.value)}
              className="rounded-lg border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {assetOptions.map((option) => (
                <option key={option.symbol} value={option.symbol}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {rangeSelectorLabel}
            <select
              value={selectedRange}
              onChange={(event) => setSelectedRange(event.target.value as RangeValue)}
              className="rounded-lg border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {rangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {rangeLabelText(option.value)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {comparisonToggleLabel}
            <input
              type="checkbox"
              checked={isComparisonMode}
              onChange={(event) => handleComparisonToggle(event.target.checked)}
              className="h-4 w-4 accent-primary"
              disabled={!comparisonCandidates.length}
            />
          </label>
        </div>
        {isComparisonMode ? (
          <div className="w-full space-y-3 rounded-lg border bg-background/70 p-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {comparisonLabel}
              </p>
              <p className="text-xs text-muted-foreground">{comparisonHelperText}</p>
            </div>
            {comparisonCandidates.length ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {comparisonCandidates.map((option) => {
                  const isSelected = selectedComparisons.includes(option.symbol)
                  return (
                    <label
                      key={option.symbol}
                      title={option.label}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs transition ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-muted bg-background text-foreground'
                      }`}
                    >
                      <span className="text-sm font-semibold">{option.symbol}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleComparisonSymbol(option.symbol)}
                        className="h-4 w-4 accent-primary"
                      />
                    </label>
                  )
                })}
              </div>
            ) : (
              <p className="rounded border border-dashed border-muted bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                {comparisonEmptyText}
              </p>
            )}
          </div>
        ) : null}
      </header>

      <div className={`${glassPanel} p-4`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_30%)]" />
        <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={`${metric.title}-${selectedAsset}`} {...metric} />
          ))}
        </div>
      </div>

      <SectionCard
        title={t('dashboard.price.title')}
        description={priceSectionDescription}
        footer={t('dashboard.price.footer')}
      >
        <div className="h-64">
          <PriceTrendChart symbols={comparisonSymbols} range={selectedRange} interval="1d" />
        </div>
      </SectionCard>

      <SectionCard
        title="資産スナップショット"
        description="ポートフォリオ内での役割と主要指標を確認します。"
      >
        <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
          <div className="space-y-4">
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  資産名
                </dt>
                <dd className="mt-1 font-medium text-foreground">{assetSummary.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  ポートフォリオ配分
                </dt>
                <dd className="mt-1 font-medium text-foreground">
                  {(allocation * 100).toFixed(1)}%
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  年初来リターン
                </dt>
                <dd className="mt-1 font-medium text-foreground">
                  {(assetSummary.yearToDate * 100).toFixed(1)}%
                </dd>
              </div>
            </dl>
          </div>
          <p className="rounded-lg border bg-background/70 p-4 text-sm text-muted-foreground">
            {assetSummary.description}
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title={t('dashboard.activity.title')}
        description={t('dashboard.activity.description')}
      >
        <ul className="space-y-4">
          {mockActivityLog.map((item) => (
            <li key={item.title} className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {item.date}
              </p>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
