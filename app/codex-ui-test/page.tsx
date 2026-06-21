"use client"

import type { ReactNode } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"

type TestWork = {
  id: string
  work_title?: string
}

type ActionState = {
  label: string
  status: "idle" | "loading" | "success" | "error"
  message: string
}

type ReadinessResult = {
  ready?: boolean
  issues?: string[]
}

type ReadinessResponse = {
  readiness?: ReadinessResult
}

type SubmissionQueueItem = {
  id: string
  target?: string
  status?: string
  entityType?: string
  entityId?: string
  exportFormat?: string
  regulatorReference?: string | null
  metadata?: unknown
  createdAt?: string
  updatedAt?: string
  submittedAt?: string | null
}

type SubmissionResponse = {
  submission?: SubmissionQueueItem
}

type QueueResponse = {
  submissions?: SubmissionQueueItem[]
}

type LifecycleEvent = {
  id: string
  eventType?: string
  oldStatus?: string | null
  newStatus?: string | null
  message?: string | null
  createdAt?: string
}

type LifecycleResponse = {
  submissions?: SubmissionQueueItem[]
  events?: LifecycleEvent[]
}

type EvidenceGovernanceFlag = {
  code: string
  severity: string
  message: string
  evidenceType?: string
  evidenceIds?: string[]
  blocksSubmission?: boolean
  blocksPayout?: boolean
  requiresHumanReview?: boolean
}

type EvidenceRequirementSummary = {
  evidenceType: string
  requirementLevel: string
  satisfactionState: string
  relatedEvidenceIds?: string[]
  isBlocking?: boolean
  isAuthorityCritical?: boolean
  isPayoutCritical?: boolean
  message: string
}

type WorkflowGateResult = {
  status: string
  reasons?: string[]
  blockingEvidenceTypes?: string[]
  warningEvidenceTypes?: string[]
  requiresHumanReview?: boolean
}

type EvidenceWorkflowImpacts = {
  submissionEligibility?: WorkflowGateResult
  queueEligibility?: WorkflowGateResult
  royaltyEligibility?: WorkflowGateResult
  payoutReadiness?: WorkflowGateResult
  remediationRequirement?: WorkflowGateResult
  reconciliationImpact?: WorkflowGateResult
}

type DiagnosticEventPreview = {
  previewOnly: boolean
  eventType: string
  trigger: string
  message: string
  evidenceIds?: string[]
}

type EvidenceReadinessResult = {
  mode?: string
  entityType?: string
  entityId?: string
  workflowContext?: string
  readinessState?: string
  ready?: boolean
  evaluatedAt?: string
  policyVersion?: string
  evidenceCount?: number
  blockers?: EvidenceGovernanceFlag[]
  warnings?: EvidenceGovernanceFlag[]
  requirementSummaries?: EvidenceRequirementSummary[]
  workflowImpacts?: EvidenceWorkflowImpacts
  governanceFlags?: EvidenceGovernanceFlag[]
  diagnosticEventPreviews?: DiagnosticEventPreview[]
  diagnostics?: {
    noEvidenceFound?: boolean
    message?: string
  }
}

type EvidenceReadinessResponse = {
  evidenceReadiness?: EvidenceReadinessResult
}

type GuidedJourneyStatus =
  | "complete"
  | "blocked"
  | "not ready"
  | "available"
  | "unknown"

type GuidedJourneyStep = {
  label: string
  status: GuidedJourneyStatus
  explanation: string
  nextSafeAction: string
}

const initialAction: ActionState = {
  label: "Idle",
  status: "idle",
  message: "Ready for TEST API review.",
}

const CANONICAL_TEST_WORK_ID = "1d6de1ff-540d-4ad4-8212-2a3371d4bb66"

async function readJson(response: Response) {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : `Request failed with ${response.status}`
    )
  }

  return data
}

