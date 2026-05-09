-- Submission Dispatch Queue V1

CREATE TABLE IF NOT EXISTS "SubmissionDispatchQueue" (
    "id" TEXT NOT NULL,
    "submissionExportId" TEXT NOT NULL,
    "regulator" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 5,
    "scheduledAt" TIMESTAMP(3),
    "dispatchedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionDispatchQueue_pkey"
    PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SubmissionDispatchQueue_submissionExportId_idx"
ON "SubmissionDispatchQueue"("submissionExportId");

CREATE INDEX IF NOT EXISTS "SubmissionDispatchQueue_regulator_idx"
ON "SubmissionDispatchQueue"("regulator");

CREATE INDEX IF NOT EXISTS "SubmissionDispatchQueue_status_idx"
ON "SubmissionDispatchQueue"("status");

CREATE INDEX IF NOT EXISTS "SubmissionDispatchQueue_scheduledAt_idx"
ON "SubmissionDispatchQueue"("scheduledAt");

CREATE INDEX IF NOT EXISTS "SubmissionDispatchQueue_createdAt_idx"
ON "SubmissionDispatchQueue"("createdAt");
