import {
  FolderOpen,
  LayoutDashboard,
  LineChart,
  Plus,
  Radio,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { DashboardProject, SplitAttentionItem } from "@/lib/dashboard/get-dashboard-home-data";
import { toArtistStatusLabel } from "@/lib/works/work-status-language";

import { SignedInUserBadge } from "./signed-in-user-badge";

// Canonical Navigation Structure — represents what the artist OWNS, not
// platform modules or backend architecture. Per
// SENTRY_SOUND_UX_DOCTRINE_AND_REDESIGN_BRIEF_V1.md "THE NAVIGATION DOCTRINE".
// Items with no href yet are marked "Coming soon" — never TEST/PLANNED/FUTURE/STATIC.
const navItems = [
  ["Home", "/dashboard", LayoutDashboard],
  ["My Projects", "/dashboard/works/list", FolderOpen],
  ["My Team", null, Users],
  ["My Protection", null, ShieldCheck],
  ["My Releases", null, Radio],
  ["My Royalties", null, WalletCards],
  ["My Business", "/dashboard/finance", LineChart],
] as const;

function statusBadgeClass(label: string) {
  if (label.includes("✓")) return "bg-[#DCFCE7] text-[#15803D]";
  if (label === "Needs Attention") return "bg-[#FEF3C7] text-[#B45309]";
  if (label === "Filed with CMO" || label === "Ready to File") return "bg-[#DBEAFE] text-[#2F48F7]";
  return "bg-[#F1F5F9] text-[#475569]";
}

function ProjectCard({ project }: { project: DashboardProject }) {
  const statusLabel = toArtistStatusLabel(project.registrationStatus);

  return (
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-[#0F172A]">{project.workTitle}</h3>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(statusLabel)}`}>
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
        {project.hasCertificate ? (
          <span className="inline-flex items-center gap-1 font-semibold text-[#15803D]">
            <ShieldCheck className="h-4 w-4" /> Certificate issued
          </span>
        ) : (
          <span>No certificate yet</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/dashboard/works/details/${project.id}`}
          className="inline-flex items-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#334155] transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
        >
          View project
        </Link>
      </div>
    </article>
  );
}

function AttentionCard({ item }: { item: SplitAttentionItem }) {
  return (
    <div className="rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-4">
      <p className="text-sm font-semibold leading-6 text-[#92400E]">
        {item.contributorName} hasn&apos;t confirmed their split on {item.workTitle}
      </p>
    </div>
  );
}

export function DashboardShell({
  workspaceName,
  projects,
  attentionItems,
}: {
  workspaceName: string;
  projects: DashboardProject[];
  attentionItems: SplitAttentionItem[];
}) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-[#E5E7EB] bg-white">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="border-b border-[#E5E7EB] px-6 py-5">
              <Image src="/logo.png" alt="Sentry Sound" width={170} height={56} className="h-12 w-auto" priority />
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
              {navItems.map(([label, href, Icon]) => {
                const active = label === "Home";
                const itemClassName = `flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  active
                    ? "bg-[#EEF2FF] text-[#2F48F7]"
                    : "text-[#475569] hover:bg-[#F8FAFC]"
                }`;

                const content = (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </div>
                    {!href ? (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                        Coming soon
                      </span>
                    ) : null}
                  </>
                );

                if (href) {
                  return (
                    <Link href={href} key={label} className={itemClassName}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <div key={label} className={`${itemClassName} cursor-default opacity-70`}>
                    {content}
                  </div>
                );
              })}
            </nav>

            <div className="border-t border-[#E5E7EB] p-4">
              <Link
                href="/dashboard/setup"
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC]"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </div>
              </Link>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 px-6 py-4 backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
                Your music business — {workspaceName}
              </h1>

              <div className="flex flex-shrink-0 items-center gap-3">
                <SignedInUserBadge />
                <Link
                  href="/dashboard/works/song-capture-v2"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F48F7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="h-4 w-4" />
                  New Project
                </Link>
              </div>
            </div>
          </header>

          <div className="grid gap-6 p-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#0F172A]">Your projects</h2>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                  Quick actions
                </p>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/dashboard/works/song-capture-v2"
                    className="block rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
                  >
                    Start New Project
                  </Link>
                  <Link
                    href="/dashboard/works/new"
                    className="block rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
                  >
                    Invite a Collaborator
                  </Link>
                </div>
              </section>

              {attentionItems.length > 0 ? (
                <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
                    Attention
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">Needs attention</h2>
                  <div className="mt-5 space-y-3">
                    {attentionItems.map((item) => (
                      <AttentionCard key={`${item.workTitle}-${item.contributorName}`} item={item} />
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
