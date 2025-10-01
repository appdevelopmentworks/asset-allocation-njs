'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/portfolio', label: 'ポートフォリオ' },
  { href: '/dashboard/analysis', label: '高度分析' },
  { href: '/dashboard/settings', label: '設定' },
]

interface DashboardSidebarProps {
  className?: string
  onNavigate?: () => void
  id?: string
}

export function DashboardSidebar({ className, onNavigate, id }: DashboardSidebarProps) {
  const pathname = usePathname()

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
