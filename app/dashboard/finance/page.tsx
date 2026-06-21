"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CircleDollarSign,
  CreditCard,
  FileText,
  Gauge,
  Loader2,
  Plus,
  Receipt,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  financeCommitmentDomainOptions,
  financeCommitmentNatures,
  financeCommitmentRiskLevels,
} from "@/lib/finance-v1/workspace-finance.types";

type FinanceSummary = {
  income_total: number;
  expense_total: number;
  receivables_total: number;
  payables_total: number;
  commitments_total: number;
  net_position: number;
  currency: string;
};

type FinanceAccount = {
  id: string;
  account_name: string;
  account_type: string;
  currency: string;
  current_balance: number;
};

type FinanceCategory = {
  id: string;
  name: string;
  category_type: "income" | "expense" | "payable" | "receivable" | "general";
};

type FinanceTransaction = {
  id: string;
  transaction_type: "income" | "expense" | "transfer" | "adjustment";
  amount: number;
  currency: string;
  transaction_date: string;
  description: string;
  category: string | null;
  status: string;
  source_module: string;
};

type FinanceObligation = {
  id: string;
  name: string;
  description: string;
  amount: number;
  outstanding_amount: number;
  currency: string;
  due_date: string | null;
  status: string;
  source_module: string;
};

type FinanceCommitment = {
  id: string;
  title: string;
  description: string | null;
  amount: number | null;
  currency: string;
  due_date: string | null;
  status: "planned" | "due" | "overdue" | "paid" | "cancelled" | "review_later";
  priority: "low" | "normal" | "high" | "urgent";
  commitment_nature: "mandatory" | "operational" | "strategic" | "optional";
  commitment_risk_level: "low" | "medium" | "high" | "critical";
  commitment_domain: string;
  commitment_category: string;
  industry: string;
  industry_body: string;
  commitment_type: string;
};

type FinanceResponse = {
  success?: boolean;
  summary?: FinanceSummary;
  accounts?: FinanceAccount[];
  categories?: FinanceCategory[];
  recent_transactions?: FinanceTransaction[];
  payables?: FinanceObligation[];
  receivables?: FinanceObligation[];
  commitments?: FinanceCommitment[];
  error?: string;
};

type MoneyStateStatus = "stable" | "attention" | "pressure" | "at_risk" | "unknown";

type MoneyState = {
  currency: string;
  recorded_income_total: number;
  recorded_expense_total: number;
  recorded_net_position: number;
  expected_receivables_total: number;
  outstanding_payables_total: number;
  open_commitments_total: number;
  mandatory_commitments_total: number;
  high_risk_commitments_total: number;
  responsibility_pressure_total: number;
  recorded_position_after_responsibilities: number;
  status: MoneyStateStatus;
  flags: {
    has_overdue_commitments: boolean;
    has_critical_commitments: boolean;
    has_outstanding_payables: boolean;
    has_negative_recorded_position: boolean;
    has_possible_overlap_between_commitments_and_payables: boolean;
  };
  disclaimer: string;
};

type MoneyStateResponse = {
  success?: boolean;
  money_state?: MoneyState;
  error?: string;
};

type QuickAction = "income" | "expense" | "payable" | "receivable";

const quickActions: Array<{
  type: QuickAction;
  title: string;
  body: string;
  icon: typeof TrendingUp;
}> = [
  {
    type: "income",
    title: "Add income",
    body: "Record money earned by the workspace.",
    icon: TrendingUp,
  },
  {
    type: "expense",
    title: "Add expense",
    body: "Record workspace spending.",
    icon: TrendingDown,
  },
  {
    type: "payable",
    title: "Add payable",
    body: "Track money the workspace owes.",
    icon: CreditCard,
  },
  {
    type: "receivable",
    title: "Add receivable",
    body: "Track money owed to the workspace.",
    icon: Receipt,
  },
];

const industryOptions = [
  ["music", "Music"],
  ["general", "General"],
] as const;

