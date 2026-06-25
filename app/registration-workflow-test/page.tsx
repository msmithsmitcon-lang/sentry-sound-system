"use client"

import { useEffect, useMemo, useState } from "react"

type ContributorDraft = {
  name: string
  role: string
  split_type: string
  percentage: string
}

type WorkflowDraft = {
  work_title: string
  genre: string
  mood: string
  contributors: ContributorDraft[]
}

type CreateSongResponse = {
  success?: boolean
  work_id?: string
  asset_id?: string
  contributor_count?: number
  message?: string
}

type ReadinessResponse = {
  success?: boolean
  readiness?: {
    ready?: boolean
    issues?: string[]
    summary?: {
      workTitle?: string
      contributorCount?: number
      totalSplit?: number
    }
  }
  error?: string
}

type SubmissionQueueItem = {
  id: string
  status?: string
  target?: string
  exportFormat?: string
  entityId?: string
  regulatorReference?: string | null
  createdAt?: string
  updatedAt?: string
}

type SubmissionResponse = {
  success?: boolean
  duplicatePrevented?: boolean
  submission?: SubmissionQueueItem
  error?: string
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
  success?: boolean
  submissions?: SubmissionQueueItem[]
  events?: LifecycleEvent[]
  error?: string
}

type ActionState = {
  label: string
  status: "idle" | "loading" | "success" | "error"
  message: string
}

type WorkflowStageStatus =
  | "active"
  | "available"
  | "blocked"
  | "complete"
  | "locked"

const STORAGE_KEY = "sentry.registration-workflow-test.original-composition"

const emptyContributor: ContributorDraft = {
  name: "",
  role: "composer",
  split_type: "composition",
  percentage: "",
}

const initialDraft: WorkflowDraft = {
  work_title: "",
  genre: "",
  mood: "",
  contributors: [{ ...emptyContributor }],
}

const initialAction: ActionState = {
  label: "Ready",
  status: "idle",
  message: "Start with an original composition draft.",
}

async function readJson(response: Response) {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : typeof data?.message === "string"
          ? data.message
          : `Request failed with ${response.status}`
    )
  }

  return data
}

