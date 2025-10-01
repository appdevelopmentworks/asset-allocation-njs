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
  'Next.js 15 App Router + TypeScriptで構築',
  'TailwindCSSとshadcn/uiによる洗練されたUI',
  'ZustandとSWRで実現するスケーラブルな状態管理',
  'Supabase・Redisと連携した堅牢なバックエンド基盤',
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      <section className="relative isolate overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Asset Allocation Tool
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            リアルタイムデータで最適なポートフォリオ戦略をデザイン
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            モダンな投資家のために設計されたNext.jsアプリケーション。効率的フロンティア、
            モンテカルロシミュレーション、リスク分析を一つのダッシュボードで提供します。
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              ダッシュボードを見る
            </Link>
            <Link
              href="/docs/getting-started"
              className="text-sm font-semibold text-foreground underline-offset-4 transition hover:underline"
            >
              ドキュメントを確認
            </Link>
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
                  className="rounded-xl border bg-card p-6 shadow-sm transition hover:shadow"
                >
                  <dt className="text-base font-semibold text-foreground">{feature.title}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="rounded-2xl border bg-card p-6 shadow-sm">
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
                  15、TailwindCSS、shadcn/ui、Zustandなどドキュメントで定義された開発環境を構築します。
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
            <div className="mt-6 space-y-5 rounded-2xl border bg-background p-6 shadow-sm">
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
