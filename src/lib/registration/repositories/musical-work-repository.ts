import { prisma } from "@/lib/db/prisma"

export async function createMusicalWorkRecord(data: {
  title: string
  status: string
}) {
  return prisma.musicalWork.create({
    data
  })
}
