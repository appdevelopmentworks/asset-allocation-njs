import { prisma } from '@/lib/prisma'
import type { CreatePortfolioInput, UpdatePortfolioInput } from '@/lib/validations/portfolio'
import type { Portfolio } from '@prisma/client'

const portfolioInclude = {
  assets: true,
  snapshots: true,
}

export async function listPortfolios() {
  const portfolios = await prisma.portfolio.findMany({
    include: portfolioInclude,
    orderBy: { updatedAt: 'desc' },
  })
  return portfolios
}

export async function getPortfolioById(id: string) {
  const portfolio = await prisma.portfolio.findUnique({
    where: { id },
    include: portfolioInclude,
  })
  return portfolio
}

export async function createPortfolio(input: CreatePortfolioInput) {
  const portfolio = await prisma.portfolio.create({
    data: {
      name: input.name,
      description: input.description,
      baseCurrency: input.baseCurrency ?? 'USD',
      settings: input.settings,
      assets: {
        create: input.assets.map((asset) => ({
          symbol: asset.symbol.toUpperCase(),
          weight: asset.weight,
          quantity: asset.quantity,
          averagePrice: asset.averagePrice,
        })),
      },
    },
    include: portfolioInclude,
  })

  return portfolio
}

export async function updatePortfolio(id: string, input: UpdatePortfolioInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.portfolio.findUnique({ where: { id }, include: { assets: true } })
    if (!existing) {
      throw new Error('Portfolio not found')
    }

    const updatedPortfolio = await tx.portfolio.update({
      where: { id },
      data: {
        name: input.name ?? existing.name,
        description: input.description ?? existing.description,
        baseCurrency: input.baseCurrency ?? existing.baseCurrency,
        settings: input.settings ?? existing.settings,
        assets: input.assets
          ? {
              deleteMany: { portfolioId: id },
              create: input.assets.map((asset) => ({
                symbol: asset.symbol.toUpperCase(),
                weight: asset.weight,
                quantity: asset.quantity,
                averagePrice: asset.averagePrice,
              })),
            }
          : undefined,
      },
      include: portfolioInclude,
    })

    return updatedPortfolio
  })
}

export async function deletePortfolio(id: string): Promise<Portfolio> {
  return prisma.portfolio.delete({
    where: { id },
    include: portfolioInclude,
  })
}
