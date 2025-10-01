import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

const DEFAULT_COUNT = 8

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')?.trim()

  if (!query || query.length < 1) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const result = await yahooFinance.search(query, {
      quotesCount: DEFAULT_COUNT,
      newsCount: 0,
      enableFuzzyQuery: true,
    })

    const quotes = (result.quotes ?? []).map((quote) => ({
      symbol: quote.symbol,
      shortname: quote.shortname,
      exchDisp: quote.exchDisp,
      typeDisp: quote.typeDisp,
      industry: quote.industry,
      sector: quote.sector,
      longname: quote.longname,
    }))

    return NextResponse.json({
      query,
      count: quotes.length,
      results: quotes,
    })
  } catch (error) {
    console.error('[api/assets/search] search failed', error)
    return NextResponse.json({ error: 'Failed to search assets' }, { status: 500 })
  }
}
