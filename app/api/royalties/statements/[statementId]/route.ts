import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type StatementRow = {
  id: string;
  source_name: string;
  upload_date: Date;
  period_start: Date | null;
  period_end: Date | null;
  total_amount: string | null;
  currency: string;
  status: string;
  raw_filename: string | null;
  created_at: Date;
};

type LineRow = {
  raw_title: string;
  raw_amount: string;
  matched_work_id: string | null;
  matched_work_title: string | null;
  match_status: string;
  attention_reason: string | null;
};

export async function GET(_request: Request, context: { params: Promise<{ statementId: string }> }) {
  const { statementId } = await context.params;

  if (!UUID_PATTERN.test(statementId)) {
    return NextResponse.json({ success: false, error: "Invalid statement ID." }, { status: 400 });
  }

  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext();

    const [statementRow] = await prisma.$queryRaw<StatementRow[]>`
      SELECT id, source_name, upload_date, period_start, period_end, total_amount, currency, status, raw_filename, created_at
      FROM public.royalty_statements
      WHERE id = ${statementId}::uuid AND workspace_id = ${workspaceContext.workspace.id}::uuid
    `;

    if (!statementRow) {
      return NextResponse.json({ success: false, error: "Statement not found." }, { status: 404 });
    }

    const lineRows = await prisma.$queryRaw<LineRow[]>`
      SELECT
        rsl.raw_title,
        rsl.raw_amount,
        rsl.matched_work_id,
        mw.work_title AS matched_work_title,
        rsl.match_status,
        rsl.attention_reason
      FROM public.royalty_statement_lines rsl
      LEFT JOIN public.musical_works mw ON mw.id = rsl.matched_work_id
      WHERE rsl.statement_id = ${statementId}::uuid AND rsl.workspace_id = ${workspaceContext.workspace.id}::uuid
      ORDER BY rsl.created_at ASC
    `;

    return NextResponse.json({
      success: true,
      statement: {
        id: statementRow.id,
        sourceName: statementRow.source_name,
        uploadDate: statementRow.upload_date,
        periodStart: statementRow.period_start,
        periodEnd: statementRow.period_end,
        totalAmount: statementRow.total_amount === null ? null : Number(statementRow.total_amount),
        currency: statementRow.currency,
        status: statementRow.status,
        rawFilename: statementRow.raw_filename,
        createdAt: statementRow.created_at,
      },
      lines: lineRows.map((row) => ({
        rawTitle: row.raw_title,
        rawAmount: Number(row.raw_amount),
        matchedWorkId: row.matched_work_id,
        matchedWorkTitle: row.matched_work_title,
        matchStatus: row.match_status,
        attentionReason: row.attention_reason,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load statement.";
    const status = message === "Authentication required." ? 401 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
