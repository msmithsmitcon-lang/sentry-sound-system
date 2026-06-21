import { CheckCircle2, Crown, FolderOpen, Sparkles } from "lucide-react";
import Link from "next/link";

import { landingTheme as t } from "../landing-theme";
import { CtaBand, PageHero, SectionHeader } from "../website-components";

const plans = [
  {
    name: "Artist Starter",
    note: "For getting songs, contributors, files, and readiness organized.",
    icon: FolderOpen,
    features: ["Workspace setup", "Song and contributor organization", "File and evidence visibility"],
  },
  {
    name: "Artist Pro",
    note: "For growing catalogues and stronger operational visibility.",
    icon: Sparkles,
    features: ["More active work capacity", "Readiness and blocker visibility", "Team workflow direction"],
  },
  {
    name: "Label / Publisher",
    note: "For larger catalogues, teams, reporting needs, and operational oversight.",
    icon: Crown,
    features: ["Catalogue operations", "Team coordination", "Governance and reporting direction"],
  },
];

export default function PricingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Pricing & Plans"
        title="Start small, scale the workspace as operations grow."
        body="Plans should support the way different music teams operate. Billing is deferred for now, so this page presents the commercial direction without claiming active payment processing."
      />

      <section className={`${t.container} ${t.section}`}>
        <SectionHeader
          eyebrow="Plan direction"
          title="Useful at lower tiers, stronger at operational scale."
          body="Sentry Sound should not unlock arbitrary extra buttons. Higher tiers should justify price through scale, governance, collaboration, reporting, and operational control."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.name} className={t.card}>
                <div className={t.iconBox}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[#0F172A]">{plan.name}</h2>
                <p className="mt-3 leading-7 text-[#475569]">{plan.note}</p>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex gap-3 text-sm font-semibold text-[#334155]">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-5 text-sm font-semibold leading-7 text-[#334155]">
          Real billing and payment provider integration are deferred. Start Free Trial currently hands off to the SaaS entry route.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/landing/start" className={t.primaryButton}>Start Free Trial</Link>
          <Link href="/landing/contact" className={t.secondaryButton}>Request Demo</Link>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
