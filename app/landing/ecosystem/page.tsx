import { BookOpen, Boxes, GraduationCap } from "lucide-react";

import { landingTheme as t } from "../landing-theme";
import { CtaBand, PageHero, SectionHeader } from "../website-components";

const ecosystem = [
  {
    title: "Plexicon",
    body: "Strategic operational logic and structured systems thinking that can support future platform intelligence and process design.",
    icon: Boxes,
  },
  {
    title: "Sentry Sound Academy",
    body: "Training, enablement, and industry education aligned with the platform's operational approach.",
    icon: GraduationCap,
  },
  {
    title: "StudyEdge",
    body: "Structured learning and support systems that can inform broader education and onboarding experiences.",
    icon: BookOpen,
  },
];

export default function EcosystemPage() {
  return (
    <main>
      <PageHero
        eyebrow="Ecosystem"
        title="A broader operating system for software, learning, and enablement."
        body="Sentry Sound is positioned as more than a single product page. The wider ecosystem connects operational software, structured learning, training, and proprietary process logic."
      />

      <section className={`${t.container} ${t.section}`}>
        <SectionHeader
          eyebrow="Strategic connections"
          title="The ecosystem strengthens the platform direction."
          body="Each part supports a practical commercial goal: clearer operations, better training, stronger enablement, and more structured ways of working."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ecosystem.map((item) => {
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
          <div className="rounded-3xl border border-[#DBEAFE] bg-[#EFF6FF] p-8 md:p-10">
            <p className={t.eyebrow}>Commercially grounded</p>
            <h2 className={`${t.h2} mt-4 max-w-4xl`}>
              The ecosystem should create trust, not confusion.
            </h2>
            <p className={`${t.body} mt-5 max-w-3xl`}>
              The website should explain how the ecosystem supports operations and education without turning the message into a vague conglomerate story.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
