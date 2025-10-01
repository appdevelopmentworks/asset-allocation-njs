import useSWR from 'swr'
import type { Prisma } from '@prisma/client'

type PortfolioWithRelations = Prisma.PortfolioGetPayload<{
  include: {
    assets: true
    snapshots: true
  }
}>

interface PortfolioResponse {
  portfolios: PortfolioWithRelations[]
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch portfolios')
  }
  return (await response.json()) as PortfolioResponse
}

export function usePortfolios() {
  const { data, error, isLoading, mutate } = useSWR<PortfolioResponse>('/api/portfolio', fetcher, {
    revalidateOnFocus: false,
  })

  return {
    portfolios: data?.portfolios ?? [],
    isLoading,
    error,
    refresh: mutate,
  }
}
