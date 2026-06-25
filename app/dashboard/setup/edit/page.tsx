"use client"

import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Info,
  Loader2,
  Save,
} from "lucide-react"

import {
  businessStages,
  catalogSizes,
  currentPainPoints,
  getDefaultCurrencyForCountry,
  getDefaultTimezoneForCountry,
  mainGoals,
  primaryRoles,
  setupCountries,
  setupCurrencies,
  setupTimezones,
  teamSizes,
  vatTaxRegisteredOptions,
  workspaceTypes,
} from "@/lib/workspace-setup/workspace-setup-v1"
import type {
  WorkspaceSetupV1,
  WorkspaceSetupV1Payload,
} from "@/lib/workspace-setup/workspace-setup-v1"

const initialForm: WorkspaceSetupV1Payload = {
  workspace_name: "",
  legal_or_trading_name: "",
  workspace_type: "Artist",
  business_stage: "Just starting",
  country: "ZA",
  base_currency: "ZAR",
  timezone: "Africa/Johannesburg",
  vat_tax_registered: "Not sure",
  primary_role: "Artist",
  main_goal: "Organize my music operations",
  current_pain_point: "Scattered files and information",
  catalog_size: "No catalog yet",
  team_size: "Just me",
  invite_team_now: false,
  add_first_work_now: true,
  upload_first_file_now: false,
}

type ApiResult =
  | {
      ok: true
      data: {
        setup: WorkspaceSetupV1 | null
        workspace?: { name?: string | null; legal_name?: string | null }
        completion: { percent: number; complete: boolean; missingFields: string[] }
        notices: string[]
      }
    }
  | { ok: false; error: { code: string; message: string; fields?: string[] } }

