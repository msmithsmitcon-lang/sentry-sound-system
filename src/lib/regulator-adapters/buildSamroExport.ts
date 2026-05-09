import {
  SubmissionManifest
} from "@/lib/submission-manifest/buildSubmissionManifest.types"

import {
  RegulatorAdapterExportResult
} from "./regulatorAdapter.types"

export interface BuildSamroExportInput {
  manifest: SubmissionManifest
}

export function buildSamroExport(
  input: BuildSamroExportInput
): RegulatorAdapterExportResult {

  return {
    regulator: "SAMRO",

    format: "JSON",

    generatedAt:
      new Date().toISOString(),

    payload: {
      manifestId:
        input.manifest.manifestId,

      regulator:
        input.manifest.regulator,

      evidenceCount:
        input.manifest.evidenceCount,

      evidence:
        input.manifest.evidence
    }
  }
}
