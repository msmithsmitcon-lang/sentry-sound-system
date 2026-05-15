export type CreateMusicalWorkRequest = {
  work_title: string
  genre?: string
  mood?: string
  copyright_status?: string
  registration_status?: string
}

export type CreateMusicalWorkValidated = {
  work_title: string
  registration_status: string
}

export function validateCreateMusicalWork(
  input: CreateMusicalWorkRequest
): CreateMusicalWorkValidated {
  if (!input.work_title?.trim()) {
    throw new Error("work_title is required.")
  }

  return {
    work_title: input.work_title.trim(),
    registration_status: input.registration_status ?? "draft"
  }
}
