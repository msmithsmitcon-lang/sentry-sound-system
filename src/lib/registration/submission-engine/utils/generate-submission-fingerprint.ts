import crypto from "crypto"

export function generateSubmissionFingerprint(
  payload: unknown
): string {
  const normalized =
    JSON.stringify(payload)

  return crypto
    .createHash("sha256")
    .update(normalized)
    .digest("hex")
}
