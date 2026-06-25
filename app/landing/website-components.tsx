import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { landingTheme as t } from "./landing-theme";

export const websiteNavItems = [
  { label: "About", href: "/landing/about" },
  { label: "Platform", href: "/landing/platform" },
  { label: "Solutions", href: "/landing/solutions" },
  { label: "Intelligence", href: "/landing/technology" },
  { label: "Ecosystem", href: "/landing/ecosystem" },
  { label: "Pricing", href: "/landing/pricing" },
  { label: "Contact", href: "/landing/contact" },
] as const;

export function WebsiteShell({ children }: { children: ReactNode }) {
  return (
    <div className={t.page}>
      <WebsiteHeader />
      {children}
      <WebsiteFooter />
    </div>
  );
}

export function WebsiteHeader() {
  return (
    <header className={t.header}>
      <div className={`${t.container} flex items-center justify-between py-4`}>
        <Link href="/landing" className="flex items-center gap-3" aria-label="Sentry Sound home">
          <Image src="/logo.png" alt="Sentry Sound" width={170} height={56} className="h-11 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-[#475569] lg:flex">
          {websiteNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#2F48F7]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden text-sm font-semibold text-[#475569] transition hover:text-[#2F48F7] sm:inline-flex">
            Login
          </Link>
          <Link href="/landing/start" className={t.primaryButton}>
            Start Free Trial
          </Link>
        </div>
      </div>
    </header>
  );
}

export function WebsiteFooter() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.1fr_1fr]">
        <div>
          <Image src="/logo.png" alt="Sentry Sound" width={155} height={52} className="h-10 w-auto" />
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#64748B]">
            The platform that keeps music operations organized. Built for practical clarity across songs,
            contributors, files, evidence, workflow status, and future operational expansion.
          </p>
        </div>
        <div className="grid gap-3 text-sm font-semibold text-[#475569] sm:grid-cols-2">
          {websiteNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#2F48F7]">
              {item.label}
            </Link>
          ))}
          <Link href="/sign-in" className="transition hover:text-[#2F48F7]">
            Login
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-3 border-t border-[#E5E7EB] pt-6 text-sm text-[#64748B] md:flex-row">
        <p>Copyright 2026 Sentry Sound Platform.</p>
        <p>Website layer only. Production billing and automation are deferred.</p>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#2F48F7]/10 via-[#60A5FA]/10 to-transparent" />
      <div className={`${t.container} relative py-16 md:py-20`}>
        <div className="max-w-4xl">
          <div className={t.badge}>{eyebrow}</div>
          <h1 className={`${t.h1} mt-6`}>{title}</h1>
          <p className={`${t.body} mt-6 max-w-3xl`}>{body}</p>
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className={t.eyebrow}>{eyebrow}</p>
      <h2 className={`${t.h2} mt-4`}>{title}</h2>
      {body ? <p className={`${t.body} mt-5`}>{body}</p> : null}
    </div>
  );
}

export function CtaBand({
  title = "Bring your music operations into one clear place.",
  body = "Start fast, set up the workspace, and let the product guide the next steps as your catalogue, files, contributors, and workflows grow.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-[#0F172A] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#93C5FD]">Start with a workspace</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#CBD5E1] md:text-lg">{body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/landing/start" className={t.primaryButton}>
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/landing/pricing" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
            View Plans
          </Link>
        </div>
      </div>
    </section>
  );
}
