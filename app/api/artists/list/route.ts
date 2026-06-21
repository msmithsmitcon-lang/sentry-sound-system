import { NextResponse } from "next/server";
import { Pool } from "pg";

import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context";

type ArtistListRow = {
  artist_profile_id: string;
  display_name: string;
  artist_type: string;
  primary_genre: string | null;
  status: string;
};

const globalForArtistListPool = globalThis as unknown as {
  artistListPool?: Pool;
};

function getArtistListPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
  }

  if (!globalForArtistListPool.artistListPool) {
    globalForArtistListPool.artistListPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return globalForArtistListPool.artistListPool;
}

export async function GET() {
  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext();
    const pool = getArtistListPool();

    const result = await pool.query<ArtistListRow>(
      `
        select
          ap.id as artist_profile_id,
          coalesce(nullif(ap.stage_name, ''), cc.display_name) as display_name,
          ap.artist_type,
          ap.primary_genre,
          ap.lifecycle_status as status
        from public.artist_profiles ap
        inner join public.crm_contacts cc
          on cc.id = ap.crm_contact_id
        where ap.workspace_id = $1::uuid
        order by lower(coalesce(nullif(ap.stage_name, ''), cc.display_name)) asc
        limit 100
      `,
      [workspaceContext.workspace.id]
    );

    return NextResponse.json({
      success: true,
      artists: result.rows.map((row) => ({
        artistProfileId: row.artist_profile_id,
        displayName: row.display_name,
        stageName: row.display_name,
        artistType: row.artist_type,
        primaryGenre: row.primary_genre ?? "",
        status: row.status,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load artists.";
    const status = message === "Authentication required." ? 401 : 400;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}
