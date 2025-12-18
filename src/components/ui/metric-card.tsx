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
        'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/50 to-slate-800/50 p-6 text-slate-100 shadow-xl shadow-black/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_30%)]" />
      <div className="relative space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{title}</p>
      <div className="mt-3 flex items-baseline gap-2 text-white">
        <span className="text-2xl font-semibold">{value}</span>
        {change && (
          <span
            className={cn(
              'text-xs font-semibold',
              change.trend === 'up' && 'text-emerald-300',
              change.trend === 'down' && 'text-rose-300',
              change.trend === 'neutral' && 'text-slate-300',
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
