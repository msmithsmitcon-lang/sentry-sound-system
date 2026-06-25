import { randomUUID } from "crypto"

import { prisma } from "@/lib/db/prisma"

/**
 * Emits a Music Domain Pack event into the local persisted log.
 *
 * Payload shape must match the canonical contract defined in
 * plexicon-contracts/src/contracts/domain-packs/music — snake_case
 * fields, canonical primitive composition (event_id, event_type,
 * event_version, event_timestamp, tenant_id, institution_id, actor_id,
 * correlation_id, causation_id, governance_context, audit, etc.).
 *
 * This does not call plexicon-contracts directly — there is no live
 * cross-repo event transport yet (Plexicon's Integration Layer is
 * OUTSTANDING per PLEXICON_ENTERPRISE_GAPS_AND_OUTSTANDING_LAYERS_V1.md).
 * Persisting here in the canonical shape keeps this replay-safe and
 * ready to forward once real transport exists.
 */
export async function emitMusicDomainEvent(input: {
  eventType: string
  workspaceId: string
  payload: Record<string, unknown>
}): Promise<void> {
  const event = {
    event_id: randomUUID(),
    event_type: input.eventType,
    event_version: "v1",
    event_timestamp: new Date().toISOString(),
    ...input.payload,
  }

  // Structured console log — observable immediately in server logs.
  console.log(`[plexicon-domain-event] ${input.eventType}`, JSON.stringify(event))

  await prisma.$executeRaw`
    INSERT INTO public.plexicon_domain_events (workspace_id, event_type, event_version, payload)
    VALUES (${input.workspaceId}::uuid, ${input.eventType}, 'v1', ${JSON.stringify(event)}::jsonb)
  `
}
