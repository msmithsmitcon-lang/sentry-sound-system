"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
} from "lucide-react";

type WorkRow = {
  id: string;
  asset_id?: string | null;
  work_title?: string | null;
  genre?: string | null;
  mood?: string | null;
  copyright_status?: string | null;
  registration_status?: string | null;
  created_at?: string | null;
  contributor_count?: number | null;
  split_total?: number | null;
};

type WorksReadModelResponse = {
  success?: boolean;
  works?: WorkRow[];
  error?: string;
};

type OperationalStatusIndicator = {
  label: "Captured" | "Needs review" | "Draft" | "Limited profile data";
  detail: string;
  className: string;
};

// UI-derived operational status indicator, not production compliance logic.
// This page summarizes captured status fields until governed readiness services are connected.
function deriveOperationalStatusIndicator(work: WorkRow): OperationalStatusIndicator {
  if (!work.contributor_count || work.contributor_count < 1) {
    return {
      label: "Needs review",
      detail: "No contributor links are visible yet.",
      className: "bg-[#FEF3C7] text-[#B45309]",
    };
  }

  if (typeof work.split_total === "number" && work.split_total !== 100) {
    return {
      label: "Needs review",
      detail: "Contributor split total does not equal 100%.",
      className: "bg-[#FEF3C7] text-[#B45309]",
    };
  }

  if (!work.registration_status) {
    return {
      label: "Draft",
      detail: "Registration status is not captured yet.",
      className: "bg-[#FEF3C7] text-[#B45309]",
    };
  }

  if (work.registration_status && work.copyright_status) {
    return {
      label: "Captured",
      detail: "Basic status fields and contributor split summary are present.",
      className: "bg-[#DCFCE7] text-[#15803D]",
    };
  }

  if (!work.genre || !work.mood) {
    return {
      label: "Limited profile data",
      detail: "Genre or mood is not captured yet.",
      className: "bg-[#F1F5F9] text-[#475569]",
    };
  }

  return {
    label: "Needs review",
    detail: "Some operational profile data is not available yet.",
    className: "bg-[#FEF3C7] text-[#B45309]",
  };
}

export default function ExistingWorksListPage() {
  const [works, setWorks] = useState<WorkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWorks() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/works", { cache: "no-store" });
        const data = (await response.json()) as WorksReadModelResponse;

        if (!response.ok || data.success === false) {
          throw new Error(data.error ?? "Failed to load works.");
        }

        if (cancelled) return;
        setWorks(Array.isArray(data.works) ? data.works : []);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load works.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWorks();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredWorks = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return works;

    return works.filter((work) =>
      [
        work.work_title,
        work.registration_status,
        work.copyright_status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle))
    );
  }, [query, works]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/dashboard/works/song-capture-v2" className="inline-flex items-center text-sm font-semibold text-[#2F48F7]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Song Capture
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Existing Works</h1>
            <p className="mt-2 max-w-2xl leading-7 text-[#64748B]">
              Review captured works, check basic status, and avoid duplicate entries before creating another work.
            </p>
          </div>

          <Link
            href="/dashboard/works/song-capture-v2"
            className="inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Song
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Works table</h2>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                Current data comes from the canonical workspace-scoped Works read model. Open a Song Profile to continue work details.
              </p>
            </div>
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 lg:w-96">
              <Search className="h-4 w-4 shrink-0 text-[#64748B]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title or status..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#94A3B8]"
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#E5E7EB]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E5E7EB] text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                  <tr>
                    <th className="px-4 py-3">Work title</th>
                    <th className="px-4 py-3">Genre</th>
                    <th className="px-4 py-3">Mood</th>
                    <th className="px-4 py-3">Registration status</th>
                    <th className="px-4 py-3">Copyright status</th>
                    <th className="px-4 py-3">Readiness / compliance</th>
                    <th className="px-4 py-3">Created date</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#2F48F7]" />
                        <p className="mt-3 font-semibold text-[#64748B]">Loading works...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center font-semibold text-[#B91C1C]">
                        {error}
                      </td>
                    </tr>
                  ) : filteredWorks.length > 0 ? (
                    filteredWorks.map((work) => {
                      const indicator = deriveOperationalStatusIndicator(work);
                      return (
                        <tr key={work.id} className="align-top">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-[#0F172A]">{work.work_title || "Untitled work"}</p>
                            <p className="mt-1 max-w-48 break-all text-xs text-[#94A3B8]">{work.id}</p>
                            <p className="mt-2 text-xs font-semibold text-[#64748B]">
                              {formatContributorCount(work.contributor_count)} / {formatSplitTotal(work.split_total)}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-[#475569]">{work.genre || "Not captured yet"}</td>
                          <td className="px-4 py-4 text-[#475569]">{work.mood || "Not captured yet"}</td>
                          <td className="px-4 py-4">
                            <StatusPill value={work.registration_status} fallback="Not captured yet" />
                          </td>
                          <td className="px-4 py-4">
                            <StatusPill value={work.copyright_status} fallback="Not captured yet" />
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${indicator.className}`}>
                              {indicator.label}
                            </span>
                            <p className="mt-2 max-w-56 text-xs leading-5 text-[#64748B]">{indicator.detail}</p>
                          </td>
                          <td className="px-4 py-4 text-[#475569]">{formatDate(work.created_at)}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-2">
                              <Link
                                href={`/dashboard/works/details/${work.id}`}
                                className="inline-flex items-center justify-center rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-xs font-semibold text-[#2F48F7]"
                              >
                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                Open details
                              </Link>
                              <button
                                type="button"
                                disabled
                                className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#94A3B8]"
                              >
                                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                Edit coming soon
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <p className="font-semibold text-[#334155]">No works captured yet</p>
                        <p className="mt-2 text-sm text-[#64748B]">
                          Create a work first, then it will appear in this table.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4 text-xs leading-5 text-[#2F48F7]">
            This page shows operational profile status only, not legal or submission readiness.
          </div>
        </section>
      </section>
    </main>
  );
}

function StatusPill({
  value,
  fallback,
}: {
  value?: string | null;
  fallback: string;
}) {
  return (
    <span className="inline-flex rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#475569]">
      {value || fallback}
    </span>
  );
}

function formatContributorCount(value?: number | null) {
  if (typeof value !== "number") return "No contributors";
  return `${value} contributor${value === 1 ? "" : "s"}`;
}

function formatSplitTotal(value?: number | null) {
  if (typeof value !== "number") return "Split unknown";
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
