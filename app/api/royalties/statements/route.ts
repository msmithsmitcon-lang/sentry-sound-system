import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { parseRoyaltyStatementCsv } from "@/lib/royalties-v1/royalty-statement-parser";
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context";

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

type StatementStatsRow = StatementRow & {
  matched_count: bigint;
  partial_count: bigint;
  unmatched_count: bigint;
  line_count: bigint;
};

export async function POST(request: Request) {
  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext();

    const formData = await request.formData();
    const file = formData.get("file");
    const sourceName = formData.get("source_name");

    if (!(file instanceof File)) {
      return errorResponse("A CSV file is required.", 400);
    }

    const isCsv =
      file.type === "text/csv" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      return errorResponse("The uploaded file must be a CSV.", 400);
    }

    const resolvedSourceName =
      typeof sourceName === "string" && sourceName.trim() ? sourceName.trim() : "Unknown source";

    const buffer = Buffer.from(await file.arrayBuffer());

    const [statementRow] = await prisma.$queryRaw<StatementRow[]>`
      INSERT INTO public.royalty_statements (
        workspace_id,
        source_name,
        status,
        raw_filename
      )
      VALUES (
        ${workspaceContext.workspace.id}::uuid,
        ${resolvedSourceName},
        'processing',
        ${file.name}
      )
      RETURNING id, source_name, upload_date, period_start, period_end, total_amount, currency, status, raw_filename, created_at
    `;

    const parsed = await parseRoyaltyStatementCsv({
      buffer,
      workspaceId: workspaceContext.workspace.id,
      statementId: statementRow.id,
      sourceName: resolvedSourceName,
    });

    for (const line of parsed.lines) {
      await prisma.$executeRaw`
        INSERT INTO public.royalty_statement_lines (
          statement_id,
          workspace_id,
          raw_title,
          raw_artist,
          raw_amount,
          raw_isrc,
          matched_work_id,
          match_status,
          attention_reason
        )
        VALUES (
          ${statementRow.id}::uuid,
          ${workspaceContext.workspace.id}::uuid,
          ${line.rawTitle},
          ${line.rawArtist},
          ${line.rawAmount},
          ${line.rawIsrc},
          ${line.matchedWorkId}::uuid,
          ${line.matchStatus},
          ${line.attentionReason}
        )
      `;
    }

    const finalStatus = parsed.unmatchedCount > 0 || parsed.partialCount > 0 ? "needs_attention" : "matched";

    const [updatedStatement] = await prisma.$queryRaw<StatementRow[]>`
      UPDATE public.royalty_statements
      SET total_amount = ${parsed.totalAmount}, status = ${finalStatus}
      WHERE id = ${statementRow.id}::uuid
      RETURNING id, source_name, upload_date, period_start, period_end, total_amount, currency, status, raw_filename, created_at
    `;

    return NextResponse.json(
      {
        success: true,
        statement: serializeStatement(updatedStatement),
        lines: parsed.lines.map((line) => ({
          rawTitle: line.rawTitle,
          rawAmount: line.rawAmount,
          matchedWorkId: line.matchedWorkId,
          matchedWorkTitle: line.matchedWorkTitle,
          matchStatus: line.matchStatus,
          attentionReason: line.attentionReason,
        })),
        summary: {
          lineCount: parsed.lines.length,
          matchedCount: parsed.matchedCount,
          partialCount: parsed.partialCount,
          unmatchedCount: parsed.unmatchedCount,
          totalAmount: parsed.totalAmount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET() {
  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext();

    const rows = await prisma.$queryRaw<StatementStatsRow[]>`
      SELECT
        rs.id,
        rs.source_name,
        rs.upload_date,
        rs.period_start,
        rs.period_end,
        rs.total_amount,
        rs.currency,
        rs.status,
        rs.raw_filename,
        rs.created_at,
        COALESCE(COUNT(rsl.id), 0) AS line_count,
        COALESCE(COUNT(rsl.id) FILTER (WHERE rsl.match_status = 'matched'), 0) AS matched_count,
        COALESCE(COUNT(rsl.id) FILTER (WHERE rsl.match_status = 'partial'), 0) AS partial_count,
        COALESCE(COUNT(rsl.id) FILTER (WHERE rsl.match_status = 'unmatched'), 0) AS unmatched_count
      FROM public.royalty_statements rs
      LEFT JOIN public.royalty_statement_lines rsl ON rsl.statement_id = rs.id
      WHERE rs.workspace_id = ${workspaceContext.workspace.id}::uuid
      GROUP BY rs.id, rs.source_name, rs.upload_date, rs.period_start, rs.period_end, rs.total_amount, rs.currency, rs.status, rs.raw_filename, rs.created_at
      ORDER BY rs.upload_date DESC
    `;

    return NextResponse.json({
      success: true,
      statements: rows.map((row) => ({
        ...serializeStatement(row),
        lineCount: Number(row.line_count),
        matchedCount: Number(row.matched_count),
        partialCount: Number(row.partial_count),
        unmatchedCount: Number(row.unmatched_count),
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

function serializeStatement(row: StatementRow) {
  return {
    id: row.id,
    sourceName: row.source_name,
    uploadDate: row.upload_date,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    totalAmount: row.total_amount === null ? null : Number(row.total_amount),
    currency: row.currency,
    status: row.status,
    rawFilename: row.raw_filename,
    createdAt: row.created_at,
  };
}

function errorResponse(error: unknown, explicitStatus?: number) {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "Royalty statement request failed.";

  const status = explicitStatus ?? (message === "Authentication required." ? 401 : 400);

  return NextResponse.json({ success: false, error: message }, { status });
}
