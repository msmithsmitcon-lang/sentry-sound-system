/**
 * Release Readiness Service
 *
 * Architectural principle: This service is a diagnostic and
 * orchestration layer. It diagnoses what is stopping release
 * readiness and recommends which Sentry Sound service or
 * ecosystem capability is best placed to resolve it.
 *
 * Today: recommended_service links to platform actions.
 * Future: recommended_service may invoke Chronicle DAWG,
 * AI services, Managed Compliance, or partner services —
 * without changing this architecture.
 *
 * Promise: "You'll always know if your music is ready to release."
 */

import { prisma } from "@/lib/db/prisma";

export type ReadinessCheckStatus = "complete" | "missing" | "attention";

export type ReadinessCheck = {
  key: string;
  label: string;
  status: ReadinessCheckStatus;
  description: string;
  action: string | null;
  action_href: string | null;
};

export type ReleaseReadinessReport = {
  overall_score: number;
  checks: ReadinessCheck[];
  ready_to_release: boolean;
  next_action: string;
};

type FactsRow = {
  isrc: string | null;
  bpm: number | null;
  musical_key: string | null;
  audio_count: number;
  artwork_count: number;
  contributor_count: number;
  unconfirmed_contributor_count: number;
  split_total: number;
  certificate_count: number;
  cmo_pack_count: number;
};

