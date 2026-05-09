import { prisma } from "../src/lib/db/prisma"

async function main() {
  const queueItems =
    await prisma.submissionQueue.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    })

  const events =
    await prisma.submissionQueueEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })

  console.log(
    JSON.stringify(
      {
        queueItems,
        events,
      },
      null,
      2
    )
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
