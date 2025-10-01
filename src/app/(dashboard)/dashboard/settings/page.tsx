import { SectionCard } from '@/components/ui/section-card'
import { mockUserPreferences } from '@/lib/constants/mock-data'

const notificationSettings = [
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
]

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">環境設定</h1>
        <p className="text-sm text-muted-foreground">
          通貨や通知設定、アクセシビリティオプションを管理します。現在はモックデータを表示しており、将来的にはユーザーごとの
          Supabase プロファイルで保存します。
        </p>
      </header>

      <SectionCard title="一般設定">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              基準通貨
            </dt>
            <dd className="mt-1 font-medium text-foreground">{mockUserPreferences.baseCurrency}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              表示ロケール
            </dt>
            <dd className="mt-1 font-medium text-foreground">{mockUserPreferences.locale}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              コントラストモード
            </dt>
            <dd className="mt-1 font-medium text-foreground">
              {mockUserPreferences.accessibility.contrastMode}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              アニメーション
            </dt>
            <dd className="mt-1 font-medium text-foreground">
              {mockUserPreferences.accessibility.reducedMotion ? '軽減する' : '標準'}
            </dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard title="通知設定">
        <ul className="space-y-4">
          {notificationSettings.map((setting) => (
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
                {setting.enabled ? 'ON' : 'OFF'}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="今後の拡張計画"
        description="UI/UX ガイドラインに基づき、設定画面には以下の機能を追加予定です。"
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Supabase Auth と連携したユーザープロファイル編集</li>
          <li>通知チャネル（メール / Web Push）の選択</li>
          <li>多言語切替とテーマプリセットの保存</li>
        </ul>
      </SectionCard>
    </div>
  )
}
