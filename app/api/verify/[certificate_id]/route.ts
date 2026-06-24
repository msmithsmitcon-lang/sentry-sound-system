import { NextResponse } from "next/server"

import { getPublicCertificateView } from "@/lib/compliance/collaboration-certificate"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Public certificate verification endpoint. No authentication required —
 * this is meant to be shared (e.g. before handing over stems). Returns
 * only contributor names, roles, and generation timestamp — never split
 * percentages or any other private workspace data (Phase 4c requirement).
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ certificate_id: string }> }
) {
  const { certificate_id } = await context.params

  if (!UUID_PATTERN.test(certificate_id)) {
    return NextResponse.json({ success: false, error: "Invalid certificate ID." }, { status: 400 })
  }

  const certificate = await getPublicCertificateView(certificate_id)

  if (!certificate) {
    return NextResponse.json({ success: false, error: "Certificate not found." }, { status: 404 })
  }

  return NextResponse.json({ success: true, certificate })
}
