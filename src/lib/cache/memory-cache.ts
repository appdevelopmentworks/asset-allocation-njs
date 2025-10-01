interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class MemoryCache<T = unknown> {
  private store = new Map<string, CacheEntry<T>>()

  constructor(private defaultTtlMs = 1000 * 60 * 5) {}

  get(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) {
      return null
    }

    if (entry.expiresAt < Date.now()) {
      this.store.delete(key)
      return null
    }

    return entry.value
  }

  set(key: string, value: T, ttlMs?: number) {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs)
    this.store.set(key, { value, expiresAt })
  }

  delete(key: string) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }
}

export const marketDataCache = new MemoryCache<unknown>()
