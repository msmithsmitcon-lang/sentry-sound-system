export function determineModuleEligibility(
  totalSlbs: number,
  completedSlbs: number,
  remediationOutstanding: boolean
): boolean {

  if (remediationOutstanding) {
    return false
  }

  return completedSlbs >= totalSlbs
}
