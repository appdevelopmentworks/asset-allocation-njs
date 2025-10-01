'use client'

import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface CorrelationHeatmapProps {
  symbols: string[]
  matrix: number[][]
}

export function CorrelationHeatmap({ symbols, matrix }: CorrelationHeatmapProps) {
  return (
    <Plot
      data={[
        {
          z: matrix,
          x: symbols,
          y: symbols,
          type: 'heatmap',
          colorscale: 'RdBu',
          reversescale: true,
          zmin: -1,
          zmax: 1,
          hoverongaps: false,
        },
      ]}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 30, r: 20, b: 40, l: 50 },
        xaxis: {
          color: '#64748b',
        },
        yaxis: {
          color: '#64748b',
        },
      }}
      config={{ displaylogo: false, responsive: true }}
      className="h-72"
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
    />
  )
}
