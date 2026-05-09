export type CrossRightsLinkValidationInput = {
  musicalWorkId?: string | null
  recordingId?: string | null
  audiovisualWorkId?: string | null
}

export type CrossRightsLinkValidationResult = {
  valid: boolean
  blockers: string[]
  warnings: string[]
}

export function validateCrossRightsLinks(
  input: CrossRightsLinkValidationInput
): CrossRightsLinkValidationResult {
  const blockers: string[] = []
  const warnings: string[] = []

  if (input.audiovisualWorkId && !input.recordingId) {
    blockers.push(
      "Audiovisual work must be linked to a recording"
    )
  }

  if (input.recordingId && !input.musicalWorkId) {
    warnings.push(
      "Recording is not linked to a musical work"
    )
  }

  if (
    input.audiovisualWorkId &&
    input.recordingId &&
    !input.musicalWorkId
  ) {
    warnings.push(
      "Audiovisual work has recording link but missing composition link"
    )
  }

  return {
    valid: blockers.length === 0,
    blockers,
    warnings
  }
}
