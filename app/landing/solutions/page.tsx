import { Building2, Headphones, Mic2, ShieldCheck, Users } from "lucide-react";

import { landingTheme as t } from "../landing-theme";
import { CtaBand, PageHero, SectionHeader } from "../website-components";

const solutions = [
  {
    title: "Artists & Producers",
    problem: "Songs, files, collaborators, and admin often live in separate places.",
    help: "Sentry Sound helps organize song context, contributors, files, evidence, and progress in one workspace.",
    icon: Mic2,
  },
  {
    title: "Labels & Publishers",
    problem: "Catalogue operations need clearer visibility across works, contributors, evidence, and readiness.",
    help: "Teams can build a more structured operating layer for catalogue work and internal coordination.",
    icon: Building2,
  },
  {
    title: "Rights Administrators",
    problem: "Missing information and unclear readiness slow down structured rights and submission workflows.",
    help: "Sentry Sound helps identify gaps, blockers, and preparation needs before work moves forward.",
    icon: ShieldCheck,
  },
  {
    title: "Studios & Teams",
    problem: "Project files, song context, contributors, and next steps can become hard to follow.",
    help: "The workspace keeps operational context closer to the music work it supports.",
    icon: Headphones,
  },
  {
    title: "Enterprise Operations",
    problem: "Larger operations need governance, reporting, controlled access, and repeatable workflow visibility.",
    help: "Sentry Sound is designed to grow toward oversight, reporting, and scalable operational control.",
    icon: Users,
  },
];

export default function SolutionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Solutions"
        title="Built for the people and teams behind music operations."
        body="Sentry Sound speaks to creators and operational teams who need clarity around songs, contributors, files, evidence, readiness, and next steps."
      />

      <section className={`${t.container} ${t.section}`}>
        <SectionHeader
          eyebrow="Service offerings"
          title="Different teams, one shared need: operational clarity."
          body="Each audience has different responsibilities, but the same underlying problem: work slows down when the important details are scattered."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {solutions.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={t.card}>
                <div className={t.iconBox}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[#0F172A]">{item.title}</h2>
                <div className="mt-4 grid gap-3">
                  <p className="leading-7 text-[#475569]">
                    <span className="font-semibold text-[#0F172A]">Problem: </span>
                    {item.problem}
                  </p>
                  <p className="leading-7 text-[#475569]">
                    <span className="font-semibold text-[#0F172A]">How Sentry Sound helps: </span>
                    {item.help}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
