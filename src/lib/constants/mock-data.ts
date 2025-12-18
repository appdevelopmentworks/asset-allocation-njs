import type { Portfolio } from '@/lib/types'

export const mockPortfolio: Portfolio = {
  id: 'portfolio-001',
  name: 'グロース＋コモディティ',
  description: '株式・債券・コモディティを組み合わせた分散ポートフォリオ',
  baseCurrency: 'USD',
  createdAt: '2024-12-01T10:00:00.000Z',
  updatedAt: '2024-12-12T09:30:00.000Z',
  settings: {
    rebalanceFrequency: 'quarterly',
    timeRange: '5Y',
    includeDividends: true,
    useLogReturns: true,
  },
  assets: [
    {
      asset: {
        id: 'asset-voo',
        symbol: 'VOO',
        name: 'Vanguard S&P 500 ETF',
        type: 'etf',
        exchange: 'NYSE',
        currency: 'USD',
      },
      weight: 0.45,
      value: 45000,
    },
    {
      asset: {
        id: 'asset-vxus',
        symbol: 'VXUS',
        name: 'Vanguard Total International Stock ETF',
        type: 'etf',
        exchange: 'NASDAQ',
        currency: 'USD',
      },
      weight: 0.2,
      value: 20000,
    },
    {
      asset: {
        id: 'asset-gld',
        symbol: 'GLD',
        name: 'SPDR Gold Shares',
        type: 'commodity',
        exchange: 'NYSE',
        currency: 'USD',
      },
      weight: 0.15,
      value: 15000,
    },
    {
      asset: {
        id: 'asset-bnd',
        symbol: 'BND',
        name: 'Vanguard Total Bond Market ETF',
        type: 'bond',
        exchange: 'NASDAQ',
        currency: 'USD',
      },
      weight: 0.12,
      value: 12000,
    },
    {
      asset: {
        id: 'asset-btc',
        symbol: 'BTC-USD',
        name: 'Bitcoin',
        type: 'crypto',
        exchange: 'CRYPTO',
        currency: 'USD',
      },
      weight: 0.08,
      value: 8000,
    },
  ],
}

export const mockPerformanceMetrics = {
  expectedReturn: 0.124,
  volatility: 0.087,
  sharpeRatio: 1.42,
  sortinoRatio: 1.95,
  maxDrawdown: -0.18,
}

export const mockAssetSummaries: Record<
  string,
  {
    name: string
    allocation: number
    expectedReturn: number
    volatility: number
    sharpeRatio: number
    yearToDate: number
    description: string
  }
> = {
  VOO: {
    name: 'Vanguard S&P 500 ETF',
    allocation: 0.45,
    expectedReturn: 0.118,
    volatility: 0.142,
    sharpeRatio: 1.38,
    yearToDate: 0.095,
    description:
      '米国大型株へ幅広く分散投資するETF。テック系の比率が高く、長期の成長ドライバーとなります。',
  },
  VXUS: {
    name: 'Vanguard Total International Stock ETF',
    allocation: 0.2,
    expectedReturn: 0.102,
    volatility: 0.156,
    sharpeRatio: 1.12,
    yearToDate: 0.064,
    description:
      '米国外の株式市場へ投資し、地域分散を実現。為替リスクがボラティリティ要因になります。',
  },
  GLD: {
    name: 'SPDR Gold Shares',
    allocation: 0.15,
    expectedReturn: 0.058,
    volatility: 0.19,
    sharpeRatio: 0.78,
    yearToDate: 0.041,
    description:
      '金価格を追随するETF。インフレヘッジおよびリスク回避局面での防御資産として機能します。',
  },
  BND: {
    name: 'Vanguard Total Bond Market ETF',
    allocation: 0.12,
    expectedReturn: 0.042,
    volatility: 0.055,
    sharpeRatio: 0.92,
    yearToDate: 0.021,
    description:
      '米国債・社債を含む広範な債券市場に投資。利回りと安定性でポートフォリオを補完します。',
  },
  'BTC-USD': {
    name: 'Bitcoin',
    allocation: 0.08,
    expectedReturn: 0.28,
    volatility: 0.62,
    sharpeRatio: 0.95,
    yearToDate: 0.184,
    description:
      '暗号資産ビットコイン。リスクは高いが高リターンを狙うサテライト資産として活用しています。',
  },
}

