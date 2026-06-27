import { prisma } from "@/lib/db/prisma";
import { emitMusicDomainEvent } from "@/lib/plexicon-events/emit-domain-event";

export type RoyaltyMatchStatus = "matched" | "unmatched" | "partial";

export type ParsedRoyaltyLine = {
  rawTitle: string;
  rawArtist: string | null;
  rawAmount: number;
  rawIsrc: string | null;
  matchedWorkId: string | null;
  matchedWorkTitle: string | null;
  matchStatus: RoyaltyMatchStatus;
  attentionReason: string | null;
};

export type ParsedRoyaltyStatement = {
  lines: ParsedRoyaltyLine[];
  totalAmount: number;
  matchedCount: number;
  unmatchedCount: number;
  partialCount: number;
};

type WorkRow = {
  id: string;
  work_title: string;
  isrc: string | null;
};

// Different royalty sources (SAMRO, DistroKid, TuneCore, ...) export the
// same four facts under different column names. Map every known alias to
// one canonical field rather than hard-coding one source's header format.
const HEADER_ALIASES: Record<string, "title" | "artist" | "amount" | "isrc"> = {
  title: "title",
  "song title": "title",
  "track": "title",
  "track title": "title",
  "work title": "title",
  "release title": "title",
  "song": "title",
  artist: "artist",
  "artist name": "artist",
  performer: "artist",
  amount: "amount",
  "net amount": "amount",
  "royalty amount": "amount",
  earnings: "amount",
  "amount (zar)": "amount",
  "net payable": "amount",
  total: "amount",
  "total amount": "amount",
  isrc: "isrc",
  "isrc code": "isrc",
};

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeTitleForMatch(title: string): string {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// Minimal dependency-free CSV parser: handles quoted fields, embedded
// commas, and escaped quotes ("") — covers the statement exports this
// service needs without adding a new dependency to the tech stack.
function parseCsvText(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim().length > 0));
}

type RawRow = {
  title: string;
  artist: string | null;
  amount: number;
  isrc: string | null;
};

function extractRawRows(csvText: string): RawRow[] {
  const rows = parseCsvText(csvText);
  if (rows.length === 0) return [];

  const headerRow = rows[0];
  const columnIndexToField = new Map<number, "title" | "artist" | "amount" | "isrc">();
  headerRow.forEach((header, index) => {
    const field = HEADER_ALIASES[normalizeHeader(header)];
    if (field) columnIndexToField.set(index, field);
  });

  const dataRows = rows.slice(1);
  const rawRows: RawRow[] = [];

  for (const cells of dataRows) {
    const fields: Record<string, string> = {};
    columnIndexToField.forEach((field, index) => {
      fields[field] = (cells[index] ?? "").trim();
    });

    const title = fields.title ?? "";
    if (!title) continue;

    const amountText = (fields.amount ?? "").replace(/[^0-9.\-]/g, "");
    const amount = amountText ? Number.parseFloat(amountText) : 0;

    rawRows.push({
      title,
      artist: fields.artist || null,
      amount: Number.isFinite(amount) ? amount : 0,
      isrc: fields.isrc ? fields.isrc.trim().toUpperCase() : null,
    });
  }

  return rawRows;
}

async function getWorkspaceWorks(workspaceId: string): Promise<WorkRow[]> {
  return prisma.$queryRaw<WorkRow[]>`
    SELECT id, work_title, isrc
    FROM public.musical_works
    WHERE workspace_id = ${workspaceId}::uuid
  `;
}

function matchRow(row: RawRow, works: WorkRow[]): {
  matchedWorkId: string | null;
  matchedWorkTitle: string | null;
  matchStatus: RoyaltyMatchStatus;
  attentionReason: string | null;
} {
  if (row.isrc) {
    const isrcMatch = works.find((work) => work.isrc && work.isrc.toUpperCase() === row.isrc);
    if (isrcMatch) {
      return {
        matchedWorkId: isrcMatch.id,
        matchedWorkTitle: isrcMatch.work_title,
        matchStatus: "matched",
        attentionReason: null,
      };
    }
  }

  const normalizedRowTitle = normalizeTitleForMatch(row.title);

  const exactTitleMatch = works.find(
    (work) => normalizeTitleForMatch(work.work_title) === normalizedRowTitle
  );
  if (exactTitleMatch) {
    return {
      matchedWorkId: exactTitleMatch.id,
      matchedWorkTitle: exactTitleMatch.work_title,
      matchStatus: "matched",
      attentionReason: null,
    };
  }

  const partialTitleMatch = works.find((work) => {
    const normalizedWorkTitle = normalizeTitleForMatch(work.work_title);
    return (
      normalizedWorkTitle.length > 0 &&
      (normalizedRowTitle.includes(normalizedWorkTitle) ||
        normalizedWorkTitle.includes(normalizedRowTitle))
    );
  });
  if (partialTitleMatch) {
    return {
      matchedWorkId: partialTitleMatch.id,
      matchedWorkTitle: partialTitleMatch.work_title,
      matchStatus: "partial",
      attentionReason: `This looks like it might be "${partialTitleMatch.work_title}", but the title on the statement doesn't match exactly. Please confirm.`,
    };
  }

  return {
    matchedWorkId: null,
    matchedWorkTitle: null,
    matchStatus: "unmatched",
    attentionReason: `We couldn't find a song titled "${row.title}" in your workspace.`,
  };
}

export async function parseRoyaltyStatementCsv(input: {
  buffer: Buffer;
  workspaceId: string;
  statementId: string;
  sourceName: string;
}): Promise<ParsedRoyaltyStatement> {
  const csvText = input.buffer.toString("utf8");
  const rawRows = extractRawRows(csvText);
  const works = await getWorkspaceWorks(input.workspaceId);

  const lines: ParsedRoyaltyLine[] = rawRows.map((row) => {
    const match = matchRow(row, works);
    return {
      rawTitle: row.title,
      rawArtist: row.artist,
      rawAmount: row.amount,
      rawIsrc: row.isrc,
      matchedWorkId: match.matchedWorkId,
      matchedWorkTitle: match.matchedWorkTitle,
      matchStatus: match.matchStatus,
      attentionReason: match.attentionReason,
    };
  });

  const totalAmount = lines.reduce((sum, line) => sum + line.rawAmount, 0);
  const matchedCount = lines.filter((line) => line.matchStatus === "matched").length;
  const partialCount = lines.filter((line) => line.matchStatus === "partial").length;
  const unmatchedCount = lines.filter((line) => line.matchStatus === "unmatched").length;

  await emitMusicDomainEvent({
    eventType: "plexicon.domain.music.royalty_ingestion.completed",
    workspaceId: input.workspaceId,
    payload: {
      statement_id: input.statementId,
      source_name: input.sourceName,
      line_count: lines.length,
      matched_count: matchedCount,
      partial_count: partialCount,
      unmatched_count: unmatchedCount,
      total_amount: totalAmount,
    },
  });

  return { lines, totalAmount, matchedCount, unmatchedCount, partialCount };
}