export default function CodexUiTestPage() {
  const [works, setWorks] = useState<TestWork[]>([])
  const [selectedWorkId, setSelectedWorkId] = useState("")
  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null)
  const [submission, setSubmission] = useState<SubmissionResponse | null>(null)
  const [queue, setQueue] = useState<QueueResponse | null>(null)
  const [lifecycle, setLifecycle] = useState<LifecycleResponse | null>(null)
  const [evidenceReadiness, setEvidenceReadiness] =
    useState<EvidenceReadinessResponse | null>(null)
  const [guidedJourneyLoading, setGuidedJourneyLoading] = useState(false)
  const [guidedJourneyError, setGuidedJourneyError] = useState<string | null>(
    null
  )
  const [lastResponse, setLastResponse] = useState<unknown>(null)
  const [action, setAction] = useState<ActionState>(initialAction)

  const selectedWork = useMemo(
    () => works.find((work) => work.id === selectedWorkId),
    [works, selectedWorkId]
  )

  async function loadLifecycleHistory(workId: string) {
    const data = (await readJson(
      await fetch(
        `/api/submissions/lifecycle?work_id=${encodeURIComponent(workId)}`
      )
    )) as LifecycleResponse

    setLifecycle(data)
  }

  async function loadEvidenceReadiness(workId: string) {
    const data = (await readJson(
      await fetch(
        `/api/evidence-readiness?work_id=${encodeURIComponent(workId)}`
      )
    )) as EvidenceReadinessResponse

    setEvidenceReadiness(data)
    return data
  }

  const loadReadOnlyJourneyState = useCallback(async (workId: string) => {
    const [readinessData, evidenceData, queueData] = (await Promise.all([
      readJson(
        await fetch(
          `/api/submissions/readiness?work_id=${encodeURIComponent(workId)}`
        )
      ),
      readJson(
        await fetch(
          `/api/evidence-readiness?work_id=${encodeURIComponent(workId)}`
        )
      ),
      readJson(await fetch("/api/submissions/pending")),
    ])) as [ReadinessResponse, EvidenceReadinessResponse, QueueResponse]

    setReadiness(readinessData)
    setEvidenceReadiness(evidenceData)
    setQueue(queueData)
  }, [])

  async function loadTestWork() {
    setAction({
      label: "Load Test Work",
      status: "loading",
      message: "Fetching controlled TEST works.",
    })

    try {
      const data = await readJson(await fetch("/api/test/get-work"))
      const loadedWorks = Array.isArray(data) ? data : []
      const nextSelectedWorkId = loadedWorks[0]?.id ?? ""

      setWorks(loadedWorks)
      setSelectedWorkId(nextSelectedWorkId)
      if (nextSelectedWorkId) {
        await loadLifecycleHistory(nextSelectedWorkId)
        await loadEvidenceReadiness(nextSelectedWorkId)
      } else {
        setLifecycle(null)
        setEvidenceReadiness(null)
      }
      setLastResponse(data)
      setAction({
        label: "Load Test Work",
        status: "success",
        message:
          loadedWorks.length > 0
            ? "Controlled TEST work loaded."
            : "No controlled TEST work returned.",
      })
    } catch (error) {
      setAction({
        label: "Load Test Work",
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load TEST work.",
      })
    }
  }

  async function checkReadiness() {
    if (!selectedWorkId) {
      setAction({
        label: "Check Readiness",
        status: "error",
        message: "Load or select a TEST work first.",
      })
      return
    }

    setAction({
      label: "Check Readiness",
      status: "loading",
      message: "Requesting backend readiness result.",
    })

    try {
      const data = (await readJson(
        await fetch(
          `/api/submissions/readiness?work_id=${encodeURIComponent(
            selectedWorkId
          )}`
        )
      )) as ReadinessResponse

      setReadiness(data)
      setLastResponse(data)
      setAction({
        label: "Check Readiness",
        status: "success",
        message: "Readiness response rendered from backend.",
      })
    } catch (error) {
      setAction({
        label: "Check Readiness",
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to check readiness.",
      })
    }
  }

  async function createSubmission() {
    if (!selectedWorkId) {
      setAction({
        label: "Create Submission",
        status: "error",
        message: "Load or select a TEST work first.",
      })
      return
    }

    setAction({
      label: "Create Submission",
      status: "loading",
      message: "Creating or retrieving submission queue item.",
    })

    try {
      const data = (await readJson(
        await fetch("/api/submissions/create-from-work", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            work_id: selectedWorkId,
          }),
        })
      )) as SubmissionResponse

      setSubmission(data)
      await loadLifecycleHistory(selectedWorkId)
      setLastResponse(data)
      setAction({
        label: "Create Submission",
        status: "success",
        message: "Submission queue response rendered from backend.",
      })
    } catch (error) {
      setAction({
        label: "Create Submission",
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create submission.",
      })
    }
  }

  async function viewQueue() {
    setAction({
      label: "View Queue",
      status: "loading",
      message: "Fetching pending submission queue.",
    })

    try {
      const data = (await readJson(
        await fetch("/api/submissions/pending")
      )) as QueueResponse

      setQueue(data)
      if (selectedWorkId) {
        await loadLifecycleHistory(selectedWorkId)
      }
      setLastResponse(data)
      setAction({
        label: "View Queue",
        status: "success",
        message: "Pending queue rendered from backend.",
      })
    } catch (error) {
      setAction({
        label: "View Queue",
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to view queue.",
      })
    }
  }

  async function refreshEvidenceReadiness() {
    if (!selectedWorkId) {
      setAction({
        label: "Refresh Evidence",
        status: "error",
        message: "Load or select a TEST work first.",
      })
      return
    }

    setAction({
      label: "Refresh Evidence",
      status: "loading",
      message: "Fetching read-only evidence readiness.",
    })

    try {
      const data =
        await loadEvidenceReadiness(selectedWorkId)

      setLastResponse(data)
      setAction({
        label: "Refresh Evidence",
        status: "success",
        message: "Evidence readiness rendered from backend TEST evaluation.",
      })
    } catch (error) {
      setAction({
        label: "Refresh Evidence",
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to refresh evidence readiness.",
      })
    }
  }

  async function selectWork(workId: string) {
    setSelectedWorkId(workId)
    await loadLifecycleHistory(workId)
    await loadEvidenceReadiness(workId)
  }

  useEffect(() => {
    let cancelled = false

    async function loadGuidedJourney() {
      setGuidedJourneyLoading(true)
      setGuidedJourneyError(null)

      try {
        // TEST-only/read-only: this guided panel uses approved GET APIs only.
        const data = await readJson(await fetch("/api/test/get-work"))
        const loadedWorks = Array.isArray(data) ? data : []
        const canonicalWork = loadedWorks.find(
          (work) => work.id === CANONICAL_TEST_WORK_ID
        )
        const nextWorkId =
          canonicalWork?.id ?? loadedWorks[0]?.id ?? CANONICAL_TEST_WORK_ID

        if (cancelled) {
          return
        }

        setWorks((currentWorks) =>
          currentWorks.length > 0 ? currentWorks : loadedWorks
        )
        setSelectedWorkId((currentWorkId) => currentWorkId || nextWorkId)
        await loadReadOnlyJourneyState(nextWorkId)
      } catch (error) {
        if (!cancelled) {
          setGuidedJourneyError(
            error instanceof Error
              ? error.message
              : "Failed to load guided TEST journey state."
          )
        }
      } finally {
        if (!cancelled) {
          setGuidedJourneyLoading(false)
        }
      }
    }

    void loadGuidedJourney()

    return () => {
      cancelled = true
    }
  }, [loadReadOnlyJourneyState])

  const readinessResult = readiness?.readiness
  const submissionResult = submission?.submission
  const queueItems = Array.isArray(queue?.submissions)
    ? queue.submissions
    : []
  const lifecycleSubmissions = Array.isArray(lifecycle?.submissions)
    ? lifecycle.submissions
    : []
  const lifecycleEvents = Array.isArray(lifecycle?.events)
    ? lifecycle.events
    : []
  const evidenceResult = evidenceReadiness?.evidenceReadiness
  const evidenceBlockers = Array.isArray(evidenceResult?.blockers)
    ? evidenceResult.blockers
    : []
  const evidenceWarnings = Array.isArray(evidenceResult?.warnings)
    ? evidenceResult.warnings
    : []
  const evidenceRequirements = Array.isArray(
    evidenceResult?.requirementSummaries
  )
    ? evidenceResult.requirementSummaries
    : []
  const evidenceGovernanceFlags = Array.isArray(
    evidenceResult?.governanceFlags
  )
    ? evidenceResult.governanceFlags
    : []
  const diagnosticEventPreviews = Array.isArray(
    evidenceResult?.diagnosticEventPreviews
  )
    ? evidenceResult.diagnosticEventPreviews
    : []
  const guidedJourneySteps = buildGuidedJourneySteps({
    selectedWorkId,
    selectedWorkTitle: selectedWork?.work_title,
    readinessResult,
    evidenceResult,
    queueItems,
    lifecycleSubmissions,
    lifecycleEvents,
  })

  return (
    <main className="min-h-screen bg-[#070b16] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#0b1222] px-6 py-8 shadow-2xl shadow-black/30 lg:block">
          <div className="mb-10">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/15 text-3xl font-black text-blue-300 ring-1 ring-blue-400/30">
              S
            </div>
            <div className="text-2xl font-black tracking-[0.2em]">
              SENTRY
            </div>
            <div className="text-xs font-semibold tracking-[0.42em] text-blue-300">
              SOUND
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-violet-400/30 bg-violet-500/10 px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-violet-200">
              Test Mode
            </div>
            <div className="mt-1 text-sm text-slate-300">
              Demo/review layer only
            </div>
          </div>

          <nav className="space-y-6 text-sm">
            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                Workflow
              </div>
              <div className="rounded-xl bg-blue-600 px-4 py-3 font-semibold">
                Submission Control
              </div>
              <div className="px-4 py-3 text-slate-400">Readiness</div>
              <div className="px-4 py-3 text-slate-400">Queue</div>
            </div>

            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                Boundary
              </div>
              <div className="px-4 py-2 text-slate-400">No direct DB calls</div>
              <div className="px-4 py-2 text-slate-400">Approved APIs only</div>
            </div>
          </nav>
        </aside>

        <section className="relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute left-1/3 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="pointer-events-none absolute right-16 top-24 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-7 lg:px-8">
            <header className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="text-sm text-slate-400">Welcome back,</div>
                <h1 className="mt-1 text-3xl font-bold">
                  Codex TEST Control Panel
                </h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 shadow-inner shadow-black/30">
                  Backend/API tests remain source of truth
                </div>
                <div className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/40">
                  TEST MODE
                </div>
              </div>
            </header>

            <section className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <StatusCard
                label="Selected Work"
                value={selectedWork?.work_title ?? "None"}
                detail={selectedWorkId || "Load a controlled TEST work"}
              />
              <StatusCard
                label="Readiness"
                value={
                  readinessResult
                    ? readinessResult.ready
                      ? "Ready"
                      : "Blocked"
                    : "Unchecked"
                }
                detail={
                  readinessResult?.issues?.length
                    ? readinessResult.issues.join(", ")
                    : "Backend readiness response"
                }
              />
              <StatusCard
                label="Submission"
                value={submissionResult?.status ?? "None"}
                detail={
                  submissionResult?.id ??
                  "Create from selected controlled work"
                }
              />
              <StatusCard
                label="Queue"
                value={String(queueItems.length)}
                detail="Pending/retry items returned by API"
              />
              <StatusCard
                label="Evidence"
                value={evidenceResult?.readinessState ?? "Unchecked"}
                detail={
                  evidenceResult?.diagnostics?.message ??
                  "Read-only TEST evidence evaluation"
                }
              />
            </section>

            <GuidedJourneyPanel
              loading={guidedJourneyLoading}
              error={guidedJourneyError}
              steps={guidedJourneySteps}
            />

            <section className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Approved TEST Actions</h2>
                  <p className="text-sm text-slate-400">
                    These controls render backend state from existing APIs only.
                  </p>
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
                    action.status === "error"
                      ? "bg-red-500/15 text-red-200"
                      : action.status === "success"
                        ? "bg-emerald-500/15 text-emerald-200"
                        : action.status === "loading"
                          ? "bg-blue-500/15 text-blue-200"
                          : "bg-slate-500/15 text-slate-300"
                  }`}
                >
                  {action.status}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <ActionButton
                  onClick={loadTestWork}
                  disabled={action.status === "loading"}
                >
                  Load Test Work
                </ActionButton>
                <ActionButton
                  onClick={checkReadiness}
                  disabled={action.status === "loading"}
                >
                  Check Readiness
                </ActionButton>
                <ActionButton
                  onClick={createSubmission}
                  disabled={action.status === "loading"}
                >
                  Create Submission
                </ActionButton>
                <ActionButton
                  onClick={viewQueue}
                  disabled={action.status === "loading"}
                >
                  View Queue
                </ActionButton>
                <ActionButton
                  onClick={refreshEvidenceReadiness}
                  disabled={action.status === "loading"}
                >
                  Refresh Evidence
                </ActionButton>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                <span className="font-semibold text-white">{action.label}:</span>{" "}
                {action.message}
              </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <Panel title="Controlled TEST Works">
                  {works.length === 0 ? (
                    <EmptyState text="No work loaded yet." />
                  ) : (
                    <div className="space-y-3">
                      {works.map((work) => (
                        <button
                          key={work.id}
                          onClick={() => {
                            void selectWork(work.id)
                          }}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                            selectedWorkId === work.id
                              ? "border-blue-400/70 bg-blue-500/15"
                              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                          }`}
                        >
                          <div className="font-semibold">
                            {work.work_title ?? "Untitled work"}
                          </div>
                          <div className="mt-1 break-all text-xs text-slate-400">
                            {work.id}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel title="Pending Queue">
                  {queueItems.length === 0 ? (
                    <EmptyState text="Queue not loaded or no pending items returned." />
                  ) : (
                    <div className="space-y-3">
                      {queueItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold">
                              {item.target} / {item.exportFormat}
                            </div>
                            <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-200">
                              {item.status}
                            </div>
                          </div>
                          <div className="mt-2 break-all text-xs text-slate-400">
                            {item.entityType}: {item.entityId}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel title="Lifecycle History">
                  {lifecycleSubmissions.length === 0 ? (
                    <EmptyState text="No lifecycle history returned for the selected work." />
                  ) : (
                    <div className="space-y-3">
                      {lifecycleSubmissions.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-semibold">
                                {item.target} / {item.exportFormat}
                              </div>
                              <div className="mt-1 break-all text-xs text-slate-400">
                                {item.id}
                              </div>
                            </div>
                            <div className="shrink-0 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-200">
                              {item.status}
                            </div>
                          </div>
                          <div className="mt-3 grid gap-2 text-xs text-slate-400 md:grid-cols-2">
                            <div>Created: {formatTimestamp(item.createdAt)}</div>
                            <div>Updated: {formatTimestamp(item.updatedAt)}</div>
                            {item.submittedAt ? (
                              <div>
                                Submitted: {formatTimestamp(item.submittedAt)}
                              </div>
                            ) : null}
                            {item.regulatorReference ? (
                              <div className="break-all">
                                Regulator ref: {item.regulatorReference}
                              </div>
                            ) : null}
                          </div>
                          {getRegulatorMessage(item.metadata) ? (
                            <div className="mt-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                              {getRegulatorMessage(item.metadata)}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel title="Evidence Pack Readiness">
                  {!evidenceResult ? (
                    <EmptyState text="No evidence readiness response yet." />
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
                              TEST READ-ONLY
                            </div>
                            <div className="mt-1 text-xl font-bold">
                              {evidenceResult.readinessState ?? "unknown"}
                            </div>
                          </div>
                          <div className="rounded-full bg-black/30 px-3 py-1 text-xs font-bold text-slate-200">
                            {evidenceResult.mode ?? "TEST_READ_ONLY"}
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2 text-xs text-slate-300 md:grid-cols-2">
                          <div>Policy: {evidenceResult.policyVersion}</div>
                          <div>
                            Evaluated:{" "}
                            {formatTimestamp(evidenceResult.evaluatedAt)}
                          </div>
                          <div>Evidence records: {evidenceResult.evidenceCount ?? 0}</div>
                          <div>
                            Workflow: {evidenceResult.workflowContext ?? "unknown"}
                          </div>
                        </div>
                        {evidenceResult.diagnostics?.message ? (
                          <div className="mt-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                            {evidenceResult.diagnostics.message}
                          </div>
                        ) : null}
                      </div>

                      <FlagList
                        title="Blockers"
                        emptyText="No backend blockers returned."
                        flags={evidenceBlockers}
                      />

                      <FlagList
                        title="Warnings"
                        emptyText="No backend warnings returned."
                        flags={evidenceWarnings}
                      />
                    </div>
                  )}
                </Panel>

                <Panel title="Evidence Requirement Status">
                  {evidenceRequirements.length === 0 ? (
                    <EmptyState text="No evidence requirement summaries returned." />
                  ) : (
                    <div className="space-y-3">
                      {evidenceRequirements.map((requirement) => (
                        <div
                          key={`${requirement.evidenceType}-${requirement.requirementLevel}`}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold">
                              {requirement.evidenceType}
                            </div>
                            <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-200">
                              {requirement.satisfactionState}
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-slate-400">
                            {requirement.requirementLevel}
                            {requirement.isAuthorityCritical
                              ? " / authority-critical"
                              : ""}
                            {requirement.isPayoutCritical
                              ? " / payout-critical"
                              : ""}
                          </div>
                          <div className="mt-3 text-sm text-slate-300">
                            {requirement.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>
              </div>

              <div className="space-y-5">
                <Panel title="Readiness Output">
                  <JsonBlock data={readiness ?? { message: "No readiness response yet." }} />
                </Panel>

                <Panel title="Submission Output">
                  <JsonBlock data={submission ?? { message: "No submission response yet." }} />
                </Panel>

                <Panel title="Lifecycle Events">
                  {lifecycleEvents.length === 0 ? (
                    <EmptyState text="No lifecycle events returned for the selected work." />
                  ) : (
                    <div className="space-y-3">
                      {lifecycleEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold">
                              {event.eventType}
                            </div>
                            <div className="text-xs text-slate-400">
                              {formatTimestamp(event.createdAt)}
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-slate-400">
                            {event.oldStatus ?? "none"} &rarr;{" "}
                            {event.newStatus ?? "none"}
                          </div>
                          {event.message ? (
                            <div className="mt-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                              {event.message}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel title="Evidence Workflow Impacts">
                  {evidenceResult?.workflowImpacts ? (
                    <div className="space-y-3">
                      {Object.entries(evidenceResult.workflowImpacts).map(
                        ([key, impact]) => (
                          <div
                            key={key}
                            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-semibold">{key}</div>
                              <div className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-200">
                                {impact?.status ?? "unknown"}
                              </div>
                            </div>
                            {impact?.reasons?.length ? (
                              <div className="mt-2 space-y-1 text-xs text-slate-400">
                                {impact.reasons.map((reason) => (
                                  <div key={reason}>{reason}</div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyState text="No workflow impacts returned." />
                  )}
                </Panel>

                <Panel title="Governance Flags">
                  <FlagList
                    title="Backend Flags"
                    emptyText="No governance flags returned."
                    flags={evidenceGovernanceFlags}
                  />
                </Panel>

                <Panel title="Diagnostic Event Previews">
                  {diagnosticEventPreviews.length === 0 ? (
                    <EmptyState text="No diagnostic event previews returned." />
                  ) : (
                    <div className="space-y-3">
                      {diagnosticEventPreviews.map((event) => (
                        <div
                          key={`${event.eventType}-${event.trigger}-${event.message}`}
                          className="rounded-xl border border-amber-300/20 bg-amber-400/10 px-4 py-3"
                        >
                          <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
                            Preview Only
                          </div>
                          <div className="font-semibold">
                            {event.eventType}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            Trigger: {event.trigger}
                          </div>
                          <div className="mt-3 text-sm text-slate-300">
                            {event.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel title="Last API Response">
                  <JsonBlock data={lastResponse ?? { message: "No API response yet." }} />
                </Panel>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

function StatusCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-3 min-h-8 truncate text-2xl font-bold">{value}</div>
      <div className="mt-3 break-all text-xs text-blue-200/80">{detail}</div>
    </div>
  )
}

function ActionButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl border border-blue-400/30 bg-gradient-to-br from-blue-600/90 to-violet-600/90 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:scale-[1.01] hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    >
      {children}
    </button>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {children}
    </section>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-8 text-center text-sm text-slate-400">
      {text}
    </div>
  )
}

function FlagList({
  title,
  emptyText,
  flags,
}: {
  title: string
  emptyText: string
  flags: EvidenceGovernanceFlag[]
}) {
  if (flags.length === 0) {
    return <EmptyState text={emptyText} />
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-slate-200">{title}</h3>
      <div className="space-y-3">
        {flags.map((flag) => (
          <div
            key={`${flag.code}-${flag.evidenceType ?? "none"}-${flag.message}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold">{flag.code}</div>
              <div
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  flag.severity === "blocker"
                    ? "bg-red-500/15 text-red-200"
                    : flag.severity === "warning"
                      ? "bg-amber-500/15 text-amber-200"
                      : "bg-blue-500/15 text-blue-200"
                }`}
              >
                {flag.severity}
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-300">{flag.message}</div>
            <div className="mt-2 text-xs text-slate-400">
              {flag.evidenceType ?? "No evidence type"} / submission:{" "}
              {flag.blocksSubmission ? "blocked" : "not blocked"} / payout:{" "}
              {flag.blocksPayout ? "blocked" : "not blocked"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GuidedJourneyPanel({
  loading,
  error,
  steps,
}: {
  loading: boolean
  error: string | null
  steps: GuidedJourneyStep[]
}) {
  return (
    <section className="mb-5 rounded-2xl border border-blue-400/20 bg-blue-500/[0.07] p-5 shadow-2xl shadow-black/30">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">
            TEST MODE / READ-ONLY
          </div>
          <h2 className="mt-1 text-lg font-bold">Guided TEST Journey</h2>
          <p className="mt-1 text-sm text-slate-400">
            Create Song -&gt; Readiness -&gt; Evidence Pack -&gt; Queue -&gt; Lifecycle
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-bold text-slate-200">
          {loading ? "Loading" : "Read-only"}
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 xl:grid-cols-5">
        {steps.map((step) => (
          <div
            key={step.label}
            className="rounded-xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="font-semibold">{step.label}</div>
              <StatusPill status={step.status} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {step.explanation}
            </p>
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-blue-100">
              <span className="font-bold text-white">Next safe action:</span>{" "}
              {step.nextSafeAction}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatusPill({ status }: { status: GuidedJourneyStatus }) {
  const className =
    status === "complete"
      ? "bg-emerald-500/15 text-emerald-200"
      : status === "blocked"
        ? "bg-red-500/15 text-red-200"
        : status === "not ready"
          ? "bg-amber-500/15 text-amber-200"
          : status === "available"
            ? "bg-blue-500/15 text-blue-200"
            : "bg-slate-500/15 text-slate-300"

  return (
    <div className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>
      {status}
    </div>
  )
}

function JsonBlock({ data }: { data: unknown }) {
  return (
    <pre className="max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/35 p-4 text-xs leading-relaxed text-slate-200">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

function formatTimestamp(value: unknown) {
  if (typeof value !== "string") {
    return "Not recorded"
  }

  return value
}

function getRegulatorMessage(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") {
    return null
  }

  const regulatorMessage =
    (metadata as Record<string, unknown>).regulatorMessage

  return typeof regulatorMessage === "string" ? regulatorMessage : null
}

function buildGuidedJourneySteps({
  selectedWorkId,
  selectedWorkTitle,
  readinessResult,
  evidenceResult,
  queueItems,
  lifecycleSubmissions,
  lifecycleEvents,
}: {
  selectedWorkId: string
  selectedWorkTitle?: string
  readinessResult?: ReadinessResult
  evidenceResult?: EvidenceReadinessResult
  queueItems: SubmissionQueueItem[]
  lifecycleSubmissions: SubmissionQueueItem[]
  lifecycleEvents: LifecycleEvent[]
}): GuidedJourneyStep[] {
  const selectedQueueItem = queueItems.find(
    (item) => item.entityId === selectedWorkId
  )
  const latestLifecycleSubmission = lifecycleSubmissions[0]
  const latestLifecycleEvent = lifecycleEvents[0]
  const evidenceBlockers = Array.isArray(evidenceResult?.blockers)
    ? evidenceResult.blockers
    : []
  const evidenceStorageUnavailable = evidenceBlockers.some(
    (flag) => flag.code === "EVIDENCE_PERSISTENCE_UNAVAILABLE"
  )
  const evidenceBlocksSubmission = evidenceBlockers.some(
    (flag) => flag.blocksSubmission
  )
  const readinessReady = readinessResult?.ready === true
  const readinessKnown = typeof readinessResult?.ready === "boolean"
  const evidenceReady = evidenceResult?.ready === true
  const evidenceKnown = typeof evidenceResult?.ready === "boolean"

  const createSongStep: GuidedJourneyStep = selectedWorkId
    ? {
        label: "Create Song",
        status: "complete",
        explanation: selectedWorkTitle
          ? `${selectedWorkTitle} is loaded as the current TEST work.`
          : "A controlled TEST work is loaded for review.",
        nextSafeAction: "Review backend readiness for this work.",
      }
    : {
        label: "Create Song",
        status: "unknown",
        explanation: "No controlled TEST work is loaded yet.",
        nextSafeAction: "Load Test Work from the approved read-only TEST API.",
      }

  const readinessStep: GuidedJourneyStep = readinessKnown
    ? readinessReady
      ? {
          label: "Readiness",
          status: "complete",
          explanation: "Backend readiness currently allows this work to move forward.",
          nextSafeAction: "Check the Evidence Pack before queue or submission decisions.",
        }
      : {
          label: "Readiness",
          status: "not ready",
          explanation:
            readinessResult?.issues?.join(" ") ||
            "Backend readiness says this work is not ready yet.",
          nextSafeAction: "Inspect blockers and keep queue/submission read-only here.",
        }
    : {
        label: "Readiness",
        status: selectedWorkId ? "available" : "unknown",
        explanation: selectedWorkId
          ? "Readiness can be checked from the backend for the loaded TEST work."
          : "Readiness needs a loaded TEST work first.",
        nextSafeAction: "Use read-only readiness visibility before any controlled action.",
      }

  const evidenceStep: GuidedJourneyStep = evidenceKnown
    ? evidenceReady
      ? {
          label: "Evidence Pack",
          status: "complete",
          explanation: "Evidence readiness is complete according to the backend result.",
          nextSafeAction: "Compare evidence impact with queue and lifecycle visibility.",
        }
      : {
          label: "Evidence Pack",
          status: evidenceBlocksSubmission ? "blocked" : "not ready",
          explanation: evidenceStorageUnavailable
            ? "Evidence storage is not yet connected. This blocks evidence readiness."
            : evidenceResult?.diagnostics?.message ||
              "Evidence readiness is not complete according to the backend result.",
          nextSafeAction:
            "Treat this as read-only TEST visibility and do not submit from this panel.",
        }
    : {
        label: "Evidence Pack",
        status: selectedWorkId ? "available" : "unknown",
        explanation: selectedWorkId
          ? "Evidence readiness can be checked from the backend for the loaded TEST work."
          : "Evidence readiness needs a loaded TEST work first.",
        nextSafeAction: "Fetch read-only evidence readiness from the approved API.",
      }

  const queueBlocked =
    (readinessKnown && !readinessReady) ||
    (evidenceKnown && !evidenceReady) ||
    evidenceBlocksSubmission
  const queueStep: GuidedJourneyStep = selectedQueueItem
    ? {
        label: "Queue",
        status: "complete",
        explanation: `A pending queue item is visible with status ${selectedQueueItem.status ?? "unknown"}.`,
        nextSafeAction: "Track lifecycle visibility without changing queue state here.",
      }
    : queueBlocked
      ? {
          label: "Queue",
          status: "blocked",
          explanation:
            "Queue/submission should not be offered while readiness or evidence is blocked.",
          nextSafeAction:
            "Resolve readiness and evidence blockers before any submission action.",
        }
      : readinessKnown && evidenceKnown
        ? {
            label: "Queue",
            status: "available",
            explanation:
              "Backend visibility does not show a pending queue item for this work.",
            nextSafeAction:
              "Keep this panel read-only; use approved submission controls only when governed.",
          }
        : {
            label: "Queue",
            status: "unknown",
            explanation:
              "Queue visibility needs readiness, evidence, and pending queue data.",
            nextSafeAction: "Load read-only readiness, evidence, and queue state.",
          }

  const lifecycleStep: GuidedJourneyStep = latestLifecycleSubmission
    ? {
        label: "Lifecycle",
        status: "complete",
        explanation: `Lifecycle history is visible. Latest submission status is ${latestLifecycleSubmission.status ?? "unknown"}.`,
        nextSafeAction: "Review lifecycle events and regulator messages if present.",
      }
    : latestLifecycleEvent
      ? {
          label: "Lifecycle",
          status: "complete",
          explanation: `Lifecycle event visible: ${latestLifecycleEvent.eventType ?? "unknown"}.`,
          nextSafeAction: "Review event details without mutating lifecycle state.",
        }
      : {
          label: "Lifecycle",
          status: "unknown",
          explanation:
            "No lifecycle history is currently visible in the existing lifecycle panel.",
          nextSafeAction:
            "Use existing lifecycle visibility after queue/submission processing creates history.",
        }

  return [
    createSongStep,
    readinessStep,
    evidenceStep,
    queueStep,
    lifecycleStep,
  ]
}
