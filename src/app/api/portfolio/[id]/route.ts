import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import {
  deletePortfolio as deletePortfolioService,
  getPortfolioById,
  updatePortfolio as updatePortfolioService,
} from '@/lib/services/portfolio-service'
import { updatePortfolioSchema } from '@/lib/validations/portfolio'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const portfolio = await getPortfolioById(id)

  if (!portfolio) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
  }

  return NextResponse.json({ portfolio })
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  try {
    const body = await request.json()
    const parsed = updatePortfolioSchema.parse(body)
    const portfolio = await updatePortfolioService(id, parsed)
    return NextResponse.json({ portfolio })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten() },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message === 'Portfolio not found') {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    console.error('[api/portfolio/:id] update failed', error)
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  try {
    const portfolio = await deletePortfolioService(id)
    return NextResponse.json({ portfolio })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    console.error('[api/portfolio/:id] delete failed', error)
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
  }
}
