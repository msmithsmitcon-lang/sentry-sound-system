import type { Recording } from "../contracts/recording-contract"

export type RecordingValidationResult = {
  valid: boolean
  errors: string[]
  warnings: string[]
  generatedConditions: Record<string, boolean>
}

export function validateRecording(
  recording: Recording
): RecordingValidationResult {

  const errors: string[] = []
  const warnings: string[] = []

  const allPerformersConfirmed =
    recording.performers.every(
      (performer) => performer.confirmed
    )

  const validISRC =
    typeof recording.isrc === "string" &&
    recording.isrc.trim().length > 0

  const hasMasterOwner =
    typeof recording.masterOwnerId === "string" &&
    recording.masterOwnerId.trim().length > 0

  const conditions: Record<string, boolean> = {
    performer_declarations_present: allPerformersConfirmed,
    unique_isrc: validISRC,
    work_documented: recording.documented
  }

  if (!validISRC) {
    errors.push(
      "Recording requires a valid ISRC"
    )
  }

  if (!hasMasterOwner) {
    errors.push(
      "Recording requires a master owner"
    )
  }

  if (!allPerformersConfirmed) {
    errors.push(
      "All performers must confirm participation"
    )
  }

  if (!recording.documented) {
    warnings.push(
      "Recording currently marked as undocumented"
    )
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    generatedConditions: conditions
  }
}
