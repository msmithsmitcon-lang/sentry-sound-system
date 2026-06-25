import { Compass, FileText, ListChecks } from "lucide-react";

import { landingTheme as t } from "../landing-theme";
import { CtaBand, PageHero, SectionHeader } from "../website-components";

const principles = [
  {
    title: "Clarity before complexity",
    body: "Music teams should be able to see what exists, what is missing, and what needs attention before they are forced into advanced setup.",
    icon: Compass,
  },
  {
    title: "Operational truth over decoration",
    body: "The product should show real workflow state and practical next steps, not fake dashboard status or empty metrics.",
    icon: ListChecks,
  },
  {
    title: "Structure for the work behind the music",
    body: "Songs, contributors, splits, files, evidence, and activity all need a clearer operating layer.",
    icon: FileText,
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About Sentry Sound"
        title="Music operations should not depend on scattered files and memory."
        body="Sentry Sound exists to bring structure, visibility, and operational confidence to the work behind music rights, submissions, evidence, and future royalty operations."
      />

      <section className={`${t.container} ${t.section}`}>
        <SectionHeader
          eyebrow="Why it exists"
          title="The industry problem is practical, not abstract."
          body="Music operations often happen across spreadsheets, folders, messages, email threads, shared drives, and disconnected systems. That makes it hard to know what is complete, what is missing, what is blocked, and what can happen next."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={t.card}>
                <div className={t.iconBox}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[#0F172A]">{item.title}</h2>
                <p className="mt-3 leading-7 text-[#475569]">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-white">
        <div className={`${t.container} ${t.section}`}>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
            <SectionHeader
              eyebrow="Operational philosophy"
              title="Enter fast, configure gradually, guide continuously."
              body="Sentry Sound follows a practical SaaS philosophy: help users get into a workspace quickly, then guide setup and operations step by step."
            />
            <div className="grid gap-4">
              {[
                "Make status visible.",
                "Show blockers in plain language.",
                "Keep setup progressive.",
                "Avoid fake readiness or fake production claims.",
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
