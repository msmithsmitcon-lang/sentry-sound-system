export function calculateCompletionRate(
  completed: number,
  total: number
): number {

  if (total === 0) {
    return 0
  }

  return Number(
    ((completed / total) * 100).toFixed(2)
  )
}
