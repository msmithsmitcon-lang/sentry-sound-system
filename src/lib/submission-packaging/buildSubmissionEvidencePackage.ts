import {
  ResolvedEvidenceSnapshot
} from "@/lib/evidence-resolution/resolveEvidenceSnapshot.types"

import {
  SubmissionEvidencePackage,
  SubmissionPackagingEvidenceItem
} from "./buildSubmissionEvidencePackage.types"

export interface BuildSubmissionEvidencePackageInput {
  snapshot: ResolvedEvidenceSnapshot

  documentTypeMap:
    Record<string, string>
}

export function buildSubmissionEvidencePackage(
  input: BuildSubmissionEvidencePackageInput
): SubmissionEvidencePackage {

  const evidence:
    SubmissionPackagingEvidenceItem[] =

    input.snapshot.validEvidenceIds.map(
      (evidenceId) => ({
        evidenceId,

        documentType:
          input.documentTypeMap[
            evidenceId
          ] ?? "unknown"
      })
    )

  return {
    generatedAt:
      new Date().toISOString(),

    evidenceCount:
      evidence.length,

    evidence
  }
}
