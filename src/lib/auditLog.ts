export async function writeAuditLog({
  supabase,
  action,
  entity_type,
  entity_id,
  metadata = {},
}: {
  supabase: any
  action: string
  entity_type: string
  entity_id?: string | null
  metadata?: Record<string, any>
}) {
  const { error } = await supabase.from("audit_logs").insert([
    {
      action,
      entity_type,
      entity_id,
      metadata,
      created_at: new Date().toISOString(),
    },
  ])

  if (error) throw new Error(error.message)

  return true
}
