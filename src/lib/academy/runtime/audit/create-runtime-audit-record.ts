import { RuntimeAuditRecord }
from "./runtime-audit-record"

export function createRuntimeAuditRecord(
  payload: RuntimeAuditRecord
): RuntimeAuditRecord {

  return {
    ...payload,
    createdAt: new Date().toISOString(),
  }
}
