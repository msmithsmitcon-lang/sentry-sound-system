import { Activity, AlertTriangle, Brain, ClipboardCheck, Eye, ListChecks } from "lucide-react";

import { landingTheme as t } from "../landing-theme";
import { CtaBand, PageHero, SectionHeader } from "../website-components";

const intelligence = [
  ["Readiness awareness", "Track whether work appears complete, missing information, blocked, or ready for review.", ClipboardCheck],
  ["Blocked item visibility", "Bring problems to the surface instead of hiding them inside scattered admin.", AlertTriangle],
  ["Workflow tracking", "Keep progress, activity, and next steps visible as operational work moves forward.", Activity],
  ["Centralized activity", "Help teams understand what changed, who acted, and what needs attention next.", Eye],
  ["Guided next steps", "Use clear status and practical signals to guide users without overwhelming them.", ListChecks],
  ["Future assistance", "Support future AI-assisted guidance without pretending the system makes rights decisions.", Brain],
] as const;

export default function TechnologyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Technology & Intelligence"
        title="Intelligent does not need to mean magical."
        body="Sentry Sound is designed to make operational state visible: readiness, gaps, blockers, activity, and next steps. The platform should feel aware, practical, and grounded."
      />

      <section className={`${t.container} ${t.section}`}>
        <SectionHeader
          eyebrow="Operational intelligence"
          title="Clear signals for practical decisions."
          body="The platform should help teams decide what needs attention without using technical language or overpromising automation."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {intelligence.map(([title, body, Icon]) => (
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
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
            <SectionHeader
              eyebrow="Grounded AI boundary"
              title="Assistive guidance, not invented truth."
              body="Future intelligent support should explain status, help users understand gaps, and guide next steps. It must not invent submissions, ownership, evidence verification, or royalty outcomes."
            />
            <div className="grid gap-4">
              {[
                "Good claim: helps surface missing information.",
                "Good claim: supports workflow visibility.",
                "Avoid: AI automatically solves rights ownership.",
                "Avoid: automatic regulator filing or royalty recovery.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 font-semibold text-[#334155]">
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
