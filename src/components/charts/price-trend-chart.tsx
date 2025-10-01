'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type Plotly from 'plotly.js'
import type { HistoricalPrice } from '@/lib/types'
import { useComparisonMarketData, useMarketData } from '@/lib/hooks/use-market-data'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface PriceTrendChartProps {
  symbols: string[]
  range?: '1y' | '3y' | '5y' | '10y' | 'max'
  interval?: '1d' | '1wk' | '1mo'
}

const chartConfig: Partial<Plotly.Config> = {
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: ['select2d', 'lasso2d'],
}

const colorPalette = [
  '#2563eb',
  '#0ea5e9',
  '#22c55e',
  '#f97316',
  '#a855f7',
  '#ec4899',
  '#14b8a6',
  '#facc15',
]

function buildReturnTrace(
  prices: HistoricalPrice[],
  label: string,
  color: string,
): Plotly.Data | null {
  if (!prices.length) {
    return null
  }

  const baselineIndex = prices.findIndex((entry) => entry.close > 0)

  if (baselineIndex === -1) {
    return null
  }

  const baseline = prices[baselineIndex].close
  const slicedPrices = prices.slice(baselineIndex)

  const x = slicedPrices.map((entry) => entry.date)
  const y = slicedPrices.map((entry) => entry.close / baseline - 1)

  if (y.some((value) => !Number.isFinite(value))) {
    return null
  }

  return {
    x,
    y,
    type: 'scatter' as const,
    mode: 'lines' as const,
    name: label,
    line: {
      color,
      width: 2,
    },
    hovertemplate: `<b>${label}</b><br>%{x|%Y-%m-%d}<br>累積リターン: %{y:.2%}<extra></extra>`,
  }
}

type ReturnTrace = NonNullable<ReturnType<typeof buildReturnTrace>>

export function PriceTrendChart({ symbols, range = '3y', interval = '1d' }: PriceTrendChartProps) {
  const uniqueSymbols = useMemo(
    () => Array.from(new Set(symbols.map((item) => item.trim()).filter((item) => item.length > 0))),
    [symbols],
  )

  const primarySymbol = uniqueSymbols[0] ?? ''
  const isComparison = uniqueSymbols.length > 1

  const {
    data: singleData,
    error: singleError,
    isLoading: singleLoading,
  } = useMarketData({ symbol: isComparison ? '' : primarySymbol, range, interval })

  const {
    data: comparisonData,
    error: comparisonError,
    isLoading: comparisonLoading,
  } = useComparisonMarketData({ symbols: isComparison ? uniqueSymbols : [], range, interval })

  const error = isComparison ? comparisonError : singleError
  const isLoading = isComparison ? comparisonLoading : singleLoading

  const traces = useMemo<Plotly.Data[] | null>(() => {
    if (isComparison) {
      if (!comparisonData) {
        return null
      }

      const comparisonTraces = comparisonData
        .map((dataset, index) =>
          buildReturnTrace(dataset.data, dataset.symbol, colorPalette[index % colorPalette.length]),
        )
        .filter((trace): trace is ReturnTrace => trace !== null)

      return comparisonTraces.length ? comparisonTraces : null
    }

    if (!singleData || !primarySymbol) {
      return null
    }

    const singleTrace = buildReturnTrace(singleData, primarySymbol, colorPalette[0])

    return singleTrace ? [singleTrace] : null
  }, [comparisonData, isComparison, primarySymbol, singleData])

  if (!uniqueSymbols.length) {
    return (
      <div className="flex h-60 items-center justify-center rounded-lg border border-dashed border-muted bg-muted/30 text-xs text-muted-foreground">
        資産が選択されていません。
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-60 items-center justify-center rounded-lg border border-destructive/40 bg-destructive/10 text-sm text-destructive">
        {isComparison
          ? '比較対象の市場データの取得に失敗しました。ネットワークやAPIキー設定を確認してください。'
          : '市場データの取得に失敗しました。ネットワークやAPIキー設定を確認してください。'}
      </div>
    )
  }

  if (isLoading || !traces || !traces.length) {
    return (
      <div className="flex h-60 animate-pulse items-center justify-center rounded-lg border border-dashed border-muted bg-muted/30 text-xs text-muted-foreground">
        Loading market data…
      </div>
    )
  }

  const layout: Partial<Plotly.Layout> = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 30, r: 10, b: 40, l: 50 },
    xaxis: {
      title: { text: 'Date' },
      showgrid: false,
      color: '#64748b',
    },
    yaxis: {
      title: { text: 'Cumulative Return (%)' },
      color: '#64748b',
      zeroline: true,
      zerolinecolor: '#cbd5f5',
      tickformat: '.0%',
    },
    hoverlabel: {
      bgcolor: '#0f172a',
      font: { color: '#f8fafc' },
    },
    legend: {
      orientation: 'h',
      x: 0,
      y: -0.2,
      font: { color: '#0f172a' },
    },
    hovermode: 'x unified' as const,
  }

  return (
    <Plot
      data={traces}
      style={{ width: '100%', height: '100%' }}
      layout={layout}
      config={chartConfig}
      useResizeHandler
      className="h-60"
    />
  )
}
