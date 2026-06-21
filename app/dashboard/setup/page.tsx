"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  Loader2,
  Pencil,
  Sparkles,
  Target,
} from "lucide-react"

import type {
  WorkspaceSetupV1,
  WorkspaceSetupV1Workspace,
} from "@/lib/workspace-setup/workspace-setup-v1"

type ApiResult =
  | {
      ok: true
      data: {
        setup: WorkspaceSetupV1 | null
        workspace: WorkspaceSetupV1Workspace
        completion: { percent: number; complete: boolean; missingFields: string[] }
        notices: string[]
      }
    }
  | { ok: false; error: { code: string; message: string; fields?: string[] } }

export default function WorkspaceSetupOverviewPage() {
  const [result, setResult] = useState<ApiResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSetup() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/workspace-setup", { cache: "no-store" })
        const data = (await response.json()) as ApiResult
        if (cancelled) return
        setResult(data)
        if (!data.ok) setError(data.error.message)
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load workspace profile.")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSetup()
    return () => {
      cancelled = true
    }
  }, [])

  const setup = result?.ok ? result.data.setup : null
  const workspace = result?.ok ? result.data.workspace : null
  const completion = result?.ok ? result.data.completion : null

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-[#2F48F7]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {setup ? "Workspace Profile" : "Workspace Setup"}
            </h1>
            <p className="mt-2 max-w-2xl leading-7 text-[#64748B]">
              {setup
                ? "Review the operational identity Sentry Sound uses to personalize your workspace, dashboard, and future defaults."
                : "Set up your workspace so Sentry Sound can personalize your dashboard, setup guidance, and future operational modules."}
            </p>
          </div>
          <div className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <p className="text-sm font-semibold text-[#2F48F7]">Setup completion</p>
            <p className="mt-1 text-2xl font-semibold">{completion?.percent ?? 0}%</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-6">
        {error ? (
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm font-semibold text-[#B91C1C]">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-80 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white">
            <Loader2 className="h-6 w-6 animate-spin text-[#2F48F7]" />
          </div>
        ) : setup ? (
          <WorkspaceProfileSummary setup={setup} workspaceName={workspace?.name ?? setup.workspace_name} />
        ) : (
          <FirstTimeSetupIntro workspaceName={workspace?.name ?? "your workspace"} />
        )}
      </section>
    </main>
  )
}

function FirstTimeSetupIntro({ workspaceName }: { workspaceName: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm shadow-slate-200/60">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F48F7]">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
          Workspace setup needed
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight">
          Set up {workspaceName} so Sentry Sound can personalize your dashboard.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-[#64748B]">
          Add the basics once: workspace identity, region defaults, your role,
          your main goal, and a few setup preferences. This helps Sentry Sound
          guide your next steps without turning setup into paperwork.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/setup/edit"
            className="inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
          >
            Start Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-semibold text-[#334155]"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>

      <aside className="space-y-4">
        {[
          "Personalizes the dashboard.",
          "Sets practical regional defaults.",
          "Supports future templates and finance defaults.",
          "Keeps compliance/KYC out of the trial setup.",
        ].map((item) => (
          <div key={item} className="flex gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
            <span className="text-sm font-semibold text-[#475569]">{item}</span>
          </div>
        ))}
      </aside>
    </div>
  )
}

function WorkspaceProfileSummary({
  setup,
  workspaceName,
}: {
  setup: WorkspaceSetupV1
  workspaceName: string
}) {
  const sections = [
    {
      title: "Workspace Identity",
      icon: Building2,
      items: [
        ["Workspace name", setup.workspace_name || workspaceName],
        ["Legal or trading name", setup.legal_or_trading_name],
        ["Workspace type", setup.workspace_type],
        ["Business stage", setup.business_stage],
      ],
    },
    {
      title: "Region & Defaults",
      icon: Globe2,
      items: [
        ["Country", setup.country],
        ["Base currency", setup.base_currency],
        ["Timezone", setup.timezone || "No default"],
        ["VAT/tax registered", setup.vat_tax_registered],
      ],
    },
    {
      title: "Operational Profile",
      icon: Target,
      items: [
        ["Primary role", setup.primary_role],
        ["Main goal", setup.main_goal],
        ["Current pain point", setup.current_pain_point],
        ["Catalog size", setup.catalog_size],
        ["Team size", setup.team_size],
      ],
    },
    {
      title: "Activation Choices",
      icon: ClipboardCheck,
      items: [
        ["Invite team now", yesNo(setup.invite_team_now)],
        ["Add first work now", yesNo(setup.add_first_work_now)],
        ["Upload first file now", yesNo(setup.upload_first_file_now)],
      ],
    },
  ] as const

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#BBF7D0] bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="inline-flex items-center rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#15803D]">
              <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
              Setup completed
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Workspace Profile</h2>
            <p className="mt-2 max-w-2xl leading-7 text-[#64748B]">
              Your setup already exists. Sentry Sound can use this operational
              identity to personalize dashboard guidance, defaults, and future
              workspace recommendations.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ProfileFact label="Workspace name" value={setup.workspace_name || workspaceName} />
              <ProfileFact label="Legal/trading name" value={setup.legal_or_trading_name} />
              <ProfileFact label="Workspace type" value={setup.workspace_type} />
              <ProfileFact label="Country" value={setup.country} />
              <ProfileFact label="Currency" value={setup.base_currency} />
              <ProfileFact label="Primary role" value={setup.primary_role} />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <p className="text-sm font-semibold text-[#334155]">Profile actions</p>
            <div className="mt-4 grid gap-3">
              <a
                href="#workspace-profile-details"
                className="inline-flex items-center justify-center rounded-xl border border-[#BFDBFE] bg-white px-5 py-3 text-sm font-semibold text-[#2F48F7] hover:bg-[#EFF6FF]"
              >
                View Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <Link
                href="/dashboard/setup/edit"
                className="inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-5 py-3 text-sm font-semibold text-white"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-semibold text-[#334155]"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/60">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#64748B]">
              Coming later
            </div>
            <h2 className="mt-3 text-xl font-semibold">Create New Profile</h2>
            <p className="mt-1 text-sm leading-6 text-[#64748B]">
              V1 supports one workspace profile. Multi-profile and multi-workspace
              setup can be added later without changing this saved profile.
            </p>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-5 py-3 text-sm font-semibold text-[#94A3B8]"
          >
            Create New Profile
          </button>
        </div>
      </section>

      <section id="workspace-profile-details" className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <SummaryCard key={section.title} title={section.title} icon={<Icon className="h-5 w-5" />}>
              {section.items.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#0F172A]">{value || "Not set"}</p>
                </div>
              ))}
            </SummaryCard>
          )
        })}
      </section>

      <section className="rounded-2xl border border-[#FEF3C7] bg-[#FFFBEB] p-5 text-sm leading-6 text-[#92400E]">
        This profile is operational setup data only. It is not compliance/KYC,
        does not verify legal authority, and does not request registration
        documents, tax clearance, or banking details.
      </section>
    </div>
  )
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-[#0F172A]">{value || "Not set"}</p>
    </div>
  )
}

function SummaryCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{children}</div>
    </article>
  )
}

function yesNo(value: boolean) {
  return value ? "Yes" : "No"
}
