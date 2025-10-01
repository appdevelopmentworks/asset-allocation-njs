import Link from 'next/link'

const requirementDocs = [
  {
    title: '01_要求定義書.md',
    path: 'docs/01_要求定義書.md',
    summary: '必須/重要/任意機能や非機能要求を網羅したドキュメント。',
  },
  {
    title: '09_セキュリティガイド.md',
    path: 'docs/09_セキュリティガイド.md',
    summary: 'セキュリティ要件と運用ベストプラクティスの詳細。',
  },
  {
    title: '10_パフォーマンス最適化ガイド.md',
    path: 'docs/10_パフォーマンス最適化ガイド.md',
    summary: 'パフォーマンスKPIに対する対策のまとめ。',
  },
]

export default function RequirementsDocsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-14">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Documentation
        </p>
        <h1 className="text-3xl font-semibold text-foreground">要求定義ドキュメント</h1>
        <p className="text-sm text-muted-foreground">
          プロダクトの機能・非機能要件、セキュリティ/性能要件はリポジトリ直下の `docs/`
          フォルダーで管理しています。
          以下のファイルをローカルエディターで開き、仕様確認やタスク分解を行ってください。
        </p>
      </header>

      <section className="space-y-4">
        {requirementDocs.map((doc) => (
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
