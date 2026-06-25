import { prisma } from "@/lib/db/prisma"

export async function getSubmissionReadiness(workId: string) {
  const workRows: any[] = await prisma.$queryRaw`
    SELECT id, work_title
    FROM musical_works
    WHERE id::text = ${workId}
    LIMIT 1
  `

  const work = workRows[0]

  if (!work) {
    return {
      ready: false,
      issues: ["WORK_NOT_FOUND"],
    }
  }

  const contributors: any[] = await prisma.$queryRaw`
    SELECT percentage
    FROM work_contributors
    WHERE work_id::text = ${workId}
  `

  const totalSplit = contributors.reduce(
    (sum, c) => sum + Number(c.percentage || 0),
    0
  )

  const issues: string[] = []

  if (contributors.length === 0) {
    issues.push("NO_CONTRIBUTORS")
  }

  if (contributors.length > 0 && totalSplit !== 100) {
    issues.push("INVALID_SPLIT_TOTAL")
  }

  return {
    ready: issues.length === 0,
    issues,
    summary: {
      workTitle: work.work_title,
      contributorCount: contributors.length,
      totalSplit,
    },
  }
}
