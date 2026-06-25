import { ArrowRight, CheckCircle2, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

import { landingTheme as t } from "../landing-theme";
import { PageHero, SectionHeader } from "../website-components";

const steps = [
  "Start with a low-friction account entry.",
  "Create or choose a workspace.",
  "Add basic workspace profile details.",
  "Enter the operational dashboard quickly.",
  "Use guided setup to activate advanced areas later.",
];

export default function StartPage() {
  return (
    <main>
      <PageHero
        eyebrow="SaaS entry handoff"
        title="Start with a workspace. Configure the rest gradually."
        body="This page bridges the public website and the operational platform. It keeps the handoff simple while deferred activation items such as billing, MFA, and production onboarding are connected later."
      />

      <section className={`${t.container} ${t.section}`}>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr]">
          <SectionHeader
            eyebrow="Entry flow"
            title="Quick entry, guided setup."
            body="The ideal SaaS journey is simple: Start Free Trial, sign in or register, create a workspace, enter the dashboard, then complete guided setup inside the platform."
          />
          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm shadow-slate-200/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2F48F7] text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="font-semibold text-[#334155]">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Link href="/sign-in" className={t.card}>
            <div className={t.iconBox}>
              <UserPlus className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[#0F172A]">Start Free Trial</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Temporary route: use the existing sign-in entry until a dedicated registration/trial flow exists.
            </p>
            <div className="mt-5 inline-flex items-center text-sm font-semibold text-[#2F48F7]">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>

          <Link href="/sign-in" className={t.card}>
            <div className={t.iconBox}>
              <LogIn className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[#0F172A]">Login</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Existing users can enter through the current authentication route.
            </p>
            <div className="mt-5 inline-flex items-center text-sm font-semibold text-[#2F48F7]">
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-5">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#16A34A]" />
            <p className="text-sm font-semibold leading-7 text-[#334155]">
              Deferred activation items remain separate: Clerk email activation, MFA, billing,
              production RBAC, production onboarding gates, invite delivery, and production dashboard metrics.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
