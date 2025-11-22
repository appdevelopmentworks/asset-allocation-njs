const EPSILON = 1e-6

export interface OptimizationConstraints {
  minWeight?: number
  maxWeight?: number
}

export interface EfficientFrontierPoint {
  weights: number[]
  return: number
  risk: number
}

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max)

function average(values: number[]): number {
  if (!values.length) {
    return 0
  }
  const sum = values.reduce((total, value) => total + value, 0)
  return sum / values.length
}

function variance(values: number[]): number {
  if (values.length <= 1) {
    return 0
  }
  const mean = average(values)
  const sum = values.reduce((total, value) => total + (value - mean) ** 2, 0)
  return sum / (values.length - 1)
}

function standardDeviation(values: number[]): number {
  const result = Math.sqrt(Math.max(variance(values), 0))
  return Number.isFinite(result) ? result : 0
}

function normalize(weights: number[]): number[] {
  const positive = weights.map((weight) => (weight > 0 && Number.isFinite(weight) ? weight : 0))
  const total = positive.reduce((sum, weight) => sum + weight, 0)
  if (total <= EPSILON) {
    return positive.map(() => 1 / positive.length)
  }
  return positive.map((weight) => weight / total)
}

function applyConstraints(weights: number[], constraints?: OptimizationConstraints): number[] {
  if (!constraints) {
    return normalize(weights)
  }

  const minWeight = constraints.minWeight ?? 0
  const maxWeight = constraints.maxWeight ?? 1
  let result = normalize(weights).map((weight) => clamp(weight, minWeight, maxWeight))

  for (let iteration = 0; iteration < 5; iteration += 1) {
    let adjusted = false
    result = result.map((weight) => {
      if (weight < minWeight - EPSILON) {
        adjusted = true
        return minWeight
      }
      if (weight > maxWeight + EPSILON) {
        adjusted = true
        return maxWeight
      }
      return weight
    })

    const total = result.reduce((sum, weight) => sum + weight, 0)
    if (Math.abs(total - 1) < EPSILON) {
      return result
    }

    if (total > 1 + EPSILON) {
      const adjustable = result.map((weight) => Math.max(0, weight - minWeight))
      const adjustableSum = adjustable.reduce((sum, value) => sum + value, 0)
      if (adjustableSum <= EPSILON) {
        break
      }
      const excess = total - 1
      result = result.map((weight, index) => {
        if (adjustable[index] <= EPSILON) {
          return weight
        }
        const delta = (excess * adjustable[index]) / adjustableSum
        return weight - delta
      })
      adjusted = true
    } else if (total < 1 - EPSILON) {
      const adjustable = result.map((weight) => Math.max(0, maxWeight - weight))
      const adjustableSum = adjustable.reduce((sum, value) => sum + value, 0)
      if (adjustableSum <= EPSILON) {
        break
      }
      const deficit = 1 - total
      result = result.map((weight, index) => {
        if (adjustable[index] <= EPSILON) {
          return weight
        }
        const delta = (deficit * adjustable[index]) / adjustableSum
        return weight + delta
      })
      adjusted = true
    }

    if (!adjusted) {
      break
    }
  }

  return normalize(result).map((weight) => clamp(weight, minWeight, maxWeight))
}

function covarianceMatrix(assetReturns: number[][]): number[][] {
  const assetCount = assetReturns.length
  const matrix = Array.from({ length: assetCount }, () => Array(assetCount).fill(0))

  for (let i = 0; i < assetCount; i += 1) {
    for (let j = i; j < assetCount; j += 1) {
      const seriesA = assetReturns[i]
      const seriesB = assetReturns[j]
      const length = Math.min(seriesA.length, seriesB.length)
      if (length <= 1) {
        matrix[i][j] = 0
        matrix[j][i] = 0
        continue
      }
      const meanA = average(seriesA)
      const meanB = average(seriesB)
      let sum = 0
      for (let index = 0; index < length; index += 1) {
        sum += (seriesA[index] - meanA) * (seriesB[index] - meanB)
      }
      const covariance = sum / (length - 1)
      matrix[i][j] = covariance
      matrix[j][i] = covariance
    }
  }

  return matrix
}