export default function WorkspaceSetupEditPage() {
  const router = useRouter()
  const [form, setForm] = useState<WorkspaceSetupV1Payload>(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [missingFields, setMissingFields] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false

    async function loadSetup() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/workspace-setup", { cache: "no-store" })
        const result = (await response.json()) as ApiResult

        if (cancelled) return

        if (result.ok) {
          setForm({
            ...initialForm,
            workspace_name:
              result.data.setup?.workspace_name ??
              result.data.workspace?.name ??
              "",
            legal_or_trading_name:
              result.data.setup?.legal_or_trading_name ??
              result.data.workspace?.legal_name ??
              "",
            ...(result.data.setup ?? {}),
          })
          setMissingFields(result.data.completion.missingFields)
        } else {
          setError(result.error.message)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load setup.")
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

  const completion = useMemo(() => {
    const required = [
      form.workspace_name,
      form.legal_or_trading_name,
      form.workspace_type,
      form.business_stage,
      form.country,
      form.base_currency,
      form.vat_tax_registered,
      form.primary_role,
      form.main_goal,
      form.current_pain_point,
      form.catalog_size,
      form.team_size,
    ]
    const completed = required.filter((value) => typeof value === "string" && value.trim()).length
    return Math.round((completed / required.length) * 100)
  }, [form])

  function updateField<K extends keyof WorkspaceSetupV1Payload>(
    key: K,
    value: WorkspaceSetupV1Payload[K]
  ) {
    setSuccess(false)
    setMissingFields((fields) => fields.filter((field) => field !== key))
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateCountry(country: string) {
    updateField("country", country)
    setForm((current) => ({
      ...current,
      country,
      base_currency: getDefaultCurrencyForCountry(country),
      timezone: getDefaultTimezoneForCountry(country),
    }))
  }

  async function saveSetup() {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const response = await fetch("/api/workspace-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const result = (await response.json()) as ApiResult

      if (!result.ok) {
        setMissingFields(result.error.fields ?? [])
        throw new Error(result.error.message)
      }

      setMissingFields([])
      setSuccess(true)
      window.setTimeout(() => router.push("/dashboard/setup"), 900)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save setup.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/dashboard/setup" className="inline-flex items-center text-sm font-semibold text-[#2F48F7]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to workspace profile
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Edit Workspace Setup</h1>
            <p className="mt-2 max-w-2xl leading-7 text-[#64748B]">
              Capture operational identity for personalization, defaults, onboarding
              guidance, and future modules. This is not compliance or KYC.
            </p>
          </div>
          <div className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <p className="text-sm font-semibold text-[#2F48F7]">Setup progress</p>
            <p className="mt-1 text-2xl font-semibold">{completion}%</p>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {error ? (
            <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm font-semibold text-[#B91C1C]">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 text-sm font-semibold text-[#15803D]">
              Workspace setup saved. Returning to workspace profile...
            </div>
          ) : null}

          {loading ? (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white">
              <Loader2 className="h-6 w-6 animate-spin text-[#2F48F7]" />
            </div>
          ) : (
            <>
              <FormSection
                title="Workspace Identity"
                description="Basic operating identity for the workspace and future templates."
              >
                <TextField label="Workspace name" required value={form.workspace_name ?? ""} missing={missingFields.includes("workspace_name")} onChange={(value) => updateField("workspace_name", value)} />
                <TextField label="Legal or trading name" required value={form.legal_or_trading_name ?? ""} missing={missingFields.includes("legal_or_trading_name")} onChange={(value) => updateField("legal_or_trading_name", value)} />
                <SelectField label="Workspace type" required value={form.workspace_type ?? ""} options={workspaceTypes} onChange={(value) => updateField("workspace_type", value as never)} />
                <SelectField label="Business stage" required value={form.business_stage ?? ""} options={businessStages} onChange={(value) => updateField("business_stage", value as never)} />
              </FormSection>

              <FormSection
                title="Region & Defaults"
                description="Defaults for future finance, templates, time display, and workspace guidance."
              >
                <SelectField label="Country" required value={form.country ?? ""} options={setupCountries.map((item) => item.code)} optionLabels={Object.fromEntries(setupCountries.map((item) => [item.code, item.label]))} onChange={updateCountry} />
                <SelectField label="Base currency" required value={form.base_currency ?? ""} options={setupCurrencies} onChange={(value) => updateField("base_currency", value)} />
                <SelectField label="Timezone" value={form.timezone ?? ""} options={setupTimezones} includeBlank onChange={(value) => updateField("timezone", value || null)} />
                <SelectField label="VAT/tax registered" required value={form.vat_tax_registered ?? ""} options={vatTaxRegisteredOptions} onChange={(value) => updateField("vat_tax_registered", value as never)} />
              </FormSection>

              <FormSection
                title="Operational Profile"
                description="Helps the dashboard guide setup and future modules without overwhelming trial users."
              >
                <SelectField label="Primary role" required value={form.primary_role ?? ""} options={primaryRoles} onChange={(value) => updateField("primary_role", value as never)} />
                <SelectField label="Main goal" required value={form.main_goal ?? ""} options={mainGoals} onChange={(value) => updateField("main_goal", value as never)} />
                <SelectField label="Current pain point" required value={form.current_pain_point ?? ""} options={currentPainPoints} onChange={(value) => updateField("current_pain_point", value as never)} />
                <SelectField label="Catalog size" required value={form.catalog_size ?? ""} options={catalogSizes} onChange={(value) => updateField("catalog_size", value as never)} />
                <SelectField label="Team size" required value={form.team_size ?? ""} options={teamSizes} onChange={(value) => updateField("team_size", value as never)} />
              </FormSection>

              <FormSection
                title="Activation Choices"
                description="Optional next-step preferences. These do not activate unavailable systems."
              >
                <ToggleField label="Invite team now" checked={form.invite_team_now === true} onChange={(checked) => updateField("invite_team_now", checked)} />
                <ToggleField label="Add first work now" checked={form.add_first_work_now === true} onChange={(checked) => updateField("add_first_work_now", checked)} />
                <ToggleField label="Upload first file now" checked={form.upload_first_file_now === true} onChange={(checked) => updateField("upload_first_file_now", checked)} />
              </FormSection>

              <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-[#64748B]">
                  Save setup to personalize the dashboard and future workspace defaults.
                </p>
                <button
                  type="button"
                  onClick={saveSetup}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Workspace Setup
                </button>
              </div>
            </>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">What this setup does</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-[#64748B]">
              {[
                "Personalizes the workspace.",
                "Supports future agreements and templates.",
                "Supports finance defaults later.",
                "Supports marketing segmentation.",
                "Guides onboarding and dashboard recommendations.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#FEF3C7] bg-[#FFFBEB] p-6">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]" />
              <div>
                <h2 className="font-semibold text-[#92400E]">Not compliance verification</h2>
                <p className="mt-2 text-sm leading-6 text-[#92400E]">
                  This page does not request company registration documents,
                  tax clearance, banking details, or compliance uploads.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#64748B]">{description}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  )
}

function TextField({
  label,
  value,
  onChange,
  required,
  missing,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  missing?: boolean
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#334155]">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F48F7] ${
          missing ? "border-[#EF4444]" : "border-[#CBD5E1]"
        }`}
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  optionLabels,
  onChange,
  required,
  includeBlank,
}: {
  label: string
  value: string
  options: readonly string[]
  optionLabels?: Record<string, string>
  onChange: (value: string) => void
  required?: boolean
  includeBlank?: boolean
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#334155]">
        {label}
        {required ? " *" : ""}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F48F7]"
      >
        {includeBlank ? <option value="">No default</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  )
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
      <span className="text-sm font-semibold text-[#334155]">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-[#2F48F7]"
      />
    </label>
  )
}
