import {
  GetUsageCounterInput,
  UsageCounter,
  UsageCounterProvider,
} from "./quota-types"

export async function getUsageCounter(
  provider: UsageCounterProvider,
  input: GetUsageCounterInput
): Promise<UsageCounter> {
  return provider.getUsageCounter(input)
}
