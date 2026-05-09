import { SubmissionAdapterRegistry } from "./submission-adapter.registry"

import { samroSubmissionAdapter } from "../adapters/samro-submission.adapter"

export const submissionAdapterRegistry:
  SubmissionAdapterRegistry = {
    SAMRO:
      samroSubmissionAdapter,
  }
