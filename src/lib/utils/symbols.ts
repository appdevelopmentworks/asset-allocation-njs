const JP_STOCK_CODE_REGEX = /^(?=.*\d)[0-9A-Z]{4}$/

export function normalizeSymbol(input: string): string {
  const normalized = input.trim().toUpperCase()
  if (!normalized) {
    return normalized
  }
  if (JP_STOCK_CODE_REGEX.test(normalized)) {
    return `${normalized}.T`
  }
  return normalized
}
