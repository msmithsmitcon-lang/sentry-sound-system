import { prisma } from "../../db/prisma"

export async function createRegistrationEvidenceRecord(data: {
  evidenceType: string
  layer: string
  title: string
  description?: string
  requirementLevel: string
  verificationStatus: string
  requiresSignature?: boolean
  requiresVerification?: boolean
  blocksSubmissionIfMissing?: boolean
  uploadedBy?: string
  relatedEntityType: string
  relatedEntityId: string
  metadata?: Record<string, unknown>
}) {
  return prisma.registrationEvidence.create({
    data: {
      evidenceType: data.evidenceType,
      layer: data.layer,
      title: data.title,
      description: data.description,
      requirementLevel: data.requirementLevel,
      verificationStatus: data.verificationStatus,
      requiresSignature: data.requiresSignature ?? false,
      requiresVerification: data.requiresVerification ?? false,
      blocksSubmissionIfMissing: data.blocksSubmissionIfMissing ?? false,
      uploadedBy: data.uploadedBy,
      relatedEntityType: data.relatedEntityType,
      relatedEntityId: data.relatedEntityId,
      metadata: data.metadata
    }
  })
}

export async function getEvidenceForEntity(input: {
  relatedEntityType: string
  relatedEntityId: string
}) {
  return prisma.registrationEvidence.findMany({
    where: {
      relatedEntityType: input.relatedEntityType,
      relatedEntityId: input.relatedEntityId
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}
