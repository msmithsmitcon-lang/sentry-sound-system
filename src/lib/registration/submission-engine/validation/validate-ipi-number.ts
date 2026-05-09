export function validateIpiNumber(
  value?: string | null
): boolean {
  if (!value) {
    return true
  }

  const normalized =
    value.replace(/\s/g, "")

  return /^\d{9,11}$/.test(
    normalized
  )
}
