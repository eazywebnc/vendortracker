import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Subscription {
  name: string
  vendor: string
  price_monthly: number
  category: string
  usage_percent: number
  status: string
}

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: subscriptions, error } = await supabase
      .from('vt_subscriptions')
      .select('name, vendor, price_monthly, category, usage_percent, status')
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        recommendations: [],
        summary: 'No subscriptions to analyze. Add some subscriptions first.',
      })
    }

    const totalMonthly = subscriptions.reduce((a: number, s: Subscription) => a + s.price_monthly, 0)
    const stackList = subscriptions
      .map((s: Subscription) => `- ${s.name} (${s.vendor}): $${s.price_monthly}/mo, category: ${s.category}, usage: ${s.usage_percent}%, status: ${s.status}`)
      .join('\n')

    const prompt = `You are a SaaS expense optimization expert. Analyze this company's software stack and provide actionable recommendations to save money.

Current SaaS Stack (total: $${totalMonthly.toFixed(2)}/month):
${stackList}

Provide your analysis as valid JSON with this exact structure:
{
  "summary": "Brief 1-2 sentence overview of the stack health",
  "total_potential_savings": <number in dollars per month>,
  "recommendations": [
    {
      "type": "duplicate|underutilized|cheaper_alternative|bundle|negotiate",
      "priority": "high|medium|low",
      "tools_involved": ["tool names"],
      "recommendation": "What to do",
      "estimated_monthly_saving": <number>,
      "reasoning": "Why this makes sense"
    }
  ]
}

Rules:
- Flag duplicates: tools in the same category with overlapping functionality
- Flag underutilized: usage below 30% means the tool might not be needed
- Suggest cheaper alternatives when well-known options exist
- Suggest bundle opportunities (e.g., Microsoft 365 vs separate tools)
- Be specific and actionable
- Only return valid JSON, no markdown or extra text`

    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI analysis not configured' }, { status: 503 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text())
      return NextResponse.json({ error: 'AI analysis failed' }, { status: 502 })
    }

    const result = await response.json()
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
    const jsonStr = (jsonMatch[1] || text).trim()

    let analysis
    try {
      analysis = JSON.parse(jsonStr)
    } catch {
      console.error('Failed to parse AI response:', jsonStr)
      return NextResponse.json({
        summary: 'AI analysis completed but response format was unexpected.',
        recommendations: [],
        raw: text,
      })
    }

    return NextResponse.json(analysis)
  } catch (err) {
    console.error('POST /api/analyze error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
