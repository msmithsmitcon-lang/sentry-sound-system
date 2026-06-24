"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Music2,
  Plus,
  Save,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { MUSIC_GENRES } from "@/lib/constants/music-genres";

type FieldImportance =
  | "System-managed field"
  | "Primary workflow field"
  | "Required validation field"
  | "Metadata/enrichment field"
  | "Future integration field"
  | "Future intelligence/analytics field";

type FieldVisibility = "V1 visible" | "Hidden/defaulted" | "Later";

type OperationalFieldDefinition = {
  fieldName: string;
  backendLink: string;
  importance: FieldImportance;
  purpose: string;
  visibility: FieldVisibility;
};

const fieldDefinitions: OperationalFieldDefinition[] = [
  {
    fieldName: "work_id",
    backendLink: "Returned by rpc_create_song_with_contributors after inserting musical_works.id.",
    importance: "System-managed field",
    purpose: "Tracks the saved work and links later readiness, evidence, submissions, reporting, and lifecycle state.",
    visibility: "Hidden/defaulted",
  },
  {
    fieldName: "asset_id",
    backendLink: "Returned by rpc_create_song_with_contributors after inserting assets.id.",
    importance: "System-managed field",
    purpose: "Links the work to the broader asset/file/catalog layer.",
    visibility: "Hidden/defaulted",
  },
  {
    fieldName: "contributor_id",
    backendLink: "Optional backend identifier used by contributors and work_contributors.",
    importance: "System-managed field",
    purpose: "Avoids duplicate contributor records and links known contributors to works.",
    visibility: "Hidden/defaulted",
  },
  {
    fieldName: "work_title",
    backendLink: "POST /api/songs/create -> create-song-contract -> musical_works.work_title.",
    importance: "Primary workflow field",
    purpose: "Names the work so the platform can create and display the operational draft.",
    visibility: "V1 visible",
  },
  {
    fieldName: "contributors.name",
    backendLink: "POST /api/songs/create -> contributors.full_name/stage_name when needed.",
    importance: "Required validation field",
    purpose: "Identifies who contributed to the work for split tracking and readiness.",
    visibility: "V1 visible",
  },
  {
    fieldName: "contributors.role",
    backendLink: "POST /api/songs/create -> contributors.role and work_contributors.role.",
    importance: "Required validation field",
    purpose: "Explains each contributor's role in the work.",
    visibility: "V1 visible",
  },
  {
    fieldName: "contributors.split_type",
    backendLink: "POST /api/songs/create -> work_contributors.split_type.",
    importance: "Required validation field",
    purpose: "Labels the split being captured. V1 uses composition splits only.",
    visibility: "V1 visible",
  },
  {
    fieldName: "contributors.percentage",
    backendLink: "POST /api/songs/create -> work_contributors.percentage.",
    importance: "Required validation field",
    purpose: "Makes the split total visible and validates whether the draft can be saved through the current API.",
    visibility: "V1 visible",
  },
  {
    fieldName: "genre",
    backendLink: "POST /api/songs/create -> musical_works.genre.",
    importance: "Metadata/enrichment field",
    purpose: "Supports catalog browsing, search, segmentation, recommendations, and future reporting.",
    visibility: "V1 visible",
  },
  {
    fieldName: "mood",
    backendLink: "POST /api/songs/create -> musical_works.mood.",
    importance: "Metadata/enrichment field",
    purpose: "Supports catalog intelligence, playlist/marketing context, and future recommendations.",
    visibility: "V1 visible",
  },
  {
    fieldName: "alternative_title",
    backendLink: "Available in future contracts/test orchestration, not persisted by POST /api/songs/create today.",
    importance: "Metadata/enrichment field",
    purpose: "Helps identify works with alternate names and future submission packaging.",
    visibility: "Later",
  },
  {
    fieldName: "language",
    backendLink: "Available in broader musical work contracts, not persisted by POST /api/songs/create today.",
    importance: "Metadata/enrichment field",
    purpose: "Supports search, catalog intelligence, and future industry packaging.",
    visibility: "Later",
  },
  {
    fieldName: "iswc",
    backendLink: "Prisma MusicalWork and future readiness contracts; not part of current create-song API.",
    importance: "Future integration field",
    purpose: "Industry identifier for later registration and society workflows.",
    visibility: "Later",
  },
  {
    fieldName: "isrc",
    backendLink: "Recording/master layer, not current musical work capture.",
    importance: "Future integration field",
    purpose: "Recording identifier for release/master workflows, not the first composition draft.",
    visibility: "Later",
  },
  {
    fieldName: "evidence_files",
    backendLink: "Evidence/file governance exists separately; not part of V1 add-work mutation.",
    importance: "Future integration field",
    purpose: "Will support proof, split sheets, files, and evidence readiness later.",
    visibility: "Later",
  },
  {
    fieldName: "submission_target",
    backendLink: "Submission queue/readiness routes exist separately; not part of V1 add-work mutation.",
    importance: "Future integration field",
    purpose: "Will let users choose industry-body submission paths after readiness is known.",
    visibility: "Later",
  },
  {
    fieldName: "timestamps/workspace/user/audit",
    backendLink: "System/platform governance fields; not captured by the user.",
    importance: "System-managed field",
    purpose: "Supports ownership, audit, reporting, activity, and production governance later.",
    visibility: "Hidden/defaulted",
  },
];

