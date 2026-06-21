import { NextResponse } from "next/server";
import { Pool, type PoolClient } from "pg";

import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context";

type ContributorPayload = {
  contributorId?: unknown;
  name?: unknown;
  role?: unknown;
  splitType?: unknown;
  percentage?: unknown;
  ipi?: unknown;
};

type PersistedContributor = {
  id: string;
  contributorId: string;
  name: string;
  role: string;
  splitType: string;
  percentage: number;
  ipi: string | null;
  confirmed: boolean;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const globalForWorkContributorsPool = globalThis as unknown as {
  workContributorsPool?: Pool;
};

function getPool() {
  if (!globalForWorkContributorsPool.workContributorsPool) {
    globalForWorkContributorsPool.workContributorsPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return globalForWorkContributorsPool.workContributorsPool;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params;

  if (!UUID_PATTERN.test(workId)) {
    return NextResponse.json({ success: false, error: "Invalid work ID." }, { status: 400 });
  }

  try {
    const authContext = await getAuthenticatedWorkspaceContext();
    const contributors = await readWorkContributors(workId, authContext.workspace.id);

    return NextResponse.json({
      success: true,
      contributors,
      splitTotal: contributors.reduce((sum, contributor) => sum + contributor.percentage, 0),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load contributors.";
    const status =
      message === "Authentication required."
        ? 401
        : message === "Work not found."
          ? 404
          : 500;

    return NextResponse.json(
      { success: false, error: status === 500 ? "Failed to load contributors." : message },
      { status }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params;

  if (!UUID_PATTERN.test(workId)) {
    return NextResponse.json({ success: false, error: "Invalid work ID." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as { contributors?: ContributorPayload[] };
    const authContext = await getAuthenticatedWorkspaceContext();
    const contributors = normalizeContributors(body.contributors);
    const invalidContributor = contributors.find(
      (contributor) =>
        !Number.isFinite(contributor.percentage) ||
        contributor.percentage < 0 ||
        contributor.percentage > 100
    );
    const splitTotal = roundSplitTotal(
      contributors.reduce((sum, contributor) => sum + contributor.percentage, 0)
    );

    if (contributors.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one contributor is required." },
        { status: 400 }
      );
    }

    if (invalidContributor) {
      return NextResponse.json(
        { success: false, error: "Contributor percentages must be between 0 and 100%." },
        { status: 400 }
      );
    }

    if (splitTotal !== 100) {
      return NextResponse.json(
        { success: false, error: "Contributor split total must equal 100%." },
        { status: 400 }
      );
    }

    const savedContributors = await replaceWorkContributors({
      workId,
      workspaceId: authContext.workspace.id,
      createdByUserId: authContext.user.clerkUserId,
      contributors,
    });

    return NextResponse.json({
      success: true,
      contributors: savedContributors,
      splitTotal,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save contributors.";
    const status =
      message === "Authentication required."
        ? 401
        : message === "Work not found."
          ? 404
          : 400;

    return NextResponse.json(
      { success: false, error: status === 400 ? message : message },
      { status }
    );
  }
}

function normalizeContributors(input: ContributorPayload[] | undefined) {
  if (!Array.isArray(input)) return [];

  return input
    .map((contributor) => {
      const contributorId = readString(contributor.contributorId);
      const name = readString(contributor.name);
      const role = readString(contributor.role) || "composer";
      const splitType = readString(contributor.splitType) || "composition";
      const percentage = Number(contributor.percentage ?? 0);
      const ipi = readString(contributor.ipi);

      return {
        contributorId,
        name,
        role,
        splitType,
        percentage,
        ipi,
      };
    })
    .filter((contributor) => contributor.name);
}

async function replaceWorkContributors(input: {
  workId: string;
  workspaceId: string;
  createdByUserId: string;
  contributors: ReturnType<typeof normalizeContributors>;
}) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await assertWorkBelongsToWorkspace(client, input.workId, input.workspaceId);

    await client.query(
      `
        delete from public.work_contributors
        where work_id = $1::uuid
          and workspace_id = $2::uuid
      `,
      [input.workId, input.workspaceId]
    );

    const savedContributors: PersistedContributor[] = [];

    for (const contributor of input.contributors) {
      const contributorId = await resolveContributorId(client, {
        workspaceId: input.workspaceId,
        createdByUserId: input.createdByUserId,
        contributorId: contributor.contributorId,
        name: contributor.name,
        role: contributor.role,
        ipi: contributor.ipi,
      });

      const inserted = await client.query<PersistedContributor>(
        `
          insert into public.work_contributors (
            workspace_id,
            created_by_user_id,
            work_id,
            contributor_id,
            role,
            split_type,
            percentage,
            confirmed
          )
          values ($1::uuid, $2::text, $3::uuid, $4::uuid, $5::text, $6::text, $7::numeric, false)
          returning
            id,
            contributor_id as "contributorId",
            $8::text as name,
            role,
            split_type as "splitType",
            percentage::float8 as percentage,
            $9::text as ipi,
            confirmed
        `,
        [
          input.workspaceId,
          input.createdByUserId,
          input.workId,
          contributorId,
          contributor.role,
          contributor.splitType,
          contributor.percentage,
          contributor.name,
          contributor.ipi,
        ]
      );

      savedContributors.push(inserted.rows[0]);
    }

    await client.query("COMMIT");

    return savedContributors;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function assertWorkBelongsToWorkspace(
  client: PoolClient,
  workId: string,
  workspaceId: string
) {
  const result = await client.query<{ id: string }>(
    `
      select id
      from public.musical_works
      where id = $1::uuid
        and workspace_id = $2::uuid
      limit 1
    `,
    [workId, workspaceId]
  );

  if (!result.rowCount) {
    throw new Error("Work not found.");
  }
}

async function resolveContributorId(
  client: PoolClient,
  input: {
    workspaceId: string;
    createdByUserId: string;
    contributorId: string;
    name: string;
    role: string;
    ipi: string;
  }
) {
  if (input.contributorId && UUID_PATTERN.test(input.contributorId)) {
    const existing = await client.query<{ id: string }>(
      `
        select id
        from public.contributors
        where id = $1::uuid
          and workspace_id = $2::uuid
        limit 1
      `,
      [input.contributorId, input.workspaceId]
    );

    if (existing.rows[0]?.id) return existing.rows[0].id;
  }

  const matched = await client.query<{ id: string }>(
    `
      select id
      from public.contributors
      where lower(full_name) = lower($1::text)
        and workspace_id = $2::uuid
      limit 1
    `,
    [input.name, input.workspaceId]
  );

  if (matched.rows[0]?.id) {
    await updateContributorMetadata(client, matched.rows[0].id, input.ipi);
    return matched.rows[0].id;
  }

  const metadata = {
    song_capture_v2: {
      ipi_id: input.ipi || null,
      source: "song_capture_v2_contributor_runtime_slice_v1",
    },
  };
  const created = await client.query<{ id: string }>(
    `
      insert into public.contributors (
        workspace_id,
        created_by_user_id,
        full_name,
        stage_name,
        role,
        contributor_type,
        metadata
      )
      values ($1::uuid, $2::text, $3::text, $3::text, $4::text, 'person', $5::jsonb)
      returning id
    `,
    [input.workspaceId, input.createdByUserId, input.name, input.role, JSON.stringify(metadata)]
  );

  return created.rows[0].id;
}

async function updateContributorMetadata(
  client: PoolClient,
  contributorId: string,
  ipi: string
) {
  if (!ipi) return;

  await client.query(
    `
      update public.contributors
      set metadata = coalesce(metadata, '{}'::jsonb) || $2::jsonb
      where id = $1::uuid
    `,
    [
      contributorId,
      JSON.stringify({
        song_capture_v2: {
          ipi_id: ipi,
          source: "song_capture_v2_contributor_runtime_slice_v1",
        },
      }),
    ]
  );
}

async function readWorkContributors(workId: string, workspaceId: string) {
  const pool = getPool();
  const result = await pool.query<PersistedContributor>(
    `
      select
        wc.id,
        wc.contributor_id as "contributorId",
        coalesce(c.stage_name, c.full_name) as name,
        wc.role,
        wc.split_type as "splitType",
        coalesce(wc.percentage, 0)::float8 as percentage,
        c.metadata #>> '{song_capture_v2,ipi_id}' as ipi,
        coalesce(wc.confirmed, false) as confirmed
      from public.work_contributors wc
      inner join public.contributors c on c.id = wc.contributor_id
      where wc.work_id = $1::uuid
        and wc.workspace_id = $2::uuid
        and c.workspace_id = $2::uuid
      order by wc.created_at asc, wc.id asc
    `,
    [workId, workspaceId]
  );

  return result.rows;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function roundSplitTotal(value: number) {
  return Math.round(value * 100) / 100;
}
