import { NextRequest, NextResponse } from "next/server"

import { saveWorkspaceOnboarding } from "@/lib/workspace-onboarding/workspace-onboarding-admin"
import { workspaceOnboardingAdminSupabaseRepository } from "@/lib/workspace-onboarding/workspace-onboarding-admin-supabase"

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      {
        ok: false,
        mode: "TEST_INTERNAL_ADMIN_ONLY",
        error: {
          code: "INVALID_JSON",
          message: "Request body must be JSON.",
        },
      },
      { status: 400 }
    )
  }

  const payload = body as Record<string, unknown>
  const result = await saveWorkspaceOnboarding({
    repository: workspaceOnboardingAdminSupabaseRepository,
    payload: {
      workspaceId: String(payload.workspace_id ?? ""),
      workspaceName:
        typeof payload.workspace_name === "string" ? payload.workspace_name : null,
      companyEntityName:
        typeof payload.company_entity_name === "string"
          ? payload.company_entity_name
          : null,
      country: typeof payload.country === "string" ? payload.country : null,
      currency: typeof payload.currency === "string" ? payload.currency : null,
      vatTaxId: typeof payload.vat_tax_id === "string" ? payload.vat_tax_id : null,
      vatStatus: typeof payload.vat_status === "string" ? payload.vat_status : null,
      businessType:
        typeof payload.business_type === "string" ? payload.business_type : null,
      addressLine1:
        typeof payload.address_line_1 === "string" ? payload.address_line_1 : null,
      addressLine2:
        typeof payload.address_line_2 === "string" ? payload.address_line_2 : null,
      city: typeof payload.city === "string" ? payload.city : null,
      stateProvince:
        typeof payload.state_province === "string" ? payload.state_province : null,
      postalCode:
        typeof payload.postal_code === "string" ? payload.postal_code : null,
      onboardingStep:
        typeof payload.onboarding_step === "string" ? payload.onboarding_step : null,
      onboardingStatus:
        typeof payload.onboarding_status === "string"
          ? payload.onboarding_status
          : null,
    },
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
