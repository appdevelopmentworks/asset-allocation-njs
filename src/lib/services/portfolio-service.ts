import { randomUUID } from 'crypto'
import { mockPortfolio } from '@/lib/constants/mock-data'
import type { Portfolio, PortfolioAsset } from '@/lib/types'
import type { CreatePortfolioInput, UpdatePortfolioInput } from '@/lib/validations/portfolio'

const store = new Map<string, Portfolio>()
store.set(mockPortfolio.id, clone(mockPortfolio))

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function toPortfolioAsset(asset: CreatePortfolioInput['assets'][number]): PortfolioAsset {
  return {
    asset: {
      id: randomUUID(),
      symbol: asset.symbol.toUpperCase(),
      name: asset.symbol.toUpperCase(),
      type: 'etf',
    },
    weight: asset.weight,
    quantity: asset.quantity,
    averagePrice: asset.averagePrice,
  }
}

export async function listPortfolios() {
  return Array.from(store.values()).map(clone)
}

export async function getPortfolioById(id: string) {
  const portfolio = store.get(id)
  return portfolio ? clone(portfolio) : null
}

export async function createPortfolio(input: CreatePortfolioInput) {
  const now = new Date().toISOString()
  const id = randomUUID()

  const portfolio: Portfolio = {
    id,
    name: input.name,
    description: input.description,
    baseCurrency: input.baseCurrency ?? 'USD',
    createdAt: now,
    updatedAt: now,
    settings: input.settings,
    assets: input.assets.map(toPortfolioAsset),
  }

  store.set(id, portfolio)
  return clone(portfolio)
}

export async function updatePortfolio(id: string, input: UpdatePortfolioInput) {
  const existing = store.get(id)
  if (!existing) {
    throw new Error('Portfolio not found')
  }

  const updated: Portfolio = {
    ...existing,
    name: input.name ?? existing.name,
    description: input.description ?? existing.description,
    baseCurrency: input.baseCurrency ?? existing.baseCurrency,
    settings: input.settings ?? existing.settings,
    updatedAt: new Date().toISOString(),
    assets: input.assets ? input.assets.map(toPortfolioAsset) : existing.assets,
  }

  store.set(id, updated)
  return clone(updated)
}

export async function deletePortfolio(id: string) {
  const existing = store.get(id)
  if (!existing) {
    throw new Error('Portfolio not found')
  }

  store.delete(id)
  return clone(existing)
}
