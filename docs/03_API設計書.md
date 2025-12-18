# API設計書 - Asset Allocation Tool

## 1. API概要

### 1.1 基本情報

- **Base URL**: `https://api.assetallocation.app/v1`
- **Protocol**: HTTPS only
- **Format**: JSON
- **Authentication**: API Key (将来実装)
- **Rate Limit**: 100 requests/minute

### 1.2 共通仕様

#### Request Headers

```http
Content-Type: application/json
Accept: application/json
X-API-Version: v1
X-Request-ID: {uuid}
Authorization: Bearer {token} (将来実装)
```

#### Response Headers

```http
Content-Type: application/json
X-Request-ID: {uuid}
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1609459200
Cache-Control: private, max-age=60
```

#### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "v1",
    "cached": false,
    "ttl": 60
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error context
    }
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "v1"
  }
}
```

## 2. Assets API

### 2.1 資産検索

**Endpoint**: `GET /api/assets/search`

**Description**: 資産を検索する

**Query Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| q | string | Yes | 検索クエリ | `AAPL` |
| type | string | No | 資産タイプ | `stock` |
| exchange | string | No | 取引所 | `NASDAQ` |
| limit | integer | No | 結果数上限 (1-100) | `20` |
| offset | integer | No | オフセット | `0` |

**Response Example**:

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "AAPL",
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "type": "stock",
        "exchange": "NASDAQ",
        "currency": "USD",
        "country": "US",
        "sector": "Technology",
        "industry": "Consumer Electronics",
        "marketCap": 3000000000000,
        "logo": "https://logo.clearbit.com/apple.com"
      }
    ],
    "total": 1,
    "hasMore": false
  }
}
```

### 2.2 資産詳細取得

**Endpoint**: `GET /api/assets/{symbol}`

**Description**: 特定の資産の詳細情報を取得

**Path Parameters**:
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| symbol | string | ティッカーシンボル | `AAPL` |

**Response Example**:

```json
{
  "success": true,
  "data": {
    "id": "AAPL",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "type": "stock",
    "exchange": "NASDAQ",
    "currency": "USD",
    "country": "US",
    "sector": "Technology",
    "industry": "Consumer Electronics",
    "marketCap": 3000000000000,
    "currentPrice": 150.25,
    "dayChange": 2.35,
    "dayChangePercent": 1.59,
    "volume": 75000000,
    "avgVolume": 65000000,
    "previousClose": 147.9,
    "dayHigh": 151.5,
    "dayLow": 148.2,
    "yearHigh": 199.62,
    "yearLow": 124.17,
    "pe": 28.5,
    "eps": 5.27,
    "dividend": 0.96,
    "dividendYield": 0.64,
    "beta": 1.25,
    "lastUpdated": "2024-01-01T15:30:00Z"
  }
}
```

### 2.3 履歴データ取得

**Endpoint**: `GET /api/assets/{symbol}/history`

**Description**: 資産の価格履歴を取得

**Path Parameters**:
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| symbol | string | ティッカーシンボル | `AAPL` |

**Query Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| start | string | Yes | 開始日 (YYYY-MM-DD) | `2023-01-01` |
| end | string | Yes | 終了日 (YYYY-MM-DD) | `2024-01-01` |
| interval | string | No | データ間隔 | `1d` |

**Interval Values**:

- `1m`: 1分
- `5m`: 5分
- `15m`: 15分
- `30m`: 30分
- `1h`: 1時間
- `1d`: 1日 (デフォルト)
- `1wk`: 1週間
- `1mo`: 1ヶ月

**Response Example**:

```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "interval": "1d",
    "currency": "USD",
    "history": [
      {
        "date": "2023-01-01",
        "open": 145.5,
        "high": 147.2,
        "low": 144.8,
        "close": 146.75,
        "adjClose": 146.75,
        "volume": 68000000
      },
      {
        "date": "2023-01-02",
        "open": 146.8,
        "high": 148.5,
        "low": 146.2,
        "close": 148.0,
        "adjClose": 148.0,
        "volume": 72000000
      }
    ],
    "total": 252
  }
}
```

### 2.4 バッチ資産取得

**Endpoint**: `POST /api/assets/batch`

**Description**: 複数の資産情報を一括取得

**Request Body**:

```json
{
  "symbols": ["AAPL", "GOOGL", "MSFT"],
  "fields": ["price", "change", "volume"]
}
```

**Response Example**:

```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "symbol": "AAPL",
        "price": 150.25,
        "change": 2.35,
        "volume": 75000000
      },
      {
        "symbol": "GOOGL",
        "price": 140.5,
        "change": -1.2,
        "volume": 25000000
      },
      {
        "symbol": "MSFT",
        "price": 380.75,
        "change": 5.45,
        "volume": 28000000
      }
    ]
  }
}
```

