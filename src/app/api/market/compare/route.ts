import { NextResponse } from 'next/server'
import { fetchHistoricalPrices } from '@/lib/api/market'
import { normalizeSymbol } from '@/lib/utils/symbols'

const DEFAULT_RANGE = '3y'
const DEFAULT_INTERVAL = '1d'

type RangeParam = '1y' | '3y' | '5y' | '10y' | 'max'
type IntervalParam = '1d' | '1wk' | '1mo'

const toRange = (value: string | null): RangeParam => {
  if (value === '1y' || value === '3y' || value === '5y' || value === '10y' || value === 'max') {
    return value
  }
  return DEFAULT_RANGE
}

const toInterval = (value: string | null): IntervalParam => {
  if (value === '1d' || value === '1wk' || value === '1mo') {
    return value
  }
  return DEFAULT_INTERVAL
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbolsParam = searchParams.get('symbols')
  const range = toRange(searchParams.get('range'))
  const interval = toInterval(searchParams.get('interval'))

  if (!symbolsParam) {
    return NextResponse.json({ error: 'Symbols query parameter is required' }, { status: 400 })
  }

  const symbols = Array.from(
    new Set(
      symbolsParam
        .split(',')
        .map((item) => normalizeSymbol(item))
        .filter((item) => item.length > 0),
    ),
  )

  if (!symbols.length) {
    return NextResponse.json(
      { error: 'At least one valid symbol must be provided' },
      { status: 400 },
    )
  }

  try {
    const datasets = await Promise.all(
      symbols.map(async (symbol) => {
        const data = await fetchHistoricalPrices({ symbol, range, interval })
        return { symbol, count: data.length, data }
      }),
    )

    return NextResponse.json({
      symbols,
      range,
      interval,
      datasets,
    })
  } catch (error) {
    console.error('[api/market/compare] failed to fetch comparison prices', error)
    return NextResponse.json({ error: 'Failed to fetch comparison market data' }, { status: 500 })
  }
}
