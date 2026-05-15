import {
  CreateMusicalWorkRequest,
  validateCreateMusicalWork
} from "@/lib/registration/contracts/create-musical-work-contract"

import { createMusicalWorkRecord } from "@/lib/registration/repositories/musical-work-repository"

export async function createMusicalWork(
  input: CreateMusicalWorkRequest
) {
  const validated = validateCreateMusicalWork(input)

  const work = await createMusicalWorkRecord({
    title: validated.work_title,
    status: validated.registration_status
  })

  return {
    success: true,
    work
  }
}
