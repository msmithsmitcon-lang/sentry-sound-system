"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export function SignedInUserBadge() {
  const { user, isLoaded } = useUser();
  const displayName =
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    user?.username ||
    "Signed in user";

  if (!isLoaded) {
    return (
      <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm shadow-slate-200/50">
        <div className="h-7 w-7 rounded-full bg-[#EEF2FF]" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#0F172A]">Checking account</p>
          <p className="text-xs font-medium text-[#64748B]">Auth loading</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex items-center justify-center rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-sm font-semibold text-[#2F48F7] transition hover:bg-white"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm shadow-slate-200/50">
      <UserButton afterSignOutUrl="/sign-in" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#0F172A]">{displayName}</p>
        <p className="text-xs font-medium text-[#64748B]">Account</p>
      </div>
    </div>
  );
}
