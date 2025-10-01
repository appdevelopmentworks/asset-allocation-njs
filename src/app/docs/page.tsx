import Link from 'next/link'

const docs = [
  {
    href: '/docs/getting-started',
    title: '開発開始手順',
    description: 'ローカル環境を構築し、アプリケーションを起動するためのステップ。',
  },
  {
    href: '/docs/requirements',
    title: '要求定義へのアクセス方法',
    description: 'docs/01_要求定義書.md を参照するためのガイド。',
  },
  {
    href: '/docs/design',
    title: '設計ドキュメント概要',
    description: '詳細設計・API設計・UIUXガイドの読み方と関連性。',
  },
]

export default function DocsIndexPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-14">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Documentation
        </p>
        <h1 className="text-3xl font-semibold text-foreground">プロジェクトドキュメント</h1>
        <p className="text-sm text-muted-foreground">
          リポジトリ内の `docs/`
          フォルダーにあるMarkdownファイルをブラウザから参照するための入口ページです。
          それぞれの項目からローカルファイル場所と読むべき順番を確認できます。
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {docs.map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            className="rounded-xl border bg-card p-6 shadow-sm transition hover:border-primary hover:shadow"
          >
            <h2 className="text-lg font-semibold text-foreground">{doc.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{doc.description}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
