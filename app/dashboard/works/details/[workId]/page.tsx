"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Lightbulb,
  Loader2,
  PlusCircle,
  Save,
  Sparkles,
  Users,
} from "lucide-react";

import { toArtistStatusLabel } from "@/lib/works/work-status-language";

type WorkContributorSplit = {
  id: string;
  contributor_id: string;
  contributor_name?: string | null;
  stage_name?: string | null;
  role?: string | null;
  split_type?: string | null;
  percentage?: number | null;
  confirmed?: boolean | null;
};

type WorkDetailsRow = {
  id: string;
  asset_id?: string | null;
  work_title?: string | null;
  genre?: string | null;
  mood?: string | null;
  themes?: string | null;
  copyright_status?: string | null;
  registration_status?: string | null;
  isrc?: string | null;
  bpm?: number | null;
  musical_key?: string | null;
  created_at?: string | null;
  contributor_count?: number | null;
  split_total?: number | null;
  contributors?: WorkContributorSplit[];
  work_intelligence_v1?: WorkIntelligenceMetadata | null;
};

type WorkDetailReadModelResponse = {
  success?: boolean;
  work?: WorkDetailsRow;
  error?: string;
};

type WorkSupportingMaterial = {
  id: string;
  link_id: string;
  file_name: string;
  file_category: string;
  reference_status: "reference_only" | "not_verified";
  reference_text?: string | null;
  notes?: string | null;
  purpose?: string | null;
  referenceType?: string | null;
  visibility?: string | null;
  usageContext?: string | null;
  publicSafeStatus?: string | null;
  evidenceCandidate?: boolean | null;
  verificationStatus?: string | null;
  lineageSourceType?: string | null;
  created_at?: string | null;
};

type WorkSupportingMaterialsResponse = {
  success?: boolean;
  materials?: WorkSupportingMaterial[];
  error?: string;
  disclaimer?: string;
};

type WorkCompletenessStatus = "needs_review" | "incomplete" | "review_ready";
type WorkCompletenessCategoryStatus = "captured" | "missing" | "needs_review";

type WorkCompletenessItem = {
  key: string;
  label: string;
  status: WorkCompletenessCategoryStatus;
  detail: string;
};

type WorkCompletenessCategory = {
  key: string;
  label: string;
  status: WorkCompletenessCategoryStatus;
  items: WorkCompletenessItem[];
};

type WorkCompletenessResponse = {
  success?: boolean;
  work_id?: string;
  status?: WorkCompletenessStatus;
  categories?: WorkCompletenessCategory[];
  missing_items?: string[];
  review_notes?: string[];
  disclaimer?: string;
  error?: string;
};

type OutcomeContextStatus = "Visible" | "Missing context" | "May need review" | "Context unavailable";
type OutcomeSufficiencyLabel = "Enough context for review" | "Some context still missing" | "Limited context visible";

type OutcomeContextItem = {
  label: string;
  detail: string;
  status: OutcomeContextStatus;
};

type OutcomeContextSummary = {
  intendedOutcome: string;
  relatedMaterials: string;
  completenessContext: string;
  sufficiencyLabel: OutcomeSufficiencyLabel;
  visibleContext: OutcomeContextItem[];
  missingContext: string[];
  reviewNotes: string[];
};

type SupportingMaterialDraft = {
  file_name: string;
  file_category: string;
  reference_text: string;
  notes: string;
  purpose: string;
  referenceType: string;
  visibility: string;
  usageContext: string;
};

type WorkDetailTab =
  | "creative-details"
  | "contributors-splits"
  | "supporting-materials"
  | "captured-basics"
  | "progress-context"
  | "song-opportunities"
  | "release-readiness";

const workDetailTabs: { key: WorkDetailTab; label: string; cue: string }[] = [
  { key: "creative-details", label: "Creative Details", cue: "Add or update song details" },
  { key: "contributors-splits", label: "Contributors & Splits", cue: "Review contributors and composition splits" },
  { key: "supporting-materials", label: "Supporting Materials", cue: "Add references connected to this song" },
  { key: "captured-basics", label: "Song Basics", cue: "Review saved song basics" },
  { key: "progress-context", label: "Progress / Context", cue: "Review profile progress and helpful context" },
  { key: "song-opportunities", label: "Opportunities", cue: "Future planning ideas" },
  { key: "release-readiness", label: "Release Readiness", cue: "See what's complete, what's missing, and what to do next" },
];

function isWorkDetailTab(value: string | null): value is WorkDetailTab {
  return workDetailTabs.some((tab) => tab.key === value);
}

type GapAction = {
  item: string;
  targetTab?: WorkDetailTab;
  actionLabel: string;
  detail: string;
};

type ContextProgress = {
  percent: number;
  captured: number;
  total: number;
  source: string;
};

type TabProgress = ContextProgress & {
  key: WorkDetailTab;
  label: string;
  color: string;
  status: "Captured" | "Needs attention" | "Coming later" | "Not active yet";
  detail: string;
};

const tabAccentColors: Record<WorkDetailTab, string> = {
  "creative-details": "#DB2777",
  "contributors-splits": "#059669",
  "supporting-materials": "#D97706",
  "captured-basics": "#2F48F7",
  "progress-context": "#7C3AED",
  "song-opportunities": "#64748B",
  "release-readiness": "#16A34A",
};

type WorkIntelligenceMetadata = {
  creative_truth?: Partial<Record<string, string>> | null;
  system_insights?: Partial<Record<string, string>> | null;
  alternative_title?: string;
  language?: string;
  energy?: string;
  clean_explicit?: string;
  audience_vibe?: string;
  sync_licensing_potential?: string;
  target_audience?: string;
  release_intentions?: string;
  commercial_notes?: string;
  marketing_notes?: string;
};

type EnrichmentField = {
  key: string;
  label: string;
  placeholder: string;
  section: "Creative details";
  status: "planned metadata field" | "existing unused metadata column";
  purpose: string;
  multiline?: boolean;
  options?: string[];
};

const enrichmentFields: EnrichmentField[] = [
  {
    key: "alternative_title",
    label: "Alternative title",
    placeholder: "Working title, translated title, or alternate spelling",
    section: "Creative details",
    status: "planned metadata field",
    purpose: "Helps identify the work when it appears under different names later.",
  },
  {
    key: "language",
    label: "Language",
    placeholder: "Select language context",
    section: "Creative details",
    status: "planned metadata field",
    purpose: "Supports future territory, discovery, and submission packaging.",
    options: ["", "English", "Afrikaans", "isiZulu", "Instrumental", "Multiple languages", "Other / Not sure"],
  },
  {
    key: "themes",
    label: "Themes",
    placeholder: "Hope, love, resilience, nightlife...",
    section: "Creative details",
    status: "existing unused metadata column",
    purpose: "Supports catalog search, briefs, playlist matching, and future recommendations.",
    multiline: true,
  },
  {
    key: "energy",
    label: "Energy / feel",
    placeholder: "Select a general energy level",
    section: "Creative details",
    status: "planned metadata field",
    purpose: "Helps later playlist, sync, and campaign planning understand where the work fits.",
    options: ["", "Low", "Medium", "High", "Peak"],
  },
  {
    key: "clean_explicit",
    label: "Clean / explicit",
    placeholder: "Select content note",
    section: "Creative details",
    status: "planned metadata field",
    purpose: "Supports future release packaging and commercial usage checks.",
    options: ["", "Clean", "Explicit", "Instrumental", "Unknown"],
  },
  {
    key: "creative_description",
    label: "Creative description",
    placeholder: "What is the song about, how does it feel, and what should someone understand about it?",
    section: "Creative details",
    status: "planned metadata field",
    purpose: "Gives the system honest creative context for future recommendations.",
    multiline: true,
  },
  {
    key: "inspiration_reference_notes",
    label: "Inspiration / reference notes",
    placeholder: "Reference tracks, creative influences, story context, or production notes",
    section: "Creative details",
    status: "planned metadata field",
    purpose: "Keeps subjective human context separate from generated commercial recommendations.",
    multiline: true,
  },
];

