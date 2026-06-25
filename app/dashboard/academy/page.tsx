import {
  ArrowRight,
  Banknote,
  CalendarRange,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

const learningPaths = [
  {
    title: "Protect your first song",
    description:
      "Learn how to register your song and generate your proof-of-creation certificate.",
    href: "/dashboard/works/song-capture-v2",
    status: "available" as const,
    icon: ShieldCheck,
  },
  {
    title: "Understand splits and collaborators",
    description:
      "Make sure every contributor is credited and every share is documented before your song is released.",
    href: "/dashboard/works/list",
    status: "available" as const,
    icon: Users,
  },
  {
    title: "Prepare your SAMRO/CAPASSO/SAMPRA pack",
    description:
      "Generate the official registration files you need to start collecting your royalties.",
    href: "/dashboard/works/list",
    status: "available" as const,
    icon: ShieldCheck,
  },
  {
    title: "Read your royalty status",
    description:
      "Understand where your money comes from and how to track what you are owed.",
    href: "/dashboard/royalties",
    status: "coming-soon" as const,
    icon: Banknote,
  },
  {
    title: "Build your release plan",
    description:
      "Plan your release properly — from distribution to marketing to commercial launch.",
    href: "/dashboard/releases",
    status: "coming-soon" as const,
    icon: CalendarRange,
  },
];

function LearningPathCard({ path }: { path: (typeof learningPaths)[number] }) {
  const Icon = path.icon;
  const isAvailable = path.status === "available";

  const card = (
    <div
      className={`flex h-full flex-col rounded-2xl border p-5 shadow-sm shadow-slate-200/60 transition ${
        isAvailable
          ? "border-[#E5E7EB] bg-white hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
          : "border-[#E5E7EB] bg-[#F8FAFC] opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F48F7]">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            isAvailable ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#F1F5F9] text-[#475569]"
          }`}
        >
          {isAvailable ? "Available now" : "Coming soon"}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-[#0F172A]">{path.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-[#64748B]">{path.description}</p>

      {isAvailable ? (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2F48F7]">
          Start learning
          <ArrowRight className="h-4 w-4" />
        </span>
      ) : null}
    </div>
  );

  if (!isAvailable) {
    return <div className="cursor-default">{card}</div>;
  }

  return (
    <Link href={path.href} className="block h-full">
      {card}
    </Link>
  );
}

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-10 text-[#0F172A] sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-[#2F48F7]">
          <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          Back to dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
          Learn how to manage your music business.
        </h1>
        <p className="mt-3 text-base leading-7 text-[#64748B]">
          Practical guides built for South African independent artists.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path) => (
            <LearningPathCard key={path.title} path={path} />
          ))}
        </div>
      </div>
    </main>
  );
}
