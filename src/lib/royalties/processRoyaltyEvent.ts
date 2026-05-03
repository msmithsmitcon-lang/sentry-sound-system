import { calculateRoyaltyDistribution } from "./calculateRoyaltyDistribution"

export async function processRoyaltyEvent({
  gross_amount,
  platform_fee_percentage,
  splits,
}: {
  gross_amount: number
  platform_fee_percentage?: number
  splits: { contributor_id: string; percentage: number }[]
}) {
  const result = calculateRoyaltyDistribution({
    gross_amount,
    platform_fee_percentage,
    splits,
  })

  return result
}
