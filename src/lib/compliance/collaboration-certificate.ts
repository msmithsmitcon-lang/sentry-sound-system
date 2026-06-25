import { prisma } from "@/lib/db/prisma"

import { getLatestMasterAudioAsset } from "@/lib/work-files/work-asset-storage-repository"
import { emitMusicDomainEvent } from "@/lib/plexicon-events/emit-domain-event"

import { getCmoContributorRecords, getCmoWorkRecord } from "./cmo-pack-data"

const LEGAL_BASIS = "Electronic Communications and Transactions Act 25 of 2002"

export type CertificateContributor = {
  name: string
  role: string
  percentage: number
  confirmed: boolean
}

export type CertificateRecord = {
  verification_id: string
  work_title: string
  contributors: CertificateContributor[]
  audio_file_checksum: string | null
  legal_basis: string
  created_at: string
}

/**
 * Generates a proof-of-collaboration certificate for a song.
 *
 * Requires at least one uploaded master audio asset with a real SHA-256
 * checksum (see Phase 2's work-asset-storage-repository) — a certificate
 * with no real file to attest to would be a placeholder, not proof.
 */
export async function generateCollaborationCertificate(input: {
  workId: string
  workspaceId: string
  generatedByUserId: string
}): Promise<CertificateRecord> {
  const work = await getCmoWorkRecord(input.workId, input.workspaceId)
  if (!work) {
    throw new Error("Work not found.")
  }

  const contributorRows = await getCmoContributorRecords(input.workId, input.workspaceId)
  if (contributorRows.length === 0) {
    throw new Error("Add contributors before generating a certificate.")
  }

  const unconfirmed = contributorRows.filter((c) => !c.confirmed)
  if (unconfirmed.length > 0) {
    throw new Error("All contributor splits must be confirmed before generating a certificate.")
  }

  const audioAsset = await getLatestMasterAudioAsset(input.workId, input.workspaceId)
  if (!audioAsset || !audioAsset.checksum) {
    throw new Error("Upload the song's master audio file before generating a certificate.")
  }

  const contributors: CertificateContributor[] = contributorRows.map((c) => ({
    name: c.name,
    role: c.role,
    percentage: c.percentage,
    confirmed: c.confirmed,
  }))

  const rows = await prisma.$queryRaw<Array<{
    verification_id: string
    work_title: string
    contributors: CertificateContributor[]
    audio_file_checksum: string | null
    legal_basis: string
    created_at: Date | string
  }>>`
    INSERT INTO public.collaboration_certificates (
      workspace_id,
      work_id,
      work_title,
      contributors,
      audio_file_checksum,
      audio_file_checksum_algorithm,
      legal_basis,
      generated_by_user_id
    )
    VALUES (
      ${input.workspaceId}::uuid,
      ${input.workId}::uuid,
      ${work.work_title},
      ${JSON.stringify(contributors)}::jsonb,
      ${audioAsset.checksum},
      'sha256',
      ${LEGAL_BASIS},
      ${input.generatedByUserId}
    )
    RETURNING
      verification_id,
      work_title,
      contributors,
      audio_file_checksum,
      legal_basis,
      created_at
  `

  const created = rows[0]
  if (!created) throw new Error("Failed to create certificate.")

  await emitMusicDomainEvent({
    eventType: "plexicon.domain.music.collaboration_proof.issued",
    workspaceId: input.workspaceId,
    payload: {
      tenant_id: input.workspaceId,
      institution_id: input.workspaceId,
      actor_id: input.generatedByUserId,
      song_id: input.workId,
      contributor_actor_ids: contributors.map((c) => c.name),
      role_description: contributors.map((c) => `${c.name}:${c.role}`).join(", "),
      content_hash: { algorithm: "sha256", digest: audioAsset.checksum },
      legal_basis_reference: LEGAL_BASIS,
      certificate_artifact_reference: created.verification_id,
    },
  })

  return {
    ...created,
    created_at: created.created_at instanceof Date ? created.created_at.toISOString() : created.created_at,
  }
}

/**
 * Retrieves full certificate data, including split percentages — for
 * the authenticated workspace owner only, not the public verify route.
 */
export async function getCertificateByVerificationId(
  verificationId: string
): Promise<CertificateRecord | null> {
  const rows = await prisma.$queryRaw<Array<{
    verification_id: string
    work_title: string
    contributors: CertificateContributor[]
    audio_file_checksum: string | null
    legal_basis: string
    created_at: Date | string
  }>>`
    SELECT verification_id, work_title, contributors, audio_file_checksum, legal_basis, created_at
    FROM public.collaboration_certificates
    WHERE verification_id = ${verificationId}::uuid
    LIMIT 1
  `

  const row = rows[0]
  if (!row) return null

  return {
    ...row,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  }
}

/**
 * Public verification view — per Phase 4c, shows contributor names and
 * roles but NOT split percentages or private data.
 */
export async function getPublicCertificateView(verificationId: string) {
  const certificate = await getCertificateByVerificationId(verificationId)
  if (!certificate) return null

  return {
    verification_id: certificate.verification_id,
    work_title: certificate.work_title,
    contributors: certificate.contributors.map((c) => ({ name: c.name, role: c.role })),
    generated_at: certificate.created_at,
  }
}
