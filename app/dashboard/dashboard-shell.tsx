"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Contact,
  FileCheck2,
  FolderOpen,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  Library,
  LineChart,
  LockKeyhole,
  Megaphone,
  Mic2,
  Music2,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navGroups = [
  {
    label: "Core Operations",
    items: [
      ["Dashboard", "Active", LayoutDashboard],
      ["Setup", "Active", ClipboardCheck],
      ["Song Capture", "TEST", Music2],
      ["Contributors & Splits", "TEST", Users],
      ["Files / Evidence", "TEST", FileCheck2],
      ["Readiness", "TEST", CheckCircle2],
      ["Submissions", "TEST", ShieldCheck],
    ],
  },
  {
    label: "Growth & Business",
    items: [
      ["Projects / Releases", "Planned", FolderOpen],
      ["Calendar / Bookings", "Future", CalendarDays],
      ["Artist Profile", "Future", Mic2],
      ["Listening Portal", "Future", Headphones],
      ["Marketing", "Coming Soon", Megaphone],
    ],
  },
  {
    label: "Money & Admin",
    items: [
      ["Royalties", "Future", WalletCards],
      ["Finance / Accounting", "Active", LineChart],
      ["CRM / Contacts", "Planned", Contact],
    ],
  },
  {
    label: "Enablement & Governance",
    items: [
      ["Academy", "Planned", GraduationCap],
      ["Reports", "Future", Library],
      ["Team", "Planned", Users],
      ["Settings", "Active", Settings],
    ],
  },
] as const;

const setupItems = [
  ["Create workspace", "complete"],
  ["Confirm company/profile details", "attention"],
  ["Set country, currency, and VAT details", "attention"],
  ["Invite team members", "planned"],
  ["Add first work/song", "next"],
  ["Attach first file or evidence item", "planned"],
] as const;

const summaryCards = [
  {
    label: "Setup progress",
    value: "42%",
    detail: "Static shell placeholder",
    status: "Active",
    icon: ClipboardCheck,
  },
  {
    label: "Song Capture",
    value: "0",
    detail: "Open the song workflow",
    status: "TEST",
    icon: Music2,
  },
  {
    label: "Readiness blockers",
    value: "3",
    detail: "Example setup blockers",
    status: "Static",
    icon: AlertTriangle,
  },
  {
    label: "Files / Evidence",
    value: "0",
    detail: "Not connected yet",
    status: "TEST",
    icon: FileCheck2,
  },
] as const;

const quickActions = [
  ["Add Song", "Create or draft the first song.", "TEST"],
  ["Complete Setup", "Finish workspace profile basics.", "Active"],
  ["Invite Team", "Prepare collaborator access later.", "Planned"],
  ["Upload File", "File storage connection comes later.", "Coming Soon"],
] as const;

const modules = [
  ["Song Capture", "Create songs, save foundations, add contributors, and move toward files.", "TEST", Music2],
  ["Contributors & Splits", "Manage roles, identity details, and split validation.", "TEST", Users],
  ["Files / Evidence", "Organize files, artwork, and evidence references.", "TEST", FileCheck2],
  ["Readiness", "Show missing information, blockers, and next steps.", "TEST", CheckCircle2],
  ["Submissions", "Prepare for structured compliance and submission tracking.", "TEST", ShieldCheck],
  ["Projects / Releases", "Plan releases, tasks, and project context.", "Planned", FolderOpen],
  ["Calendar / Bookings", "Future booking calendar and scheduling view.", "Future", CalendarDays],
  ["Artist Profile", "Future public artist profile and business presence.", "Future", Mic2],
  ["Book Artist", "Future public booking action for approved profiles.", "Future", BriefcaseBusiness],
  ["Listening Portal", "Future upload/listening area for approved access.", "Future", Headphones],
  ["Radio / Curator Access", "Future controlled sampling and discovery access.", "Future", Radio],
  ["Marketing", "Future release promotion and campaign planning.", "Coming Soon", Megaphone],
  ["Legal / Contracts", "Future contracts, mandates, and authority documents.", "Future", LockKeyhole],
  ["Royalties", "Future statement, payout, and reconciliation visibility.", "Future", WalletCards],
  ["Finance / Accounting", "Workspace income, expenses, payables, receivables, and reporting.", "Active", LineChart],
  ["CRM / Contacts", "Planned partner, contact, and relationship management.", "Planned", Contact],
  ["Academy", "Planned training and platform enablement integration.", "Planned", GraduationCap],
  ["AI Helper", "Future assistant for setup, blockers, and guidance.", "Future", Bot],
] as const;

const activityItems = [
  "No customer activity yet.",
  "Future activity will show workspace setup, works, evidence, submissions, and team actions.",
];

const trialStatus = {
  label: "14-day trial",
  daysLeft: 13,
  cta: "View Plans",
  href: "/pricing",
  note: "Demo trial placeholder. Billing is not connected yet.",
};

