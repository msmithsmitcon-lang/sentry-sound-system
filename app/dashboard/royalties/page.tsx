"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, Upload } from "lucide-react";

type StatementLine = {
  rawTitle: string;
  rawAmount: number;
  matchedWorkId: string | null;
  matchedWorkTitle: string | null;
  matchStatus: "matched" | "partial" | "unmatched";
  attentionReason: string | null;
};

type Statement = {
  id: string;
  sourceName: string;
  uploadDate: string;
  periodStart: string | null;
  periodEnd: string | null;
  totalAmount: number | null;
  currency: string;
  status: "processing" | "matched" | "needs_attention" | "complete";
  rawFilename: string | null;
  createdAt: string;
};

type StatementSummary = Statement & {
  lineCount: number;
  matchedCount: number;
  partialCount: number;
  unmatchedCount: number;
};

function formatCurrency(amount: number | null, currency: string) {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(amount);
}

function statementStatusLabel(status: Statement["status"]) {
  switch (status) {
    case "processing":
      return "Processing…";
    case "needs_attention":
      return "Needs your attention";
    case "complete":
      return "Complete";
    case "matched":
    default:
      return "All matched";
  }
}

function statementStatusClass(status: Statement["status"]) {
  switch (status) {
    case "needs_attention":
      return "bg-[#FEF3C7] text-[#B45309]";
    case "processing":
      return "bg-[#F1F5F9] text-[#475569]";
    default:
      return "bg-[#DCFCE7] text-[#15803D]";
  }
}

