export type RoyaltySplit = {
  contributor_id: string
  percentage: number
}

export type RoyaltyDistributionInput = {
  gross_amount: number
  platform_fee_percentage?: number
  splits: RoyaltySplit[]
}

export type RoyaltyDistributionResult = {
  gross_amount: number
  platform_fee: number
  net_amount: number
  distributions: {
    contributor_id: string
    percentage: number
    amount: number
  }[]
}

export function calculateRoyaltyDistribution(
  input: RoyaltyDistributionInput
): RoyaltyDistributionResult {
  const gross = Number(input.gross_amount || 0)
  const platformFeePercentage = Number(input.platform_fee_percentage || 0)

  const totalSplit = input.splits.reduce((sum, s) => sum + Number(s.percentage || 0), 0)

  if (gross <= 0) {
    throw new Error("Gross amount must be greater than 0")
  }

  if (totalSplit !== 100) {
    throw new Error("Royalty splits must equal 100%")
  }

  const platform_fee = Number((gross * (platformFeePercentage / 100)).toFixed(2))
  const net_amount = Number((gross - platform_fee).toFixed(2))

  const distributions = input.splits.map((split) => ({
    contributor_id: split.contributor_id,
    percentage: split.percentage,
    amount: Number((net_amount * (split.percentage / 100)).toFixed(2)),
  }))

  return {
    gross_amount: gross,
    platform_fee,
    net_amount,
    distributions,
  }
}
