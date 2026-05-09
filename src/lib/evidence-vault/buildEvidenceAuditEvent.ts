import {
  EvidenceAuditEvent
} from "@/contracts/evidence-vault/evidenceAudit.types"

export function buildEvidenceAuditEvent(
  event: EvidenceAuditEvent
): EvidenceAuditEvent {

  return {
    ...event,
    occurredAt: event.occurredAt ?? new Date()
  }
}
