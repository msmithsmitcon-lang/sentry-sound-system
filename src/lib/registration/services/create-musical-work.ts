import { prisma } from "@/lib/db/prisma"

import {
  CreateMusicalWorkRequest,
  validateCreateMusicalWork
} from "@/lib/registration/contracts/create-musical-work-contract"

export async function createMusicalWork(
  input: CreateMusicalWorkRequest
) {
  const validated = validateCreateMusicalWork(input)

  const work = await prisma.musicalWork.create({
    data: {
      title: validated.work_title,
      status: validated.registration_status
    }
  })

  return {
    success: true,
    work
  }
}
