export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn(`[localStorage] Failed to parse key ${key}`, error)
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`[localStorage] Failed to write key ${key}`, error)
  }
}

export function removeItem(key: string) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`[localStorage] Failed to remove key ${key}`, error)
  }
}
