import Link from 'next/link'

const steps = [
  'Node.js 20 以上と pnpm 8 以上をインストールし、Corepack で pnpm を有効化します。',
  'リポジトリをクローンしたら、ルートディレクトリで `pnpm install` を実行して依存関係を取得します。',
  '`.env.example` を `.env.local` にコピーし、必要な認証情報やAPIキーを設定します。',
  '`pnpm dev` で開発サーバーを起動し、`http://localhost:3000` にアクセスして動作を確認します。',
  'Prisma スキーマを編集した際は `pnpm prisma:generate` を忘れずに実行してください。',
]

export default function GettingStartedDocsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-14">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Documentation
        </p>
        <h1 className="text-3xl font-semibold text-foreground">開発開始手順</h1>
        <p className="text-sm text-muted-foreground">
          `docs/05_実装ガイド.md` のクイックスタート内容を元に、Next.js
          プロジェクトのセットアップ手順を整理しました。
          ローカル環境構築の際は以下を順番に進めてください。
        </p>
      </header>

      <section className="space-y-4">
        <ol className="list-decimal space-y-2 pl-6 text-sm text-muted-foreground">
          {steps.map((step) => (
            <li key={step}>
              <span className="text-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">関連ドキュメント</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>
            <Link href="/docs" className="text-primary underline-offset-4 hover:underline">
              ドキュメントインデックスに戻る
            </Link>
          </li>
          <li>
            <Link
              href="/docs/requirements"
              className="text-primary underline-offset-4 hover:underline"
            >
              機能・非機能要求チェックリスト
            </Link>
          </li>
          <li>
            <Link href="/docs/design" className="text-primary underline-offset-4 hover:underline">
              詳細設計とアーキテクチャ概要
            </Link>
          </li>
        </ul>
      </section>
    </main>
  )
}
