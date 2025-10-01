export type Locale = 'ja' | 'en'

const dictionaries: Record<Locale, Record<string, string>> = {
  ja: {
    'header.docs': 'ドキュメント',
    'header.toggleLocale': 'English',
    'dashboard.overview.title': 'ダッシュボード概要',
    'dashboard.overview.subtitle':
      '下記の指標と活動ログはモックデータです。Yahoo Finance データ連携と最適化処理が整い次第、リアルタイム値に差し替えます。',
    'dashboard.price.description':
      '指定したティッカーの累積リターン推移を可視化します。比較モードで複数資産を重ねられます。',
    'dashboard.price.footer':
      '累積リターンは期間開始時点を0%とした相対値です。スケール調整には期間セレクターをご利用ください。',
    'dashboard.price.title': '累積リターン',
    'dashboard.price.comparisonToggle': '比較モード',
    'dashboard.price.comparisonLabel': '比較対象',
    'dashboard.price.comparisonHelper':
      '重ねたい資産を選択してください。基準資産は自動的に含まれます。',
    'dashboard.price.comparisonEmpty': '比較対象に追加できる資産がありません。',
    'dashboard.activity.title': '最近のアクティビティ',
    'dashboard.activity.description': 'ユーザー操作ログや自動アラートを時系列で表示します。',
    'simulation.title': 'シミュレーション設定',
    'simulation.description':
      'モックのポートフォリオを用いて、対象資産や分析期間、シミュレーション回数を調整できます。',
    'simulation.assets': '対象資産',
    'simulation.range': '分析期間',
    'simulation.trials': 'シミュレーション回数',
    'simulation.rebalance': 'リバランス頻度',
    'simulation.apply': '設定を適用',
    'simulation.result': '最新のシミュレーション設定を適用しました。',
    'report.export': 'レポートをエクスポート',
    'report.export.success': 'JSONレポートをダウンロードしました。',
    'analysis.efficientFrontier.title': '効率的フロンティア',
    'analysis.efficientFrontier.description':
      '各ポートフォリオのリスクとリターンの関係をプロットします。',
    'analysis.correlation.title': '相関ヒートマップ',
    'analysis.correlation.description':
      '主要資産間の相関係数を可視化します。値が高いほど動きが似ています。',
    'analysis.backtest.placeholder':
      '過去 10 年間のローリングリターンやドローダウンチャートをここに表示します。',
  },
  en: {
    'header.docs': 'Documentation',
    'header.toggleLocale': '日本語',
    'dashboard.overview.title': 'Dashboard Overview',
    'dashboard.overview.subtitle':
      'The metrics and activity feed below use mock data. Live Yahoo Finance signals and optimization results will replace them soon.',
    'dashboard.price.description':
      'Displays cumulative returns for the selected ticker. Enable comparison mode to overlay multiple assets.',
    'dashboard.price.footer':
      'Returns are normalised to 0% at the start of the range. Use the range selector to rescale the view.',
    'dashboard.price.title': 'Cumulative Return',
    'dashboard.price.comparisonToggle': 'Comparison Mode',
    'dashboard.price.comparisonLabel': 'Comparison Assets',
    'dashboard.price.comparisonHelper':
      'Choose the assets to overlay. The primary selection is always included.',
    'dashboard.price.comparisonEmpty':
      'No additional assets are available for comparison right now.',
    'dashboard.activity.title': 'Recent Activity',
    'dashboard.activity.description': 'Chronological list of user actions and automated alerts.',
    'simulation.title': 'Simulation Settings',
    'simulation.description':
      'Adjust which assets to include, the analysis range, and the number of Monte Carlo trials.',
    'simulation.assets': 'Assets',
    'simulation.range': 'Range',
    'simulation.trials': 'Trials',
    'simulation.rebalance': 'Rebalance Frequency',
    'simulation.apply': 'Apply Settings',
    'simulation.result': 'Simulation settings updated successfully.',
    'report.export': 'Export Report',
    'report.export.success': 'Downloaded the JSON report.',
    'analysis.efficientFrontier.title': 'Efficient Frontier',
    'analysis.efficientFrontier.description':
      'Plots the relationship between risk and return for each candidate portfolio.',
    'analysis.correlation.title': 'Correlation Heatmap',
    'analysis.correlation.description':
      'Displays correlation coefficients across key assets. Higher values mean similar moves.',
    'analysis.backtest.placeholder': 'Rolling return and drawdown charts will appear here.',
  },
}

export const defaultLocale: Locale = 'ja'

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}
