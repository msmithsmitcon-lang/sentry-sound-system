import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''

  if (q.length < 2) {
    return NextResponse.json([])
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from('contributors')
    .select('id, full_name, stage_name, email, role, contributor_type')
    .ilike('full_name', '%' + q + '%')
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}
