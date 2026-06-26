"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  DollarSign,
  FileAudio,
  FileImage,
  FileText,
  Folder,
  HelpCircle,
  Home,
  Lightbulb,
  Mail,
  MoreHorizontal,
  Music2,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { MUSIC_GENRES } from "@/lib/constants/music-genres";

type CreateSongResponse = {
  success?: boolean;
  work_id?: string;
  workId?: string;
  error?: string;
  message?: string;
};

type ProfileUpdateResponse = {
  success?: boolean;
  error?: string;
};

type ArtistOption = {
  artistProfileId: string;
  displayName: string;
  stageName: string;
  artistType: string;
  primaryGenre: string;
  status: string;
};

type ArtistListResponse = {
  success?: boolean;
  artists?: ArtistOption[];
  error?: string;
};

type ContributorDraftRow = {
  id: string;
  contributorId?: string;
  name: string;
  role: string;
  splitType: string;
  percentage: string;
  ipi: string;
};

type WorkContributorsResponse = {
  success?: boolean;
  contributors?: {
    id: string;
    contributorId: string;
    name: string;
    role: string;
    splitType: string;
    percentage: number;
    ipi: string | null;
  }[];
  splitTotal?: number;
  error?: string;
};

const sidebarItems: { label: string; icon: LucideIcon; active?: boolean; badge?: string }[] = [
  { label: "Dashboard", icon: Home },
  { label: "Songs", icon: Music2, active: true },
  { label: "Releases", icon: Briefcase },
  { label: "Assets", icon: Folder },
  { label: "Evidence", icon: Zap },
  { label: "Royalties", icon: DollarSign },
  { label: "Contracts", icon: ClipboardList },
  { label: "Publishing", icon: BookOpen },
  { label: "Analytics", icon: BarChart3 },
  { label: "Tasks", icon: CalendarCheck, badge: "12" },
  { label: "Messages", icon: Mail, badge: "5" },
  { label: "Academy", icon: BookOpen },
  { label: "Settings", icon: Settings },
];

const initialContributorRows: ContributorDraftRow[] = [
  { id: "contributor-1", role: "performer", name: "M-WIS", splitType: "composition", percentage: "50", ipi: "123456789" },
  { id: "contributor-2", role: "producer", name: "Jay Synth", splitType: "composition", percentage: "30", ipi: "987654321" },
  { id: "contributor-3", role: "songwriter", name: "Jane Doe", splitType: "composition", percentage: "20", ipi: "112233445" },
];

const contributorRoleOptions = ["songwriter", "composer", "producer", "performer", "engineer", "publisher", "manager", "other"];
const splitTypeOptions = ["composition", "ownership", "publishing", "master", "performance", "other"];

const assetCategories: { label: string; icon: LucideIcon; tone: string }[] = [
  { label: "Lyrics", icon: FileText, tone: "green" },
  { label: "Demo / Audio", icon: Music2, tone: "purple" },
  { label: "Artwork", icon: FileImage, tone: "red" },
  { label: "Metadata", icon: ClipboardList, tone: "amber" },
  { label: "Agreement", icon: FileText, tone: "blue" },
  { label: "Evidence", icon: ShieldCheck, tone: "teal" },
  { label: "Reference", icon: Folder, tone: "sky" },
  { label: "Session File", icon: FileAudio, tone: "violet" },
  { label: "Other", icon: MoreHorizontal, tone: "slate" },
];

const recentSongs = [
  { title: "Midnight Drive", status: "Draft", detail: "Updated just now" },
  { title: "Lagos Morning", status: "In progress", detail: "Afrobeats" },
  { title: "Chrome Hearts", status: "Draft", detail: "Demo added" },
  { title: "Ocean Memory", status: "Review", detail: "Creative details ready" },
  { title: "Paper Planes", status: "Draft", detail: "Needs contributors" },
];

const genreOptions = ["", ...MUSIC_GENRES];
const languageOptions = ["", "English", "Afrikaans", "isiZulu", "Instrumental", "Multiple languages", "Other / Not sure"];
const releaseProjectGroupingOptions = [
  { type: "standalone_single", label: "Standalone single" },
  { type: "part_of_ep", label: "Part of an EP" },
  { type: "part_of_album", label: "Part of an album" },
  { type: "existing_project_collection", label: "Existing project / collection" },
  { type: "not_sure_yet", label: "Not sure yet" },
];

