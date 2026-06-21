"use client";

import { useCallback, useMemo, useState } from "react";

type TestWork = {
  id: string;
  work_title: string;
};

type ActivityEntry = {
  id: string;
  label: string;
  detail: string;
  at: string;
};

const palette = {
  bg: "#0b0e14",
  sidebar: "#0f1420",
  card: "#141a26",
  cardBorder: "#1e293b",
  text: "#f1f5f9",
  muted: "#94a3b8",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
};

function JsonPanel({ title, data }: { title: string; data: unknown }) {
  return (
    <section style={styles.jsonPanel}>
      <h3 style={styles.jsonTitle}>{title}</h3>
      <pre style={styles.jsonPre}>
        {data === null || data === undefined
          ? "—"
          : JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.kpiCard}>
      <p style={styles.kpiLabel}>{label}</p>
      <p style={styles.kpiValue}>{value}</p>
    </div>
  );
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function TestControlPanelPage() {
  const [activeWork, setActiveWork] = useState<TestWork | null>(null);
  const [loadResponse, setLoadResponse] = useState<unknown>(null);
  const [readinessResponse, setReadinessResponse] = useState<unknown>(null);
  const [createResponse, setCreateResponse] = useState<unknown>(null);
  const [queueResponse, setQueueResponse] = useState<unknown>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  const pushActivity = useCallback((label: string, detail: string) => {
    setActivity((prev) => [
      {
        id: `${Date.now()}-${prev.length}`,
        label,
        detail,
        at: new Date().toISOString(),
      },
      ...prev.slice(0, 9),
    ]);
  }, []);

  const readinessReady = useMemo(() => {
    if (
      readinessResponse &&
      typeof readinessResponse === "object" &&
      "readiness" in readinessResponse
    ) {
      const r = (readinessResponse as { readiness?: { ready?: boolean } })
        .readiness;
      if (typeof r?.ready === "boolean") {
        return r.ready ? "Ready" : "Not ready";
      }
    }
    return "—";
  }, [readinessResponse]);

  const queueCount = useMemo(() => {
    if (
      queueResponse &&
      typeof queueResponse === "object" &&
      "count" in queueResponse &&
      typeof (queueResponse as { count: unknown }).count === "number"
    ) {
      return String((queueResponse as { count: number }).count);
    }
    return "—";
  }, [queueResponse]);

  async function runAction(
    key: string,
    label: string,
    fn: () => Promise<void>
  ) {
    setLoading(key);
    setError(null);
    try {
      await fn();
      pushActivity(label, "OK");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Request failed";
      setError(message);
      pushActivity(label, message);
    } finally {
      setLoading(null);
    }
  }

  async function loadTestWork() {
    await runAction("load", "Load Test Work", async () => {
      const res = await fetch("/api/test/get-work");
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to load test work");
      if (!Array.isArray(data) || data.length === 0) {
        setActiveWork(null);
        throw new Error("No test works returned");
      }
      setLoadResponse(data);
      setActiveWork(data[0] as TestWork);
    });
  }

  async function checkReadiness() {
    if (!activeWork?.id) {
      setError("Load Test Work first");
      return;
    }
    await runAction("readiness", "Check Readiness", async () => {
      const res = await fetch(
        `/api/submissions/readiness?work_id=${encodeURIComponent(activeWork.id)}`
      );
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error ?? "Readiness check failed");
      }
      setReadinessResponse(data);
    });
  }

  async function createSubmission() {
    if (!activeWork?.id) {
      setError("Load Test Work first");
      return;
    }
    await runAction("create", "Create Submission", async () => {
      const res = await fetch("/api/submissions/create-from-work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work_id: activeWork.id }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error ?? "Create submission failed");
      }
      setCreateResponse(data);
    });
  }

  async function viewQueue() {
    await runAction("queue", "View Queue", async () => {
      const res = await fetch("/api/submissions/pending");
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error ?? "Failed to fetch queue");
      }
      setQueueResponse(data);
    });
  }

  const submissions =
    queueResponse &&
    typeof queueResponse === "object" &&
    "submissions" in queueResponse &&
    Array.isArray((queueResponse as { submissions: unknown }).submissions)
      ? (queueResponse as { submissions: Record<string, unknown>[] })
          .submissions
      : [];

  const actions = [
    {
      key: "load",
      title: "Load Test Work",
      description: "GET /api/test/get-work",
      onClick: loadTestWork,
      accent: palette.blue,
      disabled: false,
    },
    {
      key: "readiness",
      title: "Check Readiness",
      description: "GET /api/submissions/readiness",
      onClick: checkReadiness,
      accent: palette.purple,
      disabled: !activeWork,
    },
    {
      key: "create",
      title: "Create Submission",
      description: "POST /api/submissions/create-from-work",
      onClick: createSubmission,
      accent: palette.green,
      disabled: !activeWork,
    },
    {
      key: "queue",
      title: "View Queue",
      description: "GET /api/submissions/pending",
      onClick: viewQueue,
      accent: palette.amber,
      disabled: false,
    },
  ];

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logoMark} />
          <div>
            <p style={styles.brandTitle}>Sentry Sound</p>
            <p style={styles.brandSub}>TEST Control Panel</p>
          </div>
        </div>
        <nav style={styles.nav}>
          <p style={styles.navLabel}>Control Panel</p>
          <div style={{ ...styles.navItem, ...styles.navItemActive }}>
            TEST Harness
          </div>
          <div style={{ ...styles.navItem, ...styles.navItemDisabled }}>
            History
          </div>
          <div style={{ ...styles.navItem, ...styles.navItemDisabled }}>
            Settings
          </div>
        </nav>
        <div style={styles.sidebarFooter}>
          <span style={styles.testPill}>TEST MODE</span>
          <p style={styles.footerNote}>Backend/API source of truth</p>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>TEST Control Panel</h1>
            <p style={styles.pageSub}>Demonstrate approved backend flow only</p>
          </div>
          <span style={styles.testBadge}>TEST_MODE</span>
        </header>

        {error ? <div style={styles.errorBanner}>{error}</div> : null}

        <div style={styles.kpiRow}>
          <KpiCard label="Active work" value={activeWork?.id ?? "—"} />
          <KpiCard label="Readiness" value={readinessReady} />
          <KpiCard label="Queue count" value={queueCount} />
          <KpiCard label="Work title" value={activeWork?.work_title ?? "—"} />
        </div>

        <div style={styles.actionGrid}>
          {actions.map((action) => (
            <article key={action.key} style={styles.actionCard}>
              <div
                style={{
                  ...styles.iconBox,
                  background: `${action.accent}22`,
                  borderColor: `${action.accent}55`,
                }}
              />
              <h2 style={styles.actionTitle}>{action.title}</h2>
              <p style={styles.actionDesc}>{action.description}</p>
              <button
                type="button"
                style={{
                  ...styles.actionBtn,
                  boxShadow: `0 0 24px ${action.accent}55`,
                  opacity:
                    action.disabled || loading === action.key ? 0.5 : 1,
                }}
                disabled={action.disabled || loading === action.key}
                onClick={action.onClick}
              >
                {loading === action.key ? "Running…" : "Run"}
              </button>
            </article>
          ))}
        </div>

        <div style={styles.twoCol}>
          <div style={styles.colStack}>
            <JsonPanel title="Load Test Work — response" data={loadResponse} />
            <JsonPanel
              title="Check Readiness — response"
              data={readinessResponse}
            />
            <JsonPanel
              title="Create Submission — response"
              data={createResponse}
            />
          </div>
          <aside style={styles.activityCard}>
            <h3 style={styles.activityTitle}>Activity</h3>
            {activity.length === 0 ? (
              <p style={styles.muted}>No actions yet.</p>
            ) : (
              <ul style={styles.activityList}>
                {activity.map((item) => (
                  <li key={item.id} style={styles.activityItem}>
                    <strong>{item.label}</strong>
                    <span style={styles.muted}>{item.detail}</span>
                    <time style={styles.activityTime}>{item.at}</time>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>

        <section style={styles.queueSection}>
          <div style={styles.queueHeader}>
            <h2 style={styles.queueTitle}>Pending submissions</h2>
            <button
              type="button"
              style={styles.refreshBtn}
              onClick={viewQueue}
              disabled={loading === "queue"}
            >
              Refresh
            </button>
          </div>
          <JsonPanel title="View Queue — response" data={queueResponse} />
          {submissions.length > 0 ? (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {Object.keys(submissions[0]).map((col) => (
                      <th key={col} style={styles.th}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((row, i) => (
                    <tr key={String(row.id ?? i)}>
                      {Object.keys(submissions[0]).map((col) => (
                        <td key={col} style={styles.td}>
                          {formatCell(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: palette.bg,
    color: palette.text,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  sidebar: {
    width: 240,
    flexShrink: 0,
    background: palette.sidebar,
    borderRight: `1px solid ${palette.cardBorder}`,
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
  },
  brand: { display: "flex", gap: 12, alignItems: "center", marginBottom: 32 },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: `linear-gradient(135deg, ${palette.blue}, ${palette.purple})`,
    boxShadow: `0 0 20px ${palette.blue}66`,
  },
  brandTitle: { margin: 0, fontWeight: 700, fontSize: 16 },
  brandSub: { margin: 0, fontSize: 12, color: palette.muted },
  nav: { flex: 1 },
  navLabel: {
    margin: "0 0 8px 8px",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: palette.muted,
  },
  navItem: {
    padding: "10px 12px",
    borderRadius: 8,
    marginBottom: 4,
    fontSize: 14,
  },
  navItemActive: {
    background: `${palette.blue}22`,
    borderLeft: `3px solid ${palette.blue}`,
  },
  navItemDisabled: { color: palette.muted, opacity: 0.5 },
  sidebarFooter: { marginTop: "auto", paddingTop: 16 },
  testPill: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    background: `${palette.amber}33`,
    color: palette.amber,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
  },
  footerNote: { margin: "8px 0 0", fontSize: 12, color: palette.muted },
  main: { flex: 1, padding: 24, overflow: "auto" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  pageTitle: { margin: 0, fontSize: 24, fontWeight: 700 },
  pageSub: { margin: "4px 0 0", color: palette.muted, fontSize: 14 },
  testBadge: {
    padding: "6px 12px",
    borderRadius: 8,
    background: `${palette.purple}33`,
    color: palette.purple,
    fontSize: 12,
    fontWeight: 700,
    boxShadow: `0 0 16px ${palette.purple}44`,
  },
  errorBanner: {
    padding: "12px 16px",
    marginBottom: 16,
    borderRadius: 8,
    background: `${palette.red}22`,
    border: `1px solid ${palette.red}55`,
    color: "#fecaca",
    fontSize: 14,
  },
  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  kpiCard: {
    background: palette.card,
    border: `1px solid ${palette.cardBorder}`,
    borderRadius: 12,
    padding: 16,
  },
  kpiLabel: { margin: 0, fontSize: 12, color: palette.muted },
  kpiValue: {
    margin: "8px 0 0",
    fontSize: 14,
    fontWeight: 600,
    wordBreak: "break-all",
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  actionCard: {
    background: palette.card,
    border: `1px solid ${palette.cardBorder}`,
    borderRadius: 12,
    padding: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "1px solid",
    marginBottom: 12,
  },
  actionTitle: { margin: "0 0 4px", fontSize: 15, fontWeight: 600 },
  actionDesc: { margin: "0 0 12px", fontSize: 12, color: palette.muted },
  actionBtn: {
    width: "100%",
    padding: "10px 14px",
    border: "none",
    borderRadius: 8,
    background: `linear-gradient(135deg, ${palette.blue}, ${palette.purple})`,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
    marginBottom: 24,
  },
  colStack: { display: "flex", flexDirection: "column", gap: 16 },
  jsonPanel: {
    background: palette.card,
    border: `1px solid ${palette.cardBorder}`,
    borderRadius: 12,
    padding: 16,
  },
  jsonTitle: { margin: "0 0 8px", fontSize: 13, fontWeight: 600 },
  jsonPre: {
    margin: 0,
    padding: 12,
    borderRadius: 8,
    background: "#0a0d12",
    border: `1px solid ${palette.cardBorder}`,
    fontSize: 11,
    lineHeight: 1.5,
    overflow: "auto",
    maxHeight: 220,
    color: "#cbd5e1",
  },
  activityCard: {
    background: palette.card,
    border: `1px solid ${palette.cardBorder}`,
    borderRadius: 12,
    padding: 16,
  },
  activityTitle: { margin: "0 0 12px", fontSize: 14, fontWeight: 600 },
  activityList: { listStyle: "none", margin: 0, padding: 0 },
  activityItem: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "10px 0",
    borderBottom: `1px solid ${palette.cardBorder}`,
    fontSize: 13,
  },
  activityTime: { fontSize: 11, color: palette.muted },
  muted: { color: palette.muted, fontSize: 12 },
  queueSection: {
    background: palette.card,
    border: `1px solid ${palette.cardBorder}`,
    borderRadius: 12,
    padding: 16,
  },
  queueHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  queueTitle: { margin: 0, fontSize: 16, fontWeight: 600 },
  refreshBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: `1px solid ${palette.cardBorder}`,
    background: "transparent",
    color: palette.text,
    cursor: "pointer",
    fontSize: 13,
  },
  tableWrap: { overflow: "auto", marginTop: 16 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th: {
    textAlign: "left",
    padding: "8px 10px",
    borderBottom: `1px solid ${palette.cardBorder}`,
    color: palette.muted,
    fontWeight: 600,
  },
  td: {
    padding: "8px 10px",
    borderBottom: `1px solid ${palette.cardBorder}`,
    verticalAlign: "top",
  },
};
