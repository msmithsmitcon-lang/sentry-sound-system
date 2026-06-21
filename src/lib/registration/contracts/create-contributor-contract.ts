export type CreateContributorRequest = {
  contributor_name: string
  role: string
  ownership_percentage?: number
}

export type CreateContributorValidated = {
  contributor_name: string
  role: string
  ownership_percentage: number
}

export function validateCreateContributor(
  input: CreateContributorRequest
): CreateContributorValidated {
  if (!input.contributor_name?.trim()) {
    throw new Error("contributor_name is required.")
  }

  if (!input.role?.trim()) {
    throw new Error("role is required.")
  }

  return {
    contributor_name: input.contributor_name.trim(),
    role: input.role.trim(),
    ownership_percentage: input.ownership_percentage ?? 0
  }
}
