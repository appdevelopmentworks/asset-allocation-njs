import { NextResponse } from 'next/server'
import { getOptimizationSummaries } from '@/lib/services/optimization-service'
import type { OptimizationStrategy } from '@/lib/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const strategyParam = searchParams.get('strategy') as OptimizationStrategy | null

  const { summaries, summary } = getOptimizationSummaries(strategyParam ?? undefined)

  if (strategyParam && !summary) {
    return NextResponse.json({ error: 'Strategy not found' }, { status: 404 })
  }

  return NextResponse.json({ summaries, summary })
}
