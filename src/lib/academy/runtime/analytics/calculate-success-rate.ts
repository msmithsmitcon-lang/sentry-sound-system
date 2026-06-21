export function calculateSuccessRate(
  passed: number,
  total: number
): number {

  if (total === 0) {
    return 0
  }

  return Number(
    ((passed / total) * 100).toFixed(2)
  )
}
