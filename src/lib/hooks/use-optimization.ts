import useSWR from 'swr'
import type { OptimizationSummary, OptimizationStrategy, Portfolio } from '@/lib/types'

interface UseOptimizationOptions {
  strategy?: OptimizationStrategy
  portfolio?: Portfolio
}

interface OptimizationResponse {
  summaries?: OptimizationSummary[]
  summary?: OptimizationSummary
}

type OptimizationKey =
  | ['optimization', 'GET', OptimizationStrategy | undefined]
  | ['optimization', 'POST', OptimizationStrategy | undefined, Portfolio]

const fetcher = async (key: OptimizationKey) => {
  const [, method, strategy, portfolio] = key
  const search = strategy ? `?strategy=${strategy}` : ''
  const response = await fetch(`/api/optimization${search}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method === 'POST' ? JSON.stringify({ strategy, portfolio }) : undefined,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch optimization summaries')
  }

  return (await response.json()) as OptimizationResponse
}

export function useOptimization({ strategy, portfolio }: UseOptimizationOptions = {}) {
  const key = (portfolio
    ? (['optimization', 'POST', strategy, portfolio] as const)
    : (['optimization', 'GET', strategy] as const)) satisfies OptimizationKey

  const { data, error, isLoading, mutate } = useSWR<OptimizationResponse, Error, OptimizationKey>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 10,
    },
  )

  return {
    summaries: data?.summaries,
    summary: data?.summary,
    isLoading,
    error,
    refresh: mutate,
  }
}
