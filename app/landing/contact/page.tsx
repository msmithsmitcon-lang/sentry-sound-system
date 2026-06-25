import { Building2, HelpCircle, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

import { landingTheme as t } from "../landing-theme";
import { PageHero, SectionHeader } from "../website-components";

const contactOptions = [
  {
    title: "Request demo",
    body: "Walk through the website, product direction, and operational workspace flow.",
    icon: MessageSquare,
  },
  {
    title: "Contact sales",
    body: "Discuss plans, team needs, label/publisher use cases, or enterprise direction.",
    icon: Building2,
  },
  {
    title: "Business inquiries",
    body: "Talk partnerships, ecosystem alignment, training, or broader commercial opportunities.",
    icon: Mail,
  },
  {
    title: "Support contact",
    body: "Use this path later for account, onboarding, workspace, or platform support.",
    icon: HelpCircle,
  },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact / Demo"
        title="Talk to Sentry Sound about your music operations."
        body="Use this page for demo interest, sales conversations, business inquiries, and support direction. Production form handling can connect later."
      />

      <section className={`${t.container} ${t.section}`}>
        <SectionHeader
          eyebrow="Get in touch"
          title="Choose the conversation that fits."
          body="The current website can collect intent visually. A production contact form backend, CRM handoff, and email delivery are deferred activation items."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {contactOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.title} className={t.card}>
                <div className={t.iconBox}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[#0F172A]">{option.title}</h2>
                <p className="mt-3 leading-7 text-[#475569]">{option.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className={t.eyebrow}>Temporary handoff</p>
              <h2 className={`${t.h2} mt-4`}>Ready to enter the product flow?</h2>
              <p className={`${t.body} mt-4`}>
                Start Free Trial currently routes to the SaaS entry handoff. Login uses the existing sign-in route.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/landing/start" className={t.primaryButton}>Start Free Trial</Link>
              <Link href="/sign-in" className={t.secondaryButton}>Login</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
