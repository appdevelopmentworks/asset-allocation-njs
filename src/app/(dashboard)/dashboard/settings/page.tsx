'use client'

import { SectionCard } from '@/components/ui/section-card'
import { mockUserPreferences } from '@/lib/constants/mock-data'
import { useLocale } from '@/components/providers/locale-provider'

export default function SettingsPage() {
  const { locale } = useLocale()
  const text =
    locale === 'ja'
      ? {
          title: '環境設定',
          description:
            '通貨や通知設定、アクセシビリティオプションを管理します。現在はモックデータを表示しており、将来的にはユーザーごとのSupabase プロファイルで保存します。',
          generalTitle: '一般設定',
          notificationsTitle: '通知設定',
          roadmapTitle: '今後の拡張計画',
          roadmapDescription:
            'UI/UX ガイドラインに基づき、設定画面には以下の機能を追加予定です。',
          labels: {
            currency: '基準通貨',
            locale: '表示ロケール',
            contrast: 'コントラストモード',
            animation: 'アニメーション',
            animationReduced: '軽減する',
            animationDefault: '標準',
            enabled: 'ON',
            disabled: 'OFF',
          },
          notifications: [
            {
              label: 'リバランス提案',
              description: '資産配分が閾値を超えた場合に通知を受け取ります。',
              enabled: mockUserPreferences.notifications.rebalanceSuggestions,
            },
            {
              label: 'リスクアラート',
              description: '相関変化や突然のボラティリティ上昇をメールで受け取ります。',
              enabled: mockUserPreferences.notifications.riskAlerts,
            },
            {
              label: '週間サマリー',
              description: '主要イベントやパフォーマンスを週次で振り返ります。',
              enabled: mockUserPreferences.notifications.weeklyDigest,
            },
          ],
          roadmap: [
            'Supabase Auth と連携したユーザープロファイル編集',
            '通知チャネル（メール / Web Push）の選択',
            '多言語切替とテーマプリセットの保存',
          ],
        }
      : {
          title: 'Settings',
          description:
            'Manage currency, notifications, and accessibility options. Mock data is shown for now and will be stored per-user in Supabase profiles.',
          generalTitle: 'General',
          notificationsTitle: 'Notifications',
          roadmapTitle: 'Upcoming Improvements',
          roadmapDescription:
            'Based on the UI/UX guidelines, the settings screen will include the following features.',
          labels: {
            currency: 'Base Currency',
            locale: 'Locale',
            contrast: 'Contrast Mode',
            animation: 'Animation',
            animationReduced: 'Reduced',
            animationDefault: 'Standard',
            enabled: 'ON',
            disabled: 'OFF',
          },
          notifications: [
            {
              label: 'Rebalance suggestions',
              description: 'Notify when allocation drifts beyond the threshold.',
              enabled: mockUserPreferences.notifications.rebalanceSuggestions,
            },
            {
              label: 'Risk alerts',
              description: 'Email alerts for correlation shifts or volatility spikes.',
              enabled: mockUserPreferences.notifications.riskAlerts,
            },
            {
              label: 'Weekly summary',
              description: 'Weekly recap of key events and performance.',
              enabled: mockUserPreferences.notifications.weeklyDigest,
            },
          ],
          roadmap: [
            'User profile editing with Supabase Auth',
            'Notification channel selection (email / web push)',
            'Save language and theme presets',
          ],
        }
  const displayLocale = locale === 'ja' ? mockUserPreferences.locale : 'en-US'

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{text.title}</h1>
        <p className="text-sm text-muted-foreground">{text.description}</p>
      </header>

      <SectionCard title={text.generalTitle}>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {text.labels.currency}
            </dt>
            <dd className="mt-1 font-medium text-foreground">{mockUserPreferences.baseCurrency}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {text.labels.locale}
            </dt>
            <dd className="mt-1 font-medium text-foreground">{displayLocale}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {text.labels.contrast}
            </dt>
            <dd className="mt-1 font-medium text-foreground">
              {mockUserPreferences.accessibility.contrastMode}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {text.labels.animation}
            </dt>
            <dd className="mt-1 font-medium text-foreground">
              {mockUserPreferences.accessibility.reducedMotion
                ? text.labels.animationReduced
                : text.labels.animationDefault}
            </dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard title={text.notificationsTitle}>
        <ul className="space-y-4">
          {text.notifications.map((setting) => (
            <li
              key={setting.label}
              className="flex items-start justify-between gap-4 rounded-lg border bg-background/70 p-4"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{setting.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{setting.description}</p>
              </div>
              <span
                className={
                  setting.enabled
                    ? 'rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600'
                    : 'rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground'
                }
              >
                {setting.enabled ? text.labels.enabled : text.labels.disabled}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title={text.roadmapTitle}
        description={text.roadmapDescription}
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {text.roadmap.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
