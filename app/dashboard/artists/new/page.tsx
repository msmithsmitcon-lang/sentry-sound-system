"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  Circle,
  CreditCard,
  FileText,
  Globe2,
  ImageIcon,
  LinkIcon,
  LockKeyhole,
  Mail,
  Mic2,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";

const artistTypes = ["Solo artist", "Group", "Band", "DJ", "Producer", "Composer", "Label"];
const countries = ["South Africa", "Nigeria", "United States", "United Kingdom", "Other"];
const languages = ["English", "Afrikaans", "isiZulu", "Sesotho", "Instrumental", "Multiple languages", "Other"];
const genres = ["Afrobeats", "Amapiano", "Hip Hop", "House", "R&B", "Pop", "Gospel", "Other"];
const accountTypes = ["Unknown", "Cheque / Current", "Savings", "Business", "Transmission", "Other"];

const onboardingSteps = [
  { label: "Identity", complete: true },
  { label: "Contact", complete: true },
  { label: "Rights", complete: false },
  { label: "Business", complete: false },
  { label: "Review", complete: false },
];

const publicItems = ["Bio", "Stage name", "Social links", "Approved profile image", "Genre"];
const privateItems = ["Legal name", "Contracts", "Banking", "IDs", "Tax", "Evidence"];

export default function NewArtistPage() {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedArtist, setSavedArtist] = useState<{ artistProfileId: string; crmContactId: string } | null>(null);

  async function saveArtist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = submitter?.value === "create" ? "create" : "draft";
    const formData = new FormData(form);

    setSaving(true);
    setSaveError(null);
    setSavedArtist(null);

    try {
      const response = await fetch("/api/artists/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          artistName: formData.get("artistName"),
          legalName: formData.get("legalName"),
          stageName: formData.get("stageName"),
          artistType: formData.get("artistType"),
          country: formData.get("country"),
          primaryLanguage: formData.get("primaryLanguage"),
          genre: formData.get("genre"),
          bioSummary: formData.get("bioSummary"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          whatsapp: formData.get("whatsapp"),
          website: formData.get("website"),
          instagram: formData.get("instagram"),
          facebook: formData.get("facebook"),
          youtube: formData.get("youtube"),
          tiktok: formData.get("tiktok"),
          twitter: formData.get("twitter"),
          soundcloud: formData.get("soundcloud"),
          otherLink: formData.get("otherLink"),
          proSociety: formData.get("proSociety"),
          ipiNumber: formData.get("ipiNumber"),
          publisher: formData.get("publisher"),
          ownershipStatus: formData.get("ownershipStatus"),
          copyrightStatus: formData.get("copyrightStatus"),
          splitAgreementStatus: formData.get("splitAgreementStatus"),
          artistStatus: formData.get("artistStatus"),
          onboardingStage: formData.get("onboardingStage"),
          verificationStatus: formData.get("verificationStatus"),
          readinessScore: formData.get("readinessScore"),
          contractStatus: formData.get("contractStatus"),
          bankingExists: formData.get("bankingExists"),
          bankingDetailsCaptured: formData.get("bankingDetailsCaptured"),
          accountHolderName: formData.get("accountHolderName"),
          bankName: formData.get("bankName"),
          accountType: formData.get("accountType"),
          accountNumber: formData.get("accountNumber"),
          branchCode: formData.get("branchCode"),
          swiftBic: formData.get("swiftBic"),
          paymentNotes: formData.get("paymentNotes"),
          taxRegistered: formData.get("taxRegistered"),
          vatStatus: formData.get("vatStatus"),
          managementContact: formData.get("managementContact"),
          labelAffiliation: formData.get("labelAffiliation"),
          internalNotes: formData.get("internalNotes"),
        }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        artistProfileId?: string;
        crmContactId?: string;
        error?: string;
      };

      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? "Failed to save artist profile.");
      }

      if (data.artistProfileId && data.crmContactId) {
        setSavedArtist({
          artistProfileId: data.artistProfileId,
          crmContactId: data.crmContactId,
        });
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save artist profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <form onSubmit={saveArtist}>
      <div className="mx-auto grid max-w-[1680px] gap-6 px-5 py-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-sm text-[#64748B]">
            <Link href="/dashboard" className="inline-flex items-center font-semibold text-[#334155]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#111827]">New Artist</span>
          </div>

          <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
                    <Mic2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4F46E5]">
                      Artist Operations
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight">Create Artist Profile</h1>
                  </div>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-[#64748B]">
                  Capture the artist as an operational commercial entity: identity, contact channels, rights posture,
                  business readiness, and public/private boundaries.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  name="intent"
                  value="draft"
                  disabled={saving}
                  className="inline-flex items-center rounded-lg border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-semibold text-[#334155] shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Draft"}
                </button>
                <button
                  type="submit"
                  name="intent"
                  value="create"
                  disabled={saving}
                  className="inline-flex items-center rounded-lg bg-[#4F46E5] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Create Artist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-6">
              {["Basic Information", "Contact & Social", "Rights & Publishing", "Business & Legal", "Additional Details", "Review & Save"].map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0 ? "bg-[#4F46E5] text-white" : "bg-[#F1F5F9] text-[#334155]"
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-semibold">{step}</span>
                </div>
              ))}
            </div>
            {saveError ? (
              <div className="mt-5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#B91C1C]">
                {saveError}
              </div>
            ) : null}
            {savedArtist ? (
              <div className="mt-5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]">
                <p className="font-semibold">Artist profile saved.</p>
                <p className="mt-1">
                  Artist profile ID: <span className="font-mono">{savedArtist.artistProfileId}</span>
                </p>
              </div>
            ) : null}
          </section>

          <section className="grid gap-6 2xl:grid-cols-[1fr_0.9fr]">
            <FormCard icon={UserRound} title="Basic Information" body="Core artist identity and public-facing profile context.">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField name="artistName" label="Artist name" defaultValue="M-WIS" required />
                <TextField name="stageName" label="Stage name" defaultValue="M-WIS" />
                <TextField name="legalName" label="Legal name" placeholder="Private legal name" />
                <SelectField name="artistType" label="Artist type" value="Solo artist" options={artistTypes} />
                <SelectField name="country" label="Country" value="South Africa" options={countries} />
                <SelectField name="primaryLanguage" label="Primary language" value="English" options={languages} />
                <SelectField name="genre" label="Genre" value="Afrobeats" options={genres} />
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4">
                  <div className="flex h-24 items-center justify-center rounded-lg bg-white text-[#94A3B8]">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">Profile image placeholder</p>
                  <p className="mt-1 text-xs text-[#64748B]">Public use requires approval later.</p>
                </div>
                <label className="md:col-span-2">
                  <span className="text-xs font-semibold text-[#334155]">Bio summary</span>
                  <textarea
                    name="bioSummary"
                    defaultValue="Independent artist building an Afrobeats catalogue with a cinematic, emotionally direct sound."
                    rows={4}
                    className="mt-2 w-full resize-none rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-sm leading-6 outline-none"
                  />
                </label>
              </div>
            </FormCard>

            <FormCard icon={Mail} title="Contact & Social" body="Working channels and public links. Communication timeline comes later.">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField name="email" label="Email" defaultValue="artist@example.com" icon={Mail} />
                <TextField name="phone" label="Phone" placeholder="+27..." icon={Phone} />
                <TextField name="whatsapp" label="WhatsApp" placeholder="+27..." icon={Phone} />
                <TextField name="website" label="Website" placeholder="https://..." icon={Globe2} />
                <TextField name="instagram" label="Instagram" placeholder="@artist" icon={LinkIcon} />
                <TextField name="facebook" label="Facebook" placeholder="Page URL" icon={LinkIcon} />
                <TextField name="youtube" label="YouTube" placeholder="Channel URL" icon={LinkIcon} />
                <TextField name="tiktok" label="TikTok" placeholder="@artist" icon={LinkIcon} />
                <TextField name="twitter" label="X / Twitter" placeholder="@artist" icon={LinkIcon} />
                <TextField name="soundcloud" label="SoundCloud" placeholder="Profile URL" icon={LinkIcon} />
                <TextField name="otherLink" label="Other link" placeholder="Additional public or work link" icon={LinkIcon} className="md:col-span-2" />
              </div>
            </FormCard>
          </section>

          <section className="grid gap-6 2xl:grid-cols-2">
            <FormCard icon={BookOpen} title="Rights & Publishing" body="Reference posture for society, publishing, ownership, and split readiness.">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField name="proSociety" label="PRO / society" placeholder="SAMRO, CAPASSO, ASCAP..." />
                <TextField name="ipiNumber" label="IPI number" placeholder="Optional identifier" />
                <TextField name="publisher" label="Publisher" placeholder="Publisher or self-published" />
                <SelectField name="ownershipStatus" label="Ownership status" value="Unknown / needs review" options={["Unknown / needs review", "Self-owned", "Publisher involved", "Label involved"]} />
                <SelectField name="copyrightStatus" label="Copyright status" value="Draft / not reviewed" options={["Draft / not reviewed", "Clear", "Needs review", "Disputed"]} />
                <SelectField name="splitAgreementStatus" label="Split agreement status" value="Not captured" options={["Not captured", "Draft exists", "Signed", "Needs review"]} />
              </div>
            </FormCard>

            <FormCard icon={Building2} title="Business & Legal" body="Private readiness signals for operating professionally.">
              <div className="grid gap-4 md:grid-cols-2">
                <ToggleField name="taxRegistered" label="Tax registered?" />
                <SelectField name="vatStatus" label="VAT status" value="Not registered" options={["Not registered", "Registered", "Unknown"]} />
                <TextField name="managementContact" label="Management contact" placeholder="Manager or representative" />
                <TextField name="labelAffiliation" label="Label affiliation" placeholder="Independent, label, distributor..." />
                <SelectField name="contractStatus" label="Contract status" value="No active contract captured" options={["No active contract captured", "Draft contract", "Signed contract", "Needs review"]} />
              </div>
            </FormCard>
          </section>

          <section className="grid gap-6 2xl:grid-cols-2">
            <FormCard icon={CreditCard} title="Banking Details" body="Private workspace information. Never shown publicly.">
              <div className="mb-4 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm font-semibold text-[#92400E]">
                Private workspace information. Never shown publicly.
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SelectField name="bankingDetailsCaptured" label="Banking details captured?" value="No" options={["No", "Yes"]} />
                <TextField name="accountHolderName" label="Account holder name" placeholder="Private account holder name" />
                <TextField name="bankName" label="Bank name" placeholder="Bank or financial institution" />
                <SelectField name="accountType" label="Account type" value="Unknown" options={accountTypes} />
                <TextField name="accountNumber" label="Account number" placeholder="Private account number" />
                <TextField name="branchCode" label="Branch code" placeholder="Branch or routing code" />
                <TextField name="swiftBic" label="SWIFT / BIC optional" placeholder="Optional international code" />
                <TextField name="paymentNotes" label="Payment notes optional" placeholder="Internal payout notes" />
              </div>
            </FormCard>

            <FormCard icon={ShieldCheck} title="Operational Status" body="Internal onboarding state. These values are operational guidance, not public claims.">
              <div className="grid gap-4 md:grid-cols-2">
                <SelectField name="artistStatus" label="Artist status" value="Draft" options={["Draft", "Onboarding", "Active", "Inactive", "Archived"]} />
                <SelectField name="onboardingStage" label="Onboarding stage" value="Identity started" options={["Identity started", "Contact captured", "Rights review", "Business review", "Ready for review"]} />
                <SelectField name="verificationStatus" label="Verification status" value="Unverified" options={["Unverified", "Pending", "Verified later", "Rejected"]} />
                <TextField name="readinessScore" label="Readiness score" defaultValue="42%" />
              </div>
            </FormCard>

            <FormCard icon={FileText} title="Additional Details" body="Working notes for support and internal review.">
              <label>
                <span className="text-xs font-semibold text-[#334155]">Internal notes</span>
                <textarea
                  name="internalNotes"
                  placeholder="Anything the workspace should remember before review..."
                  rows={6}
                  className="mt-2 w-full resize-none rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-sm leading-6 outline-none"
                />
              </label>
            </FormCard>
          </section>
        </section>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <RailCard title="Artist Summary" icon={Mic2}>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#F97316] to-[#111827] text-lg font-bold text-white">
                MW
              </div>
              <div>
                <p className="font-semibold">M-WIS</p>
                <p className="mt-1 text-sm text-[#64748B]">Solo artist / Afrobeats</p>
                <span className="mt-2 inline-flex rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-semibold text-[#4F46E5]">
                  Draft
                </span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <SummaryTile label="Country" value="South Africa" />
              <SummaryTile label="Language" value="English" />
              <SummaryTile label="Verification" value="Unverified" />
              <SummaryTile label="Readiness" value="42%" />
            </div>
          </RailCard>

          <RailCard title="Onboarding Progress" icon={BadgeCheck}>
            <div className="mt-5 space-y-4">
              {onboardingSteps.map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  {step.complete ? (
                    <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />
                  ) : (
                    <Circle className="h-5 w-5 text-[#94A3B8]" />
                  )}
                  <span className="text-sm font-semibold text-[#334155]">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
              <div className="h-full w-[40%] rounded-full bg-[#4F46E5]" />
            </div>
          </RailCard>

          <RailCard title="Visibility & Privacy" icon={LockKeyhole}>
            <div className="mt-5 grid gap-4">
              <BoundaryList title="Public-safe later" items={publicItems} tone="public" />
              <BoundaryList title="Private workspace only" items={privateItems} tone="private" />
            </div>
          </RailCard>

          <section className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-[#4F46E5]" />
              <div>
                <p className="font-semibold">Backend alignment</p>
                <p className="mt-2 text-sm leading-6 text-[#475569]">
                  Existing CRM and artist profile tables are reused for V1 persistence. Public profile publishing and deeper relationship workflows remain separate.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
      </form>
    </main>
  );
}

