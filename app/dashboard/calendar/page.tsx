"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Plus,
  ShieldCheck,
} from "lucide-react";

type CalendarCategory =
  | "onboarding"
  | "song_profile"
  | "submission"
  | "release"
  | "finance"
  | "crm"
  | "general";

type WorkflowType =
  | "onboarding"
  | "song_profile"
  | "approval"
  | "submission"
  | "release"
  | "finance"
  | "crm"
  | "evidence"
  | "readiness"
  | "general";

type ActionStatus =
  | "pending"
  | "in_progress"
  | "awaiting_approval"
  | "completed"
  | "overdue"
  | "cancelled";

type Priority = "low" | "normal" | "high" | "urgent";

type CalendarItem = {
  id: string;
  title: string;
  description: string | null;
  item_date: string;
  required_by_date: string;
  status: string;
  action_status: ActionStatus;
  category: CalendarCategory;
  workflow_type: WorkflowType;
  priority: Priority;
  approval_required: boolean;
  assigned_to: string | null;
  completed_at: string | null;
  source_module: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
};

type CalendarResponse = {
  success?: boolean;
  items?: CalendarItem[];
  item?: CalendarItem;
  current_user_id?: string;
  error?: string;
};

const workflowLabels: Record<WorkflowType, string> = {
  onboarding: "Onboarding",
  song_profile: "Song Profile",
  approval: "Approval",
  submission: "Submission",
  release: "Release",
  finance: "Finance",
  crm: "CRM",
  evidence: "Evidence",
  readiness: "Readiness",
  general: "General",
};

const actionStatusLabels: Record<ActionStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  awaiting_approval: "Awaiting approval",
  completed: "Completed",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

const priorityLabels: Record<Priority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

const categoryClasses: Record<CalendarCategory, string> = {
  onboarding: "bg-[#EFF6FF] text-[#2F48F7] border-[#BFDBFE]",
  song_profile: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",
  submission: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]",
  release: "bg-[#FCE7F3] text-[#BE185D] border-[#FBCFE8]",
  finance: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]",
  crm: "bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]",
  general: "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]",
};

const priorityClasses: Record<Priority, string> = {
  low: "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]",
  normal: "bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]",
  high: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]",
  urgent: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
};

const statusClasses: Record<ActionStatus, string> = {
  pending: "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]",
  in_progress: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  awaiting_approval: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]",
  completed: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",
  overdue: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
  cancelled: "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]",
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const incompleteStatuses = new Set<ActionStatus>([
  "pending",
  "in_progress",
  "awaiting_approval",
  "overdue",
]);

