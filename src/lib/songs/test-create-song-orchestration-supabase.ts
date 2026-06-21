import { supabaseAdmin } from "@/lib/supabaseAdmin"

import {
  TEST_CREATE_SONG_ORCHESTRATION_MODE,
  TestCreateSongOrchestrationRecord,
  TestCreateSongOrchestrationRepository,
} from "./test-create-song-orchestration"

type WorkspaceActivityRow = {
  id: string
  metadata: Record<string, unknown>
}

export const testCreateSongOrchestrationSupabaseRepository: TestCreateSongOrchestrationRepository =
  {
    async recordOrchestration(record) {
      const { data, error } = await supabaseAdmin
        .from("workspace_activity")
        .insert({
          workspace_id: record.songDraftSummary.workspaceId,
          activity_type: "test_create_song_orchestration",
          entity_type: "song",
          entity_id: record.songDraftSummary.songId,
          message: `TEST create song orchestration: ${record.songDraftSummary.title}`,
          performed_by:
            (record.auditEventSummary as { actorUserId?: string | null })
              .actorUserId ?? null,
          metadata: {
            testCreateSongOrchestration: record,
            operationalAuditEvent: record.auditEventSummary,
            lifecycleEvent: record.lifecycleEventSummary,
            routeMode: TEST_CREATE_SONG_ORCHESTRATION_MODE,
            productionActivation: false,
            persistenceTable: "workspace_activity",
          },
        })
        .select("id,metadata")
        .single()

      if (error) throw new Error(error.message)

      return mapWorkspaceActivityRowToRecord(data)
    },
  }

function mapWorkspaceActivityRowToRecord(
  row: WorkspaceActivityRow
): TestCreateSongOrchestrationRecord {
  const record = row.metadata?.testCreateSongOrchestration
  if (record && typeof record === "object") {
    return {
      ...(record as TestCreateSongOrchestrationRecord),
      orchestrationId: row.id,
    }
  }

  throw new Error(
    `Workspace activity row ${row.id} does not contain testCreateSongOrchestration.`
  )
}