const supportingMaterialCategories = [
  "contract",
  "proof_of_ownership",
  "split_sheet",
  "master_audio",
  "artwork",
  "release_document",
  "compliance",
  "invoice",
  "statement",
  "other",
];

const supportingMaterialPurposeOptions = [
  { value: "", label: "Select a purpose" },
  { value: "lyrics", label: "Lyrics" },
  { value: "demo", label: "Demo" },
  { value: "artwork", label: "Artwork" },
  { value: "split_sheet", label: "Split sheet" },
  { value: "agreement", label: "Agreement" },
  { value: "metadata_reference", label: "Metadata reference" },
  { value: "audio_reference", label: "Audio reference" },
  { value: "proof_of_creation", label: "Proof of creation" },
  { value: "licensing_reference", label: "Licensing reference" },
  { value: "other", label: "Other" },
];

const supportingMaterialReferenceTypeOptions = [
  { value: "reference", label: "Reference" },
  { value: "evidence_candidate", label: "Evidence candidate" },
  { value: "operational_document", label: "Working document" },
  { value: "public_media", label: "May support public profile later" },
  { value: "internal_note", label: "Internal note" },
];

const supportingMaterialVisibilityOptions = [
  { value: "private", label: "Private" },
  { value: "workspace", label: "Internal/workspace" },
  { value: "public_safe_candidate", label: "Maybe public later" },
];

const supportingMaterialUsageContextOptions = [
  { value: "", label: "Select where this helps" },
  { value: "song_profile", label: "Song profile" },
  { value: "rights_admin", label: "Rights admin" },
  { value: "publishing", label: "Publishing" },
  { value: "release_preparation", label: "Release preparation" },
  { value: "licensing", label: "Licensing" },
  { value: "public_showcase_candidate", label: "Possible public showcase" },
  { value: "evidence_support", label: "Evidence support" },
];

const supportingMaterialPublicSafeStatusOptions = [
  { value: "private_only", label: "Private only" },
  { value: "candidate", label: "Public-safe candidate" },
  { value: "approved_later", label: "May be approved later" },
  { value: "not_applicable", label: "Not applicable" },
];

const supportingMaterialVerificationStatusOptions = [
  { value: "not_verified", label: "Not verified" },
  { value: "verified_later", label: "May be verified later" },
  { value: "unknown", label: "Verification unknown" },
];

const supportingMaterialLineageSourceOptions = [
  { value: "manual_reference", label: "Manual reference" },
  { value: "uploaded_file", label: "Uploaded file" },
  { value: "external_link", label: "External link" },
  { value: "generated_export", label: "Generated export" },
  { value: "legacy_reference", label: "Legacy reference" },
  { value: "unknown", label: "Source unknown" },
];

const emptySupportingMaterialDraft: SupportingMaterialDraft = {
  file_name: "",
  file_category: "proof_of_ownership",
  reference_text: "",
  notes: "",
  purpose: "",
  referenceType: "reference",
  visibility: "private",
  usageContext: "",
};

