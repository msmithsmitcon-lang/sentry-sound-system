import { randomUUID } from "crypto"

import {
  SubmissionEvidencePackage
} from "@/lib/submission-packaging/buildSubmissionEvidencePackage.types"

import {
  SubmissionManifest,
  SubmissionManifestItem
} from "./buildSubmissionManifest.types"

export interface BuildSubmissionManifestInput {
  regulator: string

  evidencePackage:
    SubmissionEvidencePackage
}

export function buildSubmissionManifest(
  input: BuildSubmissionManifestInput
): SubmissionManifest {

  const evidence:
    SubmissionManifestItem[] =

    input.evidencePackage.evidence.map(
      (item) => ({
        evidenceId:
          item.evidenceId,

        documentType:
          item.documentType
      })
    )

  return {
    manifestId:
      randomUUID(),

    generatedAt:
      new Date().toISOString(),

    regulator:
      input.regulator,

    evidenceCount:
      evidence.length,

    evidence
  }
}