export const mockRiskMetrics = [
  { label: 'Value at Risk (95%)', value: '-6.2%' },
  { label: 'Conditional VaR (95%)', value: '-9.8%' },
  { label: '最大ドローダウン', value: '-18.0%' },
  { label: 'ベータ (S&P500)', value: '0.92' },
]

export const mockActivityLog = [
  {
    date: '2024-12-12',
    title: 'ポートフォリオ「グロース＋コモディティ」を最適化',
    description: '最大シャープレシオで再計算し、株式比率を 5% 引き上げました。',
  },
  {
    date: '2024-12-10',
    title: 'リスクアラート',
    description: '暗号資産の相関が 0.65 を超過。リバランス推奨です。',
  },
  {
    date: '2024-12-08',
    title: 'バックテスト完了',
    description: '10 年間のリバランス戦略バックテストを実行しました。',
  },
]

export const mockOptimizationSummaries = [
  {
    strategy: 'max_sharpe' as const,
    expectedReturn: 0.124,
    risk: 0.087,
    sharpeRatio: 1.42,
    description:
      'リスクに対するリターン効率を最大化。株式とコモディティのバランスが最適化されました。',
    weights: [
      { symbol: 'VOO', weight: 0.38 },
      { symbol: 'VXUS', weight: 0.18 },
      { symbol: 'GLD', weight: 0.12 },
      { symbol: 'BND', weight: 0.17 },
      { symbol: 'BTC-USD', weight: 0.15 },
    ],
  },
  {
    strategy: 'min_variance' as const,
    expectedReturn: 0.073,
    risk: 0.052,
    sharpeRatio: 1.18,
    description: '安定性重視の低ボラティリティ構成。債券と金の比率を増やし、防御力を高めています。',
    weights: [
      { symbol: 'VOO', weight: 0.22 },
      { symbol: 'VXUS', weight: 0.12 },
      { symbol: 'GLD', weight: 0.28 },
      { symbol: 'BND', weight: 0.32 },
      { symbol: 'BTC-USD', weight: 0.06 },
    ],
  },
  {
    strategy: 'max_return' as const,
    expectedReturn: 0.168,
    risk: 0.125,
    sharpeRatio: 1.34,
    description:
      '期待リターン最大化。暗号資産と株式の比率が高く、ハイリスク・ハイリターン戦略です。',
    weights: [
      { symbol: 'VOO', weight: 0.42 },
      { symbol: 'VXUS', weight: 0.16 },
      { symbol: 'GLD', weight: 0.09 },
      { symbol: 'BND', weight: 0.08 },
      { symbol: 'BTC-USD', weight: 0.25 },
    ],
  },
  {
    strategy: 'risk_parity' as const,
    expectedReturn: 0.105,
    risk: 0.066,
    sharpeRatio: 1.26,
    description: 'リスク寄与度を均等化し、資産クラス間のボラティリティをバランスさせる戦略です。',
  },
]

export const mockEfficientFrontier = [
  { risk: 0.04, expectedReturn: 0.05, label: '保守型' },
  { risk: 0.06, expectedReturn: 0.07, label: 'バランス型' },
  { risk: 0.08, expectedReturn: 0.09, label: '成長型' },
  { risk: 0.1, expectedReturn: 0.11, label: '積極型' },
  { risk: 0.13, expectedReturn: 0.15, label: 'ハイリスク' },
]

export const mockOptimalPoint = { risk: 0.087, expectedReturn: 0.124 }

export const mockCorrelationMatrix = {
  symbols: ['VOO', 'VXUS', 'GLD', 'BND', 'BTC-USD'],
  matrix: [
    [1, 0.74, 0.18, 0.32, 0.12],
    [0.74, 1, 0.15, 0.28, 0.1],
    [0.18, 0.15, 1, -0.12, 0.25],
    [0.32, 0.28, -0.12, 1, -0.08],
    [0.12, 0.1, 0.25, -0.08, 1],
  ],
}

export const mockUserPreferences = {
  baseCurrency: 'JPY',
  locale: 'ja-JP',
  notifications: {
    rebalanceSuggestions: true,
    riskAlerts: true,
    weeklyDigest: false,
  },
  accessibility: {
    contrastMode: 'auto' as const,
    reducedMotion: false,
  },
}