export default function RegistrationWorkflowTestPage() {
  const [draft, setDraft] = useState<WorkflowDraft>(() => {
    if (typeof window === "undefined") {
      return initialDraft
    }

    const storedDraft = window.localStorage.getItem(STORAGE_KEY)

    if (!storedDraft) {
      return initialDraft
    }

    try {
      return JSON.parse(storedDraft) as WorkflowDraft
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
      return initialDraft
    }
  })
  const [work, setWork] = useState<CreateSongResponse | null>(null)
  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null)
  const [submission, setSubmission] = useState<SubmissionResponse | null>(null)
  const [lifecycle, setLifecycle] = useState<LifecycleResponse | null>(null)
  const [action, setAction] = useState<ActionState>(initialAction)

  useEffect(() => {
    if (work?.work_id) {
      return
    }

    // TEST-only recovery draft. Backend-created work remains the source of truth.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  }, [draft, work?.work_id])

  const splitTotal = useMemo(
    () =>
      draft.contributors.reduce(
        (total, contributor) => total + Number(contributor.percentage || 0),
        0
      ),
    [draft.contributors]
  )

  const namedContributors = draft.contributors.filter((contributor) =>
    contributor.name.trim()
  )
  const canCreateBackendDraft =
    draft.work_title.trim().length > 0 &&
    namedContributors.length > 0 &&
    splitTotal === 100
  const workId = work?.work_id ?? ""
  const readinessReady = readiness?.readiness?.ready === true
  const readinessChecked = typeof readiness?.readiness?.ready === "boolean"
  const lifecycleSubmissions = Array.isArray(lifecycle?.submissions)
    ? lifecycle.submissions
    : []
  const lifecycleEvents = Array.isArray(lifecycle?.events)
    ? lifecycle.events
    : []
  const persistedWorkTitle =
    readiness?.readiness?.summary?.workTitle || draft.work_title || "Not created"
  const persistedSplitTotal =
    typeof readiness?.readiness?.summary?.totalSplit === "number"
      ? readiness.readiness.summary.totalSplit
      : splitTotal
  const persistedContributorCount =
    typeof readiness?.readiness?.summary?.contributorCount === "number"
      ? readiness.readiness.summary.contributorCount
      : work?.contributor_count
  const lifecycleStatus = lifecycleSubmissions[0]?.status ?? "not visible yet"
  const remainingAllocation = 100 - splitTotal
  const splitAllocationMessage =
    splitTotal === 100
      ? "Composition allocation is complete at 100%."
      : splitTotal < 100
        ? `${remainingAllocation}% remains to allocate before backend draft creation.`
        : `Allocation is ${Math.abs(remainingAllocation)}% over 100%. Reduce one or more contributor shares.`
  const contributorPersistenceMessage = workId
    ? "Contributor input is locked after backend draft creation. Backend confirmation is shown in the truth panel."
    : "Contributor rows are local recovery draft data until Create Backend Draft succeeds."
  const currentStage = getCurrentStage({
    workId,
    splitTotal,
    namedContributorCount: namedContributors.length,
    readinessChecked,
    readinessReady,
    queueCreated: Boolean(submission?.submission),
    lifecycleVisible: lifecycleSubmissions.length > 0,
  })
  const nextSuggestedAction = getNextSuggestedAction({
    workId,
    hasTitle: draft.work_title.trim().length > 0,
    splitTotal,
    namedContributorCount: namedContributors.length,
    readinessChecked,
    readinessReady,
    queueCreated: Boolean(submission?.submission),
    lifecycleVisible: lifecycleSubmissions.length > 0,
  })
  const startStatus: WorkflowStageStatus = workId ? "complete" : "active"
  const contributorStatus: WorkflowStageStatus =
    splitTotal === 100 && namedContributors.length ? "complete" : "active"
  const readinessStatus: WorkflowStageStatus = readinessReady
    ? "complete"
    : readinessChecked
      ? "blocked"
      : workId
        ? "available"
        : "locked"
  const submissionStatus: WorkflowStageStatus = readinessReady
    ? "available"
    : "locked"
  const queueStatus: WorkflowStageStatus = submission?.submission
    ? "complete"
    : readinessReady
      ? "available"
      : "locked"
  const lifecycleProgressStatus: WorkflowStageStatus = lifecycleSubmissions.length
    ? "complete"
    : "available"

  async function createBackendDraft() {
    if (!canCreateBackendDraft) {
      setAction({
        label: "Create Backend Draft",
        status: "error",
        message:
          "Add a title and composition contributors with splits totaling 100%.",
      })
      return
    }

    setAction({
      label: "Create Backend Draft",
      status: "loading",
      message: "Saving original composition through the governed create API.",
    })

    try {
      const data = (await readJson(
        await fetch("/api/songs/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            work_title: draft.work_title,
            genre: draft.genre,
            mood: draft.mood,
            copyright_status: "draft",
            registration_status: "draft",
            contributors: namedContributors.map((contributor) => ({
              name: contributor.name,
              role: contributor.role,
              split_type: contributor.split_type,
              percentage: Number(contributor.percentage || 0),
            })),
          }),
        })
      )) as CreateSongResponse

      setWork(data)
      window.localStorage.removeItem(STORAGE_KEY)
      setAction({
        label: "Create Backend Draft",
        status: "success",
        message: data.work_id
          ? "Backend draft created. Readiness can now be checked."
          : "Create API responded, but no work_id was returned.",
      })
    } catch (error) {
      setAction({
        label: "Create Backend Draft",
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create backend draft.",
      })
    }
  }

  async function checkReadiness() {
    if (!workId) {
      setAction({
        label: "Check Readiness",
        status: "error",
        message: "Create the backend draft first.",
      })
      return
    }

    setAction({
      label: "Check Readiness",
      status: "loading",
      message: "Checking backend readiness for the created composition.",
    })

    try {
      const data = (await readJson(
        await fetch(
          `/api/submissions/readiness?work_id=${encodeURIComponent(workId)}`
        )
      )) as ReadinessResponse

      setReadiness(data)
      setAction({
        label: "Check Readiness",
        status: "success",
        message: data.readiness?.ready
          ? "Backend readiness allows submission intent."
          : "Backend readiness found blockers.",
      })
    } catch (error) {
      setAction({
        label: "Check Readiness",
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to check readiness.",
      })
    }
  }

  async function createQueueItem() {
    if (!workId || !readinessReady) {
      setAction({
        label: "Create Queue Item",
        status: "error",
        message: "Backend readiness must be ready before queue creation.",
      })
      return
    }

    setAction({
      label: "Create Queue Item",
      status: "loading",
      message: "Creating SAMRO TEST queue item through the submission API.",
    })

    try {
      const data = (await readJson(
        await fetch("/api/submissions/create-from-work", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            work_id: workId,
          }),
        })
      )) as SubmissionResponse

      setSubmission(data)
      await loadLifecycle()
      setAction({
        label: "Create Queue Item",
        status: "success",
        message: data.duplicatePrevented
          ? "Existing queue item returned by duplicate prevention."
          : "Queue item created by backend.",
      })
    } catch (error) {
      setAction({
        label: "Create Queue Item",
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to create queue item.",
      })
    }
  }

  async function loadLifecycle() {
    if (!workId) {
      return
    }

    const data = (await readJson(
      await fetch(
        `/api/submissions/lifecycle?work_id=${encodeURIComponent(workId)}`
      )
    )) as LifecycleResponse

    setLifecycle(data)
  }

  function updateContributor(
    index: number,
    field: keyof ContributorDraft,
    value: string
  ) {
    setDraft((current) => ({
      ...current,
      contributors: current.contributors.map((contributor, contributorIndex) =>
        contributorIndex === index
          ? {
              ...contributor,
              [field]: value,
            }
          : contributor
      ),
    }))
  }

  function addContributor() {
    setDraft((current) => ({
      ...current,
      contributors: [...current.contributors, { ...emptyContributor }],
    }))
    setAction({
      label: "Add Contributor",
      status: "success",
      message:
        "Contributor row added as local recovery draft data. Complete the row and keep composition splits at 100%.",
    })
  }

  return (
    <main className="min-h-screen bg-[#070b16] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#0b1222] px-6 py-8 shadow-2xl shadow-black/30 lg:block">
          <div className="mb-10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-2xl font-black text-blue-300 ring-1 ring-blue-400/30">
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
              Test Workflow
            </div>
            <div className="mt-1 text-sm text-slate-300">
              Original composition only
            </div>
          </div>

          <nav className="space-y-3">
            <StageNavItem title="Song Info" status={startStatus} />
            <StageNavItem title="Contributors" status={contributorStatus} />
            <StageNavItem title="Readiness" status={readinessStatus} />
            <StageNavItem title="Submission" status={submissionStatus} />
            <StageNavItem title="Queue" status={queueStatus} />
            <StageNavItem title="Lifecycle" status={lifecycleProgressStatus} />
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-slate-400">
            Backend truth owns readiness, queue, and lifecycle. Local draft
            state is labeled until persisted.
          </div>
        </aside>

        <section className="relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="pointer-events-none absolute right-10 top-28 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-7 lg:px-8">
        <header className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-200">
              TEST MODE / ORIGINAL COMPOSITION ONLY
            </div>
            <h1 className="mt-2 text-3xl font-bold">
              Registration Workspace
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Guided intake for an original composition, from local recovery
              draft to backend readiness, queue creation, and lifecycle
              visibility.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
              Backend APIs remain source of truth
            </div>
            <div className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-950/30">
              {currentStage}
            </div>
          </div>
        </header>

        <section className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
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
              <div className="mt-3 text-sm text-slate-300">
                <span className="font-semibold text-white">{action.label}:</span>{" "}
                {action.message}
              </div>
            </div>
            <div className="grid min-w-0 flex-1 gap-3 md:grid-cols-2 xl:max-w-2xl">
              <OperationalGuidance
                label="Current stage"
                value={currentStage}
              />
              <OperationalGuidance
                label="Next suggested action"
                value={nextSuggestedAction}
              />
            </div>
          </div>
        </section>

        <WorkflowProgress
          steps={[
            {
              title: "Song Info",
              status: startStatus,
              detail: workId ? "Backend work created" : "Local recovery draft",
            },
            {
              title: "Contributors",
              status: contributorStatus,
              detail: `Split total ${splitTotal}%`,
            },
            {
              title: "Readiness",
              status: readinessStatus,
              detail: readinessChecked ? "Backend checked" : "Not checked",
            },
            {
              title: "Submission",
              status: submissionStatus,
              detail: "SAMRO / CWR",
            },
            {
              title: "Lifecycle",
              status: lifecycleProgressStatus,
              detail: `${lifecycleSubmissions.length} submissions`,
            },
          ]}
        />

        <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <div className="space-y-5">
            <Panel title="1. Start Song">
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Song title">
                  <input
                    value={draft.work_title}
                    disabled={Boolean(workId)}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        work_title: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none ring-blue-400/40 focus:ring-2 disabled:opacity-60"
                    placeholder="Original composition title"
                  />
                </Field>
                <Field label="Genre">
                  <input
                    value={draft.genre}
                    disabled={Boolean(workId)}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        genre: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none ring-blue-400/40 focus:ring-2 disabled:opacity-60"
                    placeholder="Optional"
                  />
                </Field>
                <Field label="Mood">
                  <input
                    value={draft.mood}
                    disabled={Boolean(workId)}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        mood: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none ring-blue-400/40 focus:ring-2 disabled:opacity-60"
                    placeholder="Optional"
                  />
                </Field>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                This slice intentionally handles original composition only.
                Recording, release, CAPASSO mandates, neighboring rights, and
                payout flows remain deferred.
              </p>
            </Panel>

            <Panel title="2. Contributors & Splits">
              <div className="mb-4 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
                {contributorPersistenceMessage}
              </div>
              <div className="space-y-3">
                {draft.contributors.map((contributor, index) => (
                  <div key={index}>
                    <div className="mb-2 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        Contributor row {index + 1} /{" "}
                        {workId ? "submitted with backend draft" : "local recovery draft"}
                      </div>
                      <div>
                        Allocation: {Number(contributor.percentage || 0)}%
                      </div>
                    </div>
                    <div
                      className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-3 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.5fr]"
                    >
                      <input
                        value={contributor.name}
                        disabled={Boolean(workId)}
                        onChange={(event) =>
                          updateContributor(index, "name", event.target.value)
                        }
                        className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none ring-blue-400/40 focus:ring-2 disabled:opacity-60"
                        placeholder="Contributor name"
                      />
                      <select
                        value={contributor.role}
                        disabled={Boolean(workId)}
                        onChange={(event) =>
                          updateContributor(index, "role", event.target.value)
                        }
                        className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none ring-blue-400/40 focus:ring-2 disabled:opacity-60"
                      >
                        <option value="composer">Composer</option>
                        <option value="lyricist">Lyricist</option>
                        <option value="publisher">Publisher</option>
                      </select>
                      <select
                        value={contributor.split_type}
                        disabled={Boolean(workId)}
                        onChange={(event) =>
                          updateContributor(
                            index,
                            "split_type",
                            event.target.value
                          )
                        }
                        className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none ring-blue-400/40 focus:ring-2 disabled:opacity-60"
                      >
                        <option value="composition">Composition</option>
                      </select>
                      <input
                        value={contributor.percentage}
                        disabled={Boolean(workId)}
                        onChange={(event) =>
                          updateContributor(
                            index,
                            "percentage",
                            event.target.value
                          )
                        }
                        className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none ring-blue-400/40 focus:ring-2 disabled:opacity-60"
                        placeholder="%"
                        inputMode="decimal"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[0.55fr_1fr_auto] lg:items-center">
                <div
                  className={`rounded-full px-3 py-1 text-sm font-bold ${
                    splitTotal === 100
                      ? "bg-emerald-500/15 text-emerald-200"
                      : "bg-amber-500/15 text-amber-200"
                  }`}
                >
                  Split total: {splitTotal}%
                </div>
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    splitTotal === 100
                      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                      : "border-amber-400/20 bg-amber-500/10 text-amber-100"
                  }`}
                >
                  {splitAllocationMessage}
                </div>
                <button
                  type="button"
                  disabled={Boolean(workId)}
                  onClick={addContributor}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Add Contributor
                </button>
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                <span className="font-semibold text-white">Next:</span>{" "}
                {nextSuggestedAction}
              </div>
            </Panel>

            <Panel title="3. Readiness">
              <div className="flex flex-col gap-3 sm:flex-row">
                <PrimaryButton
                  disabled={
                    Boolean(workId) ||
                    action.status === "loading" ||
                    !canCreateBackendDraft
                  }
                  onClick={createBackendDraft}
                >
                  Create Backend Draft
                </PrimaryButton>
                <PrimaryButton
                  disabled={!workId || action.status === "loading"}
                  onClick={checkReadiness}
                >
                  Check Readiness
                </PrimaryButton>
              </div>
              <ReadinessSummary readiness={readiness} />
              {workId ? (
                <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  Backend draft saved. Work ID and asset ID are visible in
                  Backend Truth, and the local recovery draft was cleared only
                  after the backend returned a work ID.
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  Backend draft is not created yet. Current inputs remain
                  local recovery draft data.
                </div>
              )}
            </Panel>

            <Panel title="4. Submission Intent">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-bold text-white">
                  SAMRO original composition registration
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Target: SAMRO / Export format: CWR. This appears only as the
                  bounded TEST submission path for this slice.
                </div>
                <button
                  type="button"
                  disabled={!readinessReady || action.status === "loading"}
                  onClick={createQueueItem}
                  className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Create Queue Item
                </button>
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Backend Truth">
              <TruthRow label="Work title" value={persistedWorkTitle} />
              <TruthRow label="Work ID" value={workId || "Not created"} />
              <TruthRow label="Asset ID" value={work?.asset_id ?? "Not created"} />
              <TruthRow
                label="Contributor count"
                value={
                  typeof persistedContributorCount === "number"
                    ? String(persistedContributorCount)
                    : "Not created"
                }
              />
              <TruthRow
                label="Split total"
                value={`${persistedSplitTotal}%`}
              />
              <TruthRow
                label="Readiness"
                value={
                  readinessChecked
                    ? readinessReady
                      ? "ready"
                      : "not ready"
                    : "not checked"
                }
              />
              <TruthRow
                label="Readiness issues"
                value={
                  readiness?.readiness?.issues?.length
                    ? readiness.readiness.issues.join(", ")
                    : readinessChecked
                      ? "none"
                      : "not checked"
                }
              />
              <TruthRow
                label="Queue"
                value={submission?.submission?.status ?? "not created"}
              />
              <TruthRow
                label="Lifecycle"
                value={`${lifecycleStatus} / ${lifecycleSubmissions.length} submissions / ${lifecycleEvents.length} events`}
              />
            </Panel>

            <Panel title="5. Queue Created">
              {submission?.submission ? (
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                  <div className="font-bold text-white">
                    {submission.submission.target} /{" "}
                    {submission.submission.exportFormat}
                  </div>
                  <div className="mt-2 break-all text-xs text-slate-400">
                    {submission.submission.id}
                  </div>
                  <div className="mt-3">
                    Status: {submission.submission.status ?? "unknown"}
                  </div>
                </div>
              ) : (
                <EmptyState text="No queue item has been created by the backend yet." />
              )}
            </Panel>

            <Panel title="6. Lifecycle Tracking">
              <button
                type="button"
                disabled={!workId || action.status === "loading"}
                onClick={() => {
                  void loadLifecycle()
                }}
                className="mb-4 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Refresh Lifecycle
              </button>
              {lifecycleSubmissions.length === 0 ? (
                <EmptyState text="No lifecycle history returned yet. The UI does not invent lifecycle state." />
              ) : (
                <div className="space-y-3">
                  {lifecycleSubmissions.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-white">
                          {item.target} / {item.exportFormat}
                        </div>
                        <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-200">
                          {item.status ?? "unknown"}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        Updated: {item.updatedAt ?? "not recorded"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {lifecycleEvents.length ? (
                <div className="mt-4 space-y-3">
                  {lifecycleEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300"
                    >
                      <div className="font-bold text-white">
                        {event.eventType ?? "event"}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {event.oldStatus ?? "none"} -&gt;{" "}
                        {event.newStatus ?? "none"}
                      </div>
                      {event.message ? (
                        <div className="mt-2">{event.message}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </Panel>
          </div>
        </section>
          </div>
        </section>
      </div>
    </main>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {children}
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>
      {children}
    </label>
  )
}

function OperationalGuidance({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-100">{value}</div>
    </div>
  )
}

function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
}

function StageNavItem({
  title,
  status,
}: {
  title: string
  status: WorkflowStageStatus
}) {
  const badgeClass =
    status === "complete"
      ? "bg-emerald-500/15 text-emerald-200"
      : status === "blocked"
        ? "bg-red-500/15 text-red-200"
        : status === "available"
          ? "bg-blue-500/15 text-blue-200"
          : status === "active"
            ? "bg-amber-500/15 text-amber-200"
            : "bg-slate-500/15 text-slate-300"

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-200">{title}</div>
        <div className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeClass}`}>
          {status}
        </div>
      </div>
    </div>
  )
}