export default function WorkspaceCalendarPage() {
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredByDate, setRequiredByDate] = useState(() => toDateKey(new Date()));
  const [category, setCategory] = useState<CalendarCategory>("general");
  const [workflowType, setWorkflowType] = useState<WorkflowType>("general");
  const [priority, setPriority] = useState<Priority>("normal");
  const [actionStatus, setActionStatus] = useState<ActionStatus>("pending");
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/calendar/items", { cache: "no-store" });
        const data = (await response.json()) as CalendarResponse;

        if (!response.ok || data.success === false) {
          throw new Error(data.error ?? "Failed to load workspace actions.");
        }

        if (!cancelled) {
          setItems(data.items ?? []);
          setCurrentUserId(data.current_user_id ?? "");
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load workspace actions.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadItems();

    return () => {
      cancelled = true;
    };
  }, []);

  const calendarDays = useMemo(() => buildMonthGrid(monthCursor), [monthCursor]);
  const todayKey = toDateKey(new Date());

  const itemsByDate = useMemo(() => {
    const grouped = new Map<string, CalendarItem[]>();
    for (const item of items) {
      const dateItems = grouped.get(item.required_by_date) ?? [];
      dateItems.push(item);
      grouped.set(item.required_by_date, dateItems);
    }
    return grouped;
  }, [items]);

  const selectedItems = itemsByDate.get(selectedDate) ?? [];
  const myTasks = items
    .filter((item) => item.assigned_to === currentUserId && ["pending", "in_progress"].includes(item.action_status))
    .sort(sortByRequiredDate)
    .slice(0, 5);
  const awaitingApproval = items
    .filter((item) => item.approval_required || item.action_status === "awaiting_approval")
    .filter((item) => incompleteStatuses.has(item.action_status))
    .sort(sortByRequiredDate)
    .slice(0, 5);
  const overdueItems = items
    .filter((item) => item.required_by_date < todayKey && incompleteStatuses.has(item.action_status))
    .sort(sortByRequiredDate)
    .slice(0, 5);
  const upcomingItems = items
    .filter((item) => item.required_by_date >= todayKey && incompleteStatuses.has(item.action_status))
    .sort(sortByRequiredDate)
    .slice(0, 6);

  function selectDate(dateKey: string) {
    setSelectedDate(dateKey);
    setRequiredByDate(dateKey);
  }

  async function addItem() {
    if (!title.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/calendar/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          item_date: requiredByDate,
          required_by_date: requiredByDate,
          category,
          workflow_type: workflowType,
          priority,
          action_status: actionStatus,
          approval_required: approvalRequired,
          assigned_to: assignedTo,
        }),
      });
      const data = (await response.json()) as CalendarResponse;

      if (!response.ok || data.success === false || !data.item) {
        throw new Error(data.error ?? "Failed to create workspace action.");
      }

      setItems((current) => [...current, data.item as CalendarItem]);
      setTitle("");
      setDescription("");
      setCategory("general");
      setWorkflowType("general");
      setPriority("normal");
      setActionStatus("pending");
      setApprovalRequired(false);
      setAssignedTo("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to create workspace action.");
    } finally {
      setSaving(false);
    }
  }

  async function updateItemStatus(itemId: string, nextStatus: ActionStatus) {
    setUpdatingItemId(itemId);
    setError(null);

    try {
      const response = await fetch(`/api/calendar/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_status: nextStatus }),
      });
      const data = (await response.json()) as CalendarResponse;

      if (!response.ok || data.success === false || !data.item) {
        throw new Error(data.error ?? "Failed to update workspace action.");
      }

      setItems((current) =>
        current.map((item) => (item.id === itemId ? (data.item as CalendarItem) : item))
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update workspace action.");
    } finally {
      setUpdatingItemId(null);
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
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Your Business Calendar</h1>
            <p className="mt-2 max-w-3xl leading-7 text-[#64748B]">
              A shared task and workflow layer for onboarding, works, approvals,
              submissions, releases, finance, CRM, and future system-recommended actions.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <p className="text-sm font-semibold text-[#2F48F7]">Workflow/task layer</p>
            <p className="mt-1 text-sm font-semibold text-[#334155]">Calendar is the date view</p>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TaskPanel title="My Tasks" icon={CheckCircle2} items={myTasks} emptyText="No assigned active tasks." onStatusChange={updateItemStatus} />
            <TaskPanel title="Awaiting Approval" icon={ShieldCheck} items={awaitingApproval} emptyText="No approval queue items." onStatusChange={updateItemStatus} />
            <TaskPanel title="Overdue" icon={Clock3} items={overdueItems} emptyText="No overdue actions." onStatusChange={updateItemStatus} />
            <TaskPanel title="Upcoming" icon={CalendarDays} items={upcomingItems} emptyText="No upcoming actions." onStatusChange={updateItemStatus} />
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Calendar view</p>
                <h2 className="mt-1 text-2xl font-semibold">{formatMonth(monthCursor)}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMonthCursor(addMonths(monthCursor, -1))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white text-[#475569]"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    setMonthCursor(startOfMonth(today));
                    selectDate(toDateKey(today));
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#334155]"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setMonthCursor(addMonths(monthCursor, 1))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white text-[#475569]"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-2">
              {weekdays.map((day) => (
                <div key={day} className="px-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                  {day}
                </div>
              ))}
              {calendarDays.map((day) => {
                const dayItems = itemsByDate.get(day.key) ?? [];
                const isSelected = day.key === selectedDate;
                const inMonth = day.date.getMonth() === monthCursor.getMonth();

                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => selectDate(day.key)}
                    className={`min-h-28 rounded-2xl border p-3 text-left transition ${
                      isSelected
                        ? "border-[#2F48F7] bg-[#EEF2FF]"
                        : "border-[#E5E7EB] bg-white hover:border-[#BFDBFE] hover:bg-[#F8FAFC]"
                    } ${inMonth ? "" : "opacity-45"}`}
                  >
                    <span className="text-sm font-semibold text-[#0F172A]">{day.date.getDate()}</span>
                    <div className="mt-3 space-y-1">
                      {dayItems.slice(0, 2).map((item) => (
                        <span
                          key={item.id}
                          className={`block truncate rounded-full border px-2 py-1 text-[11px] font-semibold ${categoryClasses[item.category]}`}
                        >
                          {item.title}
                        </span>
                      ))}
                      {dayItems.length > 2 ? (
                        <span className="block text-xs font-semibold text-[#64748B]">+{dayItems.length - 2} more</span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F48F7]">Selected date</p>
                <h2 className="mt-1 text-xl font-semibold">{formatDateLabel(selectedDate)}</h2>
              </div>
              {loading ? <Loader2 className="h-5 w-5 animate-spin text-[#2F48F7]" /> : null}
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3 text-sm font-semibold text-[#B91C1C]">
                {error}
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <CalendarItemCard
                    key={item.id}
                    item={item}
                    onStatusChange={updateItemStatus}
                    updating={updatingItemId === item.id}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4">
                  <p className="text-sm font-semibold text-[#334155]">No actions for this date</p>
                  <p className="mt-1 text-xs leading-5 text-[#64748B]">
                    Add a workspace action to place operational work on the calendar.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold">Add workspace action</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Manual action for the workspace workflow layer. Module-generated actions can use this same structure later.
            </p>
            <div className="mt-5 space-y-3">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Action title"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Notes"
                rows={3}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              />
              <input
                type="date"
                value={requiredByDate}
                onChange={(event) => {
                  setRequiredByDate(event.target.value);
                  setSelectedDate(event.target.value);
                }}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={workflowType}
                  onChange={(event) => {
                    const next = event.target.value as WorkflowType;
                    setWorkflowType(next);
                    setCategory(workflowToCategory(next));
                  }}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                >
                  {Object.entries(workflowLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as Priority)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                >
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label} priority</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={actionStatus}
                  onChange={(event) => setActionStatus(event.target.value as ActionStatus)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                >
                  {Object.entries(actionStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <input
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
                  placeholder="Assigned to current user by default"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F48F7]"
                />
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#334155]">
                <input
                  type="checkbox"
                  checked={approvalRequired}
                  onChange={(event) => setApprovalRequired(event.target.checked)}
                  className="h-4 w-4 rounded border-[#CBD5E1]"
                />
                Approval required
              </label>
              <button
                type="button"
                onClick={addItem}
                disabled={saving || !title.trim()}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#2F48F7] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add workspace action
              </button>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function TaskPanel({
  title,
  icon: Icon,
  items,
  emptyText,
  onStatusChange,
}: {
  title: string;
  icon: typeof CalendarDays;
  items: CalendarItem[];
  emptyText: string;
  onStatusChange: (itemId: string, status: ActionStatus) => void;
}) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
          <p className="mt-1 text-xs font-semibold text-[#64748B]">{items.length} active</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2F48F7]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {items.length > 0 ? (
          items.slice(0, 3).map((item) => (
            <CalendarItemCard
              key={item.id}
              item={item}
              compact
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3 text-xs font-semibold text-[#64748B]">
            {emptyText}
          </p>
        )}
      </div>
    </section>
  );
}

function CalendarItemCard({
  item,
  compact = false,
  updating = false,
  onStatusChange,
}: {
  item: CalendarItem;
  compact?: boolean;
  updating?: boolean;
  onStatusChange?: (itemId: string, status: ActionStatus) => void;
}) {
  return (
    <article className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#0F172A]">{item.title}</p>
          <p className="mt-1 text-xs font-semibold text-[#64748B]">{formatDateLabel(item.required_by_date)}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${priorityClasses[item.priority]}`}>
          {priorityLabels[item.priority]}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${categoryClasses[item.category]}`}>
          {workflowLabels[item.workflow_type]}
        </span>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClasses[item.action_status]}`}>
          {actionStatusLabels[item.action_status]}
        </span>
        {item.approval_required ? (
          <span className="rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-2.5 py-1 text-[11px] font-semibold text-[#B45309]">
            Approval
          </span>
        ) : null}
      </div>
      {!compact && item.description ? (
        <p className="mt-3 text-sm leading-6 text-[#64748B]">{item.description}</p>
      ) : null}
      {onStatusChange && !compact ? (
        <div className="mt-3">
          <select
            value={item.action_status}
            onChange={(event) => onStatusChange(item.id, event.target.value as ActionStatus)}
            disabled={updating}
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-semibold text-[#334155] outline-none focus:border-[#2F48F7] disabled:opacity-60"
          >
            {Object.entries(actionStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      ) : null}
      {!compact ? (
        <p className="mt-3 text-xs font-semibold text-[#94A3B8]">
          {item.source_module}
          {item.assigned_to ? ` / assigned` : ""}
          {item.related_entity_type ? ` / ${item.related_entity_type}` : ""}
        </p>
      ) : null}
    </article>
  );
}

function buildMonthGrid(month: Date) {
  const first = startOfMonth(month);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      date,
      key: toDateKey(date),
    };
  });
}

function workflowToCategory(workflowType: WorkflowType): CalendarCategory {
  if (workflowType === "approval" || workflowType === "evidence" || workflowType === "readiness") {
    return "general";
  }
  return workflowType;
}

function sortByRequiredDate(a: CalendarItem, b: CalendarItem) {
  return a.required_by_date.localeCompare(b.required_by_date);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}
