import {
  EVIDENCE_REQUIREMENT_LEVELS,
  EVIDENCE_TYPES,
  EVIDENCE_VERIFICATION_STATUSES,
  EvidenceRequirementLevel,
  EvidenceType,
  EvidenceVerificationStatus,
} from "@/contracts/evidence-vault/evidence.constants"

import { prisma } from "@/lib/db/prisma"

import { REQUIRED_EVIDENCE_POLICY_RULES } from "./requiredEvidencePolicy.constants"

type EvidencePackReadinessState =
  | "not_assessed"
  | "incomplete"
  | "pending_review"
  | "conditionally_ready"
  | "ready"
  | "blocked"
  | "disputed"
  | "expired"
  | "superseded"

type WorkflowGateStatus =
  | "allowed"
  | "conditional"
  | "blocked"
  | "warning"
  | "not_applicable"

type RequirementSatisfactionState =
  | "satisfied"
  | "missing"
  | "pending_review"
  | "rejected"
  | "expired"
  | "superseded"
  | "invalid"

type EvidenceGovernanceFlag = {
  code: string
  severity: "info" | "warning" | "blocker"
  message: string
  evidenceType?: string
  evidenceIds: string[]
  blocksSubmission: boolean
  blocksPayout: boolean
  requiresHumanReview: boolean
}

type EvidenceRequirementSummary = {
  evidenceType: EvidenceType
  requirementLevel: EvidenceRequirementLevel
  satisfactionState: RequirementSatisfactionState
  relatedEvidenceIds: string[]
  isBlocking: boolean
  isAuthorityCritical: boolean
  isPayoutCritical: boolean
  message: string
}

type WorkflowGateResult = {
  status: WorkflowGateStatus
  reasons: string[]
  blockingEvidenceTypes: string[]
  warningEvidenceTypes: string[]
  requiresHumanReview: boolean
}

type EvidenceWorkflowImpacts = {
  submissionEligibility: WorkflowGateResult
  queueEligibility: WorkflowGateResult
  royaltyEligibility: WorkflowGateResult
  payoutReadiness: WorkflowGateResult
  remediationRequirement: WorkflowGateResult
  reconciliationImpact: WorkflowGateResult
}

type DiagnosticEventPreview = {
  previewOnly: true
  eventType: string
  trigger: string
  message: string
  evidenceIds: string[]
}

type EvidencePackReadinessResult = {
  success: true
  mode: "TEST_READ_ONLY"
  entityType: "WORK"
  entityId: string
  workflowContext: "submission_readiness"
  readinessState: EvidencePackReadinessState
  ready: boolean
  evaluatedAt: string
  policyVersion: "TEST_POLICY_V1"
  evidenceCount: number
  blockers: EvidenceGovernanceFlag[]
  warnings: EvidenceGovernanceFlag[]
  requirementSummaries: EvidenceRequirementSummary[]
  workflowImpacts: EvidenceWorkflowImpacts
  governanceFlags: EvidenceGovernanceFlag[]
  diagnosticEventPreviews: DiagnosticEventPreview[]
  diagnostics: {
    noEvidenceFound: boolean
    invalidEvidenceRecords: {
      evidenceId: string
      evidenceType: string
      verificationStatus: string
      requirementLevel: string
    }[]
    message: string
  }
}

const authorityCriticalEvidenceTypes =
  new Set<EvidenceType>([
    "SPLIT_CONFIRMATION",
    "DEED_OF_ASSIGNMENT",
    "IPI_CONFIRMATION",
    "PUBLISHER_AUTHORIZATION",
    "TERRITORY_CLEARANCE",
    "CONTRACT",
  ])

const payoutCriticalEvidenceTypes =
  new Set<EvidenceType>([
    "SPLIT_CONFIRMATION",
    "DEED_OF_ASSIGNMENT",
    "IPI_CONFIRMATION",
    "ID_DOCUMENT",
    "PROOF_OF_ADDRESS",
    "ROYALTY_STATEMENT",
    "USAGE_REPORT",
    "CONTRACT",
  ])

