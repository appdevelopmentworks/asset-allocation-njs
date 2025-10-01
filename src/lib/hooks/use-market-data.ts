import { useMemo } from 'react'
import useSWR from 'swr'
import type { HistoricalPrice } from '@/lib/types'
interface MarketDataResponse {
  symbol: string
  range: '1y' | '3y' | '5y' | '10y' | 'max'
  interval: '1d' | '1wk' | '1mo'
  count: number
  data: HistoricalPrice[]
}

interface MarketComparisonResponse {
  symbols: string[]
  range: '1y' | '3y' | '5y' | '10y' | 'max'
  interval: '1d' | '1wk' | '1mo'
  datasets: Array<{
    symbol: string
    count: number
    data: HistoricalPrice[]
  }>
}

interface UseMarketDataArgs {
  symbol: string
  range?: '1y' | '3y' | '5y' | '10y' | 'max'
  interval?: '1d' | '1wk' | '1mo'
}

export function useMarketData({ symbol, range = '3y', interval = '1d' }: UseMarketDataArgs) {
  const key = symbol ? ['market-data', symbol, range, interval] : null

  const fetcher = async () => {
    const response = await fetch(`/api/market/${symbol}?range=${range}&interval=${interval}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch market data')
    }

    const payload = (await response.json()) as MarketDataResponse
    return payload.data
  }

  const { data, error, isLoading, mutate } = useSWR<HistoricalPrice[]>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 1000 * 60 * 5,
  })

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  }
}

interface UseComparisonMarketDataArgs {
  symbols: string[]
  range?: '1y' | '3y' | '5y' | '10y' | 'max'
  interval?: '1d' | '1wk' | '1mo'
}

export interface ComparisonSeries {
  symbol: string
  data: HistoricalPrice[]
}

export function useComparisonMarketData({
  symbols,
  range = '3y',
  interval = '1d',
}: UseComparisonMarketDataArgs) {
  const normalizedSymbols = useMemo(
    () => Array.from(new Set(symbols.map((item) => item.trim()).filter((item) => item.length > 0))),
    [symbols],
  )

  const key = normalizedSymbols.length
    ? ['market-data', 'compare', ...normalizedSymbols, range, interval]
    : null

  const fetcher = async () => {
    const params = new URLSearchParams({
      symbols: normalizedSymbols.join(','),
      range,
      interval,
    })

    const response = await fetch(`/api/market/compare?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch comparison market data')
    }

    const payload = (await response.json()) as MarketComparisonResponse

    return payload.datasets.map((dataset) => ({
      symbol: dataset.symbol,
      data: dataset.data,
    })) satisfies ComparisonSeries[]
  }

  const { data, error, isLoading, mutate } = useSWR<ComparisonSeries[]>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 1000 * 60 * 5,
  })

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  }
}
