'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultLocale, getDictionary, type Locale } from '@/lib/i18n/dictionaries'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const LOCALE_STORAGE_KEY = 'asset-allocation:locale'

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === 'ja' || stored === 'en') {
      setLocale(stored)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const dictionary = useMemo(() => getDictionary(locale), [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale: () => setLocale((prev) => (prev === 'ja' ? 'en' : 'ja')),
      t: (key: string) => dictionary[key] ?? key,
    }),
    [dictionary, locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}
