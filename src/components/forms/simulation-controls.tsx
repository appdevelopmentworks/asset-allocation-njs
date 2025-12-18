'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/components/providers/locale-provider'
import type { SimulationSettings, SimulationRange, SimulationRebalance } from '@/lib/types'

interface SimulationControlsProps {
  availableAssets: Array<{ symbol: string; name: string }>
  defaultSettings?: SimulationSettings
  onApply?: (settings: SimulationSettings) => void
}

const rangeOptions: SimulationRange[] = ['1Y', '3Y', '5Y', '10Y', 'MAX']
const rebalanceOptions: SimulationRebalance[] = ['monthly', 'quarterly', 'yearly']

const glassCard =
  'relative overflow-hidden rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 shadow-2xl shadow-black/50 text-white'

export function SimulationControls({
  availableAssets,
  defaultSettings,
  onApply,
}: SimulationControlsProps) {
  const { t, locale } = useLocale()
  const [selectedAssets, setSelectedAssets] = useState<string[]>(
    defaultSettings?.assets ?? availableAssets.slice(0, 3).map((asset) => asset.symbol),
  )
  const [range, setRange] = useState<SimulationRange>(defaultSettings?.range ?? '3Y')
  const [trials, setTrials] = useState<number>(defaultSettings?.trials ?? 5000)
  const [rebalance, setRebalance] = useState<SimulationRebalance>(
    defaultSettings?.rebalance ?? 'quarterly',
  )
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    setSelectedAssets(
      defaultSettings?.assets ?? availableAssets.slice(0, 3).map((asset) => asset.symbol),
    )
    setRange(defaultSettings?.range ?? '3Y')
    setTrials(defaultSettings?.trials ?? 5000)
    setRebalance(defaultSettings?.rebalance ?? 'quarterly')
    setStatus(null)
  }, [availableAssets, defaultSettings])

  const toggleAsset = (symbol: string) => {
    setSelectedAssets((prev) =>
      prev.includes(symbol) ? prev.filter((item) => item !== symbol) : [...prev, symbol],
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload: SimulationSettings = {
      assets: selectedAssets,
      range,
      trials,
      rebalance,
    }

    onApply?.(payload)
    setStatus(t('simulation.result'))
  }

  const isAssetDisabled = (symbol: string) =>
    selectedAssets.length <= 1 && selectedAssets.includes(symbol)

  const rangeLabel = (value: SimulationRange) => {
    if (locale === 'ja') {
      switch (value) {
        case '1Y':
          return '1年'
        case '3Y':
          return '3年'
        case '5Y':
          return '5年'
        case '10Y':
          return '10年'
        default:
          return '最大'
      }
    }

    switch (value) {
      case '1Y':
        return '1 Year'
      case '3Y':
        return '3 Years'
      case '5Y':
        return '5 Years'
      case '10Y':
        return '10 Years'
      default:
        return 'Max'
    }
  }

  const rebalanceLabel = (value: SimulationRebalance) => {
    if (locale === 'ja') {
      if (value === 'monthly') return '毎月'
      if (value === 'quarterly') return '四半期'
      return '毎年'
    }

    if (value === 'monthly') return 'Monthly'
    if (value === 'quarterly') return 'Quarterly'
    return 'Yearly'
  }

  return (
    <form onSubmit={handleSubmit} className={`${glassCard} space-y-6 p-6`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_70%_40%,rgba(168,85,247,0.1),transparent_50%)]" />
      <div className="relative space-y-6">
        <header className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-white">{t('simulation.title')}</h2>
          <p className="text-sm text-slate-300/90">{t('simulation.description')}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300/90">
              {t('simulation.assets')}
            </legend>
            <div className="grid gap-2">
              {availableAssets.map((asset) => (
                <label
                  key={asset.symbol}
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 text-sm shadow-sm transition-colors hover:bg-slate-700/40"
                >
                  <span className="flex flex-col">
                    <span className="font-bold text-white">{asset.symbol}</span>
                    <span className="text-xs text-slate-300/80">{asset.name}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset.symbol)}
                    onChange={() => toggleAsset(asset.symbol)}
                    disabled={isAssetDisabled(asset.symbol)}
                    className="h-4 w-4 accent-indigo-500"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-4">
            <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300/90">
              {t('simulation.range')}
              <select
                value={range}
                onChange={(event) => setRange(event.target.value as SimulationRange)}
                className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-2 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              >
                {rangeOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900 text-white">
                    {rangeLabel(option)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300/90">
              {t('simulation.trials')}
              <input
                type="number"
                min={100}
                step={100}
                value={trials}
                onChange={(event) => setTrials(Number(event.target.value))}
                className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-2 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
            </label>

            <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300/90">
              {t('simulation.rebalance')}
              <select
                value={rebalance}
                onChange={(event) => setRebalance(event.target.value as SimulationRebalance)}
                className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-2 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              >
                {rebalanceOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900 text-white">
                    {rebalanceLabel(option)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-700/50 pt-6">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500"
          >
            {t('simulation.apply')}
          </button>
          {status ? <p className="text-xs font-bold text-emerald-400">{status}</p> : null}
        </div>
      </div>
    </form>
  )
}
