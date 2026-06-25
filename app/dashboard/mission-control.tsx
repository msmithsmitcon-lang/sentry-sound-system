import { ArrowRight, FileCheck2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const promises = [
  { icon: ShieldCheck, text: "Your song gets an official protected record" },
  { icon: Sparkles, text: "Your contributors and splits are documented" },
  { icon: Lock, text: "Your files are stored with proof of creation" },
  { icon: FileCheck2, text: "You receive a SAMRO/CAPASSO/SAMPRA submission pack" },
  { icon: ArrowRight, text: "You get a shareable proof-of-collaboration certificate" },
] as const;

export function MissionControlWelcome({ firstName }: { firstName: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-6 py-16 text-[#0F172A]">
      <div className="mb-10">
        <Image src="/logo.png" alt="Sentry Sound" width={180} height={60} className="h-12 w-auto" priority />
      </div>

      <div className="w-full max-w-xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
          Welcome to your music business, {firstName}.
        </h1>
        <p className="mt-4 text-lg leading-7 text-[#475569]">
          We&apos;ll help you organise, protect, and manage your music professionally.
        </p>
        <p className="mt-2 text-sm font-semibold text-[#64748B]">
          Your first project takes about 15 minutes.
        </p>

        <Link
          href="/dashboard/works/song-capture-v2"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F48F7] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-[#2438D6]"
        >
          Start My First Music Project
          <ArrowRight className="h-5 w-5" />
        </Link>

        <div className="mt-10 border-t border-[#E2E8F0] pt-8 text-left">
          <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
            What happens when you create a project
          </p>
          <ul className="space-y-3">
            {promises.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm leading-6 text-[#334155]">
                <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#16A34A]" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/dashboard/works/new"
          className="mt-8 inline-block text-sm font-semibold text-[#64748B] underline-offset-4 hover:text-[#2F48F7] hover:underline"
        >
          Already have songs? Import existing work →
        </Link>
      </div>
    </main>
  );
}