## 3. Portfolio API

### 3.1 ポートフォリオ最適化

**Endpoint**: `POST /api/portfolio/optimize`

**Description**: ポートフォリオの最適化を実行

**Request Body**:

```json
{
  "assets": ["AAPL", "GOOGL", "MSFT", "BND", "GLD"],
  "startDate": "2023-01-01",
  "endDate": "2024-01-01",
  "optimizationType": "max_sharpe",
  "constraints": {
    "minWeight": 0.05,
    "maxWeight": 0.4,
    "targetReturn": null,
    "maxRisk": null
  },
  "settings": {
    "riskFreeRate": 0.04,
    "confidenceLevel": 0.95,
    "rebalanceFrequency": "quarterly"
  }
}
```

**Optimization Types**:

- `max_sharpe`: シャープレシオ最大化
- `min_variance`: 分散最小化
- `max_return`: リターン最大化
- `risk_parity`: リスクパリティ
- `equal_weight`: 均等配分

**Response Example**:

```json
{
  "success": true,
  "data": {
    "optimizationType": "max_sharpe",
    "portfolio": {
      "weights": [
        {
          "symbol": "AAPL",
          "weight": 0.25,
          "value": 2500
        },
        {
          "symbol": "GOOGL",
          "weight": 0.2,
          "value": 2000
        },
        {
          "symbol": "MSFT",
          "weight": 0.25,
          "value": 2500
        },
        {
          "symbol": "BND",
          "weight": 0.2,
          "value": 2000
        },
        {
          "symbol": "GLD",
          "weight": 0.1,
          "value": 1000
        }
      ],
      "totalValue": 10000
    },
    "metrics": {
      "expectedReturn": 0.125,
      "annualizedReturn": 0.125,
      "risk": 0.158,
      "sharpeRatio": 0.532,
      "sortinoRatio": 0.684,
      "maxDrawdown": -0.089,
      "var95": -0.025,
      "cvar95": -0.038
    }
  }
}
```

### 3.2 ポートフォリオ分析

**Endpoint**: `POST /api/portfolio/analyze`

**Description**: ポートフォリオの詳細分析を実行

**Request Body**:

```json
{
  "portfolio": {
    "assets": [
      { "symbol": "AAPL", "weight": 0.3 },
      { "symbol": "GOOGL", "weight": 0.25 },
      { "symbol": "MSFT", "weight": 0.25 },
      { "symbol": "BND", "weight": 0.2 }
    ]
  },
  "startDate": "2023-01-01",
  "endDate": "2024-01-01",
  "benchmark": "SPY",
  "analysisOptions": {
    "includeCorrelation": true,
    "includeEfficiencyFrontier": true,
    "numSimulations": 5000
  }
}
```

**Response Example**:

```json
{
  "success": true,
  "data": {
    "portfolioMetrics": {
      "totalReturn": 0.185,
      "annualizedReturn": 0.172,
      "volatility": 0.145,
      "sharpeRatio": 0.841,
      "sortinoRatio": 1.052,
      "maxDrawdown": -0.076,
      "calmarRatio": 2.263,
      "beta": 0.95,
      "alpha": 0.023,
      "treynorRatio": 0.181,
      "informationRatio": 0.452
    },
    "correlationMatrix": [
      [1.0, 0.75, 0.82, -0.15],
      [0.75, 1.0, 0.68, -0.22],
      [0.82, 0.68, 1.0, -0.18],
      [-0.15, -0.22, -0.18, 1.0]
    ],
    "efficientFrontier": [
      { "risk": 0.08, "return": 0.05 },
      { "risk": 0.1, "return": 0.08 },
      { "risk": 0.12, "return": 0.11 },
      { "risk": 0.15, "return": 0.14 },
      { "risk": 0.18, "return": 0.17 }
    ],
    "periodReturns": {
      "daily": 0.00068,
      "weekly": 0.00342,
      "monthly": 0.01489,
      "quarterly": 0.04523,
      "yearly": 0.185
    }
  }
}
```

### 3.3 バックテスト実行

**Endpoint**: `POST /api/portfolio/backtest`

**Description**: 過去データでポートフォリオのバックテストを実行

**Request Body**:

```json
{
  "portfolio": {
    "assets": [
      { "symbol": "AAPL", "weight": 0.3 },
      { "symbol": "GOOGL", "weight": 0.3 },
      { "symbol": "BND", "weight": 0.4 }
    ]
  },
  "startDate": "2020-01-01",
  "endDate": "2024-01-01",
  "initialInvestment": 10000,
  "rebalanceStrategy": {
    "frequency": "quarterly",
    "threshold": 0.05,
    "method": "calendar"
  },
  "costs": {
    "transactionFee": 0.001,
    "slippage": 0.0005
  }
}
```

