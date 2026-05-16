export type CreateSongContributorInput = {
  contributor_id?: string
  name: string
  role: string
  split_type: string
  percentage: number
}

export type CreateSongRequest = {
  work_title: string
  genre?: string
  mood?: string
  copyright_status?: string
  registration_status?: string
  contributors: CreateSongContributorInput[]
}

export function validateCreateSongInput(
  input: CreateSongRequest
) {
  if (!input.work_title?.trim()) {
    throw new Error("work_title is required.")
  }

  if (!Array.isArray(input.contributors)) {
    throw new Error("contributors must be an array.")
  }

  const contributors = input.contributors
    .filter((c) => c.name?.trim())
    .map((c) => ({
      contributor_id: c.contributor_id ?? "",
      name: c.name.trim(),
      role: c.role?.trim() || "composer",
      split_type: c.split_type?.trim() || "composition",
      percentage: Number(c.percentage || 0)
    }))

  const totalSplit = contributors.reduce(
    (sum, c) => sum + c.percentage,
    0
  )

  if (contributors.length > 0 && totalSplit !== 100) {
    throw new Error("Split total must equal 100%.")
  }

  return {
    work_title: input.work_title.trim(),
    genre: input.genre ?? "",
    mood: input.mood ?? "",
    copyright_status: input.copyright_status ?? "draft",
    registration_status: input.registration_status ?? "draft",
    contributors
  }
}
