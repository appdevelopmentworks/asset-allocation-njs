import {
  calculateEfficientFrontier,
  optimizeMaxReturn,
  optimizeMaxSharpe,
  optimizeMinVariance,
  optimizeRiskParity,
} from '@/lib/calculations/optimization'

describe('Portfolio Optimization', () => {
  const mockReturns = [
    [0.01, 0.02, -0.01, 0.03],
    [0.015, -0.005, 0.02, 0.01],
    [0.005, 0.01, 0.015, -0.01],
  ]
  describe('optimizeMaxSharpe', () => {
    it('returns normalized weights', () => {
      const weights = optimizeMaxSharpe(mockReturns)
      expect(weights).toHaveLength(3)
      expect(weights.every((weight) => weight >= 0 && weight <= 1)).toBe(true)
      expect(weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 6)
    })

    it('applies min/max constraints', () => {
      const weights = optimizeMaxSharpe(mockReturns, { minWeight: 0.1, maxWeight: 0.5 })
      expect(weights.every((weight) => weight >= 0.1 && weight <= 0.5)).toBe(true)
      expect(weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 6)
    })
  })

  it('optimizes for minimum variance', () => {
    const weights = optimizeMinVariance(mockReturns)
    expect(weights).toHaveLength(3)
    expect(weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 6)
  })

  it('optimizes for risk parity', () => {
    const weights = optimizeRiskParity(mockReturns)
    expect(weights).toHaveLength(3)
    expect(weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 6)
  })

  describe('calculateEfficientFrontier', () => {
    it('creates monotonically increasing risk/return pairs', () => {
      const frontier = calculateEfficientFrontier(mockReturns, 50)
      expect(frontier).toHaveLength(50)
      expect(frontier[0].risk).toBeLessThan(frontier[49].risk)
      expect(frontier[0].return).toBeLessThan(frontier[49].return)
      frontier.forEach((point) => {
        expect(point.weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 6)
      })
    })
  })
  describe('optimizeMaxReturn', () => {
    it('prioritizes assets with higher expected returns', () => {
      const weights = optimizeMaxReturn(mockReturns)
      expect(weights).toHaveLength(3)
      expect(weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 6)
      expect(weights[0]).toBeGreaterThan(weights[1])
      expect(weights[1]).toBeGreaterThan(weights[2])
    })

    it('respects allocation constraints', () => {
      const weights = optimizeMaxReturn(mockReturns, { minWeight: 0.2, maxWeight: 0.5 })
      expect(weights.every((weight) => weight >= 0.2 && weight <= 0.5)).toBe(true)
      expect(weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 6)
    })
  })
})
