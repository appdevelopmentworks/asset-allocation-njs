import Link from 'next/link'

const features = [
  {
    title: 'リアルタイム市場データ',
    description: 'Yahoo Financeから取得した最新の価格情報で迅速な意思決定。',
  },
  {
    title: '高度な最適化エンジン',
    description: '最大シャープレシオ、最小分散、リスクパリティなど複数の戦略を搭載。',
  },
  {
    title: 'インタラクティブな可視化',
    description: '効率的フロンティアや相関ヒートマップでリスクとリターンを直感的に把握。',
  },
  {
    title: 'モバイルファースト設計',
    description: 'デバイスを問わないレスポンシブUIとアクセシビリティに配慮した操作性。',
  },
]

const highlights = [
  'Next.js 16 App Router + TypeScriptで構築',
  'TailwindCSSとshadcn/uiによる洗練されたUI',
  'ZustandとSWRで実現するスケーラブルな状態管理',
  'Supabase・Redisと連携した堅牢なバックエンド基盤',
]

const glassCard =
  'rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/10 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md'

const heroFocuses = [
  {
    title: 'ポートフォリオ情報',
    description: '資産配分や通貨を一元管理し、ローカルストレージで安全に保持します。',
  },
  {
    title: 'シミュレーション設定',
    description: '期間・回数・リバランス頻度を揃え、再現性のあるバックテストを即時実行。',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      <section className="relative isolate overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="absolute inset-x-16 top-[-10rem] h-64 rotate-12 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute inset-x-4 bottom-[-8rem] h-52 -rotate-6 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-6xl">
          <div className={`relative overflow-hidden ${glassCard} p-8 lg:p-12 ring-1 ring-white/10`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_30%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr,0.9fr]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary ring-1 ring-primary/20">
                  <span>Asset Allocation Tool</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                  <span>Next.js 16</span>
                </div>
                <div className="space-y-4">
                  <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    リアルタイムデータで最適なポートフォリオ戦略をデザイン
                  </h1>
                  <p className="text-balance text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                    モダンな投資家のために設計されたNext.jsアプリケーション。効率的フロンティア、
                    モンテカルロシミュレーション、リスク分析を一つのダッシュボードで提供します。
                  </p>
                </div>
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    ダッシュボードを見る
                  </Link>
                  <Link
                    href="/manual"
                    className="inline-flex items-center justify-center rounded-lg border border-primary/40 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    ユーザー マニュアル
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {heroFocuses.map((item) => (
                    <div key={item.title} className={`${glassCard} rounded-xl p-4`}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${glassCard} space-y-4 p-6 shadow-inner`}>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  開発ハイライト
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className={`${glassCard} flex items-start gap-3 rounded-lg border-white/5 bg-white/5 px-3 py-2 shadow-sm`}
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-2 gap-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <div
                    className={`${glassCard} rounded-lg border-white/10 bg-white/5 p-3 text-foreground shadow-sm`}
                  >
                    リアルタイムデータ
                    <p className="mt-1 text-sm font-semibold text-primary">即時反映</p>
                  </div>
                  <div
                    className={`${glassCard} rounded-lg border-white/10 bg-white/5 p-3 text-foreground shadow-sm`}
                  >
                    シミュレーション
                    <p className="mt-1 text-sm font-semibold text-primary">1000+回</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[2fr,1fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">プロダクトのコアバリュー</h2>
            <p className="mt-3 text-base text-muted-foreground">
              要求定義書と詳細設計書に基づき、初期リリースでカバーする必須要件を満たす基盤を整備します。
            </p>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className={`${glassCard} rounded-xl border-white/10 bg-white/5 p-6 transition hover:shadow-lg`}
                >
                  <dt className="text-base font-semibold text-foreground">{feature.title}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className={`${glassCard} p-6`}>
            <h3 className="text-lg font-semibold text-foreground">開発ハイライト</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-card/60 px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">初期実装ロードマップ</h2>
            <ol className="mt-6 space-y-5 text-sm text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">1. プロジェクトセットアップ</span>
                <p className="mt-2">
                  Next.js
                  16、TailwindCSS、shadcn/ui、Zustandなどドキュメントで定義された開発環境を構築します。
                </p>
              </li>
              <li>
                <span className="font-semibold text-foreground">2. UI フレーム構築</span>
                <p className="mt-2">
                  レイアウト、ヘッダー、サイドバーを含むダッシュボードの土台を作成し、レスポンシブガイドに従ってデザインを整えます。
                </p>
              </li>
              <li>
                <span className="font-semibold text-foreground">3. データレイヤー整備</span>
                <p className="mt-2">
                  Yahoo Finance
                  APIクライアント、キャッシュ戦略、型定義、計算ユーティリティを段階的に実装します。
                </p>
              </li>
              <li>
                <span className="font-semibold text-foreground">4. チャート・分析機能</span>
                <p className="mt-2">
                  効率的フロンティアや配分チャートなど、主要な可視化コンポーネントを組み込みます。
                </p>
              </li>
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">次のアクション</h2>
            <div className={`${glassCard} mt-6 space-y-5 p-6`}>
              <div>
                <p className="text-sm font-semibold text-foreground">環境変数テンプレートを作成</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  `.env.example` に必要なAPIキーと接続情報を定義して、環境構築をスムーズにします。
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">UI コンポーネントの導入</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  shadcn/uiの初期セットを追加し、フォームや入力コンポーネントを整備します。
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">CI/CD とテストベースライン</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  GitHub Actions、Jest、Playwrightの設定を加え、品質基準を早期に確立します。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
