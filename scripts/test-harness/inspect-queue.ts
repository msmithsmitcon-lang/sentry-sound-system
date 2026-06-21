import { prisma } from "../../src/lib/db/prisma"

async function main() {
  const rows = await prisma.submissionQueue.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      status: true,
      target: true,
      entityType: true,
      entityId: true,
      exportFormat: true,
      createdAt: true,
      metadata: true
    }
  })

  console.log(JSON.stringify(rows, null, 2))
}

main()
  .finally(() => prisma.$disconnect())
