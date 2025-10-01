'use client'

import Link from 'next/link'
import { useLocale } from '@/components/providers/locale-provider'

interface DashboardHeaderProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export function DashboardHeader({ onToggleSidebar, isSidebarOpen }: DashboardHeaderProps) {
  const { t, toggleLocale } = useLocale()

  return (
    <header className="border-b bg-card/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition hover:border-primary md:hidden"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation"
            aria-controls="dashboard-sidebar"
            aria-expanded={isSidebarOpen ?? false}
          >
            <span className="sr-only">メニュー</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          <Link href="/" className="text-lg font-semibold">
            Asset Allocation Tool
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-sm">
          <span className="hidden sm:inline">{t('header.docs')}:</span>
          <Link href="/docs/getting-started" className="underline-offset-4 hover:underline">
            Getting Started
          </Link>
          <span className="hidden sm:inline">/</span>
          <Link href="/docs/design" className="underline-offset-4 hover:underline">
            Design
          </Link>
          <span className="hidden sm:inline">/</span>
          <Link href="/docs/requirements" className="underline-offset-4 hover:underline">
            Requirements
          </Link>
          <button
            type="button"
            onClick={toggleLocale}
            className="rounded-full border px-3 py-1 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary"
            aria-label="Toggle locale"
          >
            {t('header.toggleLocale')}
          </button>
        </div>
      </div>
    </header>
  )
}
