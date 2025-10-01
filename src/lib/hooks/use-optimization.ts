import useSWR from 'swr'
import type { OptimizationSummary, OptimizationStrategy } from '@/lib/types'

interface UseOptimizationOptions {
  strategy?: OptimizationStrategy
}

interface OptimizationResponse {
  summaries?: OptimizationSummary[]
  summary?: OptimizationSummary
}

const fetcher = async (url: string) => {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } })

  if (!response.ok) {
    throw new Error('Failed to fetch optimization summaries')
  }

  return (await response.json()) as OptimizationResponse
}

export function useOptimization({ strategy }: UseOptimizationOptions = {}) {
  const key = strategy ? `/api/optimization?strategy=${strategy}` : '/api/optimization'

  const { data, error, isLoading, mutate } = useSWR<OptimizationResponse>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 1000 * 60 * 10,
  })

  return {
    summaries: data?.summaries,
    summary: data?.summary,
    isLoading,
    error,
    refresh: mutate,
  }
}
