'use client'

import { useLocale } from '@/components/providers/locale-provider'

export default function ManualPage() {
  const { locale } = useLocale()
  const text =
    locale === 'ja'
      ? {
          eyebrow: 'User Manual',
          title: '初心者向けユーザー マニュアル',
          intro:
            'このアプリは、複数の資産を組み合わせて最適な配分を探すためのポートフォリオ分析ツールです。価格データを使ったシミュレーションで、リスクとリターンのバランスを直感的に確認できます。',
          capabilitiesTitle: 'できること',
          flowTitle: '使い方の流れ',
          dashboardTitle: 'ダッシュボードの画面説明',
          tipsTitle: '初心者向けヒント',
          analysisTitle: '高度分析チャートの見方',
          analysisIntro:
            '「高度分析」ページでは、複数のチャートでリスクとリターンの特徴を確認できます。',
          faqTitle: 'よくある質問',
          faq: [
            {
              question: 'Q. データは外部に送信されますか？',
              answer:
                '基本的な入力内容はブラウザのローカルストレージに保存されます。機密情報は入力しないでください。',
            },
            {
              question: 'Q. どのくらいの資産数がおすすめですか？',
              answer: 'まずは2-6銘柄から始めると、結果の違いが理解しやすくなります。',
            },
            {
              question: 'Q. 結果が毎回変わるのはなぜですか？',
              answer:
                'モンテカルロシミュレーションは乱数を使うため、少しずつ結果が変動します。',
            },
          ],
        }
      : {
          eyebrow: 'User Manual',
          title: 'Beginner User Manual',
          intro:
            'This app is a portfolio analysis tool that helps you find the best allocation across multiple assets. Run simulations on price data to understand the balance between risk and return.',
          capabilitiesTitle: 'What you can do',
          flowTitle: 'How to use',
          dashboardTitle: 'Dashboard overview',
          tipsTitle: 'Tips for beginners',
          analysisTitle: 'How to read the advanced analysis charts',
          analysisIntro:
            'On the Advanced Analysis page, you can review risk and return from multiple chart angles.',
          faqTitle: 'FAQ',
          faq: [
            {
              question: 'Q. Is my data sent anywhere?',
              answer:
                'Basic inputs are stored in your browser’s local storage. Do not enter sensitive information.',
            },
            {
              question: 'Q. How many assets should I start with?',
              answer:
                'Start with 2-6 assets so it is easier to understand differences between results.',
            },
            {
              question: 'Q. Why do results change each time?',
              answer:
                'Monte Carlo simulations use random numbers, so outputs vary slightly each run.',
            },
          ],
        }
  const capabilities =
    locale === 'ja'
      ? [
          {
            title: '資産配分の最適化',
            description: '目標に合わせて最適な比率を提案します（シャープレシオ最大化など）。',
          },
          {
            title: 'リスクの可視化',
            description:
              '効率的フロンティアや相関ヒートマップでリスクを確認できます。',
          },
          {
            title: 'シミュレーション',
            description: '過去データを使って、複数回のシミュレーション結果を比較できます。',
          },
          {
            title: '設定の保存',
            description: '入力したデータはブラウザに保存され、次回も続きから開始できます。',
          },
        ]
      : [
          {
            title: 'Optimize allocations',
            description:
              'Get suggested weights based on your goal (for example, maximize Sharpe ratio).',
          },
          {
            title: 'Visualize risk',
            description: 'Review risk using the efficient frontier and correlation heatmap.',
          },
          {
            title: 'Simulations',
            description:
              'Compare multiple runs using historical data to see how outcomes differ.',
          },
          {
            title: 'Save settings',
            description: 'Your inputs are saved in the browser so you can continue next time.',
          },
        ]
  const steps =
    locale === 'ja'
      ? [
          {
            title: '1. ダッシュボードへ移動',
            description:
              'トップページの「ダッシュボードを見る」から開始します。ここが作業の中心画面です。',
          },
          {
            title: '2. 資産を入力',
            description:
              'ポートフォリオに含めたい資産の名称、通貨、比率（または金額）を入力します。',
          },
          {
            title: '3. 期間と条件を設定',
            description:
              'シミュレーションの期間や回数、リバランス頻度などを選びます。',
          },
          {
            title: '4. 最適化を実行',
            description:
              '「最適化」ボタンで分析を開始します。効率的フロンティアや配分案が表示されます。',
          },
          {
            title: '5. 結果を確認・保存',
            description:
              'グラフや指標を確認し、必要に応じて条件を微調整します。データはブラウザに保存されます。',
          },
        ]
      : [
          {
            title: '1. Open the dashboard',
            description: 'Start from “Open Dashboard” on the home page.',
          },
          {
            title: '2. Enter assets',
            description:
              'Add asset names, currency, and weights (or values) for your portfolio.',
          },
          {
            title: '3. Configure the range',
            description: 'Choose the analysis period, trial count, and rebalance frequency.',
          },
          {
            title: '4. Run optimization',
            description:
              'Click the optimization button to see the efficient frontier and allocations.',
          },
          {
            title: '5. Review and save',
            description:
              'Check charts and metrics, then adjust settings as needed. Data is saved locally.',
          },
        ]
  const tips =
    locale === 'ja'
      ? [
          {
            title: 'まずは少数の資産から',
            description:
              '慣れるまでは2-4銘柄に絞ると、結果の違いが理解しやすくなります。',
          },
          {
            title: '期間は長めに',
            description:
              '短期間はブレが大きいため、3年以上を目安にすると傾向を掴みやすくなります。',
          },
          {
            title: 'リスクの見方',
            description:
              'リスクが高いほど上下の幅が大きくなります。リターンだけでなく安定性も確認しましょう。',
          },
        ]
      : [
          {
            title: 'Start with fewer assets',
            description: 'Begin with 2-4 assets to better understand differences.',
          },
          {
            title: 'Use longer time ranges',
            description: 'Short ranges are noisy. Try 3+ years for clearer trends.',
          },
          {
            title: 'Balance risk and return',
            description: 'Higher returns often mean higher swings. Check stability too.',
          },
        ]
  const dashboardSections =
    locale === 'ja'
      ? [
          {
            title: 'サイドバー',
            description:
              'ページの切り替えや主要機能への移動に使います。スマホでは左上のメニューから開閉できます。',
          },
          {
            title: 'ポートフォリオ入力',
            description:
              '資産名、通貨、比率（または金額）を入力するエリアです。行を追加して資産数を増やします。',
          },
          {
            title: 'シミュレーション設定',
            description:
              '期間、回数、リバランス頻度などを設定します。条件を変えると結果の傾向も変わります。',
          },
          {
            title: '最適化結果',
            description:
              '効率的フロンティアや配分案が表示されます。リスクとリターンのバランスを確認します。',
          },
          {
            title: 'チャートと指標',
            description: '資産ごとの動きや相関、リスク指標を視覚的にチェックできます。',
          },
        ]
      : [
          {
            title: 'Sidebar',
            description:
              'Use it to navigate between pages and key features. On mobile, open it from the menu icon.',
          },
          {
            title: 'Portfolio inputs',
            description:
              'Enter asset names, currency, and weights (or values). Add rows to increase assets.',
          },
          {
            title: 'Simulation settings',
            description:
              'Set the range, trial count, and rebalance frequency. Changes affect results.',
          },
          {
            title: 'Optimization results',
            description:
              'View the efficient frontier and suggested allocations. Check risk/return balance.',
          },
          {
            title: 'Charts and metrics',
            description: 'Review price moves, correlations, and risk metrics visually.',
          },
        ]
  const analysisGuides =
    locale === 'ja'
      ? [
          {
            title: '効率的フロンティア',
            description:
              '右上に行くほど高リターン、高リスクです。自分の許容範囲に近い点を選ぶのが目安です。',
          },
          {
            title: '相関ヒートマップ',
            description:
              '色が濃いほど同じ動きをしやすくなります。分散したい場合は色が薄い組み合わせを探します。',
          },
          {
            title: 'バックテスト',
            description:
              '線がなめらかで下振れが小さいほど安定的です。急な上下が多い場合はリスクが高めです。',
          },
          {
            title: 'リスク指標',
            description:
              'VaRや最大ドローダウンが大きいほど損失の幅が大きくなります。数値の大きさで安全性を比較します。',
          },
          {
            title: 'ストレステスト',
            description:
              '特定の市場ショックを想定した影響度です。マイナス幅が小さいほど耐性が高いと判断できます。',
          },
        ]
      : [
          {
            title: 'Efficient frontier',
            description:
              'Top-right means higher return and higher risk. Look for points within your tolerance.',
          },
          {
            title: 'Correlation heatmap',
            description:
              'Darker colors move together more often. Choose lighter pairs for diversification.',
          },
          {
            title: 'Backtest',
            description:
              'Smoother lines with smaller drawdowns indicate more stability. Big swings mean more risk.',
          },
          {
            title: 'Risk metrics',
            description:
              'Larger VaR or max drawdown implies bigger potential losses. Compare safety by scale.',
          },
          {
            title: 'Stress tests',
            description:
              'Shows impact under specific shocks. Smaller negatives mean stronger resilience.',
          },
        ]
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {text.eyebrow}
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {text.title}
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {text.intro}
          </p>
        </section>

        <section className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">{text.capabilitiesTitle}</h2>
          <div className="mt-4 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border/40 bg-background/70 p-4"
              >
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">{text.flowTitle}</h2>
          <div className="grid gap-4">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-xl border border-border/40 bg-background/70 p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-foreground">{step.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="dashboard-manual" className="space-y-6 scroll-mt-24">
          <h2 className="text-xl font-semibold text-foreground">{text.dashboardTitle}</h2>
          <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            {dashboardSections.map((section) => (
              <div
                key={section.title}
                className="rounded-xl border border-border/40 bg-background/70 p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-foreground">{section.title}</p>
                <p className="mt-2">{section.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">{text.tipsTitle}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="rounded-xl border border-border/40 bg-background/70 p-4"
              >
                <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">
            {text.analysisTitle}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {text.analysisIntro}
          </p>
          <div className="mt-4 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            {analysisGuides.map((guide) => (
              <div
                key={guide.title}
                className="rounded-xl border border-border/40 bg-background/70 p-4"
              >
                <p className="text-sm font-semibold text-foreground">{guide.title}</p>
                <p className="mt-2">{guide.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">{text.faqTitle}</h2>
          <div className="mt-4 space-y-4 text-sm text-muted-foreground">
            {text.faq.map((item) => (
              <div key={item.question}>
                <p className="font-semibold text-foreground">{item.question}</p>
                <p className="mt-2">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
