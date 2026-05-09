import { prisma } from "../../db/prisma"

import type {
  Recording
} from "../../../generated/prisma/models"

export async function createRecording(data: {
  title: string

  isrc?: string

  status: string

  masterOwnerId: string
  masterOwnerName: string

  documented?: boolean
}) {
  return prisma.recording.create({
    data: {
      title: data.title,

      isrc:
        data.isrc ??
        `TEMP-${crypto.randomUUID()}`,

      status: data.status,

      masterOwnerId:
        data.masterOwnerId,

      masterOwnerName:
        data.masterOwnerName,

      documented:
        data.documented ?? false
    }
  })
}

export async function getRecordingById(
  id: string
): Promise<Recording | null> {

  return prisma.recording.findUnique({
    where: {
      id
    },

    include: {
      performers: true
    }
  })
}

export async function updateRecordingStatus(input: {
  id: string
  status: string
}) {

  return prisma.recording.update({
    where: {
      id: input.id
    },

    data: {
      status: input.status
    }
  })
}

export async function updateRecordingReadiness(input: {
  id: string
  readinessScore: number
}) {

  return prisma.recording.update({
    where: {
      id: input.id
    },

    data: {
      readinessScore:
        input.readinessScore
    }
  })
}

export async function addRecordingPerformer(input: {
  recordingId: string

  performerId: string
  performerName: string

  role: string

  participationPercentage?: number

  confirmed?: boolean
}) {

  return prisma.recordingPerformer.create({
    data: {
      recordingId:
        input.recordingId,

      performerId:
        input.performerId,

      performerName:
        input.performerName,

      role:
        input.role,

      participationPercentage:
        input.participationPercentage,

      confirmed:
        input.confirmed ?? false
    }
  })
}