function WorkflowProgress({
  steps,
}: {
  steps: {
    title: string
    status: WorkflowStageStatus
    detail: string
  }[]
}) {
  return (
    <section className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Operational Progress</h2>
          <p className="mt-1 text-sm text-slate-400">
            Connected stages keep the registration journey anchored to backend
            truth.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
          Governed TEST Flow
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step.title} className="relative">
            {index < steps.length - 1 ? (
              <div className="absolute left-[calc(50%+1.5rem)] top-5 hidden h-px w-[calc(100%-3rem)] bg-white/10 lg:block" />
            ) : null}
            <div className="relative rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-sm font-black text-blue-200 ring-1 ring-blue-400/30">
                  {index + 1}
                </div>
                <StatusBadge status={step.status} />
              </div>
              <div className="mt-4 font-bold">{step.title}</div>
              <div className="mt-2 min-h-10 text-xs leading-5 text-slate-400">
                {step.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: WorkflowStageStatus }) {
  const className =
    status === "complete"
      ? "bg-emerald-500/15 text-emerald-200"
      : status === "blocked"
        ? "bg-red-500/15 text-red-200"
        : status === "available"
          ? "bg-blue-500/15 text-blue-200"
          : status === "active"
            ? "bg-amber-500/15 text-amber-200"
            : "bg-slate-500/15 text-slate-300"

  return (
    <div className={`rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>
      {status}
    </div>
  )
}

function ReadinessSummary({ readiness }: { readiness: ReadinessResponse | null }) {
  if (!readiness) {
    return (
      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
        Backend readiness has not been checked yet.
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="font-bold">
        {readiness.readiness?.ready ? "Ready" : "Not ready"}
      </div>
      {readiness.readiness?.issues?.length ? (
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {readiness.readiness.issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-2 text-sm text-slate-400">
          No readiness issues returned.
        </div>
      )}
    </div>
  )
}

function TruthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 py-3 last:border-b-0">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 break-all text-sm text-slate-200">{value}</div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-8 text-center text-sm text-slate-400">
      {text}
    </div>
  )
}

function getCurrentStage({
  workId,
  splitTotal,
  namedContributorCount,
  readinessChecked,
  readinessReady,
  queueCreated,
  lifecycleVisible,
}: {
  workId: string
  splitTotal: number
  namedContributorCount: number
  readinessChecked: boolean
  readinessReady: boolean
  queueCreated: boolean
  lifecycleVisible: boolean
}) {
  if (lifecycleVisible) {
    return "Lifecycle tracking"
  }

  if (queueCreated) {
    return "Queue created"
  }

  if (readinessReady) {
    return "Submission intent"
  }

  if (workId && readinessChecked) {
    return "Readiness review"
  }

  if (workId) {
    return "Backend draft saved"
  }

  if (namedContributorCount > 0 || splitTotal > 0) {
    return "Contributors and splits"
  }

  return "Start song"
}

function getNextSuggestedAction({
  workId,
  hasTitle,
  splitTotal,
  namedContributorCount,
  readinessChecked,
  readinessReady,
  queueCreated,
  lifecycleVisible,
}: {
  workId: string
  hasTitle: boolean
  splitTotal: number
  namedContributorCount: number
  readinessChecked: boolean
  readinessReady: boolean
  queueCreated: boolean
  lifecycleVisible: boolean
}) {
  if (!hasTitle) {
    return "Enter the original composition title."
  }

  if (namedContributorCount === 0) {
    return "Add at least one contributor."
  }

  if (splitTotal < 100) {
    return `Allocate the remaining ${100 - splitTotal}% composition share.`
  }

  if (splitTotal > 100) {
    return `Reduce contributor shares by ${splitTotal - 100}% so the total equals 100%.`
  }

  if (!workId) {
    return "Create Backend Draft to persist the composition and contributor split."
  }

  if (!readinessChecked) {
    return "Check Readiness using the persisted work ID."
  }

  if (!readinessReady) {
    return "Review readiness blockers before queue creation."
  }

  if (!queueCreated) {
    return "Create Queue Item through the governed submission API."
  }

  if (!lifecycleVisible) {
    return "Refresh Lifecycle to display backend submission state."
  }

  return "Review lifecycle status and continue from backend state."
}
