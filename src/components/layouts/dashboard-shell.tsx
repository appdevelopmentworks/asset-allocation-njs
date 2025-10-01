'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { DashboardHeader } from '@/components/layouts/dashboard-header'
import { DashboardSidebar } from '@/components/layouts/dashboard-sidebar'

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const closeSidebar = () => setIsSidebarOpen(false)
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsSidebarOpen(false)
      }
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-8 md:px-6 md:py-10">
        <DashboardSidebar className="hidden md:block md:w-56 md:shrink-0" />
        <main className="flex-1 pb-16">{children}</main>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-opacity duration-200',
          isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" onClick={closeSidebar} />
        <div
          className={cn(
            'absolute inset-y-0 left-0 flex h-full w-72 max-w-[85%] -translate-x-full transform transition-transform duration-200 ease-out',
            isSidebarOpen && 'translate-x-0',
          )}
        >
          <DashboardSidebar
            id="dashboard-sidebar"
            className="h-full w-full border-r border-border bg-background/95 shadow-xl"
            onNavigate={closeSidebar}
          />
        </div>
      </div>
    </div>
  )
}
