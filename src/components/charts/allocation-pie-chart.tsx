'use client'

import dynamic from 'next/dynamic'
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface AllocationPieChartProps {
  assets: Array<{
    weight: number
    symbol?: string
    asset?: { symbol: string }
  }>
}

export function AllocationPieChart({ assets }: AllocationPieChartProps) {
  const labels = assets.map((item) => (item.asset ? item.asset.symbol : (item.symbol ?? 'N/A')))
  const values = assets.map((item) => Number((item.weight * 100).toFixed(2)))

  return (
    <Plot
      data={[
        {
          type: 'pie',
          labels,
          values,
          textinfo: 'label+percent',
          hole: 0.4,
          marker: {
            colors: ['#2563eb', '#7c3aed', '#f97316', '#16a34a', '#facc15', '#0ea5e9'],
          },
        },
      ]}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff', family: 'Inter, sans-serif' },
        margin: { t: 20, r: 20, b: 20, l: 20 },
        showlegend: true,
        legend: {
          orientation: 'h',
          y: -0.2,
          font: { color: '#ffffff' },
        },
      }}
      config={{ displaylogo: false, responsive: true }}
      className="h-64"
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
    />
  )
}
