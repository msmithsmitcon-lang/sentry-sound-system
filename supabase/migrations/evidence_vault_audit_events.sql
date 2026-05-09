-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "MusicalWork" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "alternateTitle" TEXT,
    "subtitle" TEXT,
    "language" TEXT,
    "status" TEXT NOT NULL,
    "iswc" TEXT,
    "documented" BOOLEAN NOT NULL DEFAULT false,
    "disputed" BOOLEAN NOT NULL DEFAULT false,
    "amendmentRequired" BOOLEAN NOT NULL DEFAULT false,
    "readinessScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicalWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicalWorkContributor" (
    "id" TEXT NOT NULL,
    "musicalWorkId" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "contributorName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "ownershipPercentage" DOUBLE PRECISION NOT NULL,
    "publisherSharePercentage" DOUBLE PRECISION,
    "territory" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MusicalWorkContributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isrc" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordingDate" TIMESTAMP(3),
    "studioName" TEXT,
    "masterOwnerId" TEXT NOT NULL,
    "masterOwnerName" TEXT NOT NULL,
    "linkedMusicalWorkId" TEXT,
    "documented" BOOLEAN NOT NULL DEFAULT false,
    "disputed" BOOLEAN NOT NULL DEFAULT false,
    "amendmentRequired" BOOLEAN NOT NULL DEFAULT false,
    "readinessScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordingPerformer" (
    "id" TEXT NOT NULL,
    "recordingId" TEXT NOT NULL,
    "performerId" TEXT NOT NULL,
    "performerName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "participationPercentage" DOUBLE PRECISION,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecordingPerformer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationAuditEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "performedBy" TEXT,
    "reason" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "relatedEvidenceIds" JSONB,
    "metadata" JSONB,
    "musicalWorkId" TEXT,
    "recordingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistrationAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationDispute" (
    "id" TEXT NOT NULL,
    "disputeType" TEXT NOT NULL,
    "disputeStatus" TEXT NOT NULL,
    "relatedEntityType" TEXT NOT NULL,
    "relatedEntityId" TEXT NOT NULL,
    "openedBy" TEXT,
    "description" TEXT NOT NULL,
    "evidenceIds" JSONB,
    "proposedResolution" TEXT,
    "affectsRegistrationStatus" BOOLEAN NOT NULL DEFAULT true,
    "resultingRegistrationStatus" TEXT,
    "musicalWorkId" TEXT,
    "recordingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationDispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationAmendment" (
    "id" TEXT NOT NULL,
    "amendmentType" TEXT NOT NULL,
    "amendmentStatus" TEXT NOT NULL,
    "relatedEntityType" TEXT NOT NULL,
    "relatedEntityId" TEXT NOT NULL,
    "requestedBy" TEXT,
    "reason" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "evidenceIds" JSONB,
    "requiresReconfirmation" BOOLEAN NOT NULL DEFAULT false,
    "musicalWorkId" TEXT,
    "recordingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationAmendment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationEvidence" (
    "id" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "layer" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requirementLevel" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL,
    "requiresSignature" BOOLEAN NOT NULL DEFAULT false,
    "requiresVerification" BOOLEAN NOT NULL DEFAULT false,
    "blocksSubmissionIfMissing" BOOLEAN NOT NULL DEFAULT false,
    "uploadedBy" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "supersededByEvidenceId" TEXT,
    "relatedEntityType" TEXT NOT NULL,
    "relatedEntityId" TEXT NOT NULL,
    "relatedSubmissionId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionSnapshot" (
    "id" TEXT NOT NULL,
    "exportId" TEXT NOT NULL,
    "submissionType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "exportPayload" JSONB NOT NULL,
    "exportFormat" TEXT,
    "generatedBy" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "regulatorResponse" JSONB,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionQueue" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT,
    "target" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "exportFormat" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 5,
    "regulatorReference" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "blockingIssues" JSONB,
    "metadata" JSONB,
    "snapshotId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubmissionQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionQueueEvent" (
    "id" TEXT NOT NULL,
    "submissionQueueId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionQueueEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionRemediationCase" (
    "id" TEXT NOT NULL,
    "submissionQueueId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "requiredActions" JSONB NOT NULL,
    "blocksRoyaltyEligibility" BOOLEAN NOT NULL DEFAULT true,
    "dueAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubmissionRemediationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceAuditEvent" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "actorUserId" TEXT,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "previousState" JSONB,
    "nextState" JSONB,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recording_isrc_key" ON "Recording"("isrc");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionSnapshot_exportId_key" ON "SubmissionSnapshot"("exportId");

-- CreateIndex
CREATE INDEX "EvidenceAuditEvent_evidenceId_idx" ON "EvidenceAuditEvent"("evidenceId");

-- CreateIndex
CREATE INDEX "EvidenceAuditEvent_eventType_idx" ON "EvidenceAuditEvent"("eventType");

-- CreateIndex
CREATE INDEX "EvidenceAuditEvent_occurredAt_idx" ON "EvidenceAuditEvent"("occurredAt");

-- AddForeignKey
ALTER TABLE "MusicalWorkContributor" ADD CONSTRAINT "MusicalWorkContributor_musicalWorkId_fkey" FOREIGN KEY ("musicalWorkId") REFERENCES "MusicalWork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordingPerformer" ADD CONSTRAINT "RecordingPerformer_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationAuditEvent" ADD CONSTRAINT "RegistrationAuditEvent_musicalWorkId_fkey" FOREIGN KEY ("musicalWorkId") REFERENCES "MusicalWork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationAuditEvent" ADD CONSTRAINT "RegistrationAuditEvent_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationDispute" ADD CONSTRAINT "RegistrationDispute_musicalWorkId_fkey" FOREIGN KEY ("musicalWorkId") REFERENCES "MusicalWork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationDispute" ADD CONSTRAINT "RegistrationDispute_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationAmendment" ADD CONSTRAINT "RegistrationAmendment_musicalWorkId_fkey" FOREIGN KEY ("musicalWorkId") REFERENCES "MusicalWork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationAmendment" ADD CONSTRAINT "RegistrationAmendment_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceAuditEvent" ADD CONSTRAINT "EvidenceAuditEvent_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "RegistrationEvidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
