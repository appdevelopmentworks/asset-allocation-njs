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
        'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-800/60 p-6 text-slate-100 shadow-xl shadow-black/30 backdrop-blur',
        className,
      )}
      {...props}
    >
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description ? <p className="text-sm text-slate-300">{description}</p> : null}
      </header>
      {children ? <div className="mt-4 text-sm text-slate-200">{children}</div> : null}
      {footer ? (
        <div className="mt-6 border-t border-white/10 pt-4 text-xs text-slate-300">{footer}</div>
      ) : null}
    </section>
  )
}
