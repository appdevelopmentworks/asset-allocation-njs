'use client'

import { useState } from 'react'
import { useLocale } from '@/components/providers/locale-provider'

interface ReportExportButtonProps {
  data: unknown
  filename?: string
}

export function ReportExportButton({ data, filename }: ReportExportButtonProps) {
  const { t, locale } = useLocale()
  const [isExporting, setIsExporting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleExport = () => {
    try {
      setIsExporting(true)
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename ?? `portfolio-report-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setMessage(t('report.export.success'))
    } catch (error) {
      console.error('Failed to export report', error)
      setMessage(
        locale === 'ja' ? 'レポートのエクスポートに失敗しました。' : 'Failed to export report',
      )
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className="rounded-lg border px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExporting ? (locale === 'ja' ? 'エクスポート中…' : 'Exporting…') : t('report.export')}
      </button>
      {message ? <span>{message}</span> : null}
    </div>
  )
}
