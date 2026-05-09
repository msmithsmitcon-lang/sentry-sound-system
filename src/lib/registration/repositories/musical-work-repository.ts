import { prisma } from "../../db/prisma"

import type {
  MusicalWork
} from "../../../generated/prisma/models"

export async function createMusicalWork(data: {
  title: string
  status: string
  documented?: boolean
}) {
  return prisma.musicalWork.create({
    data: {
      title: data.title,
      status: data.status,
      documented: data.documented ?? false
    }
  })
}

export async function getMusicalWorkById(
  id: string
): Promise<MusicalWork | null> {
  return prisma.musicalWork.findUnique({
    where: {
      id
    }
  })
}

export async function updateMusicalWorkStatus(input: {
  id: string
  status: string
}) {
  return prisma.musicalWork.update({
    where: {
      id: input.id
    },
    data: {
      status: input.status
    }
  })
}

export async function updateMusicalWorkReadiness(input: {
  id: string
  readinessScore: number
}) {
  return prisma.musicalWork.update({
    where: {
      id: input.id
    },
    data: {
      readinessScore: input.readinessScore
    }
  })
}