function statusClass(status: string) {
  switch (status) {
    case "Active":
      return "bg-[#DCFCE7] text-[#15803D]";
    case "TEST":
      return "bg-[#DBEAFE] text-[#2F48F7]";
    case "Planned":
      return "bg-[#FEF3C7] text-[#B45309]";
    case "Future":
      return "bg-[#F1F5F9] text-[#475569]";
    case "Coming Soon":
      return "bg-[#F3E8FF] text-[#7E22CE]";
    default:
      return "bg-[#F1F5F9] text-[#475569]";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(status)}`}>
      {status}
    </span>
  );
}

function SignedInUserBadge() {
  const { user, isLoaded } = useUser();
  const displayName =
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    user?.username ||
    "Signed in user";

  if (!isLoaded) {
    return (
      <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm shadow-slate-200/50">
        <div className="h-7 w-7 rounded-full bg-[#EEF2FF]" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#0F172A]">Checking account</p>
          <p className="text-xs font-medium text-[#64748B]">Auth loading</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex items-center justify-center rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-sm font-semibold text-[#2F48F7] transition hover:bg-white"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm shadow-slate-200/50">
      <UserButton afterSignOutUrl="/sign-in" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#0F172A]">{displayName}</p>
        <p className="text-xs font-medium text-[#64748B]">Account</p>
      </div>
    </div>
  );
}

export function DashboardShell() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-[#E5E7EB] bg-white">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="border-b border-[#E5E7EB] px-6 py-5">
              <Image src="/logo.png" alt="Sentry Sound" width={170} height={56} className="h-12 w-auto" priority />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                Workspace
              </p>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.items.map(([label, status, Icon]) => {
                      const active = label === "Dashboard";
                      const itemClassName = `flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                        active
                          ? "bg-[#EEF2FF] text-[#2F48F7]"
                          : "text-[#475569] hover:bg-[#F8FAFC]"
                      }`;

                      const itemHref =
                        label === "Setup"
                          ? "/dashboard/setup"
                            : label === "Song Capture"
                            ? "/dashboard/works/song-capture-v2"
                            : label === "Artist Profile"
                              ? "/dashboard/artists/new"
                            : label === "Calendar / Bookings"
                              ? "/dashboard/calendar"
                            : label === "Finance / Accounting"
                              ? "/dashboard/finance"
                            : null;

                      if (itemHref) {
                        return (
                          <Link href={itemHref} key={label} className={itemClassName}>
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4" />
                              <span>{label}</span>
                            </div>
                            {status !== "Active" || !active ? <StatusBadge status={status} /> : null}
                          </Link>
                        );
                      }

                      return (
                        <div
                          key={label}
                          className={itemClassName}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                          </div>
                          {status !== "Active" || !active ? <StatusBadge status={status} /> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="border-t border-[#E5E7EB] p-4">
              <Link
                href="/test-control-panel"
                className="flex items-center justify-between rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-3 text-sm font-semibold text-[#2F48F7]"
              >
                TEST Control Panel
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 px-6 py-4 backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#64748B]">Welcome back</p>
                <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
                  Sentry Sound Demo Workspace
                </h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 sm:w-80">
                  <Search className="h-4 w-4 text-[#64748B]" />
                  <span className="truncate text-sm text-[#64748B]">Search works, files, contributors...</span>
                </div>
                <button className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#475569]">
                  <Bell className="h-4 w-4" />
                </button>
                <SignedInUserBadge />
                <Link
                  href="/dashboard/works/song-capture-v2"
                  className="inline-flex items-center justify-center rounded-xl bg-[#2F48F7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
                >
                  Add Song
                </Link>
              </div>
            </div>
          </header>

          <div className="grid gap-6 p-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
                  <div>
                    <div className="mb-4 inline-flex rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2F48F7]">
                      Customer dashboard shell
                    </div>
                    <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
                      Your operational home for music work.
                    </h2>
                    <p className="mt-4 max-w-2xl leading-7 text-[#475569]">
                      Use this dashboard to understand setup progress, available modules,
                      planned capabilities, future roadmap areas, and the next safe step for
                      your workspace.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#64748B]">Trial / plan status</p>
                        <h3 className="mt-2 text-xl font-semibold text-[#0F172A]">{trialStatus.label}</h3>
                      </div>
                      <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#2F48F7]">
                        {trialStatus.daysLeft} days left
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#334155]">
                      Upgrade before your trial ends.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#64748B]">
                      {trialStatus.note} Production access and plan gates are deferred.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                          <div className="h-full w-[42%] rounded-full bg-[#2F48F7]" />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-[#64748B]">Setup progress: 42%</p>
                      </div>
                      <Link
                        href={trialStatus.href}
                        className="inline-flex items-center justify-center rounded-xl border border-[#BFDBFE] bg-white px-4 py-2 text-sm font-semibold text-[#2F48F7] hover:bg-[#EFF6FF]"
                      >
                        {trialStatus.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article key={card.label} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/60">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <StatusBadge status={card.status} />
                      </div>
                      <p className="mt-5 text-sm font-semibold text-[#64748B]">{card.label}</p>
                      <p className="mt-1 text-3xl font-semibold text-[#0F172A]">{card.value}</p>
                      <p className="mt-2 text-sm leading-6 text-[#64748B]">{card.detail}</p>
                    </article>
                  );
                })}
              </section>

              <section className="grid gap-6 lg:grid-cols-[0.88fr_1fr]">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                        Guided setup
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">
                        Finish the basics first.
                      </h2>
                    </div>
                    <StatusBadge status="Active" />
                  </div>

                  <div className="mt-5 space-y-3">
                    {setupItems.map(([label, state]) => {
                      const content = (
                        <>
                        <div className="flex items-center gap-3">
                          {state === "complete" ? (
                            <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                          ) : state === "attention" ? (
                            <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                          ) : (
                            <Clock3 className="h-4 w-4 text-[#64748B]" />
                          )}
                          <span className="text-sm font-semibold text-[#334155]">{label}</span>
                        </div>
                        <span className="text-xs font-semibold capitalize text-[#64748B]">{state}</span>
                        </>
                      )

                      return label === "Confirm company/profile details" ? (
                        <Link
                          key={label}
                          href="/dashboard/setup"
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3"
                        >
                          {content}
                        </Link>
                      ) : (
                        <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                          {content}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                    Quick actions
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">Start the next piece of work.</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {quickActions.map(([title, body, status]) => (
                      title === "Complete Setup" || title === "Add Song" ? (
                      <Link
                        key={title}
                        href={title === "Add Song" ? "/dashboard/works/song-capture-v2" : "/dashboard/setup"}
                        className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-left transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-[#0F172A]">{title}</span>
                          <StatusBadge status={status} />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#64748B]">{body}</p>
                      </Link>
                      ) : (
                      <button
                        key={title}
                        type="button"
                        className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-left transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-[#0F172A]">{title}</span>
                          <StatusBadge status={status} />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#64748B]">{body}</p>
                      </button>
                      )
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                      Ecosystem modules
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">
                      Current, planned, and future platform areas.
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                      These cards show the SaaS direction without pretending every module is live.
                    </p>
                  </div>
                  <Link href="/landing/platform" className="inline-flex items-center text-sm font-semibold text-[#2F48F7]">
                    View public platform page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {modules.map(([title, body, status, Icon]) => {
                    const href =
                      title === "Finance / Accounting"
                        ? "/dashboard/finance"
                        : title === "Song Capture"
                          ? "/dashboard/works/song-capture-v2"
                          : title === "Artist Profile"
                            ? "/dashboard/artists/new"
                          : null;
                    const content = (
                      <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2F48F7] shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        <StatusBadge status={status} />
                      </div>
                      <h3 className="mt-4 font-semibold text-[#0F172A]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#64748B]">{body}</p>
                      </>
                    );

                    return href ? (
                      <Link key={title} href={href} className="block rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]">
                        {content}
                      </Link>
                    ) : (
                      <article key={title} className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
                        {content}
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                  Attention
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">Needs attention</h2>
                <div className="mt-5 space-y-3">
                  {[
                    "Workspace profile is not complete.",
                    "Billing and production plan activation are not connected yet.",
                    "Production dashboard metrics are deferred.",
                  ].map((item) => (
                    <div key={item} className="rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-4 text-sm font-semibold leading-6 text-[#92400E]">
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <Link
                href="/dashboard/calendar"
                className="block rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60 transition hover:border-[#BFDBFE] hover:bg-[#F8FAFC]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                  Upcoming
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">Workspace actions</h2>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  See assigned tasks, approvals, due dates, and calendar-linked operational work.
                </p>
                <div className="mt-5 space-y-3">
                  {[
                    ["Today", "Complete workspace profile"],
                    ["Next", "Add first work/song"],
                    ["Later", "Review workspace calendar"],
                  ].map(([date, task]) => (
                    <div key={task} className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                      <CalendarDays className="h-5 w-5 text-[#2F48F7]" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{date}</p>
                        <p className="mt-1 text-sm font-semibold text-[#334155]">{task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Link>

              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                  Recent activity
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">No activity yet</h2>
                <div className="mt-5 space-y-3">
                  {activityItems.map((item) => (
                    <p key={item} className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">
                      {item}
                    </p>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-6 shadow-sm shadow-slate-200/60">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2F48F7] shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[#0F172A]">AI helper</h2>
                <p className="mt-3 text-sm leading-6 text-[#475569]">
                  Future assistant panel for setup guidance, blockers, and next steps. Not connected yet.
                </p>
                <div className="mt-4">
                  <StatusBadge status="Future" />
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
