import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

const DEFAULT_COUNT = 8

type QuoteResult = Record<string, unknown>

type SupportedQuote = QuoteResult & {
  symbol: string
}

function isSupportedQuote(quote: QuoteResult): quote is SupportedQuote {
  return Boolean(quote && typeof quote === 'object' && 'symbol' in quote && typeof quote.symbol === 'string')
}

export async function GET(request: NextRequest) {
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

    const rawQuotes = Array.isArray(result.quotes) ? (result.quotes as QuoteResult[]) : []

    const quotes = rawQuotes
      .filter(isSupportedQuote)
      .map((quote) => ({
        symbol: quote.symbol,
        shortname: 'shortname' in quote ? quote.shortname : undefined,
        exchDisp: 'exchDisp' in quote ? quote.exchDisp : undefined,
        typeDisp: 'typeDisp' in quote ? quote.typeDisp : undefined,
        industry: 'industry' in quote ? quote.industry : undefined,
        sector: 'sector' in quote ? quote.sector : undefined,
        longname: 'longname' in quote ? quote.longname : undefined,
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
