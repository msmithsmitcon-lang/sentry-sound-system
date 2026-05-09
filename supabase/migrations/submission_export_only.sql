-- Submission Export Persistence Layer V1

CREATE TABLE IF NOT EXISTS "SubmissionExport" (
    "id" TEXT NOT NULL,
    "regulator" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "manifestId" TEXT,
    "submissionQueueId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionExport_pkey"
    PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SubmissionExport_regulator_idx"
ON "SubmissionExport"("regulator");

CREATE INDEX IF NOT EXISTS "SubmissionExport_manifestId_idx"
ON "SubmissionExport"("manifestId");

CREATE INDEX IF NOT EXISTS "SubmissionExport_submissionQueueId_idx"
ON "SubmissionExport"("submissionQueueId");

CREATE INDEX IF NOT EXISTS "SubmissionExport_createdAt_idx"
ON "SubmissionExport"("createdAt");