function quadraticForm(weights: number[], matrix: number[][]): number {
  let sum = 0
  for (let i = 0; i < weights.length; i += 1) {
    for (let j = 0; j < weights.length; j += 1) {
      sum += weights[i] * weights[j] * (matrix[i]?.[j] ?? 0)
    }
  }
  return sum
}

export function optimizeMaxSharpe(
  assetReturns: number[][],
  constraints?: OptimizationConstraints,
): number[] {
  const scores = assetReturns.map((series) => {
    const mean = average(series)
    const vol = standardDeviation(series)
    if (!vol) {
      return mean
    }
    return mean / vol
  })

  const normalized = normalize(scores.map((score) => Math.max(score, 0)))
  return applyConstraints(normalized, constraints)
}

export function optimizeMinVariance(
  assetReturns: number[][],
  constraints?: OptimizationConstraints,
): number[] {
  const inverseVariance = assetReturns.map((series) => {
    const varValue = variance(series)
    return varValue > 0 ? 1 / varValue : 1
  })

  return applyConstraints(inverseVariance, constraints)
}

export function optimizeMaxReturn(
  assetReturns: number[][],
  constraints?: OptimizationConstraints,
): number[] {
  const expectedReturns = assetReturns.map((series) => {
    const mean = average(series)
    if (!Number.isFinite(mean)) {
      return 0
    }
    return Math.max(mean, 0)
  })

  return applyConstraints(expectedReturns, constraints)
}

export function optimizeRiskParity(
  assetReturns: number[][],
  constraints?: OptimizationConstraints,
): number[] {
  const inverseVol = assetReturns.map((series) => {
    const vol = standardDeviation(series)
    return vol > 0 ? 1 / vol : 1
  })

  return applyConstraints(inverseVol, constraints)
}

export function calculateEfficientFrontier(
  assetReturns: number[][],
  points = 50,
  constraints?: OptimizationConstraints,
): EfficientFrontierPoint[] {
  if (!assetReturns.length) {
    return []
  }

  const sanitizedPoints = points < 2 ? 2 : points
  const meanVector = assetReturns.map((series) => average(series))
  const covMatrix = covarianceMatrix(assetReturns)

  const anchors = [
    optimizeMinVariance(assetReturns, constraints),
    optimizeRiskParity(assetReturns, constraints),
    optimizeMaxReturn(assetReturns, constraints),
    optimizeMaxSharpe(assetReturns, constraints),
  ]
    .map((weights) => ({
      weights,
      stats: calculatePortfolioStats(weights, meanVector, covMatrix),
    }))
    .sort((a, b) => a.stats.risk - b.stats.risk)

  const results: EfficientFrontierPoint[] = []

  for (let index = 0; index < sanitizedPoints; index += 1) {
    const position = (index / (sanitizedPoints - 1)) * (anchors.length - 1)
    const startIndex = Math.floor(position)
    const endIndex = Math.min(anchors.length - 1, startIndex + 1)
    const localT = position - startIndex

    const start = anchors[startIndex]
    const end = anchors[endIndex]

    let blended = start.weights.map(
      (weight, i) => weight * (1 - localT) + end.weights[i] * localT,
    )
    blended = applyConstraints(blended, constraints)

    const stats = calculatePortfolioStats(blended, meanVector, covMatrix)

    results.push({
      weights: blended,
      return: Number(stats.return.toFixed(6)),
      risk: Number(stats.risk.toFixed(6)),
    })
  }

  const sorted = results.sort((a, b) => a.risk - b.risk)

  let lastReturn = sorted[0]?.return ?? 0
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].return <= lastReturn) {
      const epsilon = Math.max(Math.abs(lastReturn) * 1e-6, 1e-6)
      sorted[i].return = Number((lastReturn + epsilon).toFixed(6))
    }
    lastReturn = sorted[i].return
  }

  return sorted
}

function calculatePortfolioStats(
  weights: number[],
  meanVector: number[],
  covMatrix: number[][],
) {
  const portfolioReturn = weights.reduce((sum, weight, i) => sum + weight * meanVector[i], 0)
  const portfolioRisk = Math.sqrt(Math.max(0, quadraticForm(weights, covMatrix)))
  return { return: portfolioReturn, risk: portfolioRisk }
}
