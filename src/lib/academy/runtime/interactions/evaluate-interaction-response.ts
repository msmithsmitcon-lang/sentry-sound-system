import { detectInteractionFailure }
from "../interactions/detect-interaction-failure"

import { REMEDIATION_MAP }
from "../remediation/remediation-map"

export function evaluateInteractionResponse(
  learnerResponse: string
) {

  const failure =
    detectInteractionFailure(
      learnerResponse
    )

  if (!failure.failed) {

    return {
      remediationRequired: false,
    }
  }

  const remediation =
    REMEDIATION_MAP[
      failure.trigger || "low_confidence"
    ]

  return {
    remediationRequired: true,

    remediation,
  }
}
