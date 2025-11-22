import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PortfolioPage from '@/app/(dashboard)/dashboard/portfolio/page'
import { LocaleProvider } from '@/components/providers/locale-provider'
import { PortfolioProvider } from '@/components/providers/portfolio-provider'
import { mockOptimizationSummaries, mockPortfolio } from '@/lib/constants/mock-data'
import type { OptimizationStrategy, Portfolio } from '@/lib/types'
import { normalizePortfolio } from '@/lib/utils/portfolio'

jest.mock('@/components/forms/portfolio-editor', () => ({
  PortfolioEditor: () => <div data-testid="portfolio-editor" />,
}))

jest.mock('@/components/forms/simulation-controls', () => ({
  SimulationControls: () => <div data-testid="simulation-controls" />,
}))

jest.mock('@/components/ui/report-export-button', () => ({
  ReportExportButton: () => <div data-testid="report-export-button" />,
}))

jest.mock('@/components/charts/allocation-pie-chart', () => ({
  AllocationPieChart: ({ assets }: { assets: Array<{ weight: number }> }) => (
    <div data-testid="allocation-chart">{assets.length} assets</div>
  ),
}))

const renderPortfolioPage = () =>
  render(
    <LocaleProvider>
      <PortfolioProvider>
        <PortfolioPage />
      </PortfolioProvider>
    </LocaleProvider>,
  )

const getMockSummary = (strategy: OptimizationStrategy) => {
  const summary = mockOptimizationSummaries.find((item) => item.strategy === strategy)
  if (!summary) {
    throw new Error(`Missing mock summary for ${strategy}`)
  }
  return summary
}

const normalize = (value: string) => value.replace(/\s+/g, '')

const expectTextWithin = (element: HTMLElement, text: string) => {
  const content = normalize(element.textContent ?? '')
  expect(content).toContain(normalize(text))
}

describe('PortfolioPage optimization integration', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    window.localStorage.clear()
    const fetchMock = jest.fn(
      async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = typeof input === 'string' ? input : input.toString()
        const { searchParams } = new URL(url, 'http://localhost')
        const queryStrategy = searchParams.get('strategy') as OptimizationStrategy | null
        let bodyStrategy: OptimizationStrategy | undefined
        let portfolioPayload: Portfolio | undefined

        if (init?.body && typeof init.body === 'string') {
          const parsed = JSON.parse(init.body) as { strategy?: OptimizationStrategy; portfolio?: Portfolio }
          bodyStrategy = parsed.strategy ?? undefined
          if (parsed.portfolio) {
            portfolioPayload = normalizePortfolio(parsed.portfolio)
          }
        }

        const activeStrategy = bodyStrategy ?? queryStrategy ?? 'max_sharpe'
        const result = {
          summaries: mockOptimizationSummaries,
          summary: getMockSummary(activeStrategy),
          portfolio: portfolioPayload ?? mockPortfolio,
        }

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    )

    global.fetch = fetchMock as typeof fetch
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders the latest optimization results for the default strategy', async () => {
    const summary = getMockSummary('max_sharpe')

    renderPortfolioPage()

    await waitFor(() => expect(screen.getByText('最大シャープレシオの概要')).toBeInTheDocument())

    const summaryCard = screen.getByText('最大シャープレシオの概要').closest('div')
    expect(summaryCard).toBeTruthy()
    await waitFor(() =>
      expectTextWithin(summaryCard as HTMLElement, `${(summary!.expectedReturn * 100).toFixed(1)}`),
    )
    await waitFor(() =>
      expectTextWithin(summaryCard as HTMLElement, `${(summary!.risk * 100).toFixed(1)}`),
    )
  })

  it('updates allocations and metrics when switching strategies', async () => {
    const targetStrategy: OptimizationStrategy = 'max_return'
    const summary = getMockSummary(targetStrategy)
    const btcWeight = summary.weights?.find((item) => item.symbol === 'BTC-USD')?.weight
    expect(btcWeight).toBeDefined()

    renderPortfolioPage()

    const select = await screen.findByLabelText('最適化戦略を選択')
    await act(async () => {
      await user.selectOptions(select, targetStrategy)
    })

    await waitFor(() => expect(screen.getByText('最大リターンの概要')).toBeInTheDocument())

    const btcCell = await screen.findByText('BTC-USD')
    const btcRow = btcCell.closest('tr')
    expect(btcRow).toBeTruthy()
    await waitFor(() => expectTextWithin(btcRow as HTMLElement, `${(btcWeight! * 100).toFixed(1)}`))
  })
})
