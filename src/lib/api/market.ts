import axios from 'axios'
import { marketDataCache } from '@/lib/cache/memory-cache'
import type { HistoricalPrice } from '@/lib/types'

const BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart'

interface FetchHistoricalParams {
  symbol: string
  interval?: '1d' | '1wk' | '1mo'
  range?: '1y' | '3y' | '5y' | '10y' | 'max'
}

export async function fetchHistoricalPrices({
  symbol,
  interval = '1d',
  range = '5y',
}: FetchHistoricalParams): Promise<HistoricalPrice[]> {
  const cacheKey = ['historical', symbol, range, interval].join(':')
  const cached = marketDataCache.get(cacheKey) as HistoricalPrice[] | null
  if (cached) {
    return cached
  }

  try {
    const response = await axios.get(`${BASE_URL}/${symbol}`, {
      params: {
        range,
        interval,
        events: 'div,splits',
      },
    })

    const [result] = response.data.chart?.result ?? []

    if (!result?.timestamp || !result.indicators?.quote?.[0]) {
      throw new Error('Unexpected response structure from Yahoo Finance API')
    }

    const { timestamp, indicators } = result
    const { open, high, low, close, adjclose, volume } = indicators.quote[0]

    const prices = timestamp.map((time: number, index: number) => ({
      symbol,
      date: new Date(time * 1000).toISOString(),
      open: open[index],
      high: high[index],
      low: low[index],
      close: close[index],
      adjClose: adjclose ? adjclose[index] : close[index],
      volume: volume[index],
    }))

    marketDataCache.set(cacheKey, prices)

    return prices
  } catch (error) {
    console.error('[lib/api/market] fetchHistoricalPrices error', error)
    throw error
  }
}
