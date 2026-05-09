import crypto from "crypto"

export type ExportSnapshotFingerprint = {
  exportId: string

  fingerprint: string

  generatedAt: string
}

export function generateExportFingerprint(
  payload: unknown
): ExportSnapshotFingerprint {

  const normalizedPayload =
    JSON.stringify(payload)

  const fingerprint =
    crypto
      .createHash("sha256")
      .update(normalizedPayload)
      .digest("hex")

  const exportId =
    `export_${fingerprint.slice(0, 16)}`

  return {
    exportId,

    fingerprint,

    generatedAt:
      new Date().toISOString()
  }
}
