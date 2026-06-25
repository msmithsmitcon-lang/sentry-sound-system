import { prisma } from "@/lib/db/prisma";

export type DashboardProject = {
  id: string;
  workTitle: string;
  registrationStatus: string | null;
  hasCertificate: boolean;
};

export type SplitAttentionItem = {
  workTitle: string;
  contributorName: string;
};

type ProjectRow = {
  id: string;
  work_title: string | null;
  registration_status: string | null;
  has_certificate: boolean;
};

type AttentionRow = {
  work_title: string | null;
  contributor_name: string | null;
};

export async function getDashboardHomeData(input: { workspaceId: string }): Promise<{
  projects: DashboardProject[];
  attentionItems: SplitAttentionItem[];
}> {
  const [projectRows, attentionRows] = await Promise.all([
    prisma.$queryRaw<ProjectRow[]>`
      SELECT
        mw.id,
        mw.work_title,
        mw.registration_status,
        EXISTS (
          SELECT 1 FROM public.collaboration_certificates cc WHERE cc.work_id = mw.id
        ) AS has_certificate
      FROM public.musical_works mw
      WHERE mw.workspace_id = ${input.workspaceId}::uuid
      ORDER BY mw.created_at DESC
      LIMIT 25
    `,
    prisma.$queryRaw<AttentionRow[]>`
      SELECT
        mw.work_title,
        c.full_name AS contributor_name
      FROM public.work_contributors wc
      JOIN public.musical_works mw ON mw.id = wc.work_id
      JOIN public.contributors c ON c.id = wc.contributor_id
      WHERE wc.workspace_id = ${input.workspaceId}::uuid
        AND wc.confirmed = false
      ORDER BY wc.created_at DESC
      LIMIT 10
    `,
  ]);

  return {
    projects: projectRows.map((row) => ({
      id: row.id,
      workTitle: row.work_title ?? "Untitled song",
      registrationStatus: row.registration_status,
      hasCertificate: row.has_certificate,
    })),
    attentionItems: attentionRows
      .filter((row) => row.work_title && row.contributor_name)
      .map((row) => ({
        workTitle: row.work_title as string,
        contributorName: row.contributor_name as string,
      })),
  };
}
