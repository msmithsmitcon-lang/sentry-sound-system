import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  ListChecks,
  LockKeyhole,
  Music2,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

import { landingTheme as t } from "./landing-theme";
import { CtaBand, SectionHeader } from "./website-components";

const painPoints = [
  "Music operations are spread across spreadsheets, folders, emails, chats, and disconnected systems.",
  "Contributor details, splits, and evidence often become unclear when teams need them most.",
  "Submission and rights preparation slows down when readiness, blockers, and files are not visible.",
];

const clarityItems = [
  {
    label: "Complete",
    title: "See what is already in place",
    body: "Keep song details, contributors, files, and workspace setup visible in one operational view.",
    icon: CheckCircle2,
    color: "text-[#16A34A]",
    bg: "bg-[#16A34A]/10",
  },
  {
    label: "Missing",
    title: "Find the gaps early",
    body: "Surface missing contributor information, split issues, file references, and evidence needs before work stalls.",
    icon: AlertTriangle,
    color: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
  },
  {
    label: "Blocked",
    title: "Know what needs attention",
    body: "Turn scattered admin into clear blockers, next steps, and review-ready workflow signals.",
    icon: ListChecks,
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
  },
];

const platformAreas = [
  {
    title: "Songs and works",
    body: "Capture the music assets your team needs to organize and prepare.",
    icon: Music2,
  },
  {
    title: "Contributors and splits",
    body: "Keep contributor roles, identity details, and split totals visible.",
    icon: Users,
  },
  {
    title: "Files and evidence",
    body: "Classify files, agreements, artwork, and evidence-like assets around the work they support.",
    icon: FileCheck2,
  },
  {
    title: "Workflow and activity",
    body: "Track operational status, review states, blockers, and recent activity.",
    icon: ClipboardCheck,
  },
  {
    title: "Submission preparation",
    body: "Prepare for structured rights and submission workflows without guessing readiness.",
    icon: ShieldCheck,
  },
  {
    title: "Finance and reporting later",
    body: "Build toward royalty, finance, reports, and enterprise visibility as the platform expands.",
    icon: BarChart3,
  },
];

const ecosystemItems = [
  {
    title: "Plexicon",
    body: "Strategic operational logic and structured systems thinking that supports future platform intelligence.",
  },
  {
    title: "Sentry Sound Academy",
    body: "Training, enablement, and industry education aligned with the platform's operational approach.",
  },
  {
    title: "StudyEdge",
    body: "Structured learning and support systems that can inform broader education and onboarding experiences.",
  },
];

const previewRows = [
  ["Workspace profile", "In progress", "bg-[#DBEAFE] text-[#2F48F7]"],
  ["Contributor splits", "Review", "bg-[#FEF3C7] text-[#B45309]"],
  ["Evidence files", "Missing", "bg-[#FEE2E2] text-[#DC2626]"],
  ["Submission prep", "Blocked", "bg-[#F1F5F9] text-[#475569]"],
];

export default function WebsiteHomePage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#2F48F7]/10 via-[#60A5FA]/10 to-transparent" />
        <div className={`${t.container} relative grid items-center gap-12 py-20 lg:grid-cols-[1fr_0.92fr] lg:py-24`}>
          <div>
            <div className={t.badge}>Music operations workspace</div>
            <h1 className={`${t.h1} mt-6 max-w-4xl`}>
              The platform that keeps music operations organized.
            </h1>
            <p className={`${t.body} mt-6 max-w-2xl`}>
              Sentry Sound helps artists, producers, studios, labels, publishers,
              managers, and rights teams keep songs, contributors, splits, files,
              evidence, workflow status, and next steps in one clear workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/landing/start" className={t.primaryButton}>
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/landing/pricing" className={t.secondaryButton}>
                View Plans
              </Link>
            </div>

            <div className="mt-8 grid gap-3 text-sm font-semibold text-[#334155] sm:grid-cols-3">
              {["Complete", "Missing", "Blocked"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                  <span>Know what is {item.toLowerCase()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 shadow-2xl shadow-slate-200/80">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-5">
                <div>
                  <p className="text-sm font-semibold text-[#64748B]">Operational workspace</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
                    Midnight Drive
                  </h2>
                </div>
                <span className="rounded-full bg-[#FEF3C7] px-3 py-1.5 text-xs font-semibold text-[#B45309]">
                  Needs attention
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {previewRows.map(([label, status, style]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                    <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2F48F7] shadow-sm">
                    <ListChecks className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2F48F7]">Next step</p>
                    <p className="mt-1 text-sm leading-6 text-[#334155]">
                      Add missing evidence before this work is ready for review.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  ["78%", "Ready"],
                  ["3", "Blockers"],
                  ["6", "Files"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-[#E5E7EB] bg-white p-3">
                    <p className="text-xl font-semibold text-[#0F172A]">{value}</p>
                    <p className="mt-1 text-xs font-medium text-[#64748B]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${t.container} ${t.section}`}>
        <div className="grid gap-4 md:grid-cols-3">
          {painPoints.map((text) => (
            <div key={text} className={t.card}>
              <p className="text-base font-semibold leading-7 text-[#0F172A]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-white">
        <div className={`${t.container} ${t.section}`}>
          <SectionHeader
            eyebrow="Operational clarity"
            title="Know what is complete, missing, blocked, and next."
            body="Sentry Sound connects the day-to-day pieces of music operations so teams can see status clearly instead of chasing spreadsheets, folders, and messages."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {clarityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={t.card}>
                  <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-[#64748B]">{item.label}</p>
                  <h3 className="mt-2 text-xl font-semibold text-[#0F172A]">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[#475569]">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${t.container} ${t.section}`}>
        <SectionHeader
          eyebrow="Public website layer"
          title="Explore the platform before entering the workspace."
          body="The website explains the ecosystem, the platform, and who it serves. The SaaS product entry comes next through trial, login, onboarding, and workspace activation."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {platformAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div key={area.title} className={t.softCard}>
                <div className={t.iconBox}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#0F172A]">{area.title}</h3>
                <p className="mt-3 leading-7 text-[#475569]">{area.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-white">
        <div className={`${t.container} ${t.section}`}>
          <SectionHeader
            eyebrow="Ecosystem"
            title="Software, training, and structured operations can reinforce each other."
            body="The broader Sentry Sound ecosystem is positioned around operational software, learning, enablement, and proprietary process logic."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {ecosystemItems.map((item) => (
              <div key={item.title} className={t.card}>
                <h3 className="text-xl font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#475569]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${t.container} ${t.section}`}>
        <div className="rounded-3xl border border-[#BFDBFE] bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC] p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className={t.eyebrow}>Grounded growth</p>
              <h2 className={`${t.h2} mt-4`}>
                Designed for readiness today and deeper operations later.
              </h2>
              <p className={`${t.body} mt-5`}>
                Sentry Sound can grow toward submission workflows, royalty
                operations, finance, reporting, AI assistance, and enterprise
                oversight without pretending every advanced system is live on day one.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "No fake production metrics",
                "No automatic regulator submission claims",
                "No overpromised royalty automation",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-[#DBEAFE] bg-white px-4 py-3">
                  <LockKeyhole className="h-4 w-4 text-[#2F48F7]" />
                  <span className="text-sm font-semibold text-[#334155]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
