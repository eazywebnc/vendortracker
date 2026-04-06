import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('vt_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('price_monthly', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ subscriptions: data })
  } catch (err) {
    console.error('GET /api/subscriptions error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, vendor, price_monthly, category, billing_cycle, renewal_date } = body

    if (!name || price_monthly === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('vt_subscriptions')
      .insert({
        user_id: user.id,
        name,
        vendor: vendor || '',
        price_monthly: parseFloat(price_monthly),
        category: category || 'Other',
        billing_cycle: billing_cycle || 'monthly',
        renewal_date: renewal_date || null,
        usage_percent: 50,
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ subscription: data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/subscriptions error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
