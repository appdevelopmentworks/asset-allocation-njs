import { mockOptimizationSummaries } from '@/lib/constants/mock-data'
import type { OptimizationStrategy } from '@/lib/types'

export interface OptimizationSummaryResponse {
  summaries: typeof mockOptimizationSummaries
  summary?: (typeof mockOptimizationSummaries)[number]
}

export function getOptimizationSummaries(
  strategy?: OptimizationStrategy,
): OptimizationSummaryResponse {
  if (!strategy) {
    return { summaries: mockOptimizationSummaries }
  }

  const summary = mockOptimizationSummaries.find((item) => item.strategy === strategy)

  return {
    summaries: mockOptimizationSummaries,
    summary,
  }
}
