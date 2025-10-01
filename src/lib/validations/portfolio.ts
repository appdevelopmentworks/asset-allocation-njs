import { z } from 'zod'
import type { PortfolioSettings } from '@/lib/types'

export const portfolioSettingsSchema = z.object({
  rebalanceFrequency: z.enum(['monthly', 'quarterly', 'yearly']),
  timeRange: z.enum(['1Y', '3Y', '5Y', '10Y', 'MAX']),
  includeDividends: z.boolean().default(true),
  useLogReturns: z.boolean().default(true),
}) satisfies z.ZodType<PortfolioSettings>

export const portfolioAssetSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  weight: z.number().min(0).max(1),
  quantity: z.number().optional(),
  averagePrice: z.number().optional(),
})

const assetArraySchema = z
  .array(portfolioAssetSchema)
  .min(1, 'At least one asset is required')
  .superRefine((assets, ctx) => {
    const totalWeight = assets.reduce((sum, asset) => sum + asset.weight, 0)
    if (totalWeight > 1.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sum of weights must be less or equal to 1',
      })
    }
  })

export const createPortfolioSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().trim().optional(),
  baseCurrency: z.string().min(3).max(5).default('USD'),
  settings: portfolioSettingsSchema,
  assets: assetArraySchema,
})

export const updatePortfolioSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().trim().optional(),
  baseCurrency: z.string().min(3).max(5).optional(),
  settings: portfolioSettingsSchema.optional(),
  assets: assetArraySchema.optional(),
})

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>
