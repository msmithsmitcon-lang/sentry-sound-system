import { prisma } from "@/lib/db/prisma"

export type CreateMusicalWorkInput = {
  work_title: string
  genre?: string
  mood?: string
  copyright_status?: string
  registration_status?: string
}

export async function createMusicalWork(
  input: CreateMusicalWorkInput
) {
  if (!input.work_title) {
    return {
      success: false,
      message: "work_title is required."
    }
  }

  const work = await prisma.musicalWork.create({
    data: {
      title: input.work_title,
      status: input.registration_status ?? "draft"
    }
  })

  return {
    success: true,
    work
  }
}