function FormCard({
  icon: Icon,
  title,
  body,
  children,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[#64748B]">{body}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  placeholder,
  required = false,
  icon: Icon,
  className = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs font-semibold text-[#334155]">
        {label}
        {required ? <span className="text-[#EF4444]"> *</span> : null}
      </span>
      <div className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-[#CBD5E1] bg-white px-3">
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-[#64748B]" /> : null}
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#94A3B8]"
        />
      </div>
    </label>
  );
}

function SelectField({ name, label, value, options }: { name: string; label: string; value: string; options: string[] }) {
  return (
    <label>
      <span className="text-xs font-semibold text-[#334155]">{label}</span>
      <div className="relative mt-2">
        <select
          name={name}
          defaultValue={value}
          className="h-11 w-full appearance-none rounded-lg border border-[#CBD5E1] bg-white px-3 pr-9 text-sm outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[#64748B]" />
      </div>
    </label>
  );
}

function ToggleField({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex h-11 items-center justify-between rounded-lg border border-[#CBD5E1] bg-white px-3">
      <span className="text-sm font-semibold text-[#334155]">{label}</span>
      <input name={name} type="checkbox" value="true" className="peer sr-only" />
      <span className="flex h-6 w-11 items-center rounded-full bg-[#E2E8F0] p-1 transition peer-checked:bg-[#4F46E5]">
        <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
      </span>
    </label>
  );
}

function RailCard({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3">
      <p className="text-xs font-semibold text-[#64748B]">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function BoundaryList({ title, items, tone }: { title: string; items: string[]; tone: "public" | "private" }) {
  const toneClass = tone === "public" ? "bg-[#F0FDF4] text-[#15803D]" : "bg-[#FEF2F2] text-[#B91C1C]";

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
      <p className="font-semibold">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
