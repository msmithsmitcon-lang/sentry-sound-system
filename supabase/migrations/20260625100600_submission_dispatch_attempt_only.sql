-- Dispatch Attempt Audit Layer V1

CREATE TABLE IF NOT EXISTS "SubmissionDispatchAttempt" (
    "id" TEXT NOT NULL,
    "dispatchId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "regulatorResponse" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionDispatchAttempt_pkey"
    PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SubmissionDispatchAttempt_dispatchId_idx"
ON "SubmissionDispatchAttempt"("dispatchId");

CREATE INDEX IF NOT EXISTS "SubmissionDispatchAttempt_attemptNumber_idx"
ON "SubmissionDispatchAttempt"("attemptNumber");

CREATE INDEX IF NOT EXISTS "SubmissionDispatchAttempt_status_idx"
ON "SubmissionDispatchAttempt"("status");

CREATE INDEX IF NOT EXISTS "SubmissionDispatchAttempt_createdAt_idx"
ON "SubmissionDispatchAttempt"("createdAt");
