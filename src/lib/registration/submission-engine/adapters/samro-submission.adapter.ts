import { SubmissionRegulatorAdapter } from "./submission-regulator-adapter.interface"
import { SubmissionQueueItem } from "../types/submission-queue-item.types"
import { SubmissionProcessingResult } from "../contracts/submission-processing-result.contract"

export const samroSubmissionAdapter: SubmissionRegulatorAdapter = {
  async validate(
    submission: SubmissionQueueItem
  ): Promise<SubmissionProcessingResult> {
    if (!submission.fingerprint) {
      return {
        success: false,
        nextStatus: "blocked",
        retryable: false,
        blockingIssues: [
          "Missing deterministic export fingerprint.",
        ],
      }
    }

    return {
      success: true,
      nextStatus: "validated",
      retryable: false,
      regulatorMessage: "SAMRO submission validated.",
    }
  },

  async package(
    submission: SubmissionQueueItem
  ): Promise<SubmissionProcessingResult> {
    return {
      success: true,
      nextStatus: "packaged",
      retryable: false,
      regulatorMessage: "SAMRO submission packaged.",
      metadata: {
        exportFormat: submission.exportFormat,
      },
    }
  },

  async submit(
    submission: SubmissionQueueItem
  ): Promise<SubmissionProcessingResult> {
    return {
      success: true,
      nextStatus: "submitted",
      retryable: false,
      regulatorMessage: "SAMRO submission prepared for external filing.",
      metadata: {
        target: submission.target,
        entityType: submission.entityType,
        entityId: submission.entityId,
      },
    }
  },

  async retry(
    submission: SubmissionQueueItem
  ): Promise<SubmissionProcessingResult> {
    return {
      success: false,
      nextStatus: "retry_pending",
      retryable: true,
      regulatorMessage: "SAMRO retry requested.",
    }
  },
}
