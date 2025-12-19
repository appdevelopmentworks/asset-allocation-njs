'use client'

import dynamic from 'next/dynamic'
import type { Layout } from 'plotly.js'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export interface BacktestPoint {
  date: string
  portfolio: number
  benchmark: number
}

interface BacktestChartProps {
  series: BacktestPoint[]
}

export function BacktestChart({ series }: BacktestChartProps) {
  const layout: Partial<Layout> = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 20, r: 20, b: 40, l: 50 },
    xaxis: {
      title: 'Date',
      color: '#64748b',
      showgrid: false,
    },
    yaxis: {
      title: 'Cumulative Return',
      color: '#64748b',
      tickformat: '.0%',
      zeroline: false,
    },
    legend: {
      orientation: 'h',
      x: 0,
      y: -0.2,
      font: { color: '#f8fafc' },
    },
  }

  const portfolioTrace = {
    x: series.map((point) => point.date),
    y: series.map((point) => point.portfolio),
    mode: 'lines' as const,
    type: 'scatter' as const,
    name: 'Portfolio',
    line: {
      color: '#2563eb',
      width: 2,
    },
    hovertemplate: '%{x|%Y-%m}<br>Portfolio: %{y:.2%}<extra></extra>',
  }

  const benchmarkTrace = {
    x: series.map((point) => point.date),
    y: series.map((point) => point.benchmark),
    mode: 'lines' as const,
    type: 'scatter' as const,
    name: 'Benchmark',
    line: {
      color: '#f97316',
      width: 2,
      dash: 'dash',
    },
    hovertemplate: '%{x|%Y-%m}<br>Benchmark: %{y:.2%}<extra></extra>',
  }

  return (
    <Plot
      data={[portfolioTrace, benchmarkTrace]}
      layout={layout}
      config={{ displaylogo: false, responsive: true }}
      className="h-72 w-full"
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
    />
  )
}
