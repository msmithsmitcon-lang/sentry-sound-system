import {
  Activity,
  BarChart3,
  ClipboardCheck,
  FileCheck2,
  FolderOpen,
  Music2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { landingTheme as t } from "../landing-theme";
import { CtaBand, PageHero, SectionHeader } from "../website-components";

const capabilities = [
  ["Songs and works", "Capture and organize the music assets your team needs to prepare.", Music2],
  ["Contributors and splits", "Keep contributor roles, identity details, and split totals visible.", Users],
  ["Files and evidence", "Classify files, agreements, artwork, and evidence-like assets around the work they support.", FileCheck2],
  ["Readiness and blockers", "See what is complete, missing, blocked, or ready for review.", ClipboardCheck],
  ["Submission preparation", "Prepare for structured rights and submission workflows without guessing readiness.", ShieldCheck],
  ["Dashboard visibility", "Bring operational summaries, quick actions, and next steps into one clear view.", Activity],
  ["Activity and accountability", "Keep recent activity and responsibility visible as work moves forward.", FolderOpen],
  ["Future finance and reporting", "Build toward royalty, finance, reports, and enterprise oversight over time.", BarChart3],
] as const;

export default function PlatformPage() {
  return (
    <main>
      <PageHero
        eyebrow="Platform"
        title="One workspace for the work around the music."
        body="Sentry Sound brings songs, contributors, splits, files, evidence, workflow status, activity, and next steps into one practical operating layer."
      />

      <section className={`${t.container} ${t.section}`}>
        <SectionHeader
          eyebrow="Capabilities"
          title="Built around visibility, readiness, and organized progress."
          body="The platform is designed to help teams understand operational state without drowning them in technical or legal complexity."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(([title, body, Icon]) => (
            <div key={title} className={t.softCard}>
              <div className={t.iconBox}>
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-[#0F172A]">{title}</h2>
              <p className="mt-3 leading-7 text-[#475569]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-white">
        <div className={`${t.container} ${t.section}`}>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1fr]">
            <SectionHeader
              eyebrow="Boundaries"
              title="Grounded claims, clear future direction."
              body="Sentry Sound can explain submission preparation, readiness visibility, and future finance operations without pretending automatic regulator submission or royalty collection is already live."
            />
            <div className="grid gap-4">
              {[
                "Safe now: organize, track, prepare, and clarify.",
                "Future direction: structured submissions, deeper finance, reporting, and enterprise oversight.",
                "Not claimed: automatic regulator filing, guaranteed royalties, or legal ownership verification.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-5 font-semibold text-[#334155]">
                  {item}
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
