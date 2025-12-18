'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@/components/providers/locale-provider'
import type { AssetType, Portfolio } from '@/lib/types'

interface PortfolioEditorProps {
  portfolio: Portfolio
  onSave: (portfolio: Portfolio) => void
  onReset?: () => void
}

interface DraftAsset {
  id: string
  symbol: string
  name: string
  type: AssetType
  weight: number
}

function createDraftAssets(portfolio: Portfolio): DraftAsset[] {
  return portfolio.assets.map((item) => ({
    id: item.asset.id,
    symbol: item.asset.symbol,
    name: item.asset.name,
    type: item.asset.type,
    weight: item.weight,
  }))
}

const assetTypes: AssetType[] = ['stock', 'etf', 'bond', 'commodity', 'crypto', 'reit']

const glassCard =
  'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/50 to-slate-800/50 shadow-xl shadow-black/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md text-slate-100'

export function PortfolioEditor({ portfolio, onSave, onReset }: PortfolioEditorProps) {
  const { locale } = useLocale()
  const [name, setName] = useState(portfolio.name)
  const [description, setDescription] = useState(portfolio.description ?? '')
  const [baseCurrency, setBaseCurrency] = useState(portfolio.baseCurrency ?? 'USD')
  const [assets, setAssets] = useState<DraftAsset[]>(createDraftAssets(portfolio))
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    setName(portfolio.name)
    setDescription(portfolio.description ?? '')
    setBaseCurrency(portfolio.baseCurrency ?? 'USD')
    setAssets(createDraftAssets(portfolio))
    setStatus(null)
  }, [portfolio])

  const totalWeight = useMemo(
    () => assets.reduce((sum, asset) => sum + Math.max(asset.weight, 0), 0),
    [assets],
  )

  const weightWarning = Math.abs(totalWeight - 1) > 0.01

  const text =
    locale === 'ja'
      ? {
          title: 'ポートフォリオ情報',
          subtitle: 'ポートフォリオ名や資産配分を編集し、ローカルストレージに保存します。',
          addAsset: '資産を追加',
          reset: 'リセット',
          name: 'ポートフォリオ名',
          description: '説明',
          currency: '通貨',
          ticker: 'ティッカー',
          assetName: '名称',
          type: 'タイプ',
          weight: '配分 (0-1)',
          remove: '削除',
          total: '合計配分',
          save: '保存',
          success: 'ポートフォリオを保存しました。',
          needAsset: '少なくとも1つの資産を入力してください。',
          zeroAllocation: '資産の配分が 0% です。',
        }
      : {
          title: 'Portfolio Details',
          subtitle:
            'Adjust portfolio metadata and asset allocation; data is stored locally in your browser.',
          addAsset: 'Add Asset',
          reset: 'Reset',
          name: 'Portfolio Name',
          description: 'Description',
          currency: 'Currency',
          ticker: 'Ticker',
          assetName: 'Name',
          type: 'Type',
          weight: 'Weight (0-1)',
          remove: 'Remove',
          total: 'Total Allocation',
          save: 'Save',
          success: 'Portfolio saved locally.',
          needAsset: 'Please provide at least one asset.',
          zeroAllocation: 'Total allocation must be greater than 0%.',
        }

  const updateAsset = (id: string, patch: Partial<DraftAsset>) => {
    setAssets((prev) => prev.map((asset) => (asset.id === id ? { ...asset, ...patch } : asset)))
  }

  const addAsset = () => {
    const newAsset: DraftAsset = {
      id: crypto.randomUUID?.() || `temp-${Date.now()}`,
      symbol: 'NEW',
      name: '',
      type: 'stock',
      weight: 0.1,
    }
    setAssets((prev) => [...prev, newAsset])
  }

  const removeAsset = (id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id))
  }

  const handleSave = () => {
    const filtered = assets.filter((asset) => asset.symbol.trim().length > 0)
    if (!filtered.length) {
      setStatus(text.needAsset)
      return
    }

    const normalizedAssets = filtered.map((asset) => ({
      ...asset,
      symbol: asset.symbol.toUpperCase(),
      weight: asset.weight < 0 ? 0 : asset.weight,
    }))

    const total = normalizedAssets.reduce((sum, asset) => sum + asset.weight, 0)
    if (total === 0) {
      setStatus(text.zeroAllocation)
      return
    }

    const adjustedAssets = normalizedAssets.map((asset) => ({
      ...asset,
      weight: Number((asset.weight / total).toFixed(6)),
    }))

    const nextPortfolio: Portfolio = {
      ...portfolio,
      name: name.trim() || 'My Portfolio',
      description: description.trim() || undefined,
      baseCurrency: baseCurrency.trim().toUpperCase() || 'USD',
      assets: adjustedAssets.map((asset) => ({
        asset: {
          id: asset.id,
          symbol: asset.symbol,
          name: asset.name.trim() || asset.symbol,
          type: asset.type,
        },
        weight: asset.weight,
      })),
      updatedAt: new Date().toISOString(),
    }

    onSave(nextPortfolio)
    setStatus(text.success)
  }

  return (
    <section className={`${glassCard} space-y-6 p-6`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_30%)]" />
      <div className="relative space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{text.title}</h2>
            <p className="text-sm text-slate-300">{text.subtitle}</p>
          </div>
          <div className="flex gap-3 text-sm">
            <button
              type="button"
              onClick={addAsset}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-semibold text-white transition hover:border-primary/60 hover:text-primary shadow-sm"
            >
              {text.addAsset}
            </button>
            {onReset ? (
              <button
                type="button"
                onClick={onReset}
                className="rounded-lg border border-rose-400/50 bg-rose-500/10 px-3 py-2 font-semibold text-rose-50 transition hover:border-rose-300 hover:text-white shadow-sm"
              >
                {text.reset}
              </button>
            ) : null}
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
            {text.name}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
            {text.description}
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
            {text.currency}
            <input
              value={baseCurrency}
              maxLength={5}
              onChange={(event) => setBaseCurrency(event.target.value.toUpperCase())}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm text-slate-100">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">{text.ticker}</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">
                  {text.assetName}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">{text.type}</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">{text.weight}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/5">
              {assets.map((asset) => (
                <tr key={asset.id} className="transition hover:bg-white/10">
                  <td className="px-4 py-3">
                    <input
                      value={asset.symbol}
                      onChange={(event) => updateAsset(asset.id, { symbol: event.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={asset.name}
                      onChange={(event) => updateAsset(asset.id, { name: event.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={asset.type}
                      onChange={(event) =>
                        updateAsset(asset.id, { type: event.target.value as AssetType })
                      }
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {assetTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={asset.weight}
                      onChange={(event) =>
                        updateAsset(asset.id, { weight: Number(event.target.value) })
                      }
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-right text-sm text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeAsset(asset.id)}
                      className="rounded-lg border border-rose-300/70 bg-rose-500/15 px-2 py-1 text-xs font-semibold text-rose-50 transition hover:border-rose-200 hover:bg-rose-500/25 shadow-sm"
                    >
                      {text.remove}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-200">
          <span>
            {text.total}:{' '}
            <strong className={weightWarning ? 'text-rose-300' : 'text-white'}>
              {totalWeight.toFixed(3)}
            </strong>
          </span>
          <div className="flex items-center gap-3">
            {status ? <span>{status}</span> : null}
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              {text.save}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
