export function determineNextAction(
  competencyAchieved: boolean,
  remediationRequired: boolean
): "advance" | "remediate" | "retry" | "block" {

  if (competencyAchieved) {
    return "advance"
  }

  if (remediationRequired) {
    return "remediate"
  }

  return "retry"
}
