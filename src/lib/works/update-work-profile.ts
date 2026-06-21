import { updateCanonicalWorkProfile } from "./work-profile-update-repository"
import {
  WORK_PROFILE_UPDATE_MODE,
  WORK_PROFILE_UPDATE_SOURCE,
  type WorkProfileUpdateInput,
  type WorkProfileUpdateResponse,
} from "./work-profile-update.types"

export async function updateWorkProfile(
  workId: string,
  workspaceId: string,
  input: WorkProfileUpdateInput
): Promise<WorkProfileUpdateResponse> {
  const result = await updateCanonicalWorkProfile(workId, workspaceId, input)

  return {
    success: true,
    ...result,
    source: WORK_PROFILE_UPDATE_SOURCE,
    mode: WORK_PROFILE_UPDATE_MODE,
  }
}
