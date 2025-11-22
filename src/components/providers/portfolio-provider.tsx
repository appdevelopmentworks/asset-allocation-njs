'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { mockPortfolio } from '@/lib/constants/mock-data'
import { readJSON, removeItem, writeJSON } from '@/lib/storage/local-storage'
import type { Portfolio, SimulationSettings } from '@/lib/types'
import { isPortfolioLike, normalizePortfolio, type PortfolioLike } from '@/lib/utils/portfolio'

const PORTFOLIO_KEY = 'asset-allocation:portfolio'
const SIMULATION_KEY = 'asset-allocation:simulation'

const defaultSimulation: SimulationSettings = {
  assets: mockPortfolio.assets.map(({ asset }) => asset.symbol),
  range: '3Y',
  trials: 5000,
  rebalance: 'quarterly',
}

interface PortfolioContextValue {
  portfolio: Portfolio
  updatePortfolio: (updater: (current: Portfolio) => Portfolio) => void
  replacePortfolio: (next: Portfolio) => void
  resetPortfolio: () => void
  simulation: SimulationSettings
  setSimulation: (settings: SimulationSettings) => void
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio>(mockPortfolio)
  const [simulation, setSimulationState] = useState<SimulationSettings>(defaultSimulation)

  useEffect(() => {
    const storedPortfolio = readJSON<PortfolioLike | null>(PORTFOLIO_KEY, null)
    const storedSimulation = readJSON<SimulationSettings | null>(SIMULATION_KEY, null)

    if (storedPortfolio && isPortfolioLike(storedPortfolio)) {
      try {
        setPortfolio(normalizePortfolio(storedPortfolio))
      } catch (error) {
        console.warn('[portfolio] Failed to normalize stored portfolio', error)
      }
    }

    if (storedSimulation) {
      setSimulationState(storedSimulation)
    }
  }, [])

  useEffect(() => {
    writeJSON(PORTFOLIO_KEY, portfolio)
  }, [portfolio])

  useEffect(() => {
    writeJSON(SIMULATION_KEY, simulation)
  }, [simulation])

  useEffect(() => {
    const availableSymbols = portfolio.assets.map(({ asset }) => asset.symbol)
    setSimulationState((prev) => {
      const filtered = prev.assets.filter((symbol) => availableSymbols.includes(symbol))
      const nextAssets = filtered.length ? filtered : availableSymbols.slice(0, 3)
      if (
        nextAssets.length === prev.assets.length &&
        nextAssets.every((symbol, idx) => symbol === prev.assets[idx])
      ) {
        return prev
      }
      return { ...prev, assets: nextAssets }
    })
  }, [portfolio.assets])

  const value = useMemo<PortfolioContextValue>(
    () => ({
      portfolio,
      updatePortfolio: (updater) => {
        setPortfolio((current) => {
          const next = normalizePortfolio(updater(current))
          return {
            ...next,
            updatedAt: new Date().toISOString(),
          }
        })
      },
      replacePortfolio: (next) => {
        setPortfolio({
          ...normalizePortfolio(next),
          updatedAt: new Date().toISOString(),
        })
      },
      resetPortfolio: () => {
        setPortfolio(mockPortfolio)
        setSimulationState(defaultSimulation)
        removeItem(PORTFOLIO_KEY)
        removeItem(SIMULATION_KEY)
      },
      simulation,
      setSimulation: (settings) => {
        setSimulationState(settings)
      },
    }),
    [portfolio, simulation],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider')
  }
  return context
}
