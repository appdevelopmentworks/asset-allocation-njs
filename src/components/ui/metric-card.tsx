import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  change?: {
    value: string
    trend: 'up' | 'down' | 'neutral'
  }
  className?: string
}

export function MetricCard({ title, value, change, className }: MetricCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-6 shadow-sm', className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mt-3 flex items-baseline gap-2 text-foreground">
        <span className="text-2xl font-semibold">{value}</span>
        {change && (
          <span
            className={cn(
              'text-xs font-semibold',
              change.trend === 'up' && 'text-emerald-500',
              change.trend === 'down' && 'text-rose-500',
              change.trend === 'neutral' && 'text-muted-foreground',
            )}
          >
            {change.value}
          </span>
        )}
      </div>
    </div>
  )
}
