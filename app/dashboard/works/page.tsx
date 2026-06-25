"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FileText,
  Lightbulb,
  ListChecks,
  Loader2,
  Music2,
  Plus,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

type RecentWork = {
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
  works?: RecentWork[];
  error?: string;
};

type CalendarItem = {
  id: string;
  title: string;
  required_by_date: string;
  action_status: string;
};

type CalendarItemsResponse = {
  success?: boolean;
  items?: CalendarItem[];
  error?: string;
};

const lifecycleSteps = [
  {
    label: "1. Add song basics",
    body: "Capture the title, genre, mood, and first saved song record.",
    icon: Music2,
  },
  {
    label: "2. Add contributors",
    body: "Add writers, roles, and split details when they are ready.",
    icon: Users,
  },
  {
    label: "3. Add creative details",
    body: "Add language, themes, feel, and notes that help describe the song.",
    icon: FileText,
  },
  {
    label: "4. Add supporting references",
    body: "Attach useful reference notes or materials as the profile grows.",
    icon: Lightbulb,
  },
  {
    label: "5. Review profile",
    body: "Come back anytime to search, edit, and keep the song profile current.",
    icon: ListChecks,
  },
] as const;

export default function WorksLandingPage() {
  const [works, setWorks] = useState<RecentWork[]>([]);
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [worksError, setWorksError] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWorks() {
      setLoadingWorks(true);
      setWorksError(null);

      try {
        const response = await fetch("/api/works", { cache: "no-store" });
        const data = (await response.json()) as WorksReadModelResponse;

        if (!response.ok || data.success === false) {
          throw new Error(data.error ?? "Failed to load recent works.");
        }

        if (!cancelled) {
          setWorks(Array.isArray(data.works) ? data.works : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setWorksError(loadError instanceof Error ? loadError.message : "Failed to load recent works.");
        }
      } finally {
        if (!cancelled) setLoadingWorks(false);
      }
    }

    async function loadCalendarItems() {
      setLoadingCalendar(true);
      setCalendarError(null);

      try {
        const response = await fetch("/api/calendar/items", { cache: "no-store" });
        const data = (await response.json()) as CalendarItemsResponse;

        if (!response.ok || data.success === false) {
          throw new Error(data.error ?? "Failed to load calendar items.");
        }

        if (!cancelled) {
          setCalendarItems(Array.isArray(data.items) ? data.items : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setCalendarError(loadError instanceof Error ? loadError.message : "Failed to load calendar items.");
        }
      } finally {
        if (!cancelled) setLoadingCalendar(false);
      }
    }

    loadWorks();
    loadCalendarItems();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-[#2F48F7]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Song Capture</h1>
            <p className="mt-2 max-w-3xl leading-7 text-[#64748B]">
              Add a song, continue its Song Profile, and keep the connected details visible from one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/works/song-capture-v2"
              className="inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Song
            </Link>
            <Link
              href="/dashboard/works/list"
              className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-semibold text-[#334155]"
            >
              Continue Existing Song
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F48F7]">
              <Music2 className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">Start with a song</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#64748B]">
              Add a new song or continue editing one that is already saved. Keep the page simple:
              find the right song, open it, and add the details you know.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ActionCard
                title="Add Song"
                body="Open the guided song workflow, save the foundation, and add contributors."
                href="/dashboard/works/song-capture-v2"
                actionLabel="Add Song"
              />
              <ActionCard
                title="Continue Existing Song"
                body="Find a saved song, open its Song Profile, and keep editing."
                href="/dashboard/works/list"
                actionLabel="Continue editing"
              />
            </div>
            <Link
              href="/dashboard/works/song-capture-v2"
              className="mt-4 inline-flex items-center rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
            >
              Open Song Capture
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </section>

          <RecentWorksPanel
            works={works}
            loading={loadingWorks}
            error={worksError}
          />
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/60">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2F48F7]">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Quick reminder</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  You do not need every detail at once. Add the basics now, then return later for contributors, creative details, and references.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/60">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                Helpful next steps
              </p>
              <h2 className="mt-2 text-xl font-semibold">What happens next?</h2>
            </div>
            <div className="mt-5 space-y-3">
              {lifecycleSteps.map((step) => (
                <LifecycleStepCard
                  key={step.label}
                  label={step.label}
                  body={step.body}
                  icon={step.icon}
                />
              ))}
            </div>
          </section>

          <CalendarSupportCard
            items={calendarItems}
            loading={loadingCalendar}
            error={calendarError}
          />

          <section className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-5 shadow-sm shadow-slate-200/60">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2F48F7]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F172A]">Song helper coming later</h3>
                <p className="mt-2 text-sm leading-6 text-[#475569]">
                  Future guidance can help suggest next details, but this page stays focused on creating and editing songs.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function RecentWorksPanel({
  works,
  loading,
  error,
}: {
  works: RecentWork[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <section id="recently-captured-works" className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
            Catalog awareness
          </p>
          <h2 className="mt-2 text-xl font-semibold">Recent songs</h2>
        </div>
        <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#15803D]">
          Recent
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#64748B]">
        Open a saved song to continue editing its profile.
      </p>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
            <Loader2 className="h-5 w-5 animate-spin text-[#2F48F7]" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm font-semibold text-[#B91C1C]">
            {error}
          </div>
        ) : works.length > 0 ? (
          <>
            <div className="divide-y divide-[#E5E7EB] overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
              {works.slice(0, 5).map((work) => (
                <Link
                  key={work.id}
                  href={`/dashboard/works/details/${work.id}`}
                  className="flex items-center justify-between gap-3 px-3 py-3 transition hover:bg-[#EFF6FF]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0F172A]">
                      {work.work_title || "Untitled song"}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-[#64748B]">
                      {formatDate(work.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#475569]">
                    {work.registration_status || "Draft"}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/dashboard/works/list"
              className="inline-flex w-full items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
            >
              View all saved songs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
            <p className="font-semibold text-[#334155]">No songs captured yet</p>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Once songs are saved, they will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function CalendarSupportCard({
  items,
  loading,
  error,
}: {
  items: CalendarItem[];
  loading: boolean;
  error: string | null;
}) {
  const upcomingItems = items
    .filter((item) => item.action_status !== "completed" && item.action_status !== "cancelled")
    .sort((a, b) => a.required_by_date.localeCompare(b.required_by_date))
    .slice(0, 3);

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2F48F7]">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">Calendar</h3>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Keep song follow-ups and workspace reminders in one place.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="flex h-20 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
            <Loader2 className="h-5 w-5 animate-spin text-[#2F48F7]" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs font-semibold text-[#B91C1C]">
            {error}
          </div>
        ) : upcomingItems.length > 0 ? (
          upcomingItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3">
              <p className="truncate text-sm font-semibold text-[#0F172A]">{item.title}</p>
              <p className="mt-1 text-xs font-medium text-[#64748B]">
                {formatDate(item.required_by_date)}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm text-[#64748B]">
            No upcoming reminders yet.
          </div>
        )}
      </div>

      <Link
        href="/dashboard/calendar"
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
      >
        Open calendar
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </section>
  );
}

function LifecycleStepCard({
  label,
  body,
  icon: Icon,
}: {
  label: string;
  body: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2F48F7]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-[#0F172A]">{label}</p>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">{body}</p>
        </div>
      </div>
    </div>
  );
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

function ActionCard({
  title,
  body,
  href,
  actionLabel,
}: {
  title: string;
  body: string;
  href: string;
  actionLabel: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
    >
      <p className="font-semibold text-[#0F172A]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#64748B]">{body}</p>
      <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#2F48F7]">
        {actionLabel}
        <ArrowRight className="ml-2 h-4 w-4" />
      </span>
    </Link>
  );
}
