import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { createPortfolio, listPortfolios } from '@/lib/services/portfolio-service'
import { createPortfolioSchema } from '@/lib/validations/portfolio'

export async function GET() {
  const portfolios = await listPortfolios()
  return NextResponse.json({ portfolios })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createPortfolioSchema.parse(body)
    const portfolio = await createPortfolio(parsed)
    return NextResponse.json({ portfolio }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten() },
        { status: 400 },
      )
    }

    console.error('[api/portfolio] failed to create portfolio', error)
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}
