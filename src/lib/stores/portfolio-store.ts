import { create } from 'zustand'
import type { Portfolio } from '@/lib/types'

interface PortfolioState {
  portfolio: Portfolio | null
  setPortfolio: (portfolio: Portfolio) => void
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: null,
  setPortfolio: (portfolio) => set({ portfolio }),
}))
