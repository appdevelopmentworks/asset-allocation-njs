import { NextRequest, NextResponse } from 'next/server'
import { fetchHistoricalPrices } from '@/lib/api/market'

const DEFAULT_RANGE = '3y'
const DEFAULT_INTERVAL = '1d'

interface RouteContext {
  params: Promise<{
    symbol: string
  }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { searchParams } = new URL(request.url)
  const range = (searchParams.get('range') as '1y' | '3y' | '5y' | '10y' | 'max') ?? DEFAULT_RANGE
  const interval = (searchParams.get('interval') as '1d' | '1wk' | '1mo') ?? DEFAULT_INTERVAL

  const params = await context.params

  if (!params.symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 })
  }

  try {
    const data = await fetchHistoricalPrices({ symbol: params.symbol, range, interval })

    return NextResponse.json({
      symbol: params.symbol,
      range,
      interval,
      count: data.length,
      data,
    })
  } catch (error) {
    console.error('[api/market] failed to fetch prices', error)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
