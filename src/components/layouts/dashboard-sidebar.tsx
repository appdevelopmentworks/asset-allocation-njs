'use client'

import Link from 'next/link'
import type { Route } from 'next'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLocale } from '@/components/providers/locale-provider'

interface DashboardSidebarProps {
  className?: string
  onNavigate?: () => void
  id?: string
}

export function DashboardSidebar({ className, onNavigate, id }: DashboardSidebarProps) {
  const { locale, t } = useLocale()
  const pathname = usePathname()
  const navItems: Array<{ href: Route; label: string }> = [
    { href: '/dashboard', label: locale === 'ja' ? '概要' : t('nav.overview') },
    { href: '/dashboard/portfolio', label: t('nav.portfolio') },
    { href: '/dashboard/analysis', label: t('nav.analysis') },
    { href: '/dashboard/settings', label: t('nav.settings') },
  ]

  return (
    <aside id={id} className={cn('w-full border border-border/60 bg-card/40 shadow-sm', className)}>
      <nav className="flex flex-col gap-2 px-4 py-6 text-sm">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'rounded-lg px-3 py-2 font-medium transition',
                isActive
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
