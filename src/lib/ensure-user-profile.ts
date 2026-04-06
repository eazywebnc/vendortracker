import { createAdminClient } from '@/lib/supabase/server'

/**
 * Ensures the authenticated user has a vt_settings record.
 * Called on first dashboard access to support cross-SaaS login.
 */
export async function ensureUserProfile(userId: string) {
  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from('vt_settings')
    .select('user_id')
    .eq('user_id', userId)
    .single()

  if (existing) return

  await supabase.from('vt_settings').upsert(
    {
      user_id: userId,
      plan: 'free',
    },
    { onConflict: 'user_id' }
  )
}
