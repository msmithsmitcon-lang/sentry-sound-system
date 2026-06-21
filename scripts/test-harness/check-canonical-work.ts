import { prisma } from "../../src/lib/db/prisma"

async function main() {
  const work = await prisma.$queryRawUnsafe(`
    SELECT id, work_title, created_at
    FROM musical_works
    WHERE id = '1d6de1ff-540d-4ad4-8212-2a3371d4bb66'
  `)

  console.log(JSON.stringify(work, null, 2))
}

main()
  .finally(() => prisma.$disconnect())
