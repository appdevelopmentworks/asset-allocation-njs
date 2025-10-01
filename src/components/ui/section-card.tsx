import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  description?: string
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function SectionCard({ title, description, footer, children, className }: SectionCardProps) {
  return (
    <section className={cn('rounded-xl border bg-card p-6 shadow-sm', className)}>
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </header>
      {children ? <div className="mt-4 text-sm text-muted-foreground">{children}</div> : null}
      {footer ? (
        <div className="mt-6 border-t pt-4 text-xs text-muted-foreground">{footer}</div>
      ) : null}
    </section>
  )
}
