import type React from 'react'
import { cn } from '@/lib/utils'

interface SectionCardProps extends React.HTMLAttributes<HTMLElement> {
  title: string
  description?: string
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function SectionCard({
  title,
  description,
  footer,
  children,
  className,
  ...props
}: SectionCardProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 p-6 text-white shadow-2xl',
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_70%_40%,rgba(168,85,247,0.1),transparent_50%)]" />
      <div className="relative">
        <header className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
          {description ? <p className="text-sm text-slate-300/90">{description}</p> : null}
        </header>
        {children ? <div className="mt-6 text-sm text-slate-100">{children}</div> : null}
        {footer ? (
          <div className="mt-6 border-t border-slate-700/50 pt-6 text-xs text-slate-300">
            {footer}
          </div>
        ) : null}
      </div>
    </section>
  )
}
