-- Evidence Vault V1
-- EvidenceAuditEvent

CREATE TABLE IF NOT EXISTS "EvidenceAuditEvent" (
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

    CONSTRAINT "EvidenceAuditEvent_pkey"
    PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EvidenceAuditEvent_evidenceId_idx"
ON "EvidenceAuditEvent"("evidenceId");

CREATE INDEX IF NOT EXISTS "EvidenceAuditEvent_eventType_idx"
ON "EvidenceAuditEvent"("eventType");

CREATE INDEX IF NOT EXISTS "EvidenceAuditEvent_occurredAt_idx"
ON "EvidenceAuditEvent"("occurredAt");

ALTER TABLE "EvidenceAuditEvent"
ADD CONSTRAINT "EvidenceAuditEvent_evidenceId_fkey"
FOREIGN KEY ("evidenceId")
REFERENCES "RegistrationEvidence"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