export default function RoyaltiesPage() {
  const [statements, setStatements] = useState<StatementSummary[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeStatement, setActiveStatement] = useState<Statement | null>(null);
  const [activeLines, setActiveLines] = useState<StatementLine[] | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState("SAMRO");

  useEffect(() => {
    loadStatements();
  }, []);

  async function loadStatements() {
    try {
      const response = await fetch("/api/royalties/statements", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? "Failed to load your royalty statements.");
      }
      setStatements(data.statements ?? []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to load your royalty statements.");
    }
  }

  async function openStatement(statementId: string) {
    setLoadingDetail(true);
    setDetailError(null);
    try {
      const response = await fetch(`/api/royalties/statements/${statementId}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? "Failed to load this statement.");
      }
      setActiveStatement(data.statement);
      setActiveLines(data.lines ?? []);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "Failed to load this statement.");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError(null);

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setUploadError("Choose a CSV file first.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("source_name", sourceName);

      const response = await fetch("/api/royalties/statements", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? "We couldn't process that statement.");
      }

      setActiveStatement(data.statement);
      setActiveLines(data.lines ?? []);
      form.reset();
      await loadStatements();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "We couldn't process that statement.");
    } finally {
      setUploading(false);
    }
  }

  const hasStatements = statements !== null && statements.length > 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-10 text-[#0F172A] sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-[#2F48F7]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>

        {statements === null ? (
          <div className="mt-10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#2F48F7]" />
          </div>
        ) : loadError ? (
          <p className="mt-6 text-sm font-semibold text-[#B91C1C]">{loadError}</p>
        ) : !hasStatements ? (
          <EmptyState
            sourceName={sourceName}
            setSourceName={setSourceName}
            uploading={uploading}
            uploadError={uploadError}
            onUpload={handleUpload}
          />
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <UploadCard
                sourceName={sourceName}
                setSourceName={setSourceName}
                uploading={uploading}
                uploadError={uploadError}
                onUpload={handleUpload}
              />

              {loadingDetail ? (
                <div className="flex items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-10">
                  <Loader2 className="h-6 w-6 animate-spin text-[#2F48F7]" />
                </div>
              ) : detailError ? (
                <p className="text-sm font-semibold text-[#B91C1C]">{detailError}</p>
              ) : activeStatement && activeLines ? (
                <StatementDetail statement={activeStatement} lines={activeLines} />
              ) : (
                <p className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-6 text-sm text-[#64748B]">
                  Select a statement below to see what arrived and which songs it matches.
                </p>
              )}
            </div>

            <aside className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                Your statements
              </p>
              {statements.map((statement) => (
                <button
                  key={statement.id}
                  type="button"
                  onClick={() => openStatement(statement.id)}
                  className={`block w-full rounded-2xl border p-4 text-left transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF] ${
                    activeStatement?.id === statement.id ? "border-[#2F48F7] bg-[#EFF6FF]" : "border-[#E5E7EB] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#0F172A]">{statement.sourceName}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statementStatusClass(statement.status)}`}>
                      {statementStatusLabel(statement.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#64748B]">{formatCurrency(statement.totalAmount, statement.currency)}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {statement.matchedCount} matched · {statement.unmatchedCount + statement.partialCount} need attention
                  </p>
                </button>
              ))}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState({
  sourceName,
  setSourceName,
  uploading,
  uploadError,
  onUpload,
}: {
  sourceName: string;
  setSourceName: (value: string) => void;
  uploading: boolean;
  uploadError: string | null;
  onUpload: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="mt-10 rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center shadow-sm shadow-slate-200/60">
      <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">Your royalty income, made clear.</h1>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#64748B]">
        Upload a royalty statement from SAMRO, DistroKid, TuneCore, or any other source. We&apos;ll
        show you exactly what arrived and which songs it relates to.
      </p>

      <UploadForm
        sourceName={sourceName}
        setSourceName={setSourceName}
        uploading={uploading}
        uploadError={uploadError}
        onUpload={onUpload}
        primaryLabel="Upload Your First Statement"
        className="mx-auto mt-8 max-w-md"
      />
    </div>
  );
}

function UploadCard({
  sourceName,
  setSourceName,
  uploading,
  uploadError,
  onUpload,
}: {
  sourceName: string;
  setSourceName: (value: string) => void;
  uploading: boolean;
  uploadError: string | null;
  onUpload: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
      <h2 className="text-lg font-semibold text-[#0F172A]">Upload a new statement</h2>
      <UploadForm
        sourceName={sourceName}
        setSourceName={setSourceName}
        uploading={uploading}
        uploadError={uploadError}
        onUpload={onUpload}
        primaryLabel="Upload Statement"
        className="mt-4"
      />
    </div>
  );
}

function UploadForm({
  sourceName,
  setSourceName,
  uploading,
  uploadError,
  onUpload,
  primaryLabel,
  className,
}: {
  sourceName: string;
  setSourceName: (value: string) => void;
  uploading: boolean;
  uploadError: string | null;
  onUpload: (event: React.FormEvent<HTMLFormElement>) => void;
  primaryLabel: string;
  className?: string;
}) {
  return (
    <form onSubmit={onUpload} className={className}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={sourceName}
          onChange={(event) => setSourceName(event.target.value)}
          className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm font-semibold text-[#334155]"
        >
          <option>SAMRO</option>
          <option>CAPASSO</option>
          <option>SAMPRA</option>
          <option>DistroKid</option>
          <option>TuneCore</option>
          <option>Other</option>
        </select>
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          className="flex-1 rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#334155]"
        />
      </div>
      {uploadError ? <p className="mt-3 text-sm font-semibold text-[#B91C1C]">{uploadError}</p> : null}
      <button
        type="submit"
        disabled={uploading}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F48F7] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-[#2438D6] disabled:opacity-60 sm:w-auto"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? "Processing…" : primaryLabel}
      </button>
    </form>
  );
}

function StatementDetail({ statement, lines }: { statement: Statement; lines: StatementLine[] }) {
  const matchedLines = lines.filter((line) => line.matchStatus === "matched");
  const attentionLines = lines.filter((line) => line.matchStatus !== "matched");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">{statement.sourceName}</p>
            <h2 className="mt-1 text-2xl font-semibold text-[#0F172A]">
              {formatCurrency(statement.totalAmount, statement.currency)}
            </h2>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statementStatusClass(statement.status)}`}>
            {statementStatusLabel(statement.status)}
          </span>
        </div>
        <p className="mt-2 text-sm text-[#64748B]">
          {matchedLines.length} song{matchedLines.length === 1 ? "" : "s"} matched · {attentionLines.length} need
          {attentionLines.length === 1 ? "s" : ""} your attention
        </p>
      </div>

      {attentionLines.length > 0 ? (
        <div className="rounded-2xl border border-[#FEF3C7] bg-[#FFFBEB] p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#B45309]" />
            <h3 className="font-semibold text-[#92400E]">
              {attentionLines.length} item{attentionLines.length === 1 ? "" : "s"} need your attention
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {attentionLines.map((line, index) => (
              <div key={`${line.rawTitle}-${index}`} className="rounded-xl border border-[#FDE68A] bg-white p-4">
                <p className="text-sm font-semibold text-[#0F172A]">
                  {line.rawTitle} — {formatCurrency(line.rawAmount, statement.currency)}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#92400E]">{line.attentionReason}</p>
                <Link
                  href="/dashboard/works/list"
                  className="mt-2 inline-flex items-center text-sm font-semibold text-[#2F48F7]"
                >
                  Review →
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {matchedLines.length > 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#15803D]" />
            <h3 className="font-semibold text-[#0F172A]">Matched to your songs</h3>
          </div>
          <div className="mt-4 space-y-2">
            {matchedLines.map((line, index) => (
              <div key={`${line.rawTitle}-${index}`} className="rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] p-4">
                <p className="text-sm font-semibold text-[#0F172A]">
                  {line.matchedWorkTitle ?? line.rawTitle} — {formatCurrency(line.rawAmount, statement.currency)} from{" "}
                  {statement.sourceName}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
