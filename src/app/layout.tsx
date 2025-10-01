import type { Metadata } from 'next'
import { LocaleProvider } from '@/components/providers/locale-provider'
import { PortfolioProvider } from '@/components/providers/portfolio-provider'
import './globals.css'

const appTitle = 'Asset Allocation Tool'
const appDescription =
  'ローカルストレージでポートフォリオを管理し、チャートやシミュレーションで最適化を支援する Next.js アプリケーションです。'

export const metadata: Metadata = {
  title: {
    template: `%s | ${appTitle}`,
    default: appTitle,
  },
  description: appDescription,
  icons: {
    icon: '/images/asset-allocation.png',
    shortcut: '/images/asset-allocation.png',
    apple: '/images/asset-allocation.png',
  },
  openGraph: {
    title: appTitle,
    description: appDescription,
    images: [
      {
        url: '/images/asset-allocation.png',
        width: 1200,
        height: 630,
        alt: 'Asset Allocation Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: appTitle,
    description: appDescription,
    images: ['/images/asset-allocation.png'],
  },
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <LocaleProvider>
          <PortfolioProvider>{children}</PortfolioProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
