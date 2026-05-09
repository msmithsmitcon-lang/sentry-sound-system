export function calculateRetryDelayMinutes(
  retryCount: number
): number {
  const retryMatrix = [
    5,
    15,
    30,
    60,
    180,
    720,
    1440,
  ]

  return (
    retryMatrix[retryCount] ??
    1440
  )
}

export function calculateRetryDate(
  retryCount: number
): Date {
  const minutes =
    calculateRetryDelayMinutes(retryCount)

  return new Date(
    Date.now() + minutes * 60 * 1000
  )
}
