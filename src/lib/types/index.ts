export type AssetType = 'stock' | 'etf' | 'bond' | 'commodity' | 'crypto' | 'reit'

export type OptimizationStrategy = 'max_sharpe' | 'min_variance' | 'max_return' | 'risk_parity'

export type RiskMetric =
  | 'standard_deviation'
  | 'value_at_risk'
  | 'conditional_value_at_risk'
  | 'max_drawdown'

export type TimeRange = '1Y' | '3Y' | '5Y' | '10Y' | 'MAX'

export interface Asset {
  id: string
  symbol: string
  name: string
  type: AssetType
  exchange?: string
  currency?: string
}

export interface PortfolioAsset {
  asset: Asset
  weight: number
  quantity?: number
  value?: number
  averagePrice?: number
}

export interface PortfolioSettings {
  rebalanceFrequency: 'monthly' | 'quarterly' | 'yearly'
  timeRange: TimeRange
  includeDividends: boolean
  useLogReturns: boolean
}

export interface PortfolioSnapshot {
  id: string
  strategy: OptimizationStrategy
  expectedReturn: number
  risk: number
  sharpeRatio: number
  weights: number[]
  createdAt: string
}

export interface Portfolio {
  id: string
  name: string
  description?: string
  baseCurrency?: string
  assets: PortfolioAsset[]
  createdAt: string
  updatedAt: string
  settings: PortfolioSettings
  snapshots?: PortfolioSnapshot[]
}

export interface HistoricalPrice {
  symbol: string
  date: string
  open: number
  high: number
  low: number
  close: number
  adjClose: number
  volume: number
}

export interface OptimizationResult {
  strategy: OptimizationStrategy
  weights: number[]
  expectedReturn: number
  risk: number
  sharpeRatio: number
  portfolio: Portfolio
}

export interface OptimizationSummary {
  strategy: OptimizationStrategy
  expectedReturn: number
  risk: number
  sharpeRatio: number
  description?: string
  weights?: Array<{
    symbol: string
    name?: string
    weight: number
  }>
}

export interface PerformanceSnapshot {
  expectedReturn: number
  volatility: number
  sharpeRatio: number
  sortinoRatio?: number
  maxDrawdown?: number
}

export type SimulationRange = '1Y' | '3Y' | '5Y' | '10Y' | 'MAX'

export type SimulationRebalance = 'monthly' | 'quarterly' | 'yearly'

export interface SimulationSettings {
  assets: string[]
  range: SimulationRange
  trials: number
  rebalance: SimulationRebalance
}
