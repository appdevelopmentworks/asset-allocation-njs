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
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 p-6 text-white shadow-2xl',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_70%_40%,rgba(168,85,247,0.1),transparent_50%)]" />
      <div className="relative space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300/90">{title}</p>
        <div className="flex items-baseline gap-3 text-white">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          {change && (
            <span
              className={cn(
                'text-xs font-bold',
                change.trend === 'up' && 'text-emerald-400',
                change.trend === 'down' && 'text-rose-400',
                change.trend === 'neutral' && 'text-slate-400',
              )}
            >
              {change.value}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
