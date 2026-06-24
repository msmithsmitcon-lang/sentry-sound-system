import JSZip from "jszip"

import { emitMusicDomainEvent } from "@/lib/plexicon-events/emit-domain-event"

import {
  getCmoContributorRecords,
  getCmoWorkRecord,
  type CmoContributorRecord,
  type CmoWorkRecord,
} from "./cmo-pack-data"

export type CmoPackValidationIssue = {
  field: string
  message: string
}

export type CmoPackResult =
  | { success: true; zipBuffer: Buffer; fileName: string }
  | { success: false; issues: CmoPackValidationIssue[] }

const TARGET_CMOS = ["SAMRO", "CAPASSO", "SAMPRA"] as const

/**
 * Generates the CMO Submission Ready Pack (SAMRO + CAPASSO + SAMPRA CSVs
 * plus a checklist instruction document) for a registered, split-confirmed
 * song. Reads from the live workspace-scoped tables (see cmo-pack-data.ts
 * for why — a separate, disconnected SAMRO export subsystem already
 * exists at src/lib/registration/submission-engine but operates on a
 * different data model than the live wizard writes to).
 */
export async function generateCmoSubmissionPack(input: {
  workId: string
  workspaceId: string
  actorId: string
}): Promise<CmoPackResult> {
  const work = await getCmoWorkRecord(input.workId, input.workspaceId)
  if (!work) {
    throw new Error("Work not found.")
  }

  const contributors = await getCmoContributorRecords(input.workId, input.workspaceId)

  const issues = validateForCmoSubmission(work, contributors)
  if (issues.length > 0) {
    return { success: false, issues }
  }

  const zip = new JSZip()
  zip.file("SAMRO_submission.csv", buildSamroCsv(work, contributors))
  zip.file("CAPASSO_submission.csv", buildCapassoCsv(work, contributors))
  zip.file("SAMPRA_submission.csv", buildSampraCsv(work, contributors))
  zip.file("README_checklist.txt", buildChecklist(work, contributors))

  const zipBuffer = (await zip.generateAsync({ type: "nodebuffer" })) as Buffer
  const fileName = `${sanitizeFileName(work.work_title)}_CMO_submission_pack.zip`

  await emitMusicDomainEvent({
    eventType: "plexicon.domain.music.submission_pack.generated",
    workspaceId: input.workspaceId,
    payload: {
      tenant_id: input.workspaceId,
      institution_id: input.workspaceId,
      actor_id: input.actorId,
      song_id: work.id,
      pack_format: "csv",
      target_cmos: TARGET_CMOS,
      work_identifiers: {
        iswc: work.iswc,
      },
      artifact_reference: fileName,
    },
  })

  return { success: true, zipBuffer, fileName }
}

/**
 * Required-field validation per
 * PLEXICON_MASTER_EXECUTION_BRIEF_V1.md Part 11 Step 2 / Phase 3b:
 * ISWC if known, contributor CAE/IPI numbers, language, duration, and
 * split percentages summing to 100.
 *
 * "ISWC if known" is read as: do not block submission solely for a
 * missing ISWC (ISWC assignment commonly happens AT/AFTER CMO
 * registration, not before), but every other field is a hard
 * requirement — flagging this interpretation since it's a defensible
 * but not the only reasonable reading.
 */
export function validateForCmoSubmission(
  work: CmoWorkRecord,
  contributors: CmoContributorRecord[]
): CmoPackValidationIssue[] {
  const issues: CmoPackValidationIssue[] = []

  if (contributors.length === 0) {
    issues.push({ field: "contributors", message: "No contributors found for this song." })
  }

  const unconfirmed = contributors.filter((c) => !c.confirmed)
  if (contributors.length > 0 && unconfirmed.length > 0) {
    issues.push({
      field: "contributors",
      message: "All contributor splits must be confirmed before generating a CMO pack.",
    })
  }

  const splitTotal = Math.round(contributors.reduce((sum, c) => sum + c.percentage, 0) * 100) / 100
  if (contributors.length > 0 && splitTotal !== 100) {
    issues.push({
      field: "contributor_splits",
      message: `Contributor split total is ${splitTotal}%. It must equal 100%.`,
    })
  }

  const missingCaeIpi = contributors.filter((c) => !c.cae_ipi || !c.cae_ipi.trim())
  if (missingCaeIpi.length > 0) {
    issues.push({
      field: "contributor_cae_ipi",
      message: `Missing CAE/IPI number for: ${missingCaeIpi.map((c) => c.name).join(", ")}.`,
    })
  }

  if (!work.language || !work.language.trim()) {
    issues.push({ field: "language", message: "Song language is required for CMO submission." })
  }

  if (!work.duration_seconds || work.duration_seconds <= 0) {
    issues.push({ field: "duration_seconds", message: "Song duration is required for CMO submission." })
  }

  return issues
}