const industryBodyOptions = [
  ["none", "None"],
  ["samro", "SAMRO"],
  ["capasso", "CAPASSO"],
  ["cipc", "CIPC"],
  ["sars", "SARS"],
  ["distributor", "Distributor"],
  ["publisher", "Publisher"],
  ["pro_cmo", "PRO / CMO"],
  ["other", "Other"],
] as const;

const commitmentStatusOptions = [
  ["planned", "Planned"],
  ["due", "Due"],
  ["overdue", "Overdue"],
  ["paid", "Paid"],
  ["cancelled", "Cancelled"],
  ["review_later", "Review later"],
] as const;

const commitmentNatureOptions = financeCommitmentNatures.map((value) => [
  value,
  titleLabel(value),
] as const);

const commitmentRiskOptions = financeCommitmentRiskLevels.map((value) => [
  value,
  titleLabel(value),
] as const);

const commitmentPriorityOptions = [
  ["low", "Low"],
  ["normal", "Normal"],
  ["high", "High"],
  ["urgent", "Urgent"],
] as const;

export default function FinanceDashboardPage() {
  const [data, setData] = useState<FinanceResponse | null>(null);
  const [moneyState, setMoneyState] = useState<MoneyState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<QuickAction>("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [counterpartyName, setCounterpartyName] = useState("");
  const [dateValue, setDateValue] = useState(() => todayKey());
  const [commitmentTitle, setCommitmentTitle] = useState("");
  const [commitmentDescription, setCommitmentDescription] = useState("");
  const [commitmentAmount, setCommitmentAmount] = useState("");
  const [commitmentDueDate, setCommitmentDueDate] = useState(() => todayKey());
  const [commitmentDomain, setCommitmentDomain] = useState("compliance");
  const [commitmentIndustry, setCommitmentIndustry] = useState("music");
  const [commitmentIndustryBody, setCommitmentIndustryBody] = useState("none");
  const [commitmentType, setCommitmentType] = useState("cipc_annual_return");
  const [commitmentNature, setCommitmentNature] = useState("mandatory");
  const [commitmentRiskLevel, setCommitmentRiskLevel] = useState("high");
  const [commitmentStatus, setCommitmentStatus] = useState("planned");
  const [commitmentPriority, setCommitmentPriority] = useState("normal");

  useEffect(() => {
    let cancelled = false;

    async function loadFinance() {
      setLoading(true);
      setError(null);

      try {
        const [response, moneyStateResponse] = await Promise.all([
          fetch("/api/finance/v1", { cache: "no-store" }),
          fetch("/api/finance/v1/money-state", { cache: "no-store" }),
        ]);
        const nextData = (await response.json()) as FinanceResponse;
        const nextMoneyState = (await moneyStateResponse.json()) as MoneyStateResponse;

        if (!response.ok || nextData.success === false) {
          throw new Error(nextData.error ?? "Failed to load finance dashboard.");
        }
        if (!moneyStateResponse.ok || nextMoneyState.success === false) {
          throw new Error(nextMoneyState.error ?? "Failed to load Money State.");
        }

        if (!cancelled) {
          setData(nextData);
          setMoneyState(nextMoneyState.money_state ?? null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load finance dashboard.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFinance();

    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshFinance() {
    const response = await fetch("/api/finance/v1", { cache: "no-store" });
    const nextData = (await response.json()) as FinanceResponse;

    if (!response.ok || nextData.success === false) {
      throw new Error(nextData.error ?? "Failed to load finance dashboard.");
    }

    setData(nextData);
  }

  async function refreshMoneyState() {
    const response = await fetch("/api/finance/v1/money-state", { cache: "no-store" });
    const nextData = (await response.json()) as MoneyStateResponse;

    if (!response.ok || nextData.success === false) {
      throw new Error(nextData.error ?? "Failed to load Money State.");
    }

    setMoneyState(nextData.money_state ?? null);
  }

  const incomeCategories = useMemo(
    () =>
      (data?.categories ?? []).filter(
        (categoryItem) => categoryItem.category_type === "income"
      ),
    [data?.categories]
  );
  const expenseCategories = useMemo(
    () =>
      (data?.categories ?? []).filter(
        (categoryItem) => categoryItem.category_type === "expense"
      ),
    [data?.categories]
  );

  const selectedCategory =
    activeAction === "income"
      ? category || incomeCategories[0]?.name || ""
      : activeAction === "expense"
        ? category || expenseCategories[0]?.name || ""
      : category;
  const selectedDomain =
    financeCommitmentDomainOptions.find((option) => option.value === commitmentDomain) ??
    financeCommitmentDomainOptions[0];
  const selectedType =
    selectedDomain.types.find((option) => option.value === commitmentType) ??
    selectedDomain.types[0];

  const summary = data?.summary ?? {
    income_total: 0,
    expense_total: 0,
    receivables_total: 0,
    payables_total: 0,
    commitments_total: 0,
    net_position: 0,
    currency: "ZAR",
  };

  const commitments = data?.commitments ?? [];
  const upcomingCommitments = commitments.filter((item) =>
    item.status === "planned" || item.status === "due" || item.status === "review_later"
  );
  const overdueCommitments = commitments.filter(
    (item) => item.status === "overdue"
  );

  async function createFinanceItem() {
    if (!amount || !description.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/finance/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_type: activeAction,
          amount: Number(amount),
          description,
          category: selectedCategory,
          counterparty_name: counterpartyName,
          transaction_date: activeAction === "income" || activeAction === "expense" ? dateValue : undefined,
          due_date: activeAction === "payable" || activeAction === "receivable" ? dateValue : undefined,
        }),
      });
      const nextData = (await response.json()) as FinanceResponse;

      if (!response.ok || nextData.success === false) {
        throw new Error(nextData.error ?? "Failed to create finance record.");
      }

      setData(nextData);
      await refreshMoneyState();
      setAmount("");
      setDescription("");
      setCategory("");
      setCounterpartyName("");
      setDateValue(todayKey());
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to create finance record.");
    } finally {
      setSaving(false);
    }
  }

  async function createCommitment() {
    if (!commitmentTitle.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/finance/v1/commitments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: commitmentTitle,
          description: commitmentDescription,
          amount: commitmentAmount ? Number(commitmentAmount) : null,
          due_date: commitmentDueDate,
          status: commitmentStatus,
          priority: commitmentPriority,
          commitment_category: selectedDomain.category,
          commitment_domain: commitmentDomain,
          commitment_nature: commitmentNature,
          commitment_risk_level: commitmentRiskLevel,
          industry: commitmentIndustry,
          industry_body: commitmentIndustryBody,
          commitment_type: commitmentType,
          related_module: "manual",
        }),
      });
      const result = (await response.json()) as FinanceResponse;

      if (!response.ok || result.success === false) {
        throw new Error(result.error ?? "Failed to create commitment.");
      }

      await refreshFinance();
      await refreshMoneyState();
      setCommitmentTitle("");
      setCommitmentDescription("");
      setCommitmentAmount("");
      setCommitmentDueDate(todayKey());
      setCommitmentDomain("compliance");
      setCommitmentIndustry("music");
      setCommitmentIndustryBody("none");
      setCommitmentType("cipc_annual_return");
      setCommitmentNature("mandatory");
      setCommitmentRiskLevel("high");
      setCommitmentStatus("planned");
      setCommitmentPriority("normal");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to create commitment.");
    } finally {
      setSaving(false);
    }
  }

  async function updateCommitmentAction(
    commitmentId: string,
    action: "mark_paid" | "cancel" | "review_later"
  ) {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/finance/v1/commitments/${commitmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = (await response.json()) as FinanceResponse;

      if (!response.ok || result.success === false) {
        throw new Error(result.error ?? "Failed to update commitment.");
      }

      await refreshFinance();
      await refreshMoneyState();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to update commitment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-[#2F48F7]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Finance / Accounting</h1>
            <p className="mt-2 max-w-3xl leading-7 text-[#64748B]">
              Workspace-owned accounting for income, expenses, receivables,
              payables, and future royalty finance posting.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <p className="text-sm font-semibold text-[#2F48F7]">QuickBooks-style V1</p>
            <p className="mt-1 text-sm font-semibold text-[#334155]">Royalties feed finance later</p>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {error ? (
            <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm font-semibold text-[#B91C1C]">
              {error}
            </div>
          ) : null}

          <section className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <SummaryCard title="Income" value={summary.income_total} currency={summary.currency} icon={TrendingUp} />
            <SummaryCard title="Expenses" value={summary.expense_total} currency={summary.currency} icon={TrendingDown} />
            <SummaryCard title="Receivables" value={summary.receivables_total} currency={summary.currency} icon={Receipt} />
            <SummaryCard title="Payables" value={summary.payables_total} currency={summary.currency} icon={CreditCard} />
            <SummaryCard title="Commitments" value={summary.commitments_total} currency={summary.currency} icon={WalletCards} />
            <SummaryCard title="Net position" value={summary.net_position} currency={summary.currency} icon={CircleDollarSign} />
          </section>

          {moneyState ? <MoneyStatePanel moneyState={moneyState} /> : null}

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Accounts overview</p>
                <h2 className="mt-2 text-xl font-semibold">Basic accounts</h2>
              </div>
              {loading ? <Loader2 className="h-5 w-5 animate-spin text-[#2F48F7]" /> : null}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {(data?.accounts ?? []).map((account) => (
                <article key={account.id} className="min-w-0 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <p className="text-sm font-semibold text-[#0F172A]">{account.account_name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase text-[#64748B]">{account.account_type}</p>
                  <p className="mt-3 break-words text-sm font-semibold leading-5 text-[#334155]">
                    {formatMoney(account.current_balance, account.currency)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <ListPanel
              title="Recent Transactions"
              empty="No income or expense records yet."
              items={(data?.recent_transactions ?? []).map((item) => ({
                id: item.id,
                title: item.description,
                meta: `${item.transaction_type}${item.category ? ` / ${item.category}` : ""} / ${item.status}`,
                amount: formatMoney(item.amount, item.currency),
              }))}
            />
            <section className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-6 shadow-sm shadow-slate-200/60">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#2F48F7]">
                <WalletCards className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">Future Royalty Bridge</h2>
              <p className="mt-3 text-sm leading-6 text-[#475569]">
                Royalty earnings and contributor payables will later post into
                Finance after approval.
              </p>
              <div className="mt-4 rounded-xl border border-[#BFDBFE] bg-white p-4 text-xs font-semibold leading-5 text-[#2F48F7]">
                Royalty event to calculation to contributor payable to approved finance posting to payment/reconciliation to reports
              </div>
            </section>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <ListPanel
              title="Payables Preview"
              empty="No payables yet."
              items={(data?.payables ?? []).map((item) => ({
                id: item.id,
                title: item.name,
                meta: item.description,
                amount: formatMoney(item.outstanding_amount, item.currency),
              }))}
            />
            <ListPanel
              title="Receivables Preview"
              empty="No receivables yet."
              items={(data?.receivables ?? []).map((item) => ({
                id: item.id,
                title: item.name,
                meta: item.description,
                amount: formatMoney(item.outstanding_amount, item.currency),
              }))}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <ListPanel
              title="Upcoming Commitments"
              empty="No upcoming commitments yet."
              items={upcomingCommitments.map((item) => ({
                id: item.id,
                title: item.title,
                meta: `${labelForCommitmentType(item.commitment_type)} / ${labelForDomain(item.commitment_domain)} / ${labelFor(commitmentRiskOptions, item.commitment_risk_level)}`,
                amount: item.amount === null ? "Amount TBC" : formatMoney(item.amount, item.currency),
                tone: item.commitment_nature === "mandatory" || item.commitment_risk_level === "critical" || item.commitment_risk_level === "high"
                  ? riskTone(item.commitment_risk_level)
                  : undefined,
                actions: item.status === "paid" || item.status === "cancelled" ? [] : [
                  { label: "Mark paid", onClick: () => updateCommitmentAction(item.id, "mark_paid") },
                  { label: "Review later", onClick: () => updateCommitmentAction(item.id, "review_later") },
                  { label: "Cancel", onClick: () => updateCommitmentAction(item.id, "cancel") },
                ],
              }))}
            />
            <ListPanel
              title="Overdue Commitments"
              empty="No overdue commitments."
              items={overdueCommitments.map((item) => ({
                id: item.id,
                title: item.title,
                meta: `${labelFor(industryBodyOptions, item.industry_body)} / ${labelFor(commitmentRiskOptions, item.commitment_risk_level)} / ${item.due_date ?? "No due date"}`,
                amount: item.amount === null ? "Amount TBC" : formatMoney(item.amount, item.currency),
                tone: riskTone(item.commitment_risk_level),
                actions: [
                  { label: "Mark paid", onClick: () => updateCommitmentAction(item.id, "mark_paid") },
                  { label: "Review later", onClick: () => updateCommitmentAction(item.id, "review_later") },
                  { label: "Cancel", onClick: () => updateCommitmentAction(item.id, "cancel") },
                ],
              }))}
            />
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Reports</p>
            <h2 className="mt-2 text-xl font-semibold">Reporting placeholders</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {["Profit & Loss", "Cash Flow", "Balance Sheet", "Royalty finance bridge later"].map((report) => (
                <div key={report} className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <BarChart3 className="h-5 w-5 text-[#2F48F7]" />
                  <p className="mt-3 text-sm font-semibold text-[#0F172A]">{report}</p>
                  <p className="mt-1 text-xs leading-5 text-[#64748B]">Planned report surface</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Quick actions</p>
            <h2 className="mt-2 text-xl font-semibold">Capture finance record</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const selected = activeAction === action.type;
                return (
                  <button
                    key={action.type}
                    type="button"
                    onClick={() => setActiveAction(action.type)}
                    className={`rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-[#2F48F7] bg-[#EFF6FF]"
                        : "border-[#E5E7EB] bg-[#F8FAFC] hover:border-[#BFDBFE]"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-[#2F48F7]" />
                    <p className="mt-3 text-sm font-semibold text-[#0F172A]">{action.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#64748B]">{action.body}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-3">
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="Amount"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              />
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              />
              {activeAction === "income" || activeAction === "expense" ? (
                <select
                  value={selectedCategory}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                >
                  {(activeAction === "income" ? incomeCategories : expenseCategories).map((financeCategory) => (
                    <option key={financeCategory.id} value={financeCategory.name}>
                      {financeCategory.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="Category"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                />
              )}
              {(activeAction === "payable" || activeAction === "receivable") ? (
                <input
                  value={counterpartyName}
                  onChange={(event) => setCounterpartyName(event.target.value)}
                  placeholder={activeAction === "payable" ? "Vendor name" : "Customer name"}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                />
              ) : null}
              <input
                value={dateValue}
                onChange={(event) => setDateValue(event.target.value)}
                type="date"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              />
              <button
                type="button"
                onClick={createFinanceItem}
                disabled={saving || !amount || !description.trim()}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#2F48F7] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Save finance record
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Finance V2 Phase 1</p>
            <h2 className="mt-2 text-xl font-semibold">Add commitment</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Track obligations, reminders, and responsibilities before or alongside payment.
            </p>
            <div className="mt-5 space-y-3">
              <input
                value={commitmentTitle}
                onChange={(event) => setCommitmentTitle(event.target.value)}
                placeholder="Commitment title"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              />
              <textarea
                value={commitmentDescription}
                onChange={(event) => setCommitmentDescription(event.target.value)}
                placeholder="Notes or responsibility reason"
                rows={3}
                className="w-full resize-none rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              />
              <input
                value={commitmentAmount}
                onChange={(event) => setCommitmentAmount(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="Amount, if known"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              />
              <input
                value={commitmentDueDate}
                onChange={(event) => setCommitmentDueDate(event.target.value)}
                type="date"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              />
              <select
                value={commitmentDomain}
                onChange={(event) => {
                  const nextDomain = financeCommitmentDomainOptions.find(
                    (option) => option.value === event.target.value
                  );
                  if (!nextDomain) return;
                  const nextType = nextDomain.types[0];
                  setCommitmentDomain(nextDomain.value);
                  setCommitmentType(nextType.value);
                  setCommitmentNature(nextType.defaultNature);
                  setCommitmentRiskLevel(nextType.defaultRiskLevel);
                }}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              >
                {financeCommitmentDomainOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={commitmentType}
                onChange={(event) => {
                  const nextType = selectedDomain.types.find(
                    (option) => option.value === event.target.value
                  );
                  if (!nextType) return;
                  setCommitmentType(nextType.value);
                  setCommitmentNature(nextType.defaultNature);
                  setCommitmentRiskLevel(nextType.defaultRiskLevel);
                }}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              >
                {selectedDomain.types.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className={`rounded-xl border p-3 text-xs font-semibold leading-5 ${riskTone(commitmentRiskLevel)}`}>
                {selectedType.label}: {titleLabel(commitmentNature)} commitment, {titleLabel(commitmentRiskLevel)} risk
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={commitmentNature}
                  onChange={(event) => setCommitmentNature(event.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                >
                  {commitmentNatureOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={commitmentRiskLevel}
                  onChange={(event) => setCommitmentRiskLevel(event.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                >
                  {commitmentRiskOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={commitmentIndustry}
                  onChange={(event) => setCommitmentIndustry(event.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                >
                  {industryOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={commitmentIndustryBody}
                  onChange={(event) => setCommitmentIndustryBody(event.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                >
                  {industryBodyOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={commitmentStatus}
                  onChange={(event) => setCommitmentStatus(event.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                >
                  {commitmentStatusOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={commitmentPriority}
                  onChange={(event) => setCommitmentPriority(event.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                >
                  {commitmentPriorityOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={createCommitment}
                disabled={saving || !commitmentTitle.trim()}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Save commitment
              </button>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function MoneyStatePanel({ moneyState }: { moneyState: MoneyState }) {
  const status = moneyStateStatusCopy(moneyState.status);
  const values = [
    ["Recorded Income", moneyState.recorded_income_total],
    ["Recorded Expenses", moneyState.recorded_expense_total],
    ["Recorded Net Position", moneyState.recorded_net_position],
    ["Expected Receivables", moneyState.expected_receivables_total],
    ["Outstanding Payables", moneyState.outstanding_payables_total],
    ["Open Commitments", moneyState.open_commitments_total],
    ["Mandatory Commitments", moneyState.mandatory_commitments_total],
    ["High-Risk Commitments", moneyState.high_risk_commitments_total],
    ["Responsibility Pressure", moneyState.responsibility_pressure_total],
    ["Recorded Position After Responsibilities", moneyState.recorded_position_after_responsibilities],
  ] as const;

  return (
    <section className="rounded-2xl border border-[#DBEAFE] bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">
            Money State
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">
            Recorded financial awareness based on workspace data.
          </h2>
        </div>
        <div className={`rounded-2xl border px-4 py-3 ${status.tone}`}>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <p className="text-sm font-semibold">{status.label}</p>
          </div>
          <p className="mt-1 text-xs font-medium">{status.detail}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {values.map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3">
            <p className="text-[11px] font-semibold uppercase leading-4 text-[#64748B]">{label}</p>
            <p className="mt-1 break-words text-sm font-semibold leading-5 text-[#0F172A]">
              {formatCompactMoney(value, moneyState.currency)}
            </p>
          </div>
        ))}
      </div>

      {moneyState.flags.has_possible_overlap_between_commitments_and_payables ? (
        <p className="mt-4 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-3 text-xs font-semibold leading-5 text-[#92400E]">
          Some commitments appear linked to payables, so responsibility pressure avoids counting those linked amounts twice where possible.
        </p>
      ) : null}

      <p className="mt-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-xs leading-5 text-[#64748B]">
        {moneyState.disclaimer}
      </p>
    </section>
  );
}

function SummaryCard({
  title,
  value,
  currency,
  icon: Icon,
}: {
  title: string;
  value: number;
  currency: string;
  icon: typeof TrendingUp;
}) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2F48F7]">
          <Icon className="h-5 w-5" />
        </div>
        <span className="shrink-0 rounded-full bg-[#F8FAFC] px-2 py-1 text-[11px] font-semibold text-[#64748B]">
          {currency || "ZAR"}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold leading-5 text-[#64748B]">{title}</p>
      <p
        className="mt-1 min-w-0 break-words text-xl font-semibold leading-6 text-[#0F172A]"
        title={formatMoney(value, currency)}
      >
        {formatCompactMoney(value, currency)}
      </p>
    </article>
  );
}

function ListPanel({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: Array<{
    id: string;
    title: string;
    meta: string;
    amount: string;
    actions?: Array<{ label: string; onClick: () => void }>;
    tone?: string;
  }>;
}) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <FileText className="h-5 w-5 text-[#2F48F7]" />
      </div>
      <div className="mt-5 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <article key={item.id} className={`rounded-xl border p-4 ${item.tone ?? "border-[#E5E7EB] bg-[#F8FAFC]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0F172A]">{item.title}</p>
                  <p className="mt-1 text-xs font-medium text-[#64748B]">{item.meta}</p>
                </div>
                <p className="min-w-0 shrink-0 break-words text-right text-sm font-semibold leading-5 text-[#334155]">{item.amount}</p>
              </div>
              {item.actions?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.actions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.onClick}
                      className="rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#334155] transition hover:border-[#2F48F7] hover:text-[#2F48F7]"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-sm leading-6 text-[#64748B]">
            {empty}
          </p>
        )}
      </div>
    </section>
  );
}

function labelFor(options: ReadonlyArray<readonly [string, string]>, value: string) {
  return options.find(([optionValue]) => optionValue === value)?.[1] ?? value;
}

function labelForDomain(value: string) {
  return financeCommitmentDomainOptions.find((option) => option.value === value)?.label ?? value;
}

function labelForCommitmentType(value: string) {
  for (const domain of financeCommitmentDomainOptions) {
    const match = domain.types.find((option) => option.value === value);
    if (match) return match.label;
  }
  return value;
}

function titleLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function riskTone(value: string) {
  if (value === "critical") return "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]";
  if (value === "high") return "border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C]";
  if (value === "medium") return "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]";
  return "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]";
}

function moneyStateStatusCopy(status: MoneyStateStatus) {
  if (status === "stable") {
    return {
      label: "Stable",
      detail: "No major recorded pressure indicators.",
      tone: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
    };
  }
  if (status === "attention") {
    return {
      label: "Attention",
      detail: "Recorded responsibilities need review.",
      tone: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
    };
  }
  if (status === "pressure") {
    return {
      label: "Pressure",
      detail: "Recorded responsibilities materially affect position.",
      tone: "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
    };
  }
  if (status === "at_risk") {
    return {
      label: "At risk",
      detail: "Urgent recorded responsibilities need review.",
      tone: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
    };
  }
  return {
    label: "Unknown",
    detail: "Not enough recorded finance data yet.",
    tone: "border-[#E5E7EB] bg-[#F8FAFC] text-[#64748B]",
  };
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency || "ZAR",
  }).format(Number(value ?? 0));
}

function formatCompactMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency || "ZAR",
    notation: Math.abs(Number(value ?? 0)) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(Number(value ?? 0)) >= 10000 ? 1 : 2,
  }).format(Number(value ?? 0));
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