**Response Example**:

```json
{
  "success": true,
  "data": {
    "summary": {
      "initialValue": 10000,
      "finalValue": 14523,
      "totalReturn": 0.4523,
      "annualizedReturn": 0.0985,
      "volatility": 0.1234,
      "sharpeRatio": 0.634,
      "maxDrawdown": -0.1523,
      "winRate": 0.625,
      "profitFactor": 1.85,
      "totalTrades": 48,
      "totalCosts": 125.5
    },
    "equity": [
      { "date": "2020-01-01", "value": 10000 },
      { "date": "2020-01-02", "value": 10052 },
      { "date": "2020-01-03", "value": 10098 }
    ],
    "trades": [
      {
        "date": "2020-04-01",
        "type": "rebalance",
        "actions": [
          { "symbol": "AAPL", "action": "buy", "quantity": 5, "price": 255.5 },
          { "symbol": "BND", "action": "sell", "quantity": 10, "price": 85.2 }
        ],
        "cost": 2.58
      }
    ],
    "monthlyReturns": [
      { "month": "2020-01", "return": 0.0234 },
      { "month": "2020-02", "return": -0.0456 },
      { "month": "2020-03", "return": -0.1234 }
    ]
  }
}
```

## 4. Simulation API

### 4.1 モンテカルロシミュレーション

**Endpoint**: `POST /api/simulation/montecarlo`

**Description**: モンテカルロシミュレーションを実行

**Request Body**:

```json
{
  "portfolio": {
    "assets": [
      { "symbol": "SPY", "weight": 0.6 },
      { "symbol": "BND", "weight": 0.4 }
    ]
  },
  "numSimulations": 10000,
  "timeHorizon": 20,
  "annualContribution": 5000,
  "inflationRate": 0.02,
  "seed": 42
}
```

**Response Example**:

```json
{
  "success": true,
  "data": {
    "statistics": {
      "median": 425000,
      "mean": 438000,
      "standardDeviation": 125000,
      "percentile5": 245000,
      "percentile25": 340000,
      "percentile75": 520000,
      "percentile95": 685000,
      "successRate": 0.875
    },
    "histogram": {
      "bins": [100000, 200000, 300000, 400000, 500000, 600000, 700000],
      "frequencies": [52, 485, 2150, 3850, 2680, 650, 133]
    },
    "projections": {
      "conservative": 340000,
      "expected": 438000,
      "optimistic": 520000
    }
  }
}
```

## 5. Market Data API

### 5.1 市場指標取得

**Endpoint**: `GET /api/market/indicators`

**Description**: 主要市場指標を取得

**Response Example**:

```json
{
  "success": true,
  "data": {
    "indices": {
      "SP500": { "value": 4783.45, "change": 0.52 },
      "NASDAQ": { "value": 15123.68, "change": 0.78 },
      "DOW": { "value": 37689.54, "change": 0.35 }
    },
    "rates": {
      "US10Y": 4.25,
      "US2Y": 4.65,
      "FED_FUNDS": 5.33
    },
    "commodities": {
      "GOLD": { "value": 2050.3, "change": -0.25 },
      "OIL": { "value": 75.85, "change": 1.2 }
    },
    "crypto": {
      "BTC": { "value": 45230.5, "change": 2.35 },
      "ETH": { "value": 2485.75, "change": 3.12 }
    },
    "vix": 13.45,
    "dollarIndex": 102.35,
    "lastUpdated": "2024-01-01T15:30:00Z"
  }
}
```

### 5.2 セクターパフォーマンス

**Endpoint**: `GET /api/market/sectors`

**Description**: セクター別パフォーマンスを取得

**Query Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| period | string | No | 期間 | `1d`, `1w`, `1m`, `3m`, `1y` |

**Response Example**:

```json
{
  "success": true,
  "data": {
    "period": "1m",
    "sectors": [
      {
        "name": "Technology",
        "symbol": "XLK",
        "performance": 0.0523,
        "rank": 1
      },
      {
        "name": "Healthcare",
        "symbol": "XLV",
        "performance": 0.0342,
        "rank": 2
      },
      {
        "name": "Financials",
        "symbol": "XLF",
        "performance": 0.0285,
        "rank": 3
      }
    ]
  }
}
```

## 6. Presets API

### 6.1 プリセットポートフォリオ一覧

**Endpoint**: `GET /api/presets`

**Description**: 利用可能なプリセットポートフォリオの一覧を取得

**Response Example**:

