import { buildSamroCsvRows } from "../exports/build-samro-csv-rows"

import { generateSubmissionFingerprint } from "../utils/generate-submission-fingerprint"

import { createSubmissionSnapshot } from "../repositories/create-submission-snapshot"

import { SamroWorkExportRow } from "../contracts/samro-work-export-row.contract"

import { validateSamroOwnershipTotal } from "../validation/validate-samro-ownership-total"

import { validateSamroContributorIdentity } from "../validation/validate-samro-contributor-identity"

import { validateSamroContributorRoles } from "../validation/validate-samro-contributor-roles"

import { validateSamroTerritories } from "../validation/validate-samro-territories"

import { validateNoDuplicateSamroContributors } from "../validation/validate-no-duplicate-samro-contributors"

import { normalizeSamroWorkExportRows } from "../utils/normalize-samro-work-export-rows"

export async function buildSamroSubmissionPackage(
  data: {
    entityType: string

    entityId: string

    rows: SamroWorkExportRow[]

    generatedBy?: string | null
  }
) {
  const normalizedRows =
    normalizeSamroWorkExportRows(
      data.rows
    )

  const ownershipValidation =
    validateSamroOwnershipTotal(
      normalizedRows
    )

  if (!ownershipValidation.valid) {
    throw new Error(
      ownershipValidation.issues.join(" ")
    )
  }

  const identityValidation =
    validateSamroContributorIdentity(
      normalizedRows
    )

  if (!identityValidation.valid) {
    throw new Error(
      identityValidation.issues.join(" ")
    )
  }

  const roleValidation =
    validateSamroContributorRoles(
      normalizedRows
    )

  if (!roleValidation.valid) {
    throw new Error(
      roleValidation.issues.join(" ")
    )
  }

  const territoryValidation =
    validateSamroTerritories(
      normalizedRows
    )

  if (!territoryValidation.valid) {
    throw new Error(
      territoryValidation.issues.join(" ")
    )
  }

  const duplicateValidation =
    validateNoDuplicateSamroContributors(
      normalizedRows
    )

  if (!duplicateValidation.valid) {
    throw new Error(
      duplicateValidation.issues.join(" ")
    )
  }

  const csv =
    buildSamroCsvRows(
      normalizedRows
    )

  const fingerprint =
    generateSubmissionFingerprint(csv)

  const snapshot =
    await createSubmissionSnapshot({
      entityType:
        data.entityType,

      entityId:
        data.entityId,

      fingerprint,

      exportPayload: {
        csv,
        rows:
          normalizedRows,
      },

      exportFormat:
        "CSV",

      generatedBy:
        data.generatedBy,

      status:
        "generated",
    })

  return {
    csv,

    fingerprint,

    snapshot,
  }
}