export async function getReleaseReadinessReport(input: {
  workId: string;
  workspaceId: string;
}): Promise<ReleaseReadinessReport> {
  const rows = await prisma.$queryRaw<FactsRow[]>`
    SELECT
      mw.isrc,
      mw.bpm,
      mw.musical_key,
      COALESCE(audio_summary.audio_count, 0)::int AS audio_count,
      COALESCE(artwork_summary.artwork_count, 0)::int AS artwork_count,
      COALESCE(contributor_summary.contributor_count, 0)::int AS contributor_count,
      COALESCE(contributor_summary.unconfirmed_contributor_count, 0)::int AS unconfirmed_contributor_count,
      COALESCE(contributor_summary.split_total, 0)::float8 AS split_total,
      COALESCE(certificate_summary.certificate_count, 0)::int AS certificate_count,
      COALESCE(cmo_summary.cmo_pack_count, 0)::int AS cmo_pack_count
    FROM public.musical_works mw
    LEFT JOIN LATERAL (
      SELECT COUNT(fvl.id)::int AS audio_count
      FROM public.file_vault_links fvl
      INNER JOIN public.file_vault_items fvi
        ON fvi.id = fvl.file_vault_item_id AND fvi.workspace_id = fvl.workspace_id
      WHERE fvl.workspace_id = ${input.workspaceId}::uuid
        AND fvl.linked_record_type = 'musical_work'
        AND fvl.linked_record_id = mw.id
        AND fvi.file_category = 'master_audio'
    ) audio_summary ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(fvl.id)::int AS artwork_count
      FROM public.file_vault_links fvl
      INNER JOIN public.file_vault_items fvi
        ON fvi.id = fvl.file_vault_item_id AND fvi.workspace_id = fvl.workspace_id
      WHERE fvl.workspace_id = ${input.workspaceId}::uuid
        AND fvl.linked_record_type = 'musical_work'
        AND fvl.linked_record_id = mw.id
        AND fvi.file_category = 'artwork'
    ) artwork_summary ON true
    LEFT JOIN LATERAL (
      SELECT
        COUNT(wc.id)::int AS contributor_count,
        COUNT(wc.id) FILTER (WHERE COALESCE(wc.confirmed, false) = false)::int AS unconfirmed_contributor_count,
        COALESCE(SUM(wc.percentage), 0)::float8 AS split_total
      FROM public.work_contributors wc
      WHERE wc.work_id = mw.id
        AND wc.workspace_id = ${input.workspaceId}::uuid
    ) contributor_summary ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(cc.id)::int AS certificate_count
      FROM public.collaboration_certificates cc
      WHERE cc.work_id = mw.id AND cc.workspace_id = ${input.workspaceId}::uuid
    ) certificate_summary ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(pde.id)::int AS cmo_pack_count
      FROM public.plexicon_domain_events pde
      WHERE pde.workspace_id = ${input.workspaceId}::uuid
        AND pde.event_type = 'plexicon.domain.music.submission_pack.generated'
        AND pde.payload->>'song_id' = mw.id::text
    ) cmo_summary ON true
    WHERE mw.id = ${input.workId}::uuid
      AND mw.workspace_id = ${input.workspaceId}::uuid
    LIMIT 1
  `;

  const facts = rows[0];
  if (!facts) {
    throw new Error("Work not found.");
  }

  const basePath = `/dashboard/works/details/${input.workId}`;
  const hasIsrc = Boolean(facts.isrc && facts.isrc.trim());
  const hasKey = Boolean(facts.musical_key && facts.musical_key.trim());
  const allContributorsConfirmed = facts.contributor_count > 0 && facts.unconfirmed_contributor_count === 0;
  const splitsComplete = facts.split_total === 100;

  const checks: ReadinessCheck[] = [
    {
      key: "AUDIO_READY",
      label: "Master audio uploaded",
      status: facts.audio_count > 0 ? "complete" : "missing",
      description: "Your final master recording is stored and ready to package for release.",
      action: facts.audio_count > 0 ? null : "Upload your master WAV or MP3 file",
      action_href: facts.audio_count > 0 ? null : `${basePath}?tab=supporting-materials`,
    },
    {
      key: "ARTWORK_READY",
      label: "Artwork ready",
      status: facts.artwork_count > 0 ? "complete" : "missing",
      description: "Cover artwork is attached and ready for release.",
      action: facts.artwork_count > 0 ? null : "Upload cover artwork (JPG or PNG)",
      action_href: facts.artwork_count > 0 ? null : `${basePath}?tab=supporting-materials`,
    },
    {
      key: "CONTRIBUTORS_CONFIRMED",
      label: "All contributors confirmed",
      status: allContributorsConfirmed ? "complete" : facts.contributor_count > 0 ? "attention" : "missing",
      description: "Every contributor has confirmed their role and share of this song.",
      action: allContributorsConfirmed ? null : "Remind contributors to confirm",
      action_href: allContributorsConfirmed ? null : `${basePath}?tab=contributors-splits`,
    },
    {
      key: "SPLITS_COMPLETE",
      label: "Revenue shares agreed",
      status: splitsComplete ? "complete" : facts.split_total > 0 ? "attention" : "missing",
      description: "Contributor revenue shares add up to exactly 100%.",
      action: splitsComplete ? null : "Check split percentages add to 100%",
      action_href: splitsComplete ? null : `${basePath}?tab=contributors-splits`,
    },
    {
      key: "CERTIFICATE_ISSUED",
      label: "Proof of creation issued",
      status: facts.certificate_count > 0 ? "complete" : "missing",
      description: "A timestamped proof-of-creation certificate has been generated for this song.",
      action: facts.certificate_count > 0 ? null : "Generate your proof of creation",
      action_href: facts.certificate_count > 0 ? null : basePath,
    },
    {
      key: "ISRC_ASSIGNED",
      label: "Track ID (ISRC) assigned",
      status: hasIsrc ? "complete" : "missing",
      description: "Your song has a unique recording identifier used by stores and collecting societies.",
      action: hasIsrc ? null : "Add your ISRC code in Song Basics",
      action_href: hasIsrc ? null : `${basePath}?tab=captured-basics`,
    },
    {
      key: "BPM_CAPTURED",
      label: "Tempo recorded",
      status: facts.bpm !== null ? "complete" : "missing",
      description: "The song's tempo (BPM) is recorded for catalogue and sync purposes.",
      action: facts.bpm !== null ? null : "Add the tempo in Song Basics",
      action_href: facts.bpm !== null ? null : `${basePath}?tab=captured-basics`,
    },
    {
      key: "KEY_CAPTURED",
      label: "Musical key recorded",
      status: hasKey ? "complete" : "missing",
      description: "The song's musical key is recorded for catalogue and sync purposes.",
      action: hasKey ? null : "Add the musical key in Song Basics",
      action_href: hasKey ? null : `${basePath}?tab=captured-basics`,
    },
    {
      key: "CMO_PACK_GENERATED",
      label: "Registration pack prepared",
      status: facts.cmo_pack_count > 0 ? "complete" : "missing",
      description: "Your SAMRO/CAPASSO/SAMPRA submission pack has been generated.",
      action: facts.cmo_pack_count > 0 ? null : "Generate your SAMRO/CAPASSO/SAMPRA pack",
      action_href: facts.cmo_pack_count > 0 ? null : basePath,
    },
  ];

  const completeCount = checks.filter((check) => check.status === "complete").length;
  const overallScore = Math.round((completeCount / checks.length) * 100);
  const readyToRelease = overallScore >= 80;

  const firstIncomplete = checks.find((check) => check.status !== "complete");
  const nextAction =
    firstIncomplete?.action ?? "Your release is ready — review everything once more before you release.";

  return {
    overall_score: overallScore,
    checks,
    ready_to_release: readyToRelease,
    next_action: nextAction,
  };
}