```json
{
  "success": true,
  "data": {
    "presets": [
      {
        "id": "balanced",
        "name": "Balanced Portfolio",
        "description": "A balanced mix of stocks and bonds",
        "riskLevel": "moderate",
        "assets": [
          { "symbol": "SPY", "weight": 0.4, "name": "S&P 500" },
          { "symbol": "BND", "weight": 0.3, "name": "Bonds" },
          { "symbol": "VNQ", "weight": 0.15, "name": "Real Estate" },
          { "symbol": "GLD", "weight": 0.15, "name": "Gold" }
        ],
        "historicalReturn": 0.085,
        "historicalVolatility": 0.098
      },
      {
        "id": "aggressive",
        "name": "Aggressive Growth",
        "description": "High growth potential with higher risk",
        "riskLevel": "high",
        "assets": [
          { "symbol": "QQQ", "weight": 0.4, "name": "NASDAQ 100" },
          { "symbol": "VWO", "weight": 0.3, "name": "Emerging Markets" },
          { "symbol": "ARKK", "weight": 0.3, "name": "Innovation" }
        ],
        "historicalReturn": 0.125,
        "historicalVolatility": 0.185
      }
    ]
  }
}
```

## 7. Error Codes

### Error Code Reference

| Code                     | HTTP Status | Description                    |
| ------------------------ | ----------- | ------------------------------ |
| `INVALID_REQUEST`        | 400         | リクエストパラメータが不正     |
| `INVALID_SYMBOL`         | 400         | 無効なティッカーシンボル       |
| `INVALID_DATE_RANGE`     | 400         | 無効な日付範囲                 |
| `MISSING_REQUIRED_FIELD` | 400         | 必須フィールドが不足           |
| `RESOURCE_NOT_FOUND`     | 404         | リソースが見つからない         |
| `METHOD_NOT_ALLOWED`     | 405         | HTTPメソッドが許可されていない |
| `RATE_LIMIT_EXCEEDED`    | 429         | レート制限超過                 |
| `EXTERNAL_API_ERROR`     | 502         | 外部API通信エラー              |
| `CALCULATION_ERROR`      | 500         | 計算処理エラー                 |
| `INTERNAL_SERVER_ERROR`  | 500         | 内部サーバーエラー             |
| `SERVICE_UNAVAILABLE`    | 503         | サービス一時停止中             |

## 8. Rate Limiting

### Rate Limit Rules

- **Default**: 100 requests per minute
- **Authenticated**: 500 requests per minute (将来実装)
- **Enterprise**: Unlimited (将来実装)

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "limit": 100,
      "reset": 1609459200,
      "retryAfter": 45
    }
  }
}
```

## 9. Webhook API (将来実装)

### 9.1 Webhook登録

**Endpoint**: `POST /api/webhooks`

**Description**: Webhook URLを登録

**Request Body**:

```json
{
  "url": "https://example.com/webhook",
  "events": ["portfolio.analyzed", "alert.triggered"],
  "secret": "webhook_secret_key"
}
```

### 9.2 Webhook Events

| Event                 | Description          |
| --------------------- | -------------------- |
| `portfolio.created`   | ポートフォリオ作成時 |
| `portfolio.analyzed`  | 分析完了時           |
| `portfolio.optimized` | 最適化完了時         |
| `alert.triggered`     | アラート発火時       |
| `rebalance.required`  | リバランス必要時     |

### 9.3 Webhook Payload Example

```json
{
  "event": "portfolio.analyzed",
  "timestamp": "2024-01-01T15:30:00Z",
  "data": {
    "portfolioId": "abc123",
    "metrics": {
      "sharpeRatio": 0.85,
      "totalReturn": 0.125
    }
  },
  "signature": "sha256=abcdef..."
}
```

## 10. SDK Examples

### JavaScript/TypeScript

```typescript
import { AssetAllocationClient } from '@assetallocation/sdk'

const client = new AssetAllocationClient({
  apiKey: 'your_api_key',
  baseURL: 'https://api.assetallocation.app/v1',
})

// Search assets
const assets = await client.assets.search({
  query: 'AAPL',
  limit: 10,
})

// Optimize portfolio
const result = await client.portfolio.optimize({
  assets: ['AAPL', 'GOOGL', 'BND'],
  startDate: '2023-01-01',
  endDate: '2024-01-01',
  optimizationType: 'max_sharpe',
})
```

### Python

```python
from assetallocation import Client

client = Client(api_key='your_api_key')

# Get asset history
history = client.assets.get_history(
    symbol='AAPL',
    start='2023-01-01',
    end='2024-01-01'
)

# Analyze portfolio
analysis = client.portfolio.analyze(
    assets=[
        {'symbol': 'SPY', 'weight': 0.60},
        {'symbol': 'BND', 'weight': 0.40}
    ],
    start_date='2023-01-01',
    end_date='2024-01-01'
)
```

---

_API Version: v1_  
_Last Updated: December 2024_
