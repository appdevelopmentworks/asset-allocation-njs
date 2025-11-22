import type { Portfolio } from '@/lib/types'

export type PortfolioLike = Partial<Portfolio> & {
  assets?: Array<Partial<Portfolio['assets'][number]>>
}

const DEFAULT_SETTINGS: Portfolio['settings'] = {
  rebalanceFrequency: 'quarterly',
  timeRange: '5Y',
  includeDividends: true,
  useLogReturns: true,
}

const FALLBACK_PORTFOLIO_NAME = 'Custom Portfolio'

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `asset-${Math.random().toString(36).slice(2)}`
}

const clampWeight = (weight: number) => {
  if (!Number.isFinite(weight)) {
    return 0
  }
  const normalized = Math.max(0, Math.min(1, Number(weight)))
  return Number(normalized.toFixed(6))
}

const sanitizeAsset = (
  asset: Partial<Portfolio['assets'][number]> | undefined,
): Portfolio['assets'][number] | null => {
  if (!asset || typeof asset !== 'object') {
    return null
  }
  const instrument = asset.asset
  if (!instrument || typeof instrument.symbol !== 'string') {
    return null
  }
  const symbol = instrument.symbol.trim().toUpperCase()
  if (!symbol) {
    return null
  }

  return {
    asset: {
      id: instrument.id ?? generateId(),
      symbol,
      name: instrument.name?.trim() || symbol,
      type: instrument.type ?? 'stock',
      exchange: instrument.exchange,
      currency: instrument.currency,
    },
    weight: clampWeight(asset.weight ?? 0),
    quantity: asset.quantity,
    value: asset.value,
    averagePrice: asset.averagePrice,
  }
}

export function normalizePortfolio(input: PortfolioLike): Portfolio {
  const assets =
    input.assets
      ?.map((entry) => sanitizeAsset(entry))
      .filter((entry): entry is Portfolio['assets'][number] => Boolean(entry)) ?? []

  if (!assets.length) {
    throw new Error('Portfolio requires at least one asset with a valid symbol')
  }

  const createdAt = input.createdAt ?? new Date().toISOString()
  return {
    id: input.id ?? generateId(),
    name: input.name?.trim() || FALLBACK_PORTFOLIO_NAME,
    description: input.description ?? '',
    baseCurrency: input.baseCurrency ?? 'USD',
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
    settings: {
      ...DEFAULT_SETTINGS,
      ...input.settings,
    },
    assets,
    snapshots: input.snapshots ?? [],
  }
}

export function isPortfolioLike(value: unknown): value is PortfolioLike {
  if (!value || typeof value !== 'object') {
    return false
  }
  const maybePortfolio = value as PortfolioLike
  return Array.isArray(maybePortfolio.assets)
}
