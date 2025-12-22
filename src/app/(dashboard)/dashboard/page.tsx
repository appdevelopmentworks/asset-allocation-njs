'use client'

import { MetricCard } from '@/components/ui/metric-card'
import { SectionCard } from '@/components/ui/section-card'

import { useEffect, useMemo, useState } from 'react'
import { PriceTrendChart } from '@/components/charts/price-trend-chart'
import { mockActivityLog, mockActivityLogByLocale } from '@/lib/constants/mock-data'
import { useLocale } from '@/components/providers/locale-provider'
import { usePortfolio } from '@/components/providers/portfolio-provider'
import { useMarketData } from '@/lib/hooks/use-market-data'

type RangeValue = '1y' | '3y' | '5y' | '10y' | 'max'

const rangeOptions: RangeValue[] = ['1y', '3y', '5y', '10y', 'max']

const glassPanel =
  'relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/95 via-slate-850/95 to-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-sm'

const presetAssetOptions = [
  { symbol: 'VNQ', label: 'VNQ · Vanguard Real Estate ETF' },
  { symbol: '^N225', label: '^N225 · Nikkei 225 Index' },
]

export default function DashboardHomePage() {
  const { t, locale } = useLocale()
  const { portfolio } = usePortfolio()
  const [selectedRange, setSelectedRange] = useState<RangeValue>('1y')
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [selectedComparisons, setSelectedComparisons] = useState<string[]>([])
  const [customSymbolInput, setCustomSymbolInput] = useState('')

  const assetOptions = useMemo(() => {
    const baseOptions = portfolio.assets.map(({ asset }) => ({
      symbol: asset.symbol,
      label: `${asset.symbol} · ${asset.name}`,
    }))

    const seen = new Set(baseOptions.map((option) => option.symbol))
    const extras = presetAssetOptions.filter((option) => !seen.has(option.symbol))

    return [...baseOptions, ...extras]
  }, [portfolio.assets])

  const [selectedAsset, setSelectedAsset] = useState(
    assetOptions[0]?.symbol ?? portfolio.assets[0]?.asset.symbol ?? '',
  )

  useEffect(() => {
    if (!assetOptions.length) {
      setSelectedAsset('')
      return
    }

    if (!selectedAsset) {
      setSelectedAsset(assetOptions[0].symbol)
    }
  }, [assetOptions, selectedAsset])

  useEffect(() => {
    setSelectedComparisons((prev) =>
      prev.filter((symbol) => assetOptions.some((option) => option.symbol === symbol)),
    )
  }, [assetOptions])

  const chartSymbol = selectedAsset || assetOptions[0]?.symbol || ''

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

  const handleCustomSymbolApply = () => {
    const next = customSymbolInput.trim()
    if (!next) {
      return
    }

    setSelectedAsset(next.toUpperCase())
    setIsComparisonMode(false)
    setSelectedComparisons([])
  }

  const selectedAssetEntry = useMemo(
    () => portfolio.assets.find(({ asset }) => asset.symbol === selectedAsset),
    [portfolio.assets, selectedAsset],
  )

  const {
    data: assetPrices,
    isLoading: assetPricesLoading,
    error: assetPricesError,
  } = useMarketData({ symbol: chartSymbol, range: selectedRange, interval: '1d' })

  const assetMetrics = useMemo(() => {
    if (!chartSymbol || !assetPrices?.length) return null

    const sorted = [...assetPrices].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    const closes = sorted.map((entry) => entry.close).filter((value) => Number.isFinite(value))
    if (closes.length < 2) {
      return null
    }

    const firstClose = closes[0]
    const lastClose = closes[closes.length - 1]

    if (!firstClose || !lastClose) return null

    const daySpan =
      (new Date(sorted[sorted.length - 1].date).getTime() -
        new Date(sorted[0].date).getTime()) /
      (1000 * 60 * 60 * 24)
    const years = Math.max(daySpan / 365, 0.25)
    const cagr = Math.pow(lastClose / firstClose, 1 / years) - 1

    const dailyReturns: number[] = []
    for (let i = 1; i < closes.length; i += 1) {
      const prev = closes[i - 1]
      const current = closes[i]
      if (!prev || !current) continue
      dailyReturns.push(current / prev - 1)
    }

    const mean = dailyReturns.reduce((sum, value) => sum + value, 0) / dailyReturns.length
    const variance =
      dailyReturns.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (dailyReturns.length || 1)
    const volatility = Math.sqrt(variance) * Math.sqrt(252)

    const sharpeRatio = volatility > 0 ? cagr / volatility : 0

    const latestDate = new Date(sorted[sorted.length - 1].date)
    const startOfYear = new Date(latestDate.getFullYear(), 0, 1)
    const firstYtd = sorted.find((entry) => new Date(entry.date) >= startOfYear)
    const yearToDate = firstYtd ? lastClose / firstYtd.close - 1 : 0

    return {
      cagr,
      volatility,
      sharpeRatio,
      yearToDate,
    }
  }, [assetPrices, chartSymbol])

  const assetSummary = useMemo(() => {
    const allocation = selectedAssetEntry?.weight ?? 0

    if (!chartSymbol) {
      return {
        name: locale === 'ja' ? '資産未選択' : 'No asset selected',
        allocation,
        expectedReturn: null,
        volatility: null,
        sharpeRatio: null,
        yearToDate: null,
        description:
          locale === 'ja'
            ? 'シンボルを入力するとリアルタイムデータを取得します。'
            : 'Enter a symbol to load live data.',
      }
    }

    if (assetPricesLoading) {
      return {
        name: selectedAssetEntry?.asset.name ?? chartSymbol,
        allocation,
        expectedReturn: null,
        volatility: null,
        sharpeRatio: null,
        yearToDate: null,
        description:
          locale === 'ja'
            ? '市場データを取得しています…'
            : 'Fetching live market data…',
      }
    }

    if (assetPricesError || !assetMetrics) {
      return {
        name: selectedAssetEntry?.asset.name ?? chartSymbol,
        allocation,
        expectedReturn: null,
        volatility: null,
        sharpeRatio: null,
        yearToDate: null,
        description:
          assetPricesError && locale === 'ja'
            ? '市場データの取得に失敗しました。シンボルやネットワーク設定を確認してください。'
            : assetPricesError
              ? 'Failed to fetch market data. Check the symbol or network settings.'
              : locale === 'ja'
                ? '十分な時系列データがないため指標を計算できませんでした。'
                : 'Not enough price history to compute metrics.',
      }
    }

    return {
      name: selectedAssetEntry?.asset.name ?? chartSymbol,
      allocation,
      expectedReturn: assetMetrics.cagr,
      volatility: assetMetrics.volatility,
      sharpeRatio: assetMetrics.sharpeRatio,
      yearToDate: assetMetrics.yearToDate,
      description:
        locale === 'ja'
          ? 'Yahoo Finance の終値から算出しています。'
          : 'Computed from Yahoo Finance closing prices.',
    }
  }, [
    assetMetrics,
    assetPricesError,
    assetPricesLoading,
    chartSymbol,
    locale,
    selectedAssetEntry,
  ])

  const allocation = selectedAssetEntry?.weight ?? assetSummary.allocation ?? 0

  const metrics = useMemo(() => {
    const formatPercent = (value: number | null) => {
      if (value === null) {
        return assetPricesLoading ? (locale === 'ja' ? '計算中…' : 'Loading…') : 'N/A'
      }

      if (!Number.isFinite(value)) {
        return 'N/A'
      }

      return `${(value * 100).toFixed(1)}%`
    }

    const ytdPercent =
      typeof assetSummary.yearToDate === 'number' ? assetSummary.yearToDate * 100 : null
    const trend: 'up' | 'down' | 'neutral' =
      ytdPercent === null ? 'neutral' : ytdPercent === 0 ? 'neutral' : ytdPercent > 0 ? 'up' : 'down'
    const formattedYtd =
      ytdPercent === null
        ? assetPricesLoading
          ? locale === 'ja'
            ? '計算中…'
            : 'Loading…'
          : 'N/A'
        : `${ytdPercent > 0 ? '+' : ''}${ytdPercent.toFixed(1)}%`

    return [
      {
        title: t('dashboard.metrics.expectedReturn'),
        value: formatPercent(assetSummary.expectedReturn),
        change: { value: `YTD ${formattedYtd}`, trend },
      },
      {
        title: t('dashboard.metrics.volatility'),
        value: formatPercent(assetSummary.volatility),
      },
      {
        title: t('dashboard.metrics.sharpe'),
        value:
          assetSummary.sharpeRatio === null
            ? assetPricesLoading
              ? locale === 'ja'
                ? '計算中…'
                : 'Loading…'
              : 'N/A'
            : assetSummary.sharpeRatio.toFixed(2),
      },
    ]
  }, [
    assetPricesLoading,
    assetSummary.expectedReturn,
    assetSummary.sharpeRatio,
    assetSummary.volatility,
    assetSummary.yearToDate,
    locale,
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
  const activityLog = mockActivityLogByLocale[locale] ?? mockActivityLog

  return (
    <div className="relative space-y-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(236,72,153,0.1),transparent_28%),radial-gradient(circle_at_40%_80%,rgba(94,234,212,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-slate-950 via-slate-950/92 to-slate-950/80" />
      <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">{t('dashboard.overview.title')}</h1>
              <p className="max-w-2xl text-sm text-slate-300">{t('dashboard.overview.subtitle')}</p>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
                {assetSelectorLabel}
                <select
                  value={selectedAsset}
                  onChange={(event) => setSelectedAsset(event.target.value)}
                  className="h-10 w-72 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {assetOptions.map((option) => (
                    <option key={option.symbol} value={option.symbol} className="bg-slate-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
                {t('dashboard.customSymbol.label')}
                <div className="flex h-10 items-center gap-2">
                  <input
                    value={customSymbolInput}
                    onChange={(event) => setCustomSymbolInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        handleCustomSymbolApply()
                      }
                    }}
                    placeholder={t('dashboard.customSymbol.placeholder')}
                    className="h-full w-32 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleCustomSymbolApply}
                    className="h-full rounded-lg border border-indigo-500 bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:border-indigo-400 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/80"
                  >
                    {t('dashboard.customSymbol.apply')}
                  </button>
                </div>
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
                {rangeSelectorLabel}
                <select
                  value={selectedRange}
                  onChange={(event) => setSelectedRange(event.target.value as RangeValue)}
                  className="h-10 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {rangeOptions.map((option) => (
                    <option key={option} value={option} className="bg-slate-900">
                      {rangeLabelText(option)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <input
                  type="checkbox"
                  checked={isComparisonMode}
                  onChange={(event) => handleComparisonToggle(event.target.checked)}
                  className="h-4 w-4 accent-indigo-500"
                  disabled={!comparisonCandidates.length}
                />
                {comparisonToggleLabel}
              </label>
            </div>
          </div>
        </div>
        {isComparisonMode ? (
          <div className="w-full shrink-0 space-y-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4 lg:w-72">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                {comparisonLabel}
              </p>
              <p className="text-xs text-slate-300">{comparisonHelperText}</p>
            </div>
            {comparisonCandidates.length ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {comparisonCandidates.map((option) => {
                  const isSelected = selectedComparisons.includes(option.symbol)
                  return (
                    <label
                      key={option.symbol}
                      title={option.label}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs transition ${isSelected
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200'
                        : 'border-slate-700 bg-slate-800 text-white'
                        }`}
                    >
                      <span className="truncate text-sm font-semibold">{option.symbol}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleComparisonSymbol(option.symbol)}
                        className="h-4 w-4 accent-indigo-500"
                      />
                    </label>
                  )
                })}
              </div>
            ) : (
              <p className="rounded border border-dashed border-slate-700 bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
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
        title={t('dashboard.assetSnapshot.title')}
        description={t('dashboard.assetSnapshot.description')}
      >
        <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
          <div className="space-y-4">
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="font-bold text-indigo-300">{t('dashboard.assetSnapshot.assetName')}</dt>
                <dd className="mt-1 font-bold text-white">{assetSummary.name}</dd>
              </div>
              <div>
                <dt className="font-bold text-indigo-300">
                  {t('dashboard.assetSnapshot.allocation')}
                </dt>
                <dd className="mt-1 font-bold text-white">
                  {(allocation * 100).toFixed(1)}%
                </dd>
              </div>
              <div>
                <dt className="font-bold text-indigo-300">{t('dashboard.assetSnapshot.ytd')}</dt>
                <dd className="mt-1 font-bold text-white">
                  {assetSummary.yearToDate === null
                    ? assetPricesLoading
                      ? t('dashboard.status.calculating')
                      : 'N/A'
                    : `${(assetSummary.yearToDate * 100).toFixed(1)}%`}
                </dd>
              </div>
            </dl>
          </div>
          <p className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4 text-sm text-slate-200">
            {assetSummary.description}
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title={t('dashboard.activity.title')}
        description={t('dashboard.activity.description')}
      >
        <ul className="space-y-4">
          {activityLog.map((item) => (
            <li key={item.title} className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                {item.date}
              </p>
              <p className="text-sm font-bold text-white">{item.title}</p>
              <p className="text-xs text-slate-300/90">{item.description}</p>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
