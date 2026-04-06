'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import {
  ArrowLeft,
  Loader2,
  Package,
  Building2,
  DollarSign,
  Tag,
  Calendar,
  RotateCcw,
} from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  'Engineering',
  'Marketing',
  'Design',
  'Sales',
  'Operations',
  'HR',
  'Finance',
  'Communication',
  'Productivity',
  'Security',
  'Analytics',
  'Other',
]

export default function AddSubscriptionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    vendor: '',
    price_monthly: '',
    category: 'Other',
    billing_cycle: 'monthly',
    renewal_date: '',
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }

    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        vendor: form.vendor,
        price_monthly: parseFloat(form.price_monthly),
        category: form.category,
        billing_cycle: form.billing_cycle,
        renewal_date: form.renewal_date || null,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to add subscription')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25 transition-colors'
  const labelClass = 'text-xs font-medium text-zinc-400 mb-1.5 block'

  return (
    <div className="min-h-screen bg-[#080503]">
      <header className="border-b border-white/5 bg-[#080503]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Add Subscription</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="p-8 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur-sm">
          <h1 className="text-xl font-bold text-white mb-1">New Subscription</h1>
          <p className="text-sm text-zinc-500 mb-8">
            Track a new SaaS tool in your stack
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className={labelClass}>Name *</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Slack, Figma, GitHub"
                  required
                />
              </div>
            </div>

            {/* Vendor */}
            <div>
              <label className={labelClass}>Vendor</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={form.vendor}
                  onChange={(e) => update('vendor', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Salesforce, Atlassian"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className={labelClass}>Monthly Price (USD) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price_monthly}
                  onChange={(e) => update('price_monthly', e.target.value)}
                  className={inputClass}
                  placeholder="29.99"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className={labelClass}>Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <select
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Billing Cycle */}
            <div>
              <label className={labelClass}>Billing Cycle</label>
              <div className="relative">
                <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <select
                  value={form.billing_cycle}
                  onChange={(e) => update('billing_cycle', e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="monthly" className="bg-zinc-900">Monthly</option>
                  <option value="annual" className="bg-zinc-900">Annual</option>
                </select>
              </div>
            </div>

            {/* Renewal Date */}
            <div>
              <label className={labelClass}>Renewal Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="date"
                  value={form.renewal_date}
                  onChange={(e) => update('renewal_date', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Link
                href="/dashboard"
                className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 text-sm font-medium text-center hover:bg-white/5 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Add Subscription'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