export async function evaluateEvidencePackReadiness(
  workId: string
): Promise<EvidencePackReadinessResult> {
  let evidenceRecords: {
    id: string
    evidenceType: string
    requirementLevel: string
    verificationStatus: string
    supersededByEvidenceId: string | null
    expiryDate: Date | null
  }[]

  try {
    evidenceRecords =
      await prisma.registrationEvidence.findMany({
        select: {
          id: true,
          evidenceType: true,
          requirementLevel: true,
          verificationStatus: true,
          supersededByEvidenceId: true,
          expiryDate: true,
        },
      where: {
        relatedEntityId: workId,
        relatedEntityType: {
          in: [
            "WORK",
            "work",
            "musical_work",
          ],
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })
  } catch {
    return buildEvidencePersistenceUnavailableResult(workId)
  }

  const policies =
    REQUIRED_EVIDENCE_POLICY_RULES.filter(
      (rule) => rule.entityType === "WORK"
    )

  const invalidEvidenceRecords =
    evidenceRecords
      .filter(
        (record) =>
          !isEvidenceType(record.evidenceType) ||
          !isEvidenceVerificationStatus(record.verificationStatus) ||
          !isEvidenceRequirementLevel(record.requirementLevel)
      )
      .map((record) => ({
        evidenceId: record.id,
        evidenceType: record.evidenceType,
        verificationStatus: record.verificationStatus,
        requirementLevel: record.requirementLevel,
      }))

  const validEvidenceRecords =
    evidenceRecords.filter(
      (record) =>
        isEvidenceType(record.evidenceType) &&
        isEvidenceVerificationStatus(record.verificationStatus) &&
        isEvidenceRequirementLevel(record.requirementLevel)
    )

  const requirementSummaries =
    policies.map((policy) => {
      const relatedEvidence =
        validEvidenceRecords.filter(
          (record) => record.evidenceType === policy.evidenceType
        )

      const satisfactionState =
        resolveRequirementSatisfactionState(relatedEvidence)

      return {
        evidenceType: policy.evidenceType,
        requirementLevel: policy.requirementLevel,
        satisfactionState,
        relatedEvidenceIds:
          relatedEvidence.map((record) => record.id),
        isBlocking:
          policy.requirementLevel === "BLOCKING",
        isAuthorityCritical:
          authorityCriticalEvidenceTypes.has(policy.evidenceType),
        isPayoutCritical:
          payoutCriticalEvidenceTypes.has(policy.evidenceType),
        message:
          buildRequirementMessage(
            policy.evidenceType,
            policy.requirementLevel,
            satisfactionState
          ),
      }
    })

  const blockers =
    buildBlockers(requirementSummaries)

  const warnings =
    buildWarnings(requirementSummaries)

  const invalidRecordWarnings =
    invalidEvidenceRecords.map((record) => ({
      code: "INVALID_EVIDENCE_RECORD",
      severity: "warning" as const,
      message:
        "Evidence record could not be used in TEST readiness evaluation.",
      evidenceType: record.evidenceType,
      evidenceIds: [
        record.evidenceId,
      ],
      blocksSubmission: false,
      blocksPayout: false,
      requiresHumanReview: true,
    }))

  const governanceFlags = [
    ...blockers,
    ...warnings,
    ...invalidRecordWarnings,
  ]

  const readinessState =
    resolveReadinessState({
      evidenceCount: evidenceRecords.length,
      requirementSummaries,
      blockers,
      warnings,
    })

  const workflowImpacts =
    buildWorkflowImpacts({
      readinessState,
      blockers,
      warnings,
      requirementSummaries,
    })

  const diagnosticEventPreviews =
    buildDiagnosticEventPreviews({
      readinessState,
      blockers,
      warnings,
      evidenceCount: evidenceRecords.length,
    })

  return {
    success: true,
    mode: "TEST_READ_ONLY",
    entityType: "WORK",
    entityId: workId,
    workflowContext: "submission_readiness",
    readinessState,
    ready: readinessState === "ready",
    evaluatedAt: new Date().toISOString(),
    policyVersion: "TEST_POLICY_V1",
    evidenceCount: evidenceRecords.length,
    blockers,
    warnings: [
      ...warnings,
      ...invalidRecordWarnings,
    ],
    requirementSummaries,
    workflowImpacts,
    governanceFlags,
    diagnosticEventPreviews,
    diagnostics: {
      noEvidenceFound: evidenceRecords.length === 0,
      invalidEvidenceRecords,
      message:
        evidenceRecords.length === 0
          ? "No evidence records were found for this TEST work. Readiness is not faked."
          : "Evidence readiness was evaluated from persisted evidence records and TEST policy rules.",
    },
  }
}

function buildEvidencePersistenceUnavailableResult(
  workId: string
): EvidencePackReadinessResult {
  const persistenceUnavailableFlag: EvidenceGovernanceFlag = {
    code: "EVIDENCE_PERSISTENCE_UNAVAILABLE",
    severity: "blocker",
    message:
      "Evidence persistence unavailable. RegistrationEvidence table is unavailable or not aligned in the current TEST database.",
    evidenceIds: [],
    blocksSubmission: true,
    blocksPayout: true,
    requiresHumanReview: true,
  }

  return {
    success: true,
    mode: "TEST_READ_ONLY",
    entityType: "WORK",
    entityId: workId,
    workflowContext: "submission_readiness",
    readinessState: "not_assessed",
    ready: false,
    evaluatedAt: new Date().toISOString(),
    policyVersion: "TEST_POLICY_V1",
    evidenceCount: 0,
    blockers: [
      persistenceUnavailableFlag,
    ],
    warnings: [],
    requirementSummaries: [],
    workflowImpacts: {
      submissionEligibility: {
        status: "blocked",
        reasons: [
          persistenceUnavailableFlag.message,
        ],
        blockingEvidenceTypes: [],
        warningEvidenceTypes: [],
        requiresHumanReview: true,
      },
      queueEligibility: {
        status: "blocked",
        reasons: [
          "TEST read-only impact blocks queue eligibility because evidence persistence could not be inspected. No queue mutation is performed.",
        ],
        blockingEvidenceTypes: [],
        warningEvidenceTypes: [],
        requiresHumanReview: true,
      },
      royaltyEligibility: {
        status: "warning",
        reasons: [
          "Royalty eligibility cannot be trusted while evidence persistence is unavailable.",
        ],
        blockingEvidenceTypes: [],
        warningEvidenceTypes: [],
        requiresHumanReview: true,
      },
      payoutReadiness: {
        status: "blocked",
        reasons: [
          "Payout readiness is blocked in TEST diagnostics because evidence persistence could not be inspected.",
        ],
        blockingEvidenceTypes: [],
        warningEvidenceTypes: [],
        requiresHumanReview: true,
      },
      remediationRequirement: {
        status: "blocked",
        reasons: [
          "Evidence persistence alignment must be resolved before governed evidence remediation can be trusted.",
        ],
        blockingEvidenceTypes: [],
        warningEvidenceTypes: [],
        requiresHumanReview: true,
      },
      reconciliationImpact: {
        status: "warning",
        reasons: [
          "Reconciliation impact is diagnostic only while evidence persistence is unavailable.",
        ],
        blockingEvidenceTypes: [],
        warningEvidenceTypes: [],
        requiresHumanReview: false,
      },
    },
    governanceFlags: [
      persistenceUnavailableFlag,
    ],
    diagnosticEventPreviews: [
      {
        previewOnly: true,
        eventType: "evidence_assessment_run",
        trigger: "read_only_test_fetch",
        message:
          "PREVIEW ONLY: Evidence readiness evaluation was requested.",
        evidenceIds: [],
      },
      {
        previewOnly: true,
        eventType: "evidence_persistence_unavailable",
        trigger: "registration_evidence_lookup_failed",
        message:
          "PREVIEW ONLY: RegistrationEvidence persistence is unavailable or not aligned. No audit event was written.",
        evidenceIds: [],
      },
    ],
    diagnostics: {
      noEvidenceFound: true,
      invalidEvidenceRecords: [],
      message:
        "Evidence persistence unavailable. RegistrationEvidence table is unavailable or not aligned in the current TEST database. Readiness is not faked.",
    },
  }
}

function resolveRequirementSatisfactionState(
  evidenceRecords: {
    verificationStatus: string
    supersededByEvidenceId: string | null
    expiryDate: Date | null
  }[]
): RequirementSatisfactionState {
  if (evidenceRecords.length === 0) {
    return "missing"
  }

  if (
    evidenceRecords.some(
      (record) => record.verificationStatus === "REJECTED"
    )
  ) {
    return "rejected"
  }

  if (
    evidenceRecords.some(
      (record) =>
        record.expiryDate &&
        record.expiryDate.getTime() < Date.now()
    )
  ) {
    return "expired"
  }

  if (
    evidenceRecords.every(
      (record) => Boolean(record.supersededByEvidenceId)
    )
  ) {
    return "superseded"
  }

  if (
    evidenceRecords.some(
      (record) =>
        record.verificationStatus === "PENDING" ||
        record.verificationStatus === "UNDER_REVIEW"
    )
  ) {
    return "pending_review"
  }

  return "satisfied"
}

function buildBlockers(
  requirements: EvidenceRequirementSummary[]
): EvidenceGovernanceFlag[] {
  return requirements
    .filter(
      (requirement) =>
        requirement.isBlocking &&
        requirement.satisfactionState !== "satisfied"
    )
    .map((requirement) => ({
      code: `BLOCKING_${requirement.satisfactionState.toUpperCase()}`,
      severity: "blocker",
      message: requirement.message,
      evidenceType: requirement.evidenceType,
      evidenceIds: requirement.relatedEvidenceIds,
      blocksSubmission: true,
      blocksPayout: requirement.isPayoutCritical,
      requiresHumanReview:
        requirement.satisfactionState !== "missing",
    }))
}

function buildWarnings(
  requirements: EvidenceRequirementSummary[]
): EvidenceGovernanceFlag[] {
  return requirements
    .filter(
      (requirement) =>
        !requirement.isBlocking &&
        requirement.satisfactionState !== "satisfied"
    )
    .map((requirement) => ({
      code: `WARNING_${requirement.satisfactionState.toUpperCase()}`,
      severity: "warning",
      message: requirement.message,
      evidenceType: requirement.evidenceType,
      evidenceIds: requirement.relatedEvidenceIds,
      blocksSubmission: false,
      blocksPayout: false,
      requiresHumanReview:
        requirement.satisfactionState !== "missing",
    }))
}

function resolveReadinessState(input: {
  evidenceCount: number
  requirementSummaries: EvidenceRequirementSummary[]
  blockers: EvidenceGovernanceFlag[]
  warnings: EvidenceGovernanceFlag[]
}): EvidencePackReadinessState {
  if (input.evidenceCount === 0) {
    return "not_assessed"
  }

  if (input.blockers.length > 0) {
    if (
      input.requirementSummaries.some(
        (requirement) => requirement.satisfactionState === "expired"
      )
    ) {
      return "expired"
    }

    return "blocked"
  }

  if (
    input.requirementSummaries.some(
      (requirement) =>
        requirement.satisfactionState === "pending_review"
    )
  ) {
    return "pending_review"
  }

  if (
    input.requirementSummaries.some(
      (requirement) =>
        requirement.satisfactionState === "superseded"
    )
  ) {
    return "superseded"
  }

  if (input.warnings.length > 0) {
    return "conditionally_ready"
  }

  return "ready"
}

function buildWorkflowImpacts(input: {
  readinessState: EvidencePackReadinessState
  blockers: EvidenceGovernanceFlag[]
  warnings: EvidenceGovernanceFlag[]
  requirementSummaries: EvidenceRequirementSummary[]
}): EvidenceWorkflowImpacts {
  const blockingEvidenceTypes =
    input.blockers
      .map((blocker) => blocker.evidenceType)
      .filter((evidenceType): evidenceType is string =>
        Boolean(evidenceType)
      )

  const warningEvidenceTypes =
    input.warnings
      .map((warning) => warning.evidenceType)
      .filter((evidenceType): evidenceType is string =>
        Boolean(evidenceType)
      )

  const requiresHumanReview =
    [
      ...input.blockers,
      ...input.warnings,
    ].some((flag) => flag.requiresHumanReview)

  const submissionStatus =
    input.blockers.length > 0 ||
    input.readinessState === "not_assessed"
      ? "blocked"
      : input.warnings.length > 0
        ? "conditional"
        : "allowed"

  const payoutStatus =
    input.requirementSummaries.some(
      (requirement) =>
        requirement.isPayoutCritical &&
        requirement.satisfactionState !== "satisfied"
    )
      ? "blocked"
      : "allowed"

  return {
    submissionEligibility: {
      status: submissionStatus,
      reasons:
        input.blockers.length > 0
          ? input.blockers.map((blocker) => blocker.message)
          : input.warnings.map((warning) => warning.message),
      blockingEvidenceTypes,
      warningEvidenceTypes,
      requiresHumanReview,
    },
    queueEligibility: {
      status: submissionStatus,
      reasons: [
        "TEST read-only impact mirrors submission eligibility. No queue mutation is performed.",
      ],
      blockingEvidenceTypes,
      warningEvidenceTypes,
      requiresHumanReview,
    },
    royaltyEligibility: {
      status:
        payoutStatus === "blocked"
          ? "warning"
          : "allowed",
      reasons:
        payoutStatus === "blocked"
          ? [
              "Payout-critical or authority-critical evidence is incomplete for future royalty eligibility.",
            ]
          : [],
      blockingEvidenceTypes: [],
      warningEvidenceTypes,
      requiresHumanReview,
    },
    payoutReadiness: {
      status: payoutStatus,
      reasons:
        payoutStatus === "blocked"
          ? [
              "Payout readiness is blocked or held by incomplete payout-critical evidence.",
            ]
          : [],
      blockingEvidenceTypes:
        payoutStatus === "blocked"
          ? blockingEvidenceTypes
          : [],
      warningEvidenceTypes,
      requiresHumanReview,
    },
    remediationRequirement: {
      status:
        input.blockers.length > 0
          ? "blocked"
          : input.warnings.length > 0
            ? "warning"
            : "not_applicable",
      reasons:
        input.blockers.length > 0
          ? [
              "Evidence remediation is required before governed progression.",
            ]
          : [],
      blockingEvidenceTypes,
      warningEvidenceTypes,
      requiresHumanReview,
    },
    reconciliationImpact: {
      status: "not_applicable",
      reasons: [
        "Reconciliation impact is informational only in this TEST slice.",
      ],
      blockingEvidenceTypes: [],
      warningEvidenceTypes: [],
      requiresHumanReview: false,
    },
  }
}

function buildDiagnosticEventPreviews(input: {
  readinessState: EvidencePackReadinessState
  blockers: EvidenceGovernanceFlag[]
  warnings: EvidenceGovernanceFlag[]
  evidenceCount: number
}): DiagnosticEventPreview[] {
  const previews: DiagnosticEventPreview[] = [
    {
      previewOnly: true,
      eventType: "evidence_assessment_run",
      trigger: "read_only_test_fetch",
      message:
        "PREVIEW ONLY: Evidence readiness evaluation was requested.",
      evidenceIds: [],
    },
  ]

  if (input.evidenceCount === 0) {
    previews.push({
      previewOnly: true,
      eventType: "evidence_missing_detected",
      trigger: "no_evidence_records_found",
      message:
        "PREVIEW ONLY: No evidence records were found for this TEST work.",
      evidenceIds: [],
    })
  }

  if (input.blockers.length > 0) {
    previews.push({
      previewOnly: true,
      eventType: "blocker_detected",
      trigger: "readiness_evaluation",
      message:
        "PREVIEW ONLY: Evidence blockers were detected. No audit event was written.",
      evidenceIds:
        input.blockers.flatMap((blocker) => blocker.evidenceIds),
    })
  }

  if (input.warnings.length > 0) {
    previews.push({
      previewOnly: true,
      eventType: "warning_detected",
      trigger: "readiness_evaluation",
      message:
        "PREVIEW ONLY: Evidence warnings were detected. No audit event was written.",
      evidenceIds:
        input.warnings.flatMap((warning) => warning.evidenceIds),
    })
  }

  previews.push({
    previewOnly: true,
    eventType: "evidence_readiness_evaluated",
    trigger: "read_only_test_fetch",
    message:
      `PREVIEW ONLY: Evidence readiness evaluated as ${input.readinessState}.`,
    evidenceIds: [],
  })

  return previews
}

function buildRequirementMessage(
  evidenceType: EvidenceType,
  requirementLevel: EvidenceRequirementLevel,
  satisfactionState: RequirementSatisfactionState
) {
  if (satisfactionState === "satisfied") {
    return `${evidenceType} satisfies ${requirementLevel} requirement.`
  }

  return `${evidenceType} is ${satisfactionState} for ${requirementLevel} requirement.`
}

function isEvidenceType(value: string): value is EvidenceType {
  return EVIDENCE_TYPES.includes(value as EvidenceType)
}

function isEvidenceVerificationStatus(
  value: string
): value is EvidenceVerificationStatus {
  return EVIDENCE_VERIFICATION_STATUSES.includes(
    value as EvidenceVerificationStatus
  )
}

function isEvidenceRequirementLevel(
  value: string
): value is EvidenceRequirementLevel {
  return EVIDENCE_REQUIREMENT_LEVELS.includes(
    value as EvidenceRequirementLevel
  )
}