export default function SongCaptureV2PrototypePage() {
  const [songTitle, setSongTitle] = useState("Midnight Drive");
  const [genre, setGenre] = useState("Afrobeats/Afropop");
  const [alternateTitle, setAlternateTitle] = useState("");
  const [language, setLanguage] = useState("English");
  const [releaseProjectGroupingType, setReleaseProjectGroupingType] = useState("standalone_single");
  const [description, setDescription] = useState(
    "This is the first version of Midnight Drive.\nWritten in Lagos during the Sentry Sound creative session."
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedWorkId, setSavedWorkId] = useState<string | null>(null);
  const [foundationSaved, setFoundationSaved] = useState(false);
  const [contributorsReviewed, setContributorsReviewed] = useState(false);
  const [contributorRows, setContributorRows] = useState<ContributorDraftRow[]>(initialContributorRows);
  const [contributorsSaving, setContributorsSaving] = useState(false);
  const [contributorsSaved, setContributorsSaved] = useState(false);
  const [contributorsError, setContributorsError] = useState<string | null>(null);
  const [contributorsMessage, setContributorsMessage] = useState<string | null>(null);
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [artistSearch, setArtistSearch] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [artistLoadError, setArtistLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadArtists() {
      try {
        const response = await fetch("/api/artists/list");
        const data = (await response.json()) as ArtistListResponse;

        if (!response.ok || data.success === false) {
          throw new Error(data.error ?? "Could not load artists.");
        }

        if (cancelled) return;

        const artistOptions = data.artists ?? [];
        setArtists(artistOptions);

        const preferredArtist =
          artistOptions.find((artist) => artist.displayName.toLowerCase().includes("m-wis test artist")) ??
          artistOptions.find((artist) => artist.displayName.toLowerCase().includes("m-wis")) ??
          artistOptions[0];

        if (preferredArtist) {
          setSelectedArtistId(preferredArtist.artistProfileId);
        }
      } catch (error) {
        if (!cancelled) {
          setArtistLoadError(error instanceof Error ? error.message : "Could not load artists.");
        }
      }
    }

    loadArtists();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedArtist = artists.find((artist) => artist.artistProfileId === selectedArtistId) ?? null;
  const selectedReleaseProjectGrouping =
    releaseProjectGroupingOptions.find((option) => option.type === releaseProjectGroupingType) ??
    releaseProjectGroupingOptions[0];
  const contributorSplitTotal = useMemo(
    () => roundSplitTotal(
      contributorRows.reduce((sum, contributor) => sum + Number(contributor.percentage || 0), 0)
    ),
    [contributorRows]
  );

  function updateContributorRow(id: string, field: keyof ContributorDraftRow, value: string) {
    setContributorRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
    setContributorsSaved(false);
    setContributorsReviewed(false);
    setContributorsMessage(null);
  }

  function addContributorRow() {
    setContributorRows((currentRows) => [
      ...currentRows,
      {
        id: `contributor-${Date.now()}`,
        name: "",
        role: "songwriter",
        splitType: "composition",
        percentage: "0",
        ipi: "",
      },
    ]);
    setContributorsSaved(false);
    setContributorsReviewed(false);
    setContributorsMessage(null);
  }

  function removeContributorRow(id: string) {
    setContributorRows((currentRows) => currentRows.filter((row) => row.id !== id));
    setContributorsSaved(false);
    setContributorsReviewed(false);
    setContributorsMessage(null);
  }

  async function saveContributors() {
    if (!savedWorkId) {
      setContributorsError("Save the song foundation before adding contributors.");
      return;
    }

    const namedContributors = contributorRows.filter((contributor) => contributor.name.trim());
    const splitTotal = roundSplitTotal(
      namedContributors.reduce((sum, contributor) => sum + Number(contributor.percentage || 0), 0)
    );

    if (namedContributors.length === 0) {
      setContributorsError("Add at least one contributor before saving.");
      setContributorsReviewed(false);
      return;
    }

    if (splitTotal !== 100) {
      setContributorsError(`Contributor split total is ${splitTotal}%. It must equal 100% before review.`);
      setContributorsReviewed(false);
      return;
    }

    setContributorsSaving(true);
    setContributorsError(null);
    setContributorsMessage(null);

    try {
      const response = await fetch(`/api/works/${savedWorkId}/contributors`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contributors: namedContributors.map((contributor) => ({
            contributorId: contributor.contributorId ?? "",
            name: contributor.name.trim(),
            role: contributor.role,
            splitType: contributor.splitType,
            percentage: Number(contributor.percentage || 0),
            ipi: contributor.ipi.trim(),
          })),
        }),
      });
      const data = (await response.json()) as WorkContributorsResponse;

      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? "Failed to save contributors.");
      }

      if (data.contributors?.length) {
        setContributorRows(
          data.contributors.map((contributor) => ({
            id: contributor.id,
            contributorId: contributor.contributorId,
            name: contributor.name,
            role: contributor.role,
            splitType: contributor.splitType,
            percentage: String(contributor.percentage),
            ipi: contributor.ipi ?? "",
          }))
        );
      }

      setContributorsSaved(true);
      setContributorsMessage("Contributors saved. You can mark them reviewed now.");
    } catch (error) {
      setContributorsError(error instanceof Error ? error.message : "Failed to save contributors.");
      setContributorsReviewed(false);
    } finally {
      setContributorsSaving(false);
    }
  }

  async function markContributorsReviewed() {
    if (contributorSplitTotal !== 100) {
      setContributorsError(`Contributor split total is ${contributorSplitTotal}%. It must equal 100% before review.`);
      setContributorsReviewed(false);
      return;
    }

    if (!contributorsSaved || !savedWorkId) {
      setContributorsError("Save contributors before marking them reviewed.");
      setContributorsReviewed(false);
      return;
    }

    setContributorsError(null);
    setContributorsSaving(true);
    try {
      const response = await fetch(`/api/works/${savedWorkId}/contributors`, { method: "PATCH" });
      const data = (await response.json()) as WorkContributorsResponse;
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to confirm splits.");
      }
      setContributorsMessage("Contributors reviewed and confirmed. Files & Assets are now unlocked.");
      setContributorsReviewed(true);
    } catch (error) {
      setContributorsError(error instanceof Error ? error.message : "Failed to confirm splits.");
      setContributorsReviewed(false);
    } finally {
      setContributorsSaving(false);
    }
  }

  async function saveSongFoundation() {
    const title = songTitle.trim();

    if (!title) {
      setSaveError("Song title is required.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      let workId = savedWorkId;

      if (!workId) {
        const createResponse = await fetch("/api/songs/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            work_title: title,
            genre: genre.trim(),
            mood: "",
            copyright_status: "draft",
            registration_status: "draft",
            contributors: [],
          }),
        });
        const createData = (await createResponse.json()) as CreateSongResponse;

        if (!createResponse.ok || createData.success === false) {
          throw new Error(createData.error ?? createData.message ?? "Failed to create song foundation.");
        }

        workId = createData.work_id ?? createData.workId ?? "";
        if (!workId) throw new Error("Song foundation was created, but no work ID was returned.");
      }

      const profilePayload = {
        alternative_title: alternateTitle.trim(),
        language: language.trim(),
        creative_description: description.trim(),
        primary_artist_profile_id: selectedArtist?.artistProfileId ?? "",
        primary_artist_display_name: selectedArtist?.displayName ?? "",
        primary_artist_tagged_for_future_relationship: Boolean(selectedArtist),
        release_project_grouping_type: selectedReleaseProjectGrouping.type,
        release_project_grouping_label: selectedReleaseProjectGrouping.label,
        release_project_grouping_tagged_for_future_relationship: true,
      };
      const hasProfileValues = Object.values(profilePayload).some(Boolean);

      if (hasProfileValues) {
        const profileResponse = await fetch(`/api/works/${workId}/profile`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profilePayload),
        });
        const profileData = (await profileResponse.json()) as ProfileUpdateResponse;

        if (!profileResponse.ok || profileData.success === false) {
          throw new Error(profileData.error ?? "Song draft was created, but profile details could not be saved.");
        }
      }

      setSavedWorkId(workId);
      setFoundationSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save song foundation.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-[#E5E7EB] bg-white px-6 py-7 lg:flex lg:flex-col">
          <Link href="/dashboard" className="inline-flex items-center">
            <Image src="/logo.png" alt="Sentry Sound" width={178} height={58} className="h-12 w-auto" priority />
          </Link>

          <div className="mt-8 flex items-center gap-3 border-b border-[#E5E7EB] pb-6">
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-[#F97316] to-[#111827] text-sm font-bold text-white">
              MW
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[#111827]">M-WIS</p>
              <p className="text-sm text-[#64748B]">Artist</p>
            </div>
            <ChevronDown className="h-4 w-4 text-[#64748B]" />
          </div>

          <nav className="mt-6 space-y-1">
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  item.active
                    ? "bg-[#EEF2FF] text-[#4338CA]"
                    : "text-[#334155] hover:bg-[#F8FAFC]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-[#EDE9FE] px-2 py-0.5 text-xs text-[#4F46E5]">{item.badge}</span>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#111827]">Storage Used</span>
                <span className="text-[#64748B]">12%</span>
              </div>
              <p className="mt-3 text-sm text-[#334155]">128 GB of 1 TB</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                <div className="h-full w-[12%] rounded-full bg-[#4F46E5]" />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#4F46E5]">Manage Storage</p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
              <p className="font-semibold">Sentry Sound Pro</p>
              <p className="mt-2 text-sm text-[#16A34A]">Active Plan</p>
              <p className="mt-3 text-sm font-semibold text-[#4F46E5]">View Plan</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-5 sm:px-6 xl:px-8">
          <div className="mx-auto max-w-[1640px]">
            <div className="mb-5 flex items-center gap-3 text-sm text-[#64748B]">
              <Link href="/dashboard" className="inline-flex items-center font-semibold text-[#334155]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Songs
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#111827]">New Song</span>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
              <div className="space-y-5">
                <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">Start a New Music Project</h1>
                      <p className="mt-2 text-sm leading-6 text-[#64748B]">
                        We&apos;ll begin with your song, then organise your contributors, files, splits,
                        protection records, and submissions in one professional workspace.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className="rounded-lg border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        onClick={saveSongFoundation}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : foundationSaved ? "Update Song Foundation" : "Save Song Foundation"}
                      </button>
                      <button
                        className="inline-flex items-center rounded-lg bg-[#4F46E5] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        disabled
                        title="Coming later"
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <WorkflowStepper foundationSaved={foundationSaved} contributorsReviewed={contributorsReviewed} />
                  {saveError ? (
                    <div className="mt-5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#B91C1C]">
                      {saveError}
                    </div>
                  ) : null}
                  {foundationSaved ? (
                    <div className="mt-5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]">
                      <p className="font-semibold">Song foundation saved.</p>
                      <p className="mt-1">Now add contributors.</p>
                    </div>
                  ) : null}
                </section>

                <SongDetailsCard
                  songTitle={songTitle}
                  onSongTitleChange={setSongTitle}
                  genre={genre}
                  onGenreChange={setGenre}
                  alternateTitle={alternateTitle}
                  onAlternateTitleChange={setAlternateTitle}
                  language={language}
                  onLanguageChange={setLanguage}
                  releaseProjectGroupingType={releaseProjectGroupingType}
                  onReleaseProjectGroupingTypeChange={setReleaseProjectGroupingType}
                  description={description}
                  onDescriptionChange={setDescription}
                  artists={artists}
                  selectedArtistId={selectedArtistId}
                  onSelectedArtistChange={setSelectedArtistId}
                  artistSearch={artistSearch}
                  onArtistSearchChange={setArtistSearch}
                  artistLoadError={artistLoadError}
                  onSaveFoundation={saveSongFoundation}
                  saving={saving}
                  foundationSaved={foundationSaved}
                  savedWorkId={savedWorkId}
                />
                <ContributorsCard
                  workId={savedWorkId}
                  locked={!foundationSaved}
                  reviewed={contributorsReviewed}
                  saved={contributorsSaved}
                  saving={contributorsSaving}
                  rows={contributorRows}
                  splitTotal={contributorSplitTotal}
                  error={contributorsError}
                  message={contributorsMessage}
                  onAddRow={addContributorRow}
                  onRemoveRow={removeContributorRow}
                  onUpdateRow={updateContributorRow}
                  onSave={saveContributors}
                  onMarkReviewed={markContributorsReviewed}
                />
                <FilesAssetsCard locked={!contributorsReviewed} workId={savedWorkId} />
                <ReviewSaveCard locked />

                <section className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 text-sm text-[#64748B] shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5]">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <p>
                      <span className="font-semibold text-[#111827]">Need help?</span> Visit our{" "}
                      <span className="font-semibold text-[#4F46E5]">Help Center</span> or watch a quick tutorial.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 font-semibold text-[#334155]">
                      Open Help Center
                    </button>
                    <button type="button" className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 font-semibold text-[#334155]">
                      Watch Tutorial
                    </button>
                  </div>
                </section>
              </div>

              <RightRail
                songTitle={songTitle}
                primaryArtist={selectedArtist?.displayName ?? "Not selected"}
                releaseProjectGrouping={selectedReleaseProjectGrouping.label}
                foundationSaved={foundationSaved}
                contributorsReviewed={contributorsReviewed}
                savedWorkId={savedWorkId}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function WorkflowStepper({
  foundationSaved,
  contributorsReviewed,
}: {
  foundationSaved: boolean;
  contributorsReviewed: boolean;
}) {
  const steps = [
    {
      number: "1",
      label: "Song Foundation",
      active: !foundationSaved,
      complete: foundationSaved,
      locked: false,
    },
    {
      number: "2",
      label: "Contributors",
      active: foundationSaved && !contributorsReviewed,
      complete: contributorsReviewed,
      locked: !foundationSaved,
    },
    {
      number: "3",
      label: "Files & Assets",
      active: contributorsReviewed,
      complete: false,
      locked: !contributorsReviewed,
    },
    {
      number: "4",
      label: "Review & Save",
      active: false,
      complete: false,
      locked: true,
    },
  ];

  return (
    <div className="mt-7 grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            step.complete
              ? "bg-[#16A34A] text-white"
              : step.active
                ? "bg-[#4F46E5] text-white"
                : step.locked
                  ? "bg-[#F1F5F9] text-[#94A3B8]"
                  : "bg-[#F1F5F9] text-[#334155]"
          }`}>
            {step.complete ? "✓" : step.number}
          </div>
          <span className={`text-sm font-semibold ${step.locked ? "text-[#94A3B8]" : "text-[#111827]"}`}>
            {step.label}
          </span>
          {index < steps.length - 1 ? <div className="hidden h-px flex-1 bg-[#CBD5E1] md:block" /> : null}
        </div>
      ))}
    </div>
  );
}

function SongDetailsCard({
  songTitle,
  onSongTitleChange,
  genre,
  onGenreChange,
  alternateTitle,
  onAlternateTitleChange,
  language,
  onLanguageChange,
  releaseProjectGroupingType,
  onReleaseProjectGroupingTypeChange,
  description,
  onDescriptionChange,
  artists,
  selectedArtistId,
  onSelectedArtistChange,
  artistSearch,
  onArtistSearchChange,
  artistLoadError,
  onSaveFoundation,
  saving,
  foundationSaved,
  savedWorkId,
}: {
  songTitle: string;
  onSongTitleChange: (value: string) => void;
  genre: string;
  onGenreChange: (value: string) => void;
  alternateTitle: string;
  onAlternateTitleChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  releaseProjectGroupingType: string;
  onReleaseProjectGroupingTypeChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  artists: ArtistOption[];
  selectedArtistId: string;
  onSelectedArtistChange: (value: string) => void;
  artistSearch: string;
  onArtistSearchChange: (value: string) => void;
  artistLoadError: string | null;
  onSaveFoundation: () => void;
  saving: boolean;
  foundationSaved: boolean;
  savedWorkId: string | null;
}) {
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle number="1" title="Song Foundation" body="Basic information about your song." />
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <button
            type="button"
            onClick={onSaveFoundation}
            disabled={saving}
            className="rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : foundationSaved ? "Update Song Foundation" : "Save Song Foundation"}
          </button>
          {foundationSaved ? (
            <p className="text-xs font-semibold text-[#16A34A]">
              Song foundation saved{savedWorkId ? ` · ${savedWorkId.slice(0, 8)}` : ""}.
            </p>
          ) : (
            <p className="text-xs font-semibold text-[#64748B]">Contributors unlock after song foundation is saved.</p>
          )}
        </div>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <div className="grid gap-4 md:grid-cols-6">
          <Field label="Song Title" required value={songTitle} onChange={onSongTitleChange} className="md:col-span-4" />
          <Field label="Version (Optional)" value="1" className="md:col-span-2" deferred />
          <Field
            label="Alternate Title (Optional)"
            value={alternateTitle}
            placeholder="e.g. Midnight Drive (Remix)"
            onChange={onAlternateTitleChange}
            className="md:col-span-6"
          />
          <SelectField label="Genre" value={genre} options={genreOptions} onChange={onGenreChange} className="md:col-span-2" />
          <Field label="BPM (Optional)" value="98" className="md:col-span-2" deferred />
          <Field label="Key (Optional)" value="Em" className="md:col-span-2" deferred />
          <label className="md:col-span-6">
            <span className="text-xs font-medium text-[#334155]">Description / Notes</span>
            <textarea
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-sm leading-6 text-[#111827] outline-none"
            />
            <span className="mt-1 block text-right text-xs text-[#64748B]">{description.length}/500</span>
          </label>
        </div>

        <div className="border-t border-[#E5E7EB] pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <ArtistDropdown
              artists={artists}
              selectedArtistId={selectedArtistId}
              onSelectedArtistChange={onSelectedArtistChange}
              search={artistSearch}
              onSearchChange={onArtistSearchChange}
              loadError={artistLoadError}
            />
            <SelectField label="Language" value={language} options={languageOptions} onChange={onLanguageChange} />
            <ReleaseProjectGroupingField
              value={releaseProjectGroupingType}
              onChange={onReleaseProjectGroupingTypeChange}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Song Status</span>
                <HelpCircle className="h-4 w-4 text-[#64748B]" />
              </div>
              <span className="mt-3 inline-flex rounded-full bg-[#EDE9FE] px-3 py-1 text-sm font-semibold text-[#4F46E5]">
                Draft
              </span>
              <p className="mt-3 text-sm text-[#64748B]">You can change this later.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContributorsCard({
  workId,
  locked,
  reviewed,
  saved,
  saving,
  rows,
  splitTotal,
  error,
  message,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  onSave,
  onMarkReviewed,
}: {
  workId: string | null;
  locked: boolean;
  reviewed: boolean;
  saved: boolean;
  saving: boolean;
  rows: ContributorDraftRow[];
  splitTotal: number;
  error: string | null;
  message: string | null;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onUpdateRow: (id: string, field: keyof ContributorDraftRow, value: string) => void;
  onSave: () => void;
  onMarkReviewed: () => void;
}) {
  const splitIsValid = splitTotal === 100;

  return (
    <section className={`rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm ${locked ? "opacity-65" : ""}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle number="2" title="Contributors" body="Add songwriters, producers, artists and other contributors." compact />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={locked}
            onClick={onAddRow}
            className="inline-flex items-center justify-center rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Contributor
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={locked || saving}
            className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Update contributors" : "Save contributors"}
          </button>
          <button
            type="button"
            onClick={onMarkReviewed}
            disabled={locked || reviewed || !saved || !splitIsValid}
            className="rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
          >
            {reviewed ? "Contributors reviewed" : "Mark contributors reviewed"}
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs font-semibold text-[#64748B]">
        {locked
          ? "Contributors unlock after song foundation is saved."
          : workId
            ? `Saved against work ${workId.slice(0, 8)} using existing contributor structures.`
            : "Save the song foundation first."}
      </p>
      {error ? (
        <div className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#B91C1C]">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="mt-4 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#166534]">
          {message}
        </div>
      ) : null}
      {!locked && !splitIsValid ? (
        <div className="mt-4 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] px-4 py-3 text-sm font-semibold text-[#C2410C]">
          Split total is {splitTotal}%. It must equal 100% before contributors can be reviewed.
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-lg border border-[#E5E7EB]">
        <div className="grid min-w-[900px] grid-cols-[1fr_1.35fr_1fr_0.75fr_1fr_0.55fr] bg-[#F8FAFC] px-4 py-3 text-xs font-semibold text-[#475569]">
          <span>Role</span>
          <span>Name</span>
          <span>Split type</span>
          <span>Share %</span>
          <span>IPI / ID (Optional)</span>
          <span>Actions</span>
        </div>
        <div className="overflow-x-auto">
          {rows.map((contributor) => (
            <div key={contributor.id} className="grid min-w-[900px] grid-cols-[1fr_1.35fr_1fr_0.75fr_1fr_0.55fr] items-center gap-3 border-t border-[#E5E7EB] px-4 py-3 text-sm">
              <select
                value={contributor.role}
                onChange={(event) => onUpdateRow(contributor.id, "role", event.target.value)}
                disabled={locked}
                className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm outline-none disabled:bg-[#F8FAFC]"
              >
                {contributorRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {formatContributorLabel(role)}
                  </option>
                ))}
              </select>
              <input
                value={contributor.name}
                onChange={(event) => onUpdateRow(contributor.id, "name", event.target.value)}
                disabled={locked}
                placeholder="Contributor name"
                className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm outline-none placeholder:text-[#94A3B8] disabled:bg-[#F8FAFC]"
              />
              <select
                value={contributor.splitType}
                onChange={(event) => onUpdateRow(contributor.id, "splitType", event.target.value)}
                disabled={locked}
                className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm outline-none disabled:bg-[#F8FAFC]"
              >
                {splitTypeOptions.map((splitType) => (
                  <option key={splitType} value={splitType}>
                    {formatContributorLabel(splitType)}
                  </option>
                ))}
              </select>
              <input
                value={contributor.percentage}
                onChange={(event) => onUpdateRow(contributor.id, "percentage", event.target.value)}
                disabled={locked}
                inputMode="decimal"
                className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm outline-none disabled:bg-[#F8FAFC]"
              />
              <input
                value={contributor.ipi}
                onChange={(event) => onUpdateRow(contributor.id, "ipi", event.target.value)}
                disabled={locked}
                placeholder="Optional"
                className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm outline-none placeholder:text-[#94A3B8] disabled:bg-[#F8FAFC]"
              />
              <button
                type="button"
                onClick={() => onRemoveRow(contributor.id)}
                disabled={locked || rows.length === 1}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#64748B] disabled:cursor-not-allowed disabled:opacity-40"
                title="Remove contributor"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_1.35fr_1fr_0.75fr_1fr_0.55fr] border-t border-[#E5E7EB] px-4 py-3 text-sm font-semibold">
          <span>Total</span>
          <span />
          <span />
          <span className={splitIsValid ? "text-[#16A34A]" : "text-[#C2410C]"}>{splitTotal}%</span>
          <span className="text-xs font-medium text-[#64748B]">
            {reviewed ? "Reviewed" : saved ? "Saved" : "Not saved"}
          </span>
          <span />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#64748B]">
        Saving contributors updates the existing contributor records for this song. Files & Assets unlock after contributors are saved and reviewed.
      </p>
    </section>
  );
}

type WorkAssetSummary = {
  id: string;
  file_name: string;
  file_category: string;
  file_size_bytes: number | null;
  checksum: string | null;
  created_at: string;
};

type WorkAssetsListResponse = {
  success?: boolean;
  assets?: WorkAssetSummary[];
  error?: string;
};

function FilesAssetsCard({ locked, workId }: { locked: boolean; workId: string | null }) {
  const [assets, setAssets] = useState<WorkAssetSummary[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!workId || locked) return;
    fetch(`/api/works/${workId}/assets`)
      .then((response) => response.json())
      .then((data: WorkAssetsListResponse) => {
        if (data.assets) setAssets(data.assets);
      })
      .catch(() => {
        // Listing failure is non-blocking — upload remains available.
      });
  }, [workId, locked]);

  async function handleFileSelected(file: File | undefined) {
    if (!file || !workId) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_category", "master_audio");

      const response = await fetch(`/api/works/${workId}/assets`, {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as WorkAssetsListResponse;
      if (!response.ok || !data.assets) {
        throw new Error(data.error ?? "Upload failed.");
      }
      setAssets(data.assets);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className={`rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm ${locked ? "opacity-65" : ""}`}>
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.45fr]">
        <div>
          <SectionTitle number="3" title="Files & Assets" body="Attach files that support this song." compact />
          <p className="mt-3 text-xs font-semibold text-[#64748B]">
            {locked
              ? "Files unlock after contributors are reviewed."
              : uploading
                ? "Uploading…"
                : "Files upload to secure storage and are hashed for verification."}
          </p>
          {uploadError ? <p className="mt-2 text-xs font-semibold text-[#C2410C]">{uploadError}</p> : null}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            disabled={locked || uploading || !workId}
            onChange={(event) => handleFileSelected(event.target.files?.[0])}
          />
          <button
            type="button"
            disabled={locked || uploading || !workId}
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 flex min-h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#7C3AED] bg-[#FBFAFF] p-6 text-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-[#4F46E5] text-white">
              <UploadCloud className="h-8 w-8" />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#111827]">Click to browse</p>
            <p className="mt-1 text-sm text-[#64748B]">Uploads the song's master audio file</p>
            <p className="mt-3 text-xs text-[#64748B]">All file types supported. Max 5GB per file.</p>
          </button>
          {assets.length > 0 ? (
            <ul className="mt-4 space-y-2 text-xs text-[#334155]">
              {assets.map((asset) => (
                <li key={asset.id} className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2">
                  <p className="font-semibold">{asset.file_name}</p>
                  <p className="text-[#64748B]">
                    {asset.checksum ? `sha256:${asset.checksum.slice(0, 16)}…` : "Hashing…"}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-semibold text-[#111827]">Quick Add from Category</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-5">
            {assetCategories.map((category) => (
              <button
                key={category.label}
                type="button"
                disabled={locked}
                className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 text-left text-sm font-semibold text-[#111827] shadow-sm transition hover:border-[#C7D2FE] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${categoryTone(category.tone)}`}>
                  <category.icon className="h-5 w-5" />
                </span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewSaveCard({ locked }: { locked: boolean }) {
  return (
    <section className={`rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm ${locked ? "opacity-65" : ""}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle number="4" title="Review & Save" body="Review the song workflow before final save." compact />
        <button
          type="button"
          disabled
          className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#94A3B8]"
        >
          Review later
        </button>
      </div>
      <p className="mt-3 text-xs font-semibold text-[#64748B]">
        Review unlocks after files and assets are ready. Full review behavior is deferred.
      </p>
    </section>
  );
}

function RightRail({
  songTitle,
  primaryArtist,
  releaseProjectGrouping,
  foundationSaved,
  contributorsReviewed,
  savedWorkId,
}: {
  songTitle: string;
  primaryArtist: string;
  releaseProjectGrouping: string;
  foundationSaved: boolean;
  contributorsReviewed: boolean;
  savedWorkId: string | null;
}) {
  const currentStage = !foundationSaved
    ? "Song Foundation"
    : !contributorsReviewed
      ? "Contributors"
      : "Files & Assets";
  const nextAction = !foundationSaved
    ? "Save Song Foundation"
    : !contributorsReviewed
      ? "Now add contributors"
      : "Add files and assets";

  return (
    <aside className="space-y-5">
      <RailCard>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
            <Music2 className="h-5 w-5" />
          </div>
          <h2 className="font-semibold">Song Summary</h2>
        </div>
        <div className="mt-5 space-y-4 text-sm">
          <SummaryRow label="Title" value={songTitle.trim() || "Untitled song"} />
          <SummaryRow label="Primary Artist" value={primaryArtist} />
          <SummaryRow label="Release / Project" value={releaseProjectGrouping} />
          <SummaryRow label="Status" value="Draft" badge />
          <SummaryRow label="Foundation" value={foundationSaved ? "Saved" : "Not saved"} />
          <SummaryRow label="Current stage" value={currentStage} />
          <SummaryRow label="Next action" value={nextAction} />
          {savedWorkId ? <SummaryRow label="Work ID" value={savedWorkId.slice(0, 8)} /> : null}
          <SummaryRow label="Created" value="May 10, 2025 10:15 AM" />
          <SummaryRow label="Last Saved" value="Just now" />
        </div>
      </RailCard>

      <RailCard>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">Recent Songs</h2>
            <p className="mt-1 text-xs text-[#64748B]">Last 5 songs in this workspace</p>
          </div>
          <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-xs font-semibold text-[#64748B]">Mock</span>
        </div>
        <div className="mt-4 divide-y divide-[#E5E7EB] overflow-hidden rounded-lg border border-[#E5E7EB]">
          {recentSongs.map((song) => (
            <div key={song.title} className="bg-[#F8FAFC] px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#111827]">{song.title}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{song.detail}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#4F46E5]">
                  {song.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </RailCard>

      <RailCard>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706]">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Tips</h2>
            <p className="mt-3 text-sm leading-6 text-[#475569]">
              Adding the right files now helps you stay organized and ready for release, publishing, and royalties.
            </p>
            <p className="mt-4 inline-flex items-center text-sm font-semibold text-[#4F46E5]">
              Learn more in the Help Center
              <ArrowRight className="ml-2 h-4 w-4" />
            </p>
          </div>
        </div>
      </RailCard>
    </aside>
  );
}

function SectionTitle({
  number,
  title,
  body,
  compact = false,
}: {
  number: string;
  title: string;
  body: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-bold text-white">
        {number}
      </div>
      <div>
        <h2 className={compact ? "font-semibold" : "text-lg font-semibold"}>{title}</h2>
        <p className="mt-1 text-sm text-[#64748B]">{body}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  required = false,
  className = "",
  deferred = false,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  className?: string;
  deferred?: boolean;
}) {
  return (
    <label className={className}>
      <span className="flex items-center gap-2 text-xs font-medium text-[#334155]">
        <span>
          {label}
          {required ? <span className="text-[#EF4444]"> *</span> : null}
        </span>
        {deferred ? <DeferredBadge /> : null}
      </span>
      <input
        readOnly={!onChange}
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className={`mt-2 h-11 w-full rounded-lg border border-[#CBD5E1] px-4 text-sm text-[#111827] outline-none placeholder:text-[#94A3B8] ${
          deferred ? "bg-[#F8FAFC] text-[#64748B]" : "bg-white"
        }`}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  required = false,
  avatar = false,
  wide = false,
  className = "",
  options,
  onChange,
  deferred = false,
}: {
  label: string;
  value: string;
  required?: boolean;
  avatar?: boolean;
  wide?: boolean;
  className?: string;
  options?: string[];
  onChange?: (value: string) => void;
  deferred?: boolean;
}) {
  if (options && onChange) {
    return (
      <label className={`${wide ? "md:col-span-2 xl:col-span-1" : ""} ${className}`}>
        <span className="text-xs font-medium text-[#334155]">
          {label}
          {required ? <span className="text-[#EF4444]"> *</span> : null}
        </span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-[#CBD5E1] bg-white px-4 text-sm text-[#111827] outline-none"
        >
          {options.map((option) => (
            <option key={option || "empty"} value={option}>
              {option || "Select"}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className={`${wide ? "md:col-span-2 xl:col-span-1" : ""} ${className}`}>
      <span className="flex items-center gap-2 text-xs font-medium text-[#334155]">
        <span>
          {label}
          {required ? <span className="text-[#EF4444]"> *</span> : null}
        </span>
        {deferred ? <DeferredBadge /> : null}
      </span>
      <div className="mt-2 flex h-11 items-center justify-between rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-4 text-sm text-[#64748B]">
        <span className="flex min-w-0 items-center gap-2">
          {avatar ? (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-[10px] font-bold text-white">
              MW
            </span>
          ) : null}
          <span className="truncate">{value}</span>
          {avatar ? <span className="text-[#94A3B8]">x</span> : null}
        </span>
        <ChevronDown className="h-4 w-4 text-[#64748B]" />
      </div>
    </label>
  );
}

function ArtistDropdown({
  artists,
  selectedArtistId,
  onSelectedArtistChange,
  search,
  onSearchChange,
  loadError,
}: {
  artists: ArtistOption[];
  selectedArtistId: string;
  onSelectedArtistChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  loadError: string | null;
}) {
  const filteredArtists = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return artists;

    return artists.filter((artist) =>
      [artist.displayName, artist.artistType, artist.primaryGenre, artist.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [artists, search]);

  const selectedArtist = artists.find((artist) => artist.artistProfileId === selectedArtistId) ?? null;
  const dropdownArtist =
    filteredArtists.find((artist) => artist.artistProfileId === selectedArtistId) ?? filteredArtists[0] ?? null;

  return (
    <div>
      <span className="flex items-center gap-2 text-xs font-medium text-[#334155]">
        <span>
          Primary Artist <span className="text-[#EF4444]">*</span>
        </span>
        <SavedWithProfileBadge />
      </span>
      <div className="mt-2 rounded-lg border border-[#CBD5E1] bg-white p-2">
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search artists"
          className="h-9 w-full rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none placeholder:text-[#94A3B8]"
        />

        <select
          value={dropdownArtist?.artistProfileId ?? ""}
          onChange={(event) => onSelectedArtistChange(event.target.value)}
          className="mt-2 h-11 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-semibold text-[#111827] outline-none"
        >
          {filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => (
              <option key={artist.artistProfileId} value={artist.artistProfileId}>
                {artist.displayName} - {formatArtistType(artist.artistType)}
                {artist.primaryGenre ? ` / ${artist.primaryGenre}` : ""}
              </option>
            ))
          ) : (
            <option value="">No artists found</option>
          )}
        </select>

        {dropdownArtist ? (
          <div className="mt-2 flex items-center gap-2 rounded-md bg-[#F8FAFC] px-3 py-2 text-sm text-[#475569]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-[10px] font-bold text-white">
              {dropdownArtist.displayName.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate">
              {formatArtistType(dropdownArtist.artistType)}
              {dropdownArtist.primaryGenre ? ` / ${dropdownArtist.primaryGenre}` : ""} - {dropdownArtist.status}
            </span>
          </div>
        ) : null}

        {search.trim() && selectedArtist && dropdownArtist?.artistProfileId !== selectedArtist.artistProfileId ? (
          <p className="mt-2 text-xs text-[#64748B]">
            Current selection: <span className="font-semibold">{selectedArtist.displayName}</span>
          </p>
        ) : null}

        <p className="mt-2 text-xs font-semibold text-[#64748B]">
          Tagged for this song profile. Contributor, split, and rights links come later.
        </p>
        {loadError ? <p className="mt-2 text-xs font-semibold text-[#B91C1C]">{loadError}</p> : null}
      </div>
    </div>
  );
}

function ReleaseProjectGroupingField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="md:col-span-2 xl:col-span-1">
      <span className="flex items-center gap-2 text-xs font-medium text-[#334155]">
        <span>Release / Project</span>
        <SavedWithProfileBadge label="Tagged for future release linking" />
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-[#CBD5E1] bg-white px-4 text-sm text-[#111827] outline-none"
      >
        {releaseProjectGroupingOptions.map((option) => (
          <option key={option.type} value={option.type}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs leading-5 text-[#64748B]">
        Choose whether this song is a standalone single or belongs to an EP, album, or project. Full release linking comes later.
      </p>
    </label>
  );
}

function DeferredBadge() {
  return <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-semibold text-[#64748B]">Later</span>;
}

function SavedWithProfileBadge({ label = "Saved with song profile" }: { label?: string }) {
  return (
    <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-semibold text-[#15803D]">
      {label}
    </span>
  );
}

function RailCard({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">{children}</section>;
}

function SummaryRow({ label, value, badge = false }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_1.1fr] gap-3">
      <span className="text-[#64748B]">{label}</span>
      {badge ? (
        <span>
          <span className="rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-semibold text-[#4F46E5]">{value}</span>
        </span>
      ) : (
        <span className="font-medium text-[#111827]">{value}</span>
      )}
    </div>
  );
}

function categoryTone(tone: string) {
  const tones: Record<string, string> = {
    green: "bg-[#DCFCE7] text-[#16A34A]",
    purple: "bg-[#EDE9FE] text-[#7C3AED]",
    red: "bg-[#FEE2E2] text-[#EF4444]",
    amber: "bg-[#FEF3C7] text-[#D97706]",
    blue: "bg-[#DBEAFE] text-[#2563EB]",
    teal: "bg-[#CCFBF1] text-[#0F766E]",
    sky: "bg-[#E0F2FE] text-[#0284C7]",
    violet: "bg-[#F3E8FF] text-[#9333EA]",
    slate: "bg-[#F1F5F9] text-[#475569]",
    indigo: "bg-[#E0E7FF] text-[#4F46E5]",
  };

  return tones[tone] ?? tones.slate;
}

function formatContributorLabel(value: string) {
  if (!value) return "";

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatArtistType(value: string) {
  if (!value) return "Artist";

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function roundSplitTotal(value: number) {
  return Math.round(value * 100) / 100;
}
