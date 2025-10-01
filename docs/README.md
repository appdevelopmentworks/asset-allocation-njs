# Asset Allocation Tool - Next.js 15

A modern portfolio optimization application built with Next.js 15, featuring real-time market data, advanced portfolio analysis, and responsive design.

## 🚀 Features

- **Portfolio Optimization**: Multiple optimization strategies (Max Sharpe, Min Variance, Risk Parity)
- **Real-time Data**: Live market data from Yahoo Finance
- **Efficient Frontier**: Interactive visualization of risk-return tradeoffs  
- **Mobile-First**: Fully responsive design with touch gestures
- **Dark Mode**: System-aware theme switching
- **Performance**: Optimized with Next.js 15 App Router

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: TailwindCSS + shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts, Plotly.js
- **State**: Zustand

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis (Upstash)
- **Data Source**: Yahoo Finance API

### Infrastructure
- **Hosting**: Vercel
- **CDN**: Cloudflare
- **Monitoring**: Vercel Analytics, Sentry
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
asset-allocation-nextjs/
├── app/                    # Next.js 15 App Router
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── charts/          # Chart components
│   └── forms/           # Form components
├── lib/                 # Utilities and logic
│   ├── api/            # API client
│   ├── calculations/   # Portfolio calculations
│   ├── stores/         # Zustand stores
│   └── types/          # TypeScript types
├── docs/               # Documentation
│   ├── 01_要求定義書.md
│   ├── 02_詳細設計書.md
│   ├── 03_API設計書.md
│   ├── 04_UIUXデザインガイド.md
│   ├── 05_実装ガイド.md
│   ├── 06_データベース設計書.md
│   ├── 07_テスト仕様書.md
│   └── 08_デプロイメントガイド.md
└── tests/              # Test files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Redis

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/asset-allocation-nextjs.git
cd asset-allocation-nextjs
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. Set up the database:
```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# External APIs
YAHOO_FINANCE_API_KEY="..."

# Monitoring
NEXT_PUBLIC_SENTRY_DSN="https://..."
```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

## 📦 Building

```bash
# Build for production
pnpm build

# Analyze bundle size
pnpm analyze

# Type check
pnpm type-check

# Lint
pnpm lint
```

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/asset-allocation-nextjs)

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy to staging
vercel --prod --env staging
```

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- [要求定義書](./docs/01_要求定義書.md) - Requirements specification
- [詳細設計書](./docs/02_詳細設計書.md) - Detailed design
- [API設計書](./docs/03_API設計書.md) - API documentation
- [UIUXデザインガイド](./docs/04_UIUXデザインガイド.md) - UI/UX design guide
- [実装ガイド](./docs/05_実装ガイド.md) - Implementation guide
- [データベース設計書](./docs/06_データベース設計書.md) - Database design
- [テスト仕様書](./docs/07_テスト仕様書.md) - Test specifications
- [デプロイメントガイド](./docs/08_デプロイメントガイド.md) - Deployment guide

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Vercel](https://vercel.com) for hosting
- [Supabase](https://supabase.com) for the database
- [Yahoo Finance](https://finance.yahoo.com) for market data

## 📧 Contact

- Website: [assetallocation.com](https://assetallocation.com)
- Email: support@assetallocation.com
- Twitter: [@assetallocation](https://twitter.com/assetallocation)

## 🔗 Links

- [Demo](https://app.assetallocation.com)
- [Documentation](https://docs.assetallocation.com)
- [API Reference](https://api.assetallocation.com/docs)
- [Status Page](https://status.assetallocation.com)

---

Built with ❤️ using Next.js 15
