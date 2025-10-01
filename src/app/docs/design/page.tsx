import Link from 'next/link'

const designDocs = [
  {
    title: '02_詳細設計書.md',
    path: 'docs/02_詳細設計書.md',
    summary: 'システムアーキテクチャ、ディレクトリ構成、データモデルの指針。',
  },
  {
    title: '03_API設計書.md',
    path: 'docs/03_API設計書.md',
    summary: 'APIエンドポイント、リクエスト/レスポンス仕様、エラーハンドリング。',
  },
  {
    title: '04_UIUXデザインガイド.md',
    path: 'docs/04_UIUXデザインガイド.md',
    summary: 'カラー、タイポグラフィ、コンポーネントのUXルール。',
  },
  {
    title: '05_実装ガイド.md',
    path: 'docs/05_実装ガイド.md',
    summary: 'Next.js プロジェクトのセットアップと推奨実装フロー。',
  },
]

export default function DesignDocsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-14">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Documentation
        </p>
        <h1 className="text-3xl font-semibold text-foreground">設計ドキュメント概要</h1>
        <p className="text-sm text-muted-foreground">
          設計関連のMarkdownファイルは下記の通りです。各ファイルは `docs/`
          配下にあり、エディターやMarkdownビューアで閲覧できます。
        </p>
      </header>

      <section className="space-y-4">
        {designDocs.map((doc) => (
          <article key={doc.path} className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">{doc.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{doc.summary}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              ローカルパス: <code className="bg-muted px-2 py-1">{doc.path}</code>
            </p>
          </article>
        ))}
      </section>

      <Link href="/docs" className="text-sm text-primary underline-offset-4 hover:underline">
        ドキュメントインデックスへ戻る
      </Link>
    </main>
  )
}
