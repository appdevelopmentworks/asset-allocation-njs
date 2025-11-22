import { NextResponse } from 'next/server'
import { getOptimizationSummaries } from '@/lib/services/optimization-service'
import type { OptimizationStrategy, Portfolio } from '@/lib/types'
import { isPortfolioLike, normalizePortfolio, type PortfolioLike } from '@/lib/utils/portfolio'

const STRATEGY_VALUES: OptimizationStrategy[] = [
  'max_sharpe',
  'min_variance',
  'max_return',
  'risk_parity',
]

const parseStrategy = (value: string | null): OptimizationStrategy | undefined => {
  if (!value) {
    return undefined
  }
  return STRATEGY_VALUES.includes(value as OptimizationStrategy)
    ? (value as OptimizationStrategy)
    : undefined
}

const resolvePortfolio = (payload?: PortfolioLike): Portfolio | undefined => {
  if (!payload) {
    return undefined
  }
  if (!isPortfolioLike(payload)) {
    throw new Error('Invalid portfolio payload')
  }
  return normalizePortfolio(payload)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawStrategy = searchParams.get('strategy')
  const strategyParam = parseStrategy(rawStrategy)

  if (rawStrategy && !strategyParam) {
    return NextResponse.json({ error: 'Invalid strategy' }, { status: 400 })
  }

  const result = getOptimizationSummaries(strategyParam)

  if (strategyParam && !result.summary) {
    return NextResponse.json({ error: 'Strategy not found' }, { status: 404 })
  }

  return NextResponse.json(result)
}

interface OptimizationRequestPayload {
  strategy?: OptimizationStrategy
  portfolio?: PortfolioLike
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OptimizationRequestPayload
    const strategy = parseStrategy(payload.strategy ?? null)
    if (payload.strategy && !strategy) {
      return NextResponse.json({ error: 'Invalid strategy' }, { status: 400 })
    }

    const portfolio = resolvePortfolio(payload.portfolio)
    const result = getOptimizationSummaries(strategy, portfolio)

    if (strategy && !result.summary) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid payload'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
