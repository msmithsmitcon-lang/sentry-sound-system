-- Operational Incident Management Layer V1

CREATE TABLE IF NOT EXISTS "OperationalIncident" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationalIncident_pkey"
    PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "OperationalIncident_type_idx"
ON "OperationalIncident"("type");

CREATE INDEX IF NOT EXISTS "OperationalIncident_severity_idx"
ON "OperationalIncident"("severity");

CREATE INDEX IF NOT EXISTS "OperationalIncident_status_idx"
ON "OperationalIncident"("status");

CREATE INDEX IF NOT EXISTS "OperationalIncident_createdAt_idx"
ON "OperationalIncident"("createdAt");
