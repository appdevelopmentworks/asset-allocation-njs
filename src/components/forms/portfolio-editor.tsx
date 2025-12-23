'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from '@/components/providers/locale-provider'
import { mockPortfolioLabels } from '@/lib/constants/mock-data'
import type { AssetType, Portfolio } from '@/lib/types'
import { normalizeSymbol } from '@/lib/utils/symbols'

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
  'relative overflow-hidden rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 shadow-2xl shadow-black/50 text-white'

const getLocalizedPortfolioDefaults = (portfolio: Portfolio, locale: 'ja' | 'en') => {
  const nameMatches =
    portfolio.name === mockPortfolioLabels.ja.name || portfolio.name === mockPortfolioLabels.en.name
  const description = portfolio.description ?? ''
  const descriptionMatches =
    description === mockPortfolioLabels.ja.description ||
    description === mockPortfolioLabels.en.description

  return {
    name: nameMatches ? mockPortfolioLabels[locale].name : portfolio.name,
    description: descriptionMatches ? mockPortfolioLabels[locale].description : description,
  }
}

export function PortfolioEditor({ portfolio, onSave, onReset }: PortfolioEditorProps) {
  const { locale } = useLocale()
  const localizedDefaults = useMemo(
    () => getLocalizedPortfolioDefaults(portfolio, locale),
    [portfolio, locale],
  )
  const [name, setName] = useState(localizedDefaults.name)
  const [description, setDescription] = useState(localizedDefaults.description)
  const [baseCurrency, setBaseCurrency] = useState(portfolio.baseCurrency ?? 'USD')
  const [assets, setAssets] = useState<DraftAsset[]>(createDraftAssets(portfolio))
  const [status, setStatus] = useState<string | null>(null)
  const nameFetchTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  useEffect(() => {
    const nextDefaults = getLocalizedPortfolioDefaults(portfolio, locale)
    setName(nextDefaults.name)
    setDescription(nextDefaults.description)
    setBaseCurrency(portfolio.baseCurrency ?? 'USD')
    setAssets(createDraftAssets(portfolio))
    setStatus(null)
  }, [portfolio, locale])

  useEffect(() => {
    return () => {
      nameFetchTimers.current.forEach((timer) => clearTimeout(timer))
      nameFetchTimers.current.clear()
    }
  }, [])

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

  const resolveAssetName = async (id: string, rawSymbol: string) => {
    const symbol = normalizeSymbol(rawSymbol)
    if (!symbol) {
      return
    }

    try {
      const response = await fetch(`/api/assets/search?query=${encodeURIComponent(symbol)}`)
      if (!response.ok) {
        return
      }
      const data = (await response.json()) as {
        results?: Array<{
          symbol?: string
          shortname?: string
          longname?: string
        }>
      }
      const results = Array.isArray(data.results) ? data.results : []
      const matched =
        results.find((item) => item.symbol && normalizeSymbol(item.symbol) === symbol) ?? results[0]
      const resolvedName = matched?.longname || matched?.shortname

      if (resolvedName) {
        setAssets((prev) =>
          prev.map((asset) =>
            asset.id === id
              ? (() => {
                  const shouldOverwrite =
                    !asset.name.trim() ||
                    asset.name.trim().toUpperCase() === asset.symbol.trim().toUpperCase()
                  return {
                    ...asset,
                    symbol,
                    name: shouldOverwrite ? resolvedName : asset.name,
                  }
                })()
              : asset,
          ),
        )
      }
    } catch (error) {
      console.error('[portfolio-editor] failed to resolve asset name', error)
    }
  }

  const handleSymbolChange = (id: string, value: string) => {
    updateAsset(id, { symbol: value })

    const existingTimer = nameFetchTimers.current.get(id)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    const nextTimer = setTimeout(() => {
      resolveAssetName(id, value)
    }, 400)

    nameFetchTimers.current.set(id, nextTimer)
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
      symbol: normalizeSymbol(asset.symbol),
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_70%_40%,rgba(168,85,247,0.1),transparent_50%)]" />
      <div className="relative space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white">{text.title}</h2>
            <p className="text-sm text-slate-300/90">{text.subtitle}</p>
          </div>
          <div className="flex gap-3 text-sm">
            <button
              type="button"
              onClick={addAsset}
              className="rounded-lg border border-indigo-400/30 bg-indigo-500/20 px-4 py-2 text-sm font-bold text-indigo-200 shadow-lg transition hover:bg-indigo-500/30"
            >
              {text.addAsset}
            </button>
            {onReset ? (
              <button
                type="button"
                onClick={onReset}
                className="rounded-lg border border-rose-400/30 bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-200 shadow-lg transition hover:bg-rose-500/30"
              >
                {text.reset}
              </button>
            ) : null}
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300/90">
            {text.name}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-2 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300/90">
            {text.description}
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-2 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300/90">
            {text.currency}
            <input
              value={baseCurrency}
              maxLength={5}
              onChange={(event) => setBaseCurrency(event.target.value.toUpperCase())}
              className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-2 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-700/50">
          <table className="min-w-full divide-y divide-slate-700/50 text-sm">
            <thead className="bg-slate-800/80 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-300">{text.ticker}</th>
                <th className="px-4 py-3 text-left font-bold text-slate-300">
                  {text.assetName}
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-300">{text.type}</th>
                <th className="px-4 py-3 text-right font-bold text-slate-300">{text.weight}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 bg-slate-800/40">
              {assets.map((asset) => (
                <tr key={asset.id} className="transition-colors hover:bg-slate-700/40">
                  <td className="px-4 py-3">
                    <input
                      value={asset.symbol}
                      onChange={(event) => handleSymbolChange(asset.id, event.target.value)}
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-800/60 px-2 py-1 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={asset.name}
                      onChange={(event) => updateAsset(asset.id, { name: event.target.value })}
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-800/60 px-2 py-1 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={asset.type}
                      onChange={(event) =>
                        updateAsset(asset.id, { type: event.target.value as AssetType })
                      }
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-800/60 px-2 py-1 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      {assetTypes.map((type) => (
                        <option key={type} value={type} className="bg-slate-900">
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
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-800/60 px-2 py-1 text-right text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeAsset(asset.id)}
                      className="rounded-lg border border-rose-400/30 bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-200 shadow-sm transition hover:bg-rose-500/30"
                    >
                      {text.remove}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-700/50 pt-6 text-sm">
          <span className="font-bold text-slate-300">
            {text.total}:{' '}
            <strong className={weightWarning ? 'text-rose-400' : 'text-emerald-400'}>
              {(totalWeight * 100).toFixed(1)}%
            </strong>
          </span>
          <div className="flex items-center gap-4">
            {status ? <span className="font-bold text-emerald-400">{status}</span> : null}
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500"
            >
              {text.save}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
