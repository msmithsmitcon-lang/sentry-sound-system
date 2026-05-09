export type RegulatorAdapterKey =
  | "SAMRO"
  | "CAPASSO"
  | "CWR"
  | "DDEX"

export interface RegulatorAdapterExportResult {
  regulator: RegulatorAdapterKey

  format: string

  generatedAt: string

  payload:
    Record<string, unknown>
}