type ContributorDraft = {
  name: string;
  role: "composer" | "lyricist" | "publisher";
  split_type: "composition";
  percentage: string;
};

type CreateSongResponse = {
  success?: boolean;
  work_id?: string;
  asset_id?: string;
  contributor_count?: number;
  message?: string;
};

type RecentWork = {
  id: string;
  work_title?: string | null;
  genre?: string | null;
  mood?: string | null;
  created_at?: string | null;
  contributor_count?: number | null;
  split_total?: number | null;
};

type WorksReadModelResponse = {
  success?: boolean;
  works?: RecentWork[];
  error?: string;
};

const emptyContributor: ContributorDraft = {
  name: "",
  role: "composer",
  split_type: "composition",
  percentage: "",
};

export default function NewWorkPage() {
  const router = useRouter();
  const [workTitle, setWorkTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [contributors, setContributors] = useState<ContributorDraft[]>([{ ...emptyContributor }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<CreateSongResponse | null>(null);
  const [recentWorks, setRecentWorks] = useState<RecentWork[]>([]);
  const [recentWorksLoading, setRecentWorksLoading] = useState(true);
  const [recentWorksError, setRecentWorksError] = useState<string | null>(null);
  const [duplicateQuery, setDuplicateQuery] = useState("");
  const [duplicateCheckCompleted, setDuplicateCheckCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRecentWorks() {
      setRecentWorksLoading(true);
      setRecentWorksError(null);

      try {
        const response = await fetch("/api/works", { cache: "no-store" });
        const data = (await response.json()) as WorksReadModelResponse;

        if (!response.ok || data.success === false) {
          throw new Error(data.error ?? "Failed to load existing works.");
        }

        if (!cancelled) setRecentWorks(Array.isArray(data.works) ? data.works : []);
      } catch (loadError) {
        if (!cancelled) {
          setRecentWorksError(loadError instanceof Error ? loadError.message : "Failed to load existing works.");
        }
      } finally {
        if (!cancelled) setRecentWorksLoading(false);
      }
    }

    loadRecentWorks();

    return () => {
      cancelled = true;
    };
  }, []);

  const namedContributors = useMemo(
    () => contributors.filter((contributor) => contributor.name.trim()),
    [contributors]
  );

  const splitTotal = useMemo(
    () =>
      namedContributors.reduce(
        (sum, contributor) => sum + Number(contributor.percentage || 0),
        0
      ),
    [namedContributors]
  );

  const canSave =
    duplicateCheckCompleted &&
    workTitle.trim().length > 0 &&
    namedContributors.length > 0 &&
    splitTotal === 100;

  const possibleMatches = useMemo(() => {
    const needle = duplicateQuery.trim().toLowerCase();
    if (!needle) return [];

    return recentWorks.filter((work) => String(work.work_title ?? "").toLowerCase().includes(needle));
  }, [duplicateQuery, recentWorks]);

  function updateDuplicateQuery(value: string) {
    setDuplicateQuery(value);
    setDuplicateCheckCompleted(false);
  }

  function completeDuplicateCheck() {
    setDuplicateCheckCompleted(true);
  }

  function updateContributor<K extends keyof ContributorDraft>(
    index: number,
    key: K,
    value: ContributorDraft[K]
  ) {
    setSaved(null);
    setError(null);
    setContributors((current) =>
      current.map((contributor, contributorIndex) =>
        contributorIndex === index ? { ...contributor, [key]: value } : contributor
      )
    );
  }

  function addContributor() {
    setContributors((current) => [...current, { ...emptyContributor }]);
  }

  function removeContributor(index: number) {
    setContributors((current) =>
      current.length === 1 ? [{ ...emptyContributor }] : current.filter((_, contributorIndex) => contributorIndex !== index)
    );
  }

  function resetForAnotherSong() {
    setWorkTitle("");
    setGenre("");
    setMood("");
    setContributors([{ ...emptyContributor }]);
    setSaving(false);
    setError(null);
    setSaved(null);
    setDuplicateQuery("");
    setDuplicateCheckCompleted(false);
  }

  async function saveDraft() {
    setSaving(true);
    setError(null);
    setSaved(null);

    try {
      const response = await fetch("/api/songs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          work_title: workTitle,
          genre,
          mood,
          copyright_status: "draft",
          registration_status: "draft",
          contributors: namedContributors.map((contributor) => ({
            name: contributor.name,
            role: contributor.role,
            split_type: contributor.split_type,
            percentage: Number(contributor.percentage || 0),
          })),
        }),
      });
      const data = (await response.json()) as CreateSongResponse;

      if (!response.ok || data.success === false) {
        throw new Error(data.message ?? "Failed to save song draft.");
      }

      setSaved(data);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save song draft.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-[#2F48F7]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Add Song</h1>
            <p className="mt-2 max-w-2xl leading-7 text-[#64748B]">
              Check whether the song already exists, then capture the basics.
              Song details, supporting materials, and next steps continue from the saved song.
            </p>
          </div>
          <div className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <p className="text-sm font-semibold text-[#2F48F7]">Song draft</p>
            <p className="mt-1 text-sm font-semibold text-[#334155]">Saved to your workspace</p>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#BFDBFE] bg-white p-6 shadow-sm shadow-blue-100/80">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2F48F7]">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Start here</p>
                  <h2 className="text-xl font-semibold">Check if this song already exists</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                    Search your catalog by title before creating a new song.
                    If it already exists, open that record instead of creating a duplicate.
                  </p>
                </div>
              </div>
              <div className={`rounded-full px-3 py-1 text-sm font-semibold ${duplicateCheckCompleted ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF3C7] text-[#B45309]"}`}>
                {duplicateCheckCompleted ? "Check completed" : "Required before capture"}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3">
              <Search className="h-4 w-4 text-[#64748B]" />
              <input
                value={duplicateQuery}
                onChange={(event) => updateDuplicateQuery(event.target.value)}
                placeholder="Search by work or song title..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#94A3B8]"
              />
            </div>

            <div className="mt-5">
              {recentWorksLoading ? (
                <div className="flex min-h-28 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
                  <Loader2 className="h-5 w-5 animate-spin text-[#2F48F7]" />
                </div>
              ) : recentWorksError ? (
                <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                  <p className="text-sm font-semibold text-[#B91C1C]">{recentWorksError}</p>
                  <p className="mt-1 text-sm leading-6 text-[#7F1D1D]">
                    Existing song search is unavailable. Continue carefully only if you know this is a new song.
                  </p>
                  <button
                    type="button"
                    onClick={completeDuplicateCheck}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Continue to add song
                  </button>
                </div>
              ) : duplicateQuery.trim() && possibleMatches.length > 0 ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-4">
                    <p className="text-sm font-semibold text-[#92400E]">Possible matches found</p>
                    <p className="mt-1 text-sm leading-6 text-[#92400E]">
                      Open an existing song if this is the same song, or continue only if this is a different song.
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
                    <div className="hidden grid-cols-[1.2fr_0.7fr_0.7fr_0.8fr_0.7fr_0.7fr_0.9fr] gap-3 bg-[#F8FAFC] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B] lg:grid">
                      <span>Title</span>
                      <span>Genre</span>
                      <span>Mood</span>
                      <span>Created</span>
                      <span>Contributors</span>
                      <span>Split</span>
                      <span>Action</span>
                    </div>
                    <div className="divide-y divide-[#E5E7EB]">
                      {possibleMatches.slice(0, 8).map((work) => (
                        <article key={work.id} className="grid gap-3 bg-white px-4 py-4 text-sm lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.8fr_0.7fr_0.7fr_0.9fr] lg:items-center">
                          <div>
                            <p className="font-semibold text-[#0F172A]">{work.work_title || "Untitled work"}</p>
                            <p className="mt-1 text-xs font-medium text-[#94A3B8] lg:hidden">{formatDate(work.created_at)}</p>
                          </div>
                          <p className="text-[#475569]">{work.genre || "Not captured"}</p>
                          <p className="text-[#475569]">{work.mood || "Not captured"}</p>
                          <p className="hidden text-[#475569] lg:block">{formatDate(work.created_at)}</p>
                          <p className="text-[#475569]">{formatContributorCount(work.contributor_count) || "Not available"}</p>
                          <p className="text-[#475569]">{formatSplitTotal(work.split_total) || "Unknown"}</p>
                          <Link
                            href={`/dashboard/works/details/${work.id}`}
                            className="inline-flex items-center justify-center rounded-lg border border-[#BFDBFE] bg-white px-3 py-2 text-xs font-semibold text-[#2F48F7] hover:bg-[#EFF6FF]"
                          >
                            Open existing work
                          </Link>
                        </article>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={completeDuplicateCheck}
                    className="inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
                  >
                    This is a different song - continue anyway
                  </button>
                </div>
              ) : duplicateQuery.trim() ? (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5">
                  <p className="text-sm font-semibold text-[#334155]">No similar works found</p>
                  <p className="mt-1 text-sm leading-6 text-[#64748B]">
                    You can continue to create a new song draft.
                  </p>
                  <button
                    type="button"
                    onClick={completeDuplicateCheck}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
                  >
                    Continue to add song
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5">
                  <p className="text-sm font-semibold text-[#334155]">Search before capture</p>
                  <p className="mt-1 text-sm leading-6 text-[#64748B]">
                    Type the work or song title before creating a new draft.
                  </p>
                </div>
              )}
            </div>
          </section>

          {error ? (
            <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm font-semibold text-[#B91C1C]">
              {error}
            </div>
          ) : null}

          {saved ? (
            <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-5">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#16A34A]" />
                <div>
                  <h2 className="font-semibold text-[#14532D]">Song saved</h2>
                  <p className="mt-1 text-sm leading-6 text-[#166534]">
                    Continue to Song Details to add creative details. Supporting materials, readiness, and submissions can wait.
                  </p>
                  {saved.work_id ? (
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/dashboard/works/details/${saved.work_id}?tab=creative-details`}
                        className="inline-flex items-center justify-center rounded-xl bg-[#15803D] px-5 py-3 text-sm font-semibold text-white"
                      >
                        Continue to Song Details
                      </Link>
                      <button
                        type="button"
                        onClick={resetForAnotherSong}
                        className="inline-flex items-center justify-center rounded-xl border border-[#BBF7D0] bg-white px-4 py-2 text-sm font-semibold text-[#15803D]"
                      >
                        Add another song
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push("/dashboard/works/list")}
                        className="inline-flex items-center justify-center rounded-xl border border-[#BBF7D0] bg-white px-4 py-2 text-sm font-semibold text-[#15803D]"
                      >
                        View all songs
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {!duplicateCheckCompleted ? (
            <div className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-5">
              <p className="text-sm font-semibold text-[#2F48F7]">Song details unlock after the catalog check</p>
              <p className="mt-1 text-sm leading-6 text-[#334155]">
                Complete the check above, then Song basics, Contributors and splits, and Review and save will unlock.
              </p>
            </div>
          ) : null}

          <div
            aria-disabled={!duplicateCheckCompleted}
            className={`space-y-6 transition ${duplicateCheckCompleted ? "" : "pointer-events-none select-none opacity-45"}`}
          >
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
                <Music2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Step 1</p>
                <h2 className="text-xl font-semibold">Song basics</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <TextField label="Work title" required value={workTitle} onChange={(value) => { setSaved(null); setWorkTitle(value); }} />
              <SelectField label="Genre" value={genre} options={["", ...MUSIC_GENRES]} onChange={(value) => { setSaved(null); setGenre(value); }} />
              <TextField label="Mood" value={mood} onChange={(value) => { setSaved(null); setMood(value); }} />
              <ReadOnlyField label="Registration status" value="Draft" />
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Step 2</p>
                  <h2 className="text-xl font-semibold">Contributors and splits</h2>
                </div>
              </div>
              <div className={`rounded-full px-3 py-1 text-sm font-semibold ${splitTotal === 100 ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF3C7] text-[#B45309]"}`}>
                Split total: {splitTotal}%
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {contributors.map((contributor, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 md:grid-cols-[1.2fr_0.75fr_0.75fr_0.45fr_auto]">
                  <TextField label="Contributor name" value={contributor.name} onChange={(value) => updateContributor(index, "name", value)} />
                  <SelectField label="Role" value={contributor.role} options={["composer", "lyricist", "publisher"]} onChange={(value) => updateContributor(index, "role", value as ContributorDraft["role"])} />
                  <ReadOnlyField label="Split type" value="Composition" />
                  <TextField label="%" value={contributor.percentage} inputMode="decimal" onChange={(value) => updateContributor(index, "percentage", value)} />
                  <button
                    type="button"
                    onClick={() => removeContributor(index)}
                    className="mt-7 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#64748B] hover:text-[#B91C1C]"
                    aria-label="Remove contributor"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addContributor}
              className="mt-4 inline-flex items-center justify-center rounded-xl border border-[#BFDBFE] bg-white px-4 py-2 text-sm font-semibold text-[#2F48F7] hover:bg-[#EFF6FF]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add contributor
            </button>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Step 3</p>
                <h2 className="text-xl font-semibold">Review and save</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <ReviewCard label="Work title" value={workTitle || "Missing"} state={workTitle ? "ok" : "attention"} />
              <ReviewCard label="Contributors" value={String(namedContributors.length)} state={namedContributors.length ? "ok" : "attention"} />
              <ReviewCard label="Split total" value={`${splitTotal}%`} state={splitTotal === 100 ? "ok" : "attention"} />
            </div>

            <div className="mt-5 rounded-2xl border border-[#FEF3C7] bg-[#FFFBEB] p-4 text-sm leading-6 text-[#92400E]">
              <AlertTriangle className="mr-2 inline h-4 w-4" />
              This saves the song draft. Supporting materials, submissions, contracts, and readiness can be handled later.
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-[#64748B]">
                Required now: title, at least one contributor, and 100% composition split.
              </p>
              <button
                type="button"
                onClick={saveDraft}
                disabled={!canSave || saving}
                className="inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Song
              </button>
            </div>
          </section>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold">Why check first?</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              A quick title check helps prevent duplicate song records before you save.
            </p>
            <div className="mt-5 space-y-3">
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <p className="text-sm font-semibold text-[#334155]">Protect catalog integrity</p>
                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                  Duplicate works can create confusion around ownership, contributors, files, and future submission readiness.
                </p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <p className="text-sm font-semibold text-[#334155]">Prepare for future submissions</p>
                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                  Later production flows may use this check before SAMRO, CAPASSO, or other registration workflows.
                </p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <p className="text-sm font-semibold text-[#334155]">Future automatic awareness</p>
                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                  Future versions can suggest matches using titles, contributors, splits, identifiers, genre, mood, and warning history.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4 text-xs leading-5 text-[#2F48F7]">
              Override reasons, audit trails, fuzzy matching, and production submission protection remain future backend work.
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold">What you need now</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Start with only the fields needed to save a useful song draft.
              More detail can be added after the song is saved.
            </p>
            <div className="mt-5 space-y-3">
              {fieldDefinitions
                .filter((field) => field.visibility === "V1 visible")
                .map((field) => (
                  <FieldPurpose key={field.fieldName} field={field} />
                ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold">You can add later</h2>
            <div className="mt-4 space-y-2">
              {fieldDefinitions
                .filter((field) => field.visibility === "Later")
                .map((field) => (
                  <div key={field.fieldName} className="rounded-xl bg-[#F8FAFC] px-4 py-3">
                    <p className="text-sm font-semibold text-[#334155]">{field.fieldName}</p>
                    <p className="mt-1 text-xs leading-5 text-[#64748B]">{field.purpose}</p>
                  </div>
                ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  inputMode?: "text" | "decimal";
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#334155]">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F48F7]"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#334155]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F48F7]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#334155]">{label}</p>
      <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#64748B]">
        {value}
      </div>
    </div>
  );
}

function ReviewCard({
  label,
  value,
  state,
}: {
  label: string;
  value: string;
  state: "ok" | "attention";
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[#0F172A]">{value}</p>
      <p className={`mt-2 text-xs font-semibold ${state === "ok" ? "text-[#15803D]" : "text-[#B45309]"}`}>
        {state === "ok" ? "Ready" : "Needs attention"}
      </p>
    </div>
  );
}

function FieldPurpose({ field }: { field: OperationalFieldDefinition }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#0F172A]">{field.fieldName}</p>
        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-semibold text-[#2F48F7]">
          {field.importance}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-[#64748B]">{field.purpose}</p>
    </div>
  );
}

function formatContributorCount(value?: number | null) {
  if (typeof value !== "number") return null;
  return `${value} contributor${value === 1 ? "" : "s"}`;
}

function formatSplitTotal(value?: number | null) {
  if (typeof value !== "number") return null;
  return `${value}% split`;
}

function formatDate(value?: string | null) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