export default function WorkDetailsPage() {
  const params = useParams<{ workId: string }>();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const workId = Array.isArray(params.workId) ? params.workId[0] : params.workId;
  const [work, setWork] = useState<WorkDetailsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [basicsDraft, setBasicsDraft] = useState({ isrc: "", bpm: "", musical_key: "" });
  const [basicsSavingField, setBasicsSavingField] = useState<string | null>(null);
  const [basicsSavedField, setBasicsSavedField] = useState<string | null>(null);
  const [basicsError, setBasicsError] = useState<string | null>(null);
  const [supportingMaterials, setSupportingMaterials] = useState<WorkSupportingMaterial[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialsError, setMaterialsError] = useState<string | null>(null);
  const [materialDraft, setMaterialDraft] = useState<SupportingMaterialDraft>(emptySupportingMaterialDraft);
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [completeness, setCompleteness] = useState<WorkCompletenessResponse | null>(null);
  const [completenessLoading, setCompletenessLoading] = useState(false);
  const [completenessError, setCompletenessError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WorkDetailTab>(
    isWorkDetailTab(requestedTab) ? requestedTab : "captured-basics"
  );

  async function loadSupportingMaterials(currentWorkId: string, cancelled = false) {
    setMaterialsLoading(true);
    setMaterialsError(null);

    try {
      const response = await fetch(`/api/works/${currentWorkId}/files`, { cache: "no-store" });
      const data = (await response.json()) as WorkSupportingMaterialsResponse;

      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? "Failed to load supporting materials.");
      }

      if (!cancelled) {
        setSupportingMaterials(data.materials ?? []);
      }
    } catch (loadError) {
      if (!cancelled) {
        setMaterialsError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load supporting materials."
        );
      }
    } finally {
      if (!cancelled) setMaterialsLoading(false);
    }
  }

  async function loadCompleteness(currentWorkId: string, cancelled = false) {
    setCompletenessLoading(true);
    setCompletenessError(null);

    try {
      const response = await fetch(`/api/works/${currentWorkId}/completeness`, { cache: "no-store" });
      const data = (await response.json()) as WorkCompletenessResponse;

      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? "Failed to load operational completeness.");
      }

      if (!cancelled) setCompleteness(data);
    } catch (loadError) {
      if (!cancelled) {
        setCompletenessError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load operational completeness."
        );
      }
    } finally {
      if (!cancelled) setCompletenessLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadWork() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/works/${workId}`, { cache: "no-store" });
        const data = (await response.json()) as WorkDetailReadModelResponse;

        if (!response.ok || data.success === false) {
          throw new Error(data.error ?? "Failed to load work details.");
        }

        if (!cancelled) {
          const currentWork = data.work ?? null;
          setWork(currentWork);
          if (currentWork) {
            setDraft(buildDraftFromWork(currentWork));
            setBasicsDraft({
              isrc: currentWork.isrc ?? "",
              bpm: currentWork.bpm !== null && currentWork.bpm !== undefined ? String(currentWork.bpm) : "",
              musical_key: currentWork.musical_key ?? "",
            });
          }
        }

        if (data.work && !cancelled) {
          await Promise.all([
            loadSupportingMaterials(data.work.id, cancelled),
            loadCompleteness(data.work.id, cancelled),
          ]);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load work details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWork();
    return () => {
      cancelled = true;
    };
  }, [workId]);

  const completionCount = useMemo(
    () => enrichmentFields.filter((field) => draft[field.key]?.trim()).length,
    [draft]
  );

  const insightCards = useMemo(
    () => {
      const systemInsights = work?.work_intelligence_v1?.system_insights ?? {};

      return [
        {
          label: "Audience profile",
          value: systemInsights.audience_profile,
        },
        {
          label: "Sync/licensing potential",
          value: systemInsights.sync_licensing_potential,
        },
        {
          label: "Market positioning",
          value: systemInsights.market_positioning,
        },
        {
          label: "Release strategy",
          value: systemInsights.release_strategy,
        },
        {
          label: "Campaign suggestions",
          value: systemInsights.campaign_suggestions,
        },
      ];
    },
    [work?.work_intelligence_v1?.system_insights]
  );

  const outcomeContext = useMemo(
    () => work ? buildOutcomeContext(work, supportingMaterials, completeness, completenessLoading, completenessError) : null,
    [completeness, completenessError, completenessLoading, supportingMaterials, work]
  );
  const currentTab = workDetailTabs.find((tab) => tab.key === activeTab) ?? workDetailTabs[0];
  const gapActions = useMemo(
    () => buildGapActions([
      ...(completeness?.missing_items ?? []),
      ...(completeness?.review_notes ?? []),
    ]),
    [completeness?.missing_items, completeness?.review_notes]
  );
  const tabProgressItems = useMemo(
    () => work ? buildTabProgressItems(work, draft, supportingMaterials, completeness, outcomeContext, insightCards) : [],
    [completeness, draft, insightCards, outcomeContext, supportingMaterials, work]
  );
  const overallContextProgress = useMemo(
    () => buildOverallTabProgress(tabProgressItems),
    [tabProgressItems]
  );
  const currentTabProgress = useMemo(
    () => tabProgressItems.find((item) => item.key === activeTab),
    [activeTab, tabProgressItems]
  );
  const isCreativeDetailsActive = activeTab === "creative-details";

  async function saveIntelligence() {
    if (!work) return;

    setSaving(true);
    setSaveError(null);
    setSavedMessage(null);

    try {
      const response = await fetch(`/api/works/${work.id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? "Failed to save work intelligence.");
      }

      setWork((current) =>
        current
          ? {
              ...current,
              themes: data.themes,
              work_intelligence_v1: data.work_intelligence_v1,
            }
          : current
      );
      setSavedMessage("Song Profile saved. Refreshing this page will keep the creative fields populated.");
    } catch (saveError) {
      setSaveError(saveError instanceof Error ? saveError.message : "Failed to save work intelligence.");
    } finally {
      setSaving(false);
    }
  }

  async function saveBasicsField(field: "isrc" | "bpm" | "musical_key") {
    if (!work) return;

    setBasicsSavingField(field);
    setBasicsSavedField(null);
    setBasicsError(null);

    try {
      const response = await fetch(`/api/works/${work.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isrc: basicsDraft.isrc,
          bpm: basicsDraft.bpm.trim() ? Number(basicsDraft.bpm) : null,
          musical_key: basicsDraft.musical_key,
        }),
      });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? "Failed to save.");
      }

      setWork((current) =>
        current ? { ...current, isrc: data.isrc, bpm: data.bpm, musical_key: data.musical_key } : current
      );
      setBasicsDraft({
        isrc: data.isrc ?? "",
        bpm: data.bpm !== null && data.bpm !== undefined ? String(data.bpm) : "",
        musical_key: data.musical_key ?? "",
      });
      setBasicsSavedField(field);
    } catch (saveError) {
      setBasicsError(saveError instanceof Error ? saveError.message : "Failed to save.");
    } finally {
      setBasicsSavingField(null);
    }
  }

  async function addSupportingMaterial() {
    if (!work) return;

    setAddingMaterial(true);
    setMaterialsError(null);

    try {
      const response = await fetch(`/api/works/${work.id}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materialDraft),
      });
      const data = (await response.json()) as WorkSupportingMaterialsResponse;

      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? "Failed to add supporting material reference.");
      }

      setSupportingMaterials(data.materials ?? []);
      setMaterialDraft(emptySupportingMaterialDraft);
      await loadCompleteness(work.id);
    } catch (addError) {
      setMaterialsError(
        addError instanceof Error
          ? addError.message
          : "Failed to add supporting material reference."
      );
    } finally {
      setAddingMaterial(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/dashboard/works/list" className="inline-flex items-center text-sm font-semibold text-[#2F48F7]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Existing Works
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Song Profile</h1>
            <p className="mt-2 max-w-3xl leading-7 text-[#64748B]">
              Capture the creative truth around this song. Sentry Sound can use this
              structured context later to generate commercial insights, recommendations,
              and next steps without rewriting user-entered facts.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <p className="text-sm font-semibold text-[#2F48F7]">Creative truth</p>
            <p className="mt-1 text-sm font-semibold text-[#334155]">Your Song Profile</p>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {loading ? (
            <StateCard icon={<Loader2 className="h-5 w-5 animate-spin" />} title="Loading work" body="Reading the canonical work detail." />
          ) : error ? (
            <StateCard title="Could not load work" body={error} tone="danger" />
          ) : !work ? (
            <StateCard
              title="Work not available"
              body="This work could not be found in the canonical works read model."
              tone="warning"
            />
          ) : (
            <>
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm shadow-slate-200/60">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                    Song sections
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#334155]">{currentTab.cue}</p>
                </div>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {workDetailTabs.map((tab) => {
                    const active = tab.key === activeTab;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                          active
                            ? "bg-[#EFF6FF] text-[#0F172A]"
                            : "border-[#E5E7EB] bg-white text-[#475569] hover:border-[#BFDBFE] hover:bg-[#F8FAFC]"
                        }`}
                        style={active ? { borderColor: tabAccentColors[tab.key] } : undefined}
                        aria-pressed={active}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              <ComplianceExportsCard workId={workId} />

              {activeTab === "captured-basics" ? (
              <>
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Captured basics</p>
                    <h2 className="mt-2 text-2xl font-semibold">{work.work_title || "Untitled work"}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#64748B]">
                      The fields below are saved through the workspace-owned create path.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#15803D]">
                    Captured draft
                  </span>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <SummaryTile label="Genre" value={work.genre || "Not captured"} />
                  <SummaryTile label="Mood" value={work.mood || "Not captured"} />
                  <SummaryTile label="Contributors" value={formatContributorCount(work.contributor_count)} />
                  <SummaryTile label="Split total" value={formatSplitTotal(work.split_total)} />
                  <SummaryTile label="Protection status" value={toArtistStatusLabel(work.registration_status)} />
                  <SummaryTile label="Copyright" value={work.copyright_status || "Draft"} />
                </div>
              </section>

              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Track details</p>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  Optional, but used to check this song&apos;s release readiness.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <BasicsField
                    label="Track ID (ISRC)"
                    value={basicsDraft.isrc}
                    placeholder="e.g. ZAA123456789"
                    saving={basicsSavingField === "isrc"}
                    saved={basicsSavedField === "isrc"}
                    onChange={(value) => setBasicsDraft((current) => ({ ...current, isrc: value }))}
                    onBlur={() => saveBasicsField("isrc")}
                  />
                  <BasicsField
                    label="Tempo (BPM)"
                    value={basicsDraft.bpm}
                    placeholder="e.g. 120"
                    type="number"
                    saving={basicsSavingField === "bpm"}
                    saved={basicsSavedField === "bpm"}
                    onChange={(value) => setBasicsDraft((current) => ({ ...current, bpm: value }))}
                    onBlur={() => saveBasicsField("bpm")}
                  />
                  <BasicsField
                    label="Musical Key"
                    value={basicsDraft.musical_key}
                    placeholder="e.g. C major, A minor"
                    saving={basicsSavingField === "musical_key"}
                    saved={basicsSavedField === "musical_key"}
                    onChange={(value) => setBasicsDraft((current) => ({ ...current, musical_key: value }))}
                    onBlur={() => saveBasicsField("musical_key")}
                  />
                </div>
                {basicsError ? <p className="mt-3 text-sm font-semibold text-[#B91C1C]">{basicsError}</p> : null}
              </section>

              {gapActions.length > 0 ? (
                <section className="rounded-2xl border border-[#FEF3C7] bg-[#FFFBEB] p-4 shadow-sm shadow-slate-200/60">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#92400E]">Next things to add</p>
                      <p className="mt-1 text-xs leading-5 text-[#78350F]">
                        Use the song sections above to keep building this profile when you are ready.
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#92400E]">
                      {gapActions.length} item{gapActions.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </section>
              ) : null}
              </>
              ) : null}

              {activeTab === "progress-context" && outcomeContext ? (
                <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                          Context only
                        </p>
                        <h2 className="text-xl font-semibold">Outcome Context</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                          Read-only operational context around this work. Review visible context before deciding the next operational step.
                        </p>
                      </div>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${outcomeSufficiencyClass(outcomeContext.sufficiencyLabel)}`}>
                      {outcomeContext.sufficiencyLabel}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <SummaryTile label="Intended outcome" value={outcomeContext.intendedOutcome} />
                    <SummaryTile label="Related materials" value={outcomeContext.relatedMaterials} />
                    <SummaryTile label="Completeness context" value={outcomeContext.completenessContext} />
                    <SummaryTile label="Contextual sufficiency" value={outcomeContext.sufficiencyLabel} />
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                    <p className="text-sm font-semibold text-[#0F172A]">Visible context</p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {outcomeContext.visibleContext.map((item) => (
                        <div key={item.label} className="rounded-xl bg-white p-3">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-[#334155]">{item.label}</p>
                              <p className="mt-1 text-xs leading-5 text-[#64748B]">{item.detail}</p>
                            </div>
                            <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${outcomeContextStatusClass(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {outcomeContext.missingContext.length > 0 ? (
                    <div className="mt-5 rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-4">
                          <p className="text-sm font-semibold text-[#92400E]">Next things to add</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#78350F]">
                        {outcomeContext.missingContext.slice(0, 4).map((item) => {
                          const action = getGapAction(item);
                          return (
                            <li key={item} className="rounded-xl bg-white/70 p-3">
                              <p>- {item}</p>
                              {action.targetTab ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveTab(action.targetTab ?? "progress-context")}
                                  className="mt-2 inline-flex rounded-xl border border-[#FCD34D] bg-white px-3 py-1.5 text-xs font-semibold text-[#92400E] transition hover:bg-[#FFFBEB]"
                                >
                                  {action.actionLabel}
                                </button>
                              ) : (
                                <span className="mt-2 inline-flex rounded-xl border border-[#FDE68A] bg-white px-3 py-1.5 text-xs font-semibold text-[#92400E]">
                                  {action.actionLabel}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}

                  {outcomeContext.reviewNotes.length > 0 ? (
                    <div className="mt-5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                      <p className="text-sm font-semibold text-[#2F48F7]">May need review</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#1E3A8A]">
                        {outcomeContext.reviewNotes.slice(0, 4).map((item) => {
                          const action = getGapAction(item);
                          return (
                            <li key={item} className="rounded-xl bg-white/70 p-3">
                              <p>- {item}</p>
                              {action.targetTab ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveTab(action.targetTab ?? "progress-context")}
                                  className="mt-2 inline-flex rounded-xl border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#2F48F7] transition hover:bg-[#EFF6FF]"
                                >
                                  {action.actionLabel}
                                </button>
                              ) : (
                                <span className="mt-2 inline-flex rounded-xl border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#2F48F7]">
                                  {action.actionLabel}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4 text-xs leading-5 text-[#2F48F7]">
                    Context only. This panel does not approve readiness, verify evidence, change status, create actions, or decide submission/release timing.
                  </div>
                </section>
              ) : null}

              {activeTab === "progress-context" ? (
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                        Profile progress
                      </p>
                      <h2 className="text-xl font-semibold">Progress / Context</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                        A calm view of what is filled in, what can still be added, and what may help later.
                      </p>
                    </div>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${completenessStatusClass(completeness?.status)}`}>
                    {formatCompletenessStatus(completeness?.status)}
                  </span>
                </div>

                <div className="mt-5">
                  {completenessLoading ? (
                    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 text-sm font-semibold text-[#64748B]">
                      Loading profile progress...
                    </div>
                  ) : completenessError ? (
                    <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-5 text-sm font-semibold text-[#B91C1C]">
                      {completenessError}
                    </div>
                  ) : completeness?.categories?.length ? (
                    <div className="grid gap-3 lg:grid-cols-2">
                      {completeness.categories.map((category) => (
                        <article key={category.key} className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-semibold text-[#0F172A]">{category.label}</h3>
                            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${completenessCategoryClass(category.status)}`}>
                              {formatCategoryStatus(category.status)}
                            </span>
                          </div>
                          <div className="mt-4 space-y-2">
                            {category.items.map((item) => (
                              <div key={item.key} className="rounded-xl bg-white p-3">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                  <p className="text-sm font-semibold text-[#334155]">{item.label}</p>
                                  <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${completenessCategoryClass(item.status)}`}>
                                    {formatCategoryStatus(item.status)}
                                  </span>
                                </div>
                                <p className="mt-2 text-xs leading-5 text-[#64748B]">{item.detail}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5">
                      <p className="font-semibold text-[#334155]">Completeness visibility unavailable</p>
                      <p className="mt-2 text-sm leading-6 text-[#64748B]">
                        The song loaded, but profile progress details are not available yet.
                      </p>
                    </div>
                  )}
                </div>

                {completeness?.missing_items?.length ? (
                  <div className="mt-5 rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-4">
                    <p className="text-sm font-semibold text-[#92400E]">Next things to add</p>
                    <ul className="mt-2 space-y-2 text-xs leading-5 text-[#92400E]">
                      {completeness.missing_items.map((item) => {
                        const action = getGapAction(item);
                        return (
                          <li key={item} className="rounded-xl bg-white/70 p-3">
                            <p>{item}</p>
                            {action.targetTab ? (
                              <button
                                type="button"
                                onClick={() => setActiveTab(action.targetTab ?? "progress-context")}
                                className="mt-2 inline-flex rounded-xl border border-[#FCD34D] bg-white px-3 py-1.5 text-xs font-semibold text-[#92400E] transition hover:bg-[#FFFBEB]"
                              >
                                {action.actionLabel}
                              </button>
                            ) : (
                              <span className="mt-2 inline-flex rounded-xl border border-[#FDE68A] bg-white px-3 py-1.5 text-xs font-semibold text-[#92400E]">
                                {action.actionLabel}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}

                {completeness?.review_notes?.length ? (
                  <div className="mt-3 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                    <p className="text-sm font-semibold text-[#2F48F7]">Helpful review notes</p>
                    <ul className="mt-2 space-y-2 text-xs leading-5 text-[#1D4ED8]">
                      {completeness.review_notes.map((note) => {
                        const action = getGapAction(note);
                        return (
                          <li key={note} className="rounded-xl bg-white/70 p-3">
                            <p>{note}</p>
                            {action.targetTab ? (
                              <button
                                type="button"
                                onClick={() => setActiveTab(action.targetTab ?? "progress-context")}
                                className="mt-2 inline-flex rounded-xl border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#2F48F7] transition hover:bg-[#EFF6FF]"
                              >
                                {action.actionLabel}
                              </button>
                            ) : (
                              <span className="mt-2 inline-flex rounded-xl border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#2F48F7]">
                                {action.actionLabel}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4 text-xs leading-5 text-[#2F48F7]">
                  This is profile progress only. It does not confirm legal clearance, evidence verification, royalty readiness, regulator acceptance, or submission approval.
                </div>
              </section>
              ) : null}

              {activeTab === "contributors-splits" ? (
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                        Captured split data
                      </p>
                      <h2 className="text-xl font-semibold">Contributors & Splits</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                        Read-only view of the composition contributors captured for this work.
                        Editing, split-sheet evidence, and contributor approval remain later workflow steps.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${work.split_total === 100 ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF3C7] text-[#B45309]"}`}>
                      Split total: {formatSplitTotal(work.split_total)}
                    </span>
                    <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#64748B]">
                      Editing coming later
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  {work.contributors && work.contributors.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB]">
                      <div className="hidden grid-cols-[1.2fr_0.7fr_0.7fr_0.5fr_0.8fr] gap-3 bg-[#F8FAFC] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B] lg:grid">
                        <span>Contributor</span>
                        <span>Role</span>
                        <span>Split type</span>
                        <span>Share</span>
                        <span>Confirmation</span>
                      </div>
                      <div className="divide-y divide-[#E5E7EB] bg-white">
                        {work.contributors.map((contributor) => (
                          <article
                            key={contributor.id}
                            className="grid gap-3 px-4 py-4 text-sm lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.5fr_0.8fr] lg:items-center"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#0F172A]">
                                {contributor.contributor_name || contributor.stage_name || "Unnamed contributor"}
                              </p>
                              {contributor.stage_name && contributor.stage_name !== contributor.contributor_name ? (
                                <p className="mt-1 truncate text-xs text-[#64748B]">
                                  {contributor.stage_name}
                                </p>
                              ) : null}
                            </div>
                            <p className="text-[#475569]">{formatContributorValue(contributor.role)}</p>
                            <p className="text-[#475569]">{formatContributorValue(contributor.split_type)}</p>
                            <p className="font-semibold text-[#0F172A]">{formatPercentage(contributor.percentage)}</p>
                            <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${contributor.confirmed ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF3C7] text-[#B45309]"}`}>
                              {contributor.confirmed ? "Confirmed" : "Not confirmed yet"}
                            </span>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5">
                      <p className="font-semibold text-[#334155]">No contributor rows visible</p>
                      <p className="mt-2 text-sm leading-6 text-[#64748B]">
                        This read-only panel shows contributors once they are linked through the canonical work create flow.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4 text-xs leading-5 text-[#2F48F7]">
                  This panel shows captured composition split data only. It is not a signed split sheet, legal clearance, royalty payout readiness, or registration readiness result.
                </div>
              </section>
              ) : null}

              {activeTab === "supporting-materials" ? (
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                        Reference only
                      </p>
                      <h2 className="text-xl font-semibold">Supporting Materials</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                        Add metadata-only references for files, proof, split sheets, artwork, or other supporting materials connected to this work.
                      </p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#64748B]">
                    {supportingMaterials.length} reference{supportingMaterials.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
                  <div className="space-y-3">
                    {materialsLoading ? (
                      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 text-sm font-semibold text-[#64748B]">
                        Loading supporting materials...
                      </div>
                    ) : supportingMaterials.length > 0 ? (
                      supportingMaterials.map((material) => (
                        <article key={material.link_id} className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#0F172A]">{material.file_name}</p>
                              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                                {formatContributorValue(material.file_category)}
                              </p>
                            </div>
                            <span className="w-fit rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#B45309]">
                              Not verified
                            </span>
                          </div>
                          {material.reference_text ? (
                            <p className="mt-3 text-sm leading-6 text-[#475569]">{material.reference_text}</p>
                          ) : null}
                          {material.notes ? (
                            <p className="mt-2 text-xs leading-5 text-[#64748B]">{material.notes}</p>
                          ) : null}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {material.purpose ? (
                              <MaterialBadge label={getOptionLabel(supportingMaterialPurposeOptions, material.purpose)} />
                            ) : null}
                            {material.referenceType ? (
                              <MaterialBadge label={getOptionLabel(supportingMaterialReferenceTypeOptions, material.referenceType)} />
                            ) : null}
                            {material.visibility ? (
                              <MaterialBadge label={getOptionLabel(supportingMaterialVisibilityOptions, material.visibility)} />
                            ) : null}
                            {material.usageContext ? (
                              <MaterialBadge label={getOptionLabel(supportingMaterialUsageContextOptions, material.usageContext)} />
                            ) : null}
                            {material.publicSafeStatus ? (
                              <MaterialBadge label={getOptionLabel(supportingMaterialPublicSafeStatusOptions, material.publicSafeStatus)} />
                            ) : null}
                            {material.evidenceCandidate ? (
                              <MaterialBadge label="Evidence candidate only" />
                            ) : null}
                            {material.verificationStatus ? (
                              <MaterialBadge label={getOptionLabel(supportingMaterialVerificationStatusOptions, material.verificationStatus)} />
                            ) : null}
                            {material.lineageSourceType ? (
                              <MaterialBadge label={getOptionLabel(supportingMaterialLineageSourceOptions, material.lineageSourceType)} />
                            ) : null}
                          </div>
                          <p className="mt-3 text-xs font-semibold text-[#94A3B8]">
                            Added {formatDate(material.created_at)}
                          </p>
                        </article>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5">
                        <p className="font-semibold text-[#334155]">No supporting materials linked yet</p>
                        <p className="mt-2 text-sm leading-6 text-[#64748B]">
                          Add a reference when a split sheet, artwork file, ownership note, contract, or other supporting material exists elsewhere.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                    <h3 className="font-semibold text-[#0F172A]">Add reference</h3>
                    <p className="mt-2 text-xs leading-5 text-[#64748B]">
                      This captures a workspace reference only. It does not upload a file or verify evidence.
                    </p>
                    <div className="mt-4 space-y-3">
                      <CompactInput
                        label="Material name"
                        value={materialDraft.file_name}
                        placeholder="Split sheet draft, artwork brief, contract note..."
                        onChange={(value) => setMaterialDraft((current) => ({ ...current, file_name: value }))}
                      />
                      <CompactSelect
                        label="What is this file for?"
                        value={materialDraft.purpose}
                        options={supportingMaterialPurposeOptions}
                        onChange={(value) => setMaterialDraft((current) => ({ ...current, purpose: value }))}
                      />
                      <CompactSelect
                        label="Reference type"
                        value={materialDraft.referenceType}
                        options={supportingMaterialReferenceTypeOptions}
                        onChange={(value) => setMaterialDraft((current) => ({ ...current, referenceType: value }))}
                      />
                      <CompactSelect
                        label="Visibility"
                        value={materialDraft.visibility}
                        options={supportingMaterialVisibilityOptions}
                        onChange={(value) => setMaterialDraft((current) => ({ ...current, visibility: value }))}
                      />
                      <CompactSelect
                        label="Where will this help?"
                        value={materialDraft.usageContext}
                        options={supportingMaterialUsageContextOptions}
                        onChange={(value) => setMaterialDraft((current) => ({ ...current, usageContext: value }))}
                      />
                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Category</span>
                        <select
                          value={materialDraft.file_category}
                          onChange={(event) => setMaterialDraft((current) => ({ ...current, file_category: event.target.value }))}
                          className="mt-2 w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2F48F7]"
                        >
                          {supportingMaterialCategories.map((category) => (
                            <option key={category} value={category}>
                              {formatContributorValue(category)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <CompactInput
                        label="Reference text"
                        value={materialDraft.reference_text}
                        placeholder="Where this material lives, or a short reference"
                        onChange={(value) => setMaterialDraft((current) => ({ ...current, reference_text: value }))}
                      />
                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Notes</span>
                        <textarea
                          value={materialDraft.notes}
                          onChange={(event) => setMaterialDraft((current) => ({ ...current, notes: event.target.value }))}
                          rows={3}
                          className="mt-2 w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2F48F7]"
                          placeholder="Optional context for the workspace"
                        />
                      </label>
                      {materialsError ? (
                        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs font-semibold text-[#B91C1C]">
                          {materialsError}
                        </div>
                      ) : null}
                      <button
                        type="button"
                        disabled={!work || addingMaterial || !materialDraft.file_name.trim()}
                        onClick={addSupportingMaterial}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-[#2F48F7] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {addingMaterial ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        Add Reference
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4 text-xs leading-5 text-[#2F48F7]">
                  Reference only. These supporting materials are not verified and do not confirm legal clearance or submission readiness.
                </div>
              </section>
              ) : null}

              {activeTab === "creative-details" ? (["Creative details"] as const).map((section) => (
                <section key={section} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                  <SectionHeading />
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
                    Add the human details around the song: language, themes, feel, content notes, and creative context.
                    These details can support future recommendations and planning.
                  </p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {enrichmentFields
                      .filter((field) => field.section === section)
                      .map((field) => (
                        <EnrichmentInput
                          key={field.key}
                          field={field}
                          value={draft[field.key] ?? ""}
                          onChange={(value) => setDraft((current) => ({ ...current, [field.key]: value }))}
                        />
                      ))}
                  </div>
                </section>
              )) : null}

              {activeTab === "song-opportunities" ? (
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Coming later</p>
                    <h2 className="text-xl font-semibold">Song Opportunities</h2>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">
                  These are future system-generated outputs. The user should not have to
                  invent commercial strategy; the platform should generate these insights
                  from creative truth and market intelligence later.
                </p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {insightCards.map((item) => (
                    <div key={item.label} className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                      <p className="text-sm font-semibold text-[#0F172A]">{item.label}</p>
                      <p className={`mt-2 text-xs font-semibold ${item.value ? "text-[#15803D]" : "text-[#B45309]"}`}>
                        {item.value || "Coming later"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
              ) : null}

              {activeTab === "release-readiness" ? <ReleaseReadinessPanel workId={workId} /> : null}
            </>
          )}
        </div>

        <aside className="space-y-6">
          {work ? (
            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/60">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#2F48F7 ${overallContextProgress.percent}%, #E2E8F0 ${overallContextProgress.percent}% 100%)`,
                  }}
                  aria-label={`Profile progress ${overallContextProgress.percent}%`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                    <span className="text-base font-semibold text-[#0F172A]">
                      {overallContextProgress.percent}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                    Profile progress
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">Supporting context</h2>
                  <p className="mt-2 text-xs leading-5 text-[#64748B]">
                    A helpful snapshot only. It does not certify readiness, approval, or release status.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <StatusRow
                  label="Overall"
                  value={`${overallContextProgress.captured} of ${overallContextProgress.total} visible items captured`}
                />
                <StatusRow
                  label="Creative details"
                  value={`${completionCount} of ${enrichmentFields.length} fields filled`}
                />
                {currentTabProgress ? (
                  <StatusRow
                    label="Current section"
                    value={`${currentTabProgress.percent}% - ${currentTabProgress.status}`}
                  />
                ) : null}
              </div>

              <div className="mt-5 space-y-2">
                {tabProgressItems.map((item) => (
                  <div key={item.key} className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#0F172A]">{item.label}</p>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tabProgressStatusClass(item.status)}`}>
                        {item.percent}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-[#64748B]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {isCreativeDetailsActive ? (
            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
              <h2 className="text-xl font-semibold">Save status</h2>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                Save your song details when you are ready. This updates the saved Song Profile.
              </p>
              {savedMessage ? (
                <div className="mt-4 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-3 text-sm font-semibold text-[#15803D]">
                  {savedMessage}
                </div>
              ) : null}
              {saveError ? (
                <div className="mt-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3 text-sm font-semibold text-[#B91C1C]">
                  {saveError}
                </div>
              ) : null}
              <button
                type="button"
                disabled={!work || saving}
                onClick={saveIntelligence}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#2F48F7] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Song Profile
              </button>
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

function SectionHeading() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
        <Lightbulb className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Song details</p>
        <h2 className="text-xl font-semibold">Add song details</h2>
      </div>
    </div>
  );
}

function EnrichmentInput({
  field,
  value,
  onChange,
}: {
  field: EnrichmentField;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputClass = "mt-2 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F48F7]";
  const selectOptions =
    field.options && value && !field.options.includes(value)
      ? [...field.options, value]
      : field.options;

  return (
    <label className={field.multiline ? "md:col-span-2" : "block"}>
      <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#334155]">
        {field.label}
        <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-[#64748B]">
          Song detail
        </span>
      </span>
      {selectOptions ? (
        <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
          {selectOptions.map((option) => (
            <option key={option || "empty"} value={option}>
              {option || field.placeholder}
            </option>
          ))}
        </select>
      ) : field.multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={inputClass}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      )}
      <span className="mt-2 block text-xs leading-5 text-[#64748B]">{field.purpose}</span>
    </label>
  );
}

function BasicsField({
  label,
  value,
  placeholder,
  type = "text",
  saving,
  saved,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: "text" | "number";
  saving: boolean;
  saved: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="mt-2 w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#334155] focus:border-[#2F48F7] focus:outline-none"
      />
      <div className="mt-1 h-4 text-xs font-semibold">
        {saving ? (
          <span className="text-[#64748B]">Saving…</span>
        ) : saved ? (
          <span className="text-[#15803D]">Saved ✓</span>
        ) : null}
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#334155]">{value}</p>
    </div>
  );
}

function CompactInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2F48F7]"
      />
    </label>
  );
}

function CompactSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2F48F7]"
      >
        {options.map((option) => (
          <option key={option.value || "empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MaterialBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-semibold text-[#475569]">
      {label}
    </span>
  );
}

function StateCard({
  title,
  body,
  icon,
  tone = "default",
}: {
  title: string;
  body: string;
  icon?: ReactNode;
  tone?: "default" | "warning" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
      : tone === "warning"
        ? "border-[#FEF3C7] bg-[#FFFBEB] text-[#92400E]"
        : "border-[#E5E7EB] bg-white text-[#334155]";

  return (
    <section className={`rounded-2xl border p-6 shadow-sm shadow-slate-200/60 ${toneClass}`}>
      <div className="flex items-start gap-3">
        {icon ?? <CheckCircle2 className="mt-1 h-5 w-5" />}
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6">{body}</p>
        </div>
      </div>
    </section>
  );
}

function buildDraftFromWork(work: WorkDetailsRow): Record<string, string> {
  const creativeTruth = work.work_intelligence_v1?.creative_truth;
  const legacy = work.work_intelligence_v1;

  return {
    themes: work.themes ?? "",
    alternative_title: creativeTruth?.alternative_title ?? legacy?.alternative_title ?? "",
    language: creativeTruth?.language ?? legacy?.language ?? "",
    energy: creativeTruth?.energy ?? legacy?.energy ?? "",
    clean_explicit: creativeTruth?.clean_explicit ?? legacy?.clean_explicit ?? "",
    creative_description: creativeTruth?.creative_description ?? "",
    inspiration_reference_notes: creativeTruth?.inspiration_reference_notes ?? "",
  };
}

function buildGapActions(items: string[]): GapAction[] {
  return Array.from(new Set(items)).map(getGapAction);
}

function getGapAction(item: string): GapAction {
  const normalized = item.toLowerCase();

  if (
    normalized.includes("themes") ||
    normalized.includes("language") ||
    normalized.includes("clean / explicit") ||
    normalized.includes("creative description") ||
    normalized.includes("song profile")
  ) {
    return {
      item,
      targetTab: "creative-details",
      actionLabel: "Review Creative Details",
      detail: "This can be reviewed in the Creative Details tab. Use the existing save control when ready.",
    };
  }

  if (
    normalized.includes("supporting material") ||
    normalized.includes("split sheet") ||
    normalized.includes("reference is linked")
  ) {
    return {
      item,
      targetTab: "supporting-materials",
      actionLabel: "Review Supporting Materials",
      detail: "This can be reviewed in the Supporting Materials tab using existing reference controls.",
    };
  }

  if (
    normalized.includes("contributor") ||
    normalized.includes("split total") ||
    normalized.includes("composition split")
  ) {
    return {
      item,
      targetTab: "contributors-splits",
      actionLabel: "Review Contributors & Splits",
      detail: "This is visible in Contributors & Splits. Editing or confirmation workflows may still be later.",
    };
  }

  if (
    normalized.includes("work basics") ||
    normalized.includes("work title") ||
    normalized.includes("genre") ||
    normalized.includes("mood")
  ) {
    return {
      item,
      targetTab: "captured-basics",
      actionLabel: "Review Captured Basics",
      detail: "This is visible in Captured Basics. Some basic edit workflows may still be later.",
    };
  }

  return {
    item,
    actionLabel: "Workflow coming later",
    detail: "No direct tab action is available yet for this item.",
  };
}

function buildTabProgressItems(
  work: WorkDetailsRow,
  draft: Record<string, string>,
  supportingMaterials: WorkSupportingMaterial[],
  completeness: WorkCompletenessResponse | null,
  outcomeContext: OutcomeContextSummary | null,
  insightCards: { label: string; value?: string }[]
): TabProgress[] {
  const completenessItems = completeness?.categories?.flatMap((category) => category.items) ?? [];
  const visibleContextItems = outcomeContext?.visibleContext ?? [];
  const activeInsightCount = insightCards.filter((item) => Boolean(item.value?.trim())).length;

  return [
    buildTabProgress("creative-details", "Creative Details", [
      Boolean(draft.themes?.trim()),
      Boolean(draft.language?.trim()),
      Boolean(draft.clean_explicit?.trim()),
      Boolean(draft.creative_description?.trim()),
      Boolean(draft.inspiration_reference_notes?.trim()),
    ], "Themes, language, content note, description, and reference notes."),
    buildTabProgress("contributors-splits", "Contributors & Splits", [
      (work.contributors?.length ?? work.contributor_count ?? 0) > 0,
      typeof work.split_total === "number",
      work.split_total === 100,
      (work.contributors ?? []).some((contributor) => contributor.confirmed),
    ], "Contributor rows, split total, and confirmation visibility."),
    buildTabProgress("supporting-materials", "Supporting Materials", [
      supportingMaterials.length > 0,
    ], `${supportingMaterials.length} linked material reference${supportingMaterials.length === 1 ? "" : "s"}.`),
    buildTabProgress("captured-basics", "Song Basics", [
      Boolean(work.work_title?.trim()),
      Boolean(work.genre?.trim()),
      Boolean(work.mood?.trim()),
    ], "Title, genre, and mood visibility."),
    buildTabProgress("progress-context", "Progress / Context", [
      Boolean(outcomeContext?.intendedOutcome),
      visibleContextItems.length > 0,
      visibleContextItems.some((item) => item.status === "Visible"),
      Boolean(outcomeContext?.completenessContext),
      Boolean(completeness?.status),
      completenessItems.length > 0,
      (completeness?.missing_items?.length ?? 0) === 0,
      (completeness?.review_notes?.length ?? 0) === 0,
    ], formatReviewContextDetail(completeness)),
    {
      key: "song-opportunities",
      label: "Song Opportunities",
      detail: activeInsightCount > 0
        ? `${activeInsightCount} future intelligence placeholder${activeInsightCount === 1 ? "" : "s"} have values.`
        : "Coming-later future intelligence preview.",
      captured: activeInsightCount,
      total: activeInsightCount > 0 ? insightCards.length : 0,
      percent: activeInsightCount > 0 ? Math.round((activeInsightCount / insightCards.length) * 100) : 0,
      source: "existing page data",
      color: tabAccentColors["song-opportunities"],
      status: activeInsightCount > 0 ? "Needs attention" : "Not active yet",
    },
  ];
}

function buildTabProgress(key: WorkDetailTab, label: string, checks: boolean[], detail: string): TabProgress {
  const total = checks.length;
  const captured = checks.filter(Boolean).length;
  const percent = total > 0 ? Math.round((captured / total) * 100) : 0;

  return {
    key,
    label,
    detail,
    captured,
    total,
    percent,
    source: "existing page data",
    color: tabAccentColors[key],
    status:
      captured === total
        ? "Captured"
        : captured > 0
          ? "Needs attention"
          : "Needs attention",
  };
}

function buildOverallTabProgress(items: TabProgress[]): ContextProgress {
  const activeItems = items.filter((item) => item.total > 0);
  const total = activeItems.reduce((sum, item) => sum + item.total, 0);
  const captured = activeItems.reduce((sum, item) => sum + item.captured, 0);

  return {
    captured,
    total,
    percent: total > 0 ? Math.round((captured / total) * 100) : 0,
    source: "tab progress items",
  };
}

function formatReviewContextDetail(completeness: WorkCompletenessResponse | null) {
  if (!completeness?.status) return "Completeness context unavailable.";

  const missingCount = completeness.missing_items?.length ?? 0;
  const reviewCount = completeness.review_notes?.length ?? 0;

  if (missingCount === 0 && reviewCount === 0) {
    return "No visible missing items or review notes.";
  }

  return `${missingCount} missing item${missingCount === 1 ? "" : "s"} and ${reviewCount} review note${reviewCount === 1 ? "" : "s"}.`;
}

function buildOutcomeContext(
  work: WorkDetailsRow,
  supportingMaterials: WorkSupportingMaterial[],
  completeness: WorkCompletenessResponse | null,
  completenessLoading: boolean,
  completenessError: string | null
): OutcomeContextSummary {
  const contributorsVisible = (work.contributors?.length ?? work.contributor_count ?? 0) > 0;
  const splitVisible = typeof work.split_total === "number";
  const missingContext = completeness?.missing_items ?? [];
  const reviewNotes = completeness?.review_notes ?? [];
  const intendedOutcome =
    work.work_intelligence_v1?.creative_truth?.release_intentions?.trim() ||
    work.work_intelligence_v1?.release_intentions?.trim() ||
    "No intended outcome selected yet.";

  const visibleContext: OutcomeContextItem[] = [
    {
      label: "Work title",
      detail: work.work_title?.trim() ? work.work_title : "No title captured.",
      status: work.work_title?.trim() ? "Visible" : "Missing context",
    },
    {
      label: "Contributors and splits",
      detail: contributorsVisible
        ? `${formatContributorCount(work.contributor_count)} visible; ${formatSplitTotal(work.split_total)}.`
        : "No contributor or split context visible.",
      status: contributorsVisible && splitVisible ? "Visible" : "May need review",
    },
    {
      label: "Supporting materials",
      detail: supportingMaterials.length > 0
        ? `${supportingMaterials.length} linked reference${supportingMaterials.length === 1 ? "" : "s"} visible.`
        : "No linked materials found.",
      status: supportingMaterials.length > 0 ? "Visible" : "Missing context",
    },
    {
      label: "Completeness context",
      detail: completenessLoading
        ? "Completeness context is loading."
        : completenessError
          ? "Completeness context unavailable."
          : completeness?.status
            ? formatCompletenessStatus(completeness.status)
            : "Completeness context unavailable.",
      status: completenessLoading || completenessError || !completeness?.status ? "Context unavailable" : "Visible",
    },
  ];

  return {
    intendedOutcome,
    relatedMaterials: supportingMaterials.length > 0
      ? `${supportingMaterials.length} linked material${supportingMaterials.length === 1 ? "" : "s"}`
      : "No linked materials found",
    completenessContext: completenessLoading
      ? "Completeness context loading"
      : completenessError || !completeness
        ? "Completeness context unavailable."
        : formatCompletenessStatus(completeness.status),
    sufficiencyLabel: getOutcomeSufficiencyLabel(
      work,
      supportingMaterials,
      completeness,
      completenessLoading,
      completenessError
    ),
    visibleContext,
    missingContext,
    reviewNotes,
  };
}

function getOutcomeSufficiencyLabel(
  work: WorkDetailsRow,
  supportingMaterials: WorkSupportingMaterial[],
  completeness: WorkCompletenessResponse | null,
  completenessLoading: boolean,
  completenessError: string | null
): OutcomeSufficiencyLabel {
  if (completenessLoading || completenessError || !completeness) return "Limited context visible";
  if (completeness.status === "incomplete" || (completeness.missing_items?.length ?? 0) > 0) {
    return "Some context still missing";
  }

  const hasTitle = Boolean(work.work_title?.trim());
  const hasContributorContext = (work.contributors?.length ?? work.contributor_count ?? 0) > 0;
  const hasMaterialContext = supportingMaterials.length > 0;

  if (hasTitle && hasContributorContext && hasMaterialContext && completeness.status === "review_ready") {
    return "Enough context for review";
  }

  return "Limited context visible";
}

function formatContributorCount(value?: number | null) {
  if (typeof value !== "number") return "No contributors visible";
  return `${value} contributor${value === 1 ? "" : "s"}`;
}

function formatSplitTotal(value?: number | null) {
  if (typeof value !== "number") return "Split unknown";
  return `${value}% split`;
}

function formatContributorValue(value?: string | null) {
  if (!value) return "Not captured";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getOptionLabel(options: { value: string; label: string }[], value?: string | null) {
  if (!value) return "Not selected";
  return options.find((option) => option.value === value)?.label ?? formatContributorValue(value);
}

function formatPercentage(value?: number | null) {
  if (typeof value !== "number") return "0%";
  return `${value}%`;
}

function formatCompletenessStatus(value?: WorkCompletenessStatus) {
  if (value === "review_ready") return "Review ready";
  if (value === "needs_review") return "Needs review";
  return "Incomplete";
}

function formatCategoryStatus(value: WorkCompletenessCategoryStatus) {
  if (value === "captured") return "Captured";
  if (value === "needs_review") return "Needs Review";
  return "Missing";
}

function completenessStatusClass(value?: WorkCompletenessStatus) {
  if (value === "review_ready") return "bg-[#DCFCE7] text-[#15803D]";
  if (value === "needs_review") return "bg-[#DBEAFE] text-[#2F48F7]";
  return "bg-[#FEF3C7] text-[#B45309]";
}

function completenessCategoryClass(value: WorkCompletenessCategoryStatus) {
  if (value === "captured") return "bg-[#DCFCE7] text-[#15803D]";
  if (value === "needs_review") return "bg-[#DBEAFE] text-[#2F48F7]";
  return "bg-[#FEF3C7] text-[#B45309]";
}

function outcomeSufficiencyClass(value: OutcomeSufficiencyLabel) {
  if (value === "Enough context for review") return "bg-[#DCFCE7] text-[#15803D]";
  if (value === "Some context still missing") return "bg-[#FEF3C7] text-[#B45309]";
  return "bg-[#F1F5F9] text-[#64748B]";
}

function outcomeContextStatusClass(value: OutcomeContextStatus) {
  if (value === "Visible") return "bg-[#DCFCE7] text-[#15803D]";
  if (value === "May need review") return "bg-[#DBEAFE] text-[#2F48F7]";
  if (value === "Missing context") return "bg-[#FEF3C7] text-[#B45309]";
  return "bg-[#F1F5F9] text-[#64748B]";
}

function tabProgressStatusClass(value: TabProgress["status"]) {
  if (value === "Captured") return "bg-[#DCFCE7] text-[#15803D]";
  if (value === "Not active yet") return "bg-[#F1F5F9] text-[#64748B]";
  if (value === "Coming later") return "bg-[#F1F5F9] text-[#64748B]";
  if (value === "Needs attention") return "bg-[#FEF3C7] text-[#B45309]";
  return "bg-[#F1F5F9] text-[#64748B]";
}

function formatDate(value?: string | null) {
  if (!value) return "date not captured";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "date not captured";
  return date.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type ReadinessCheckStatus = "complete" | "missing" | "attention";

type ReadinessCheck = {
  key: string;
  label: string;
  status: ReadinessCheckStatus;
  description: string;
  action: string | null;
  action_href: string | null;
};

type ReleaseReadinessReport = {
  overall_score: number;
  checks: ReadinessCheck[];
  ready_to_release: boolean;
  next_action: string;
};

function ReleaseReadinessPanel({ workId }: { workId: string }) {
  const [report, setReport] = useState<ReleaseReadinessReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/works/${workId}/release-readiness`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || data.success === false) {
          throw new Error(data.error ?? "Failed to load release readiness.");
        }
        if (!cancelled) setReport(data.report);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load release readiness.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [workId]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-10 shadow-sm shadow-slate-200/60">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#2F48F7]" />
        </div>
      </section>
    );
  }

  if (error || !report) {
    return (
      <section className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-6 shadow-sm shadow-slate-200/60">
        <p className="text-sm font-semibold text-[#B91C1C]">{error ?? "Release readiness is not available."}</p>
      </section>
    );
  }

  const scoreLabel = report.ready_to_release ? "Release Ready ✓" : `${report.overall_score}% Release Ready`;
  const incompleteChecks = report.checks.filter((check) => check.status !== "complete");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Release Readiness</p>
        <h2
          className={`mt-2 text-2xl font-semibold ${
            report.ready_to_release ? "text-[#15803D]" : "text-[#0F172A]"
          }`}
        >
          {scoreLabel}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#64748B]">
          {report.ready_to_release
            ? "This song meets the bar for release readiness."
            : `${incompleteChecks.length} thing${incompleteChecks.length === 1 ? "" : "s"} still need your attention before this song is fully release-ready.`}
        </p>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Checklist</h3>
        <div className="mt-4 space-y-3">
          {report.checks.map((check) => (
            <div
              key={check.key}
              className={`rounded-xl border p-4 ${
                check.status === "complete"
                  ? "border-[#DCFCE7] bg-[#F0FDF4]"
                  : "border-[#FEF3C7] bg-[#FFFBEB]"
              }`}
            >
              <div className="flex items-start gap-3">
                {check.status === "complete" ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#15803D]" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#B45309]" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#0F172A]">{check.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#64748B]">{check.description}</p>
                  {check.status !== "complete" && check.action ? (
                    <Link
                      href={check.action_href ?? "#"}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#2F48F7]"
                    >
                      {check.action}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-6 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Your next step</p>
        <p className="mt-2 text-lg font-semibold text-[#0F172A]">{report.next_action}</p>
        {!report.ready_to_release ? (
          <Link
            href={incompleteChecks[0]?.action_href ?? `/dashboard/works/details/${workId}`}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F48F7] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-[#2438D6]"
          >
            Take the next step
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </section>
    </div>
  );
}

function ComplianceExportsCard({ workId }: { workId: string }) {
  const [generatingPack, setGeneratingPack] = useState(false);
  const [packError, setPackError] = useState<string | null>(null);
  const [packIssues, setPackIssues] = useState<string[]>([]);

  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const [certificateError, setCertificateError] = useState<string | null>(null);
  const [certificateVerificationId, setCertificateVerificationId] = useState<string | null>(null);

  async function handleGenerateCertificate() {
    setGeneratingCertificate(true);
    setCertificateError(null);
    setCertificateVerificationId(null);
    try {
      const response = await fetch(`/api/works/${workId}/certificate`, { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Failed to generate certificate.");
      }
      setCertificateVerificationId(data.certificate.verification_id);
    } catch (error) {
      setCertificateError(error instanceof Error ? error.message : "Failed to generate certificate.");
    } finally {
      setGeneratingCertificate(false);
    }
  }

  async function handleGenerateCmoPack() {
    setGeneratingPack(true);
    setPackError(null);
    setPackIssues([]);
    try {
      const response = await fetch("/api/compliance/cmo-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work_id: workId }),
      });

      if (response.status === 422) {
        const data = await response.json();
        setPackIssues((data.issues ?? []).map((issue: { message: string }) => issue.message));
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to generate CMO submission pack.");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const fileNameMatch = disposition.match(/filename="(.+)"/);
      const fileName = fileNameMatch?.[1] ?? "CMO_submission_pack.zip";

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setPackError(error instanceof Error ? error.message : "Failed to generate CMO submission pack.");
    } finally {
      setGeneratingPack(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm shadow-slate-200/60">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Compliance exports</p>
      <p className="mt-1 text-sm font-semibold text-[#334155]">Registration Filing Pack</p>
      <p className="mt-1 text-xs text-[#64748B]">
        Generates SAMRO, CAPASSO, and SAMPRA submission CSVs plus a filing checklist, bundled as a zip.
      </p>
      <button
        type="button"
        onClick={handleGenerateCmoPack}
        disabled={generatingPack}
        className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1E3AE0] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {generatingPack ? "Generating…" : "Generate Submission Pack"}
      </button>
      {packError ? <p className="mt-2 text-xs font-semibold text-[#C2410C]">{packError}</p> : null}
      {packIssues.length > 0 ? (
        <ul className="mt-2 space-y-1 text-xs font-semibold text-[#C2410C]">
          {packIssues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 border-t border-[#E5E7EB] pt-4">
        <p className="text-sm font-semibold text-[#334155]">Proof of Collaboration Certificate</p>
        <p className="mt-1 text-xs text-[#64748B]">
          Timestamped certificate naming all confirmed contributors, hashed to the uploaded master audio file. Share before handing over stems.
        </p>
        <button
          type="button"
          onClick={handleGenerateCertificate}
          disabled={generatingCertificate}
          className="mt-3 inline-flex items-center justify-center rounded-xl border border-[#2F48F7] px-4 py-2 text-sm font-semibold text-[#2F48F7] transition hover:bg-[#EFF6FF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generatingCertificate ? "Generating…" : "Generate Certificate"}
        </button>
        {certificateError ? <p className="mt-2 text-xs font-semibold text-[#C2410C]">{certificateError}</p> : null}
        {certificateVerificationId ? (
          <p className="mt-2 text-xs font-semibold text-[#15803D]">
            Certificate generated.{" "}
            <a
              href={`/verify/${certificateVerificationId}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              View public verification page
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