function buildSamroCsv(work: CmoWorkRecord, contributors: CmoContributorRecord[]): string {
  const headers = ["Work Title", "ISWC", "Language", "Duration (s)", "Contributor Name", "Role", "CAE/IPI", "Ownership %", "Publisher Name", "Publisher Share %"]
  const rows = contributors.map((c) => [
    work.work_title,
    work.iswc ?? "",
    work.language ?? "",
    String(work.duration_seconds ?? ""),
    c.name,
    c.role,
    c.cae_ipi ?? "",
    String(c.percentage),
    work.publisher_name ?? "",
    work.publisher_share != null ? String(work.publisher_share) : "",
  ])
  return toCsv(headers, rows)
}

/**
 * CAPASSO mirrors SAMRO splits per PLEXICON_MASTER_EXECUTION_BRIEF_V1.md
 * Part 5 ("CAPASSO mechanical royalties -> mirrors SAMRO splits") — same
 * row shape, distinct file per regulator submission convention.
 */
function buildCapassoCsv(work: CmoWorkRecord, contributors: CmoContributorRecord[]): string {
  return buildSamroCsv(work, contributors)
}

/**
 * SAMPRA covers master/recording/performer rights, not composition
 * rights — a different row shape from SAMRO/CAPASSO (no publisher
 * share; performer/master ownership instead).
 */
function buildSampraCsv(work: CmoWorkRecord, contributors: CmoContributorRecord[]): string {
  const headers = ["Work Title", "ISRC", "Duration (s)", "Performer/Contributor Name", "Role", "CAE/IPI", "Master/Performer Ownership %"]
  const rows = contributors.map((c) => [
    work.work_title,
    "", // ISRC is recording-level; not yet captured on musical_works — left blank, flagged in checklist
    String(work.duration_seconds ?? ""),
    c.name,
    c.role,
    c.cae_ipi ?? "",
    String(c.percentage),
  ])
  return toCsv(headers, rows)
}

function buildChecklist(work: CmoWorkRecord, contributors: CmoContributorRecord[]): string {
  const lines = [
    "SENTRY SOUND — CMO SUBMISSION READY PACK",
    `Work: ${work.work_title}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    "Contents:",
    "  - SAMRO_submission.csv (composition performance royalties)",
    "  - CAPASSO_submission.csv (mechanical royalties, mirrors SAMRO splits)",
    "  - SAMPRA_submission.csv (master/recording/performer royalties)",
    "",
    "Before submitting to each collecting society:",
    "  1. Confirm the work's ISWC is assigned (if not yet known, apply via the relevant CMO's portal first).",
    "  2. SAMPRA_submission.csv requires the recording's ISRC — not yet captured by Sentry Sound; add it manually before submission.",
    "  3. Verify every contributor's CAE/IPI number is current with their registering society.",
    "  4. Confirm contributor split percentages sum to 100% (validated automatically before this pack was generated).",
    "",
    `Contributors (${contributors.length}):`,
    ...contributors.map((c) => `  - ${c.name} (${c.role}) — ${c.percentage}% — CAE/IPI: ${c.cae_ipi ?? "MISSING"}`),
    "",
    "This pack is a preparation aid. Sentry Sound does not submit on your behalf — you remain responsible for filing with each collecting society.",
  ]
  return lines.join("\n")
}

function toCsv(headers: string[], rows: string[][]): string {
  const escape = (value: string) => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n")
}

function sanitizeFileName(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_")
}
