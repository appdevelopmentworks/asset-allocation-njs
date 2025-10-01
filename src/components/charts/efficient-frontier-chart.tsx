'use client'

import dynamic from 'next/dynamic'
import type { Layout } from 'plotly.js'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export interface EfficientFrontierPoint {
  risk: number
  expectedReturn: number
  label?: string
}

interface EfficientFrontierChartProps {
  points: EfficientFrontierPoint[]
  optimalPoint?: EfficientFrontierPoint
}

export function EfficientFrontierChart({ points, optimalPoint }: EfficientFrontierChartProps) {
  const frontierTrace = {
    x: points.map((point) => point.risk * 100),
    y: points.map((point) => point.expectedReturn * 100),
    mode: 'lines+markers' as const,
    type: 'scatter' as const,
    name: 'Efficient Frontier',
    marker: {
      color: '#2563eb',
      size: 8,
    },
    line: {
      color: '#2563eb',
      width: 2,
    },
    text: points.map((point) => point.label ?? ''),
    hovertemplate: 'リスク: %{x:.2f}%<br>リターン: %{y:.2f}%<br>%{text}<extra></extra>',
  }

  const optimalTrace = optimalPoint
    ? {
        x: [optimalPoint.risk * 100],
        y: [optimalPoint.expectedReturn * 100],
        mode: 'markers' as const,
        type: 'scatter' as const,
        name: 'Optimal Portfolio',
        marker: {
          color: '#f97316',
          size: 12,
          symbol: 'star',
        },
        hovertemplate:
          '最適ポートフォリオ<br>リスク: %{x:.2f}%<br>リターン: %{y:.2f}%<extra></extra>',
      }
    : null

  const layout: Partial<Layout> = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 20, r: 20, b: 40, l: 50 },
    xaxis: {
      title: 'Risk (%)',
      color: '#64748b',
      zeroline: false,
    },
    yaxis: {
      title: 'Expected Return (%)',
      color: '#64748b',
      zeroline: false,
    },
    legend: {
      orientation: 'h',
      x: 0,
      y: -0.2,
    },
  }

  return (
    <Plot
      data={[frontierTrace, ...(optimalTrace ? [optimalTrace] : [])]}
      layout={layout}
      config={{ displaylogo: false, responsive: true }}
      className="h-72 w-full"
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
    />
  )
}
