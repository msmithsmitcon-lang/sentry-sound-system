import { randomUUID } from "crypto"

import { createEvidenceAuditEvent } from "@/lib/evidence-vault/createEvidenceAuditEvent"

async function main() {

  const result =
    await createEvidenceAuditEvent({
      evidenceId: randomUUID(),

      eventType: "EVIDENCE_TEST_EVENT",

      metadata: {
        source: "evidence-vault-test"
      }
    })

  console.log(result)
}

main()
  .catch(console.error)
