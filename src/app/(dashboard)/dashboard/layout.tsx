import type { Metadata } from 'next'
import { DashboardShell } from '@/components/layouts/dashboard-shell'

export const metadata: Metadata = {
  title: 'ダッシュボード',
}

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>
}
