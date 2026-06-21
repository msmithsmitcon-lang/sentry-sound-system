import { prisma } from "@/lib/db/prisma"

export async function getValidTestWork() {
  return prisma.musicalWork.findFirst({
    select: {
      id: true,
      title: true
    }
  })
}
