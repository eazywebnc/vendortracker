'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import {
  ArrowLeft,
  DollarSign,
  Loader2,
  Save,
  Trash2,
  CheckCircle2,
  TrendingDown,
  AlertCircle,
  Package,
} from 'lucide-react'

interface Subscription {
  id: string
  name: string
  vendor: string
  price_monthly: number
  category: string
  usage_percent: number
  status: string
  renewal_date: string | null
  billing_cycle: string
  notes: string | null
  created_at: string
}

const CATEGORIES = [
  'Engineering', 'Marketing', 'Design', 'Sales', 'Operations',
  'HR', 'Finance', 'Communication', 'Productivity', 'Security', 'Analytics', 'Other',
]

const STATUSES = ['active', 'unused', 'duplicate', 'cancelled']

export default function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [sub, setSub] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    name: '',
    vendor: '',
    price_monthly: '',
    category: 'Other',
    usage_percent: '50',
    status: 'active',
    renewal_date: '',
    billing_cycle: 'monthly',
    notes: '',
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const res = await fetch(`/api/subscriptions/${id}`)
      if (!res.ok) {
        router.push('/dashboard')
        return
      }

      const data = await res.json()
      const s = data.subscription
      setSub(s)
      setForm({
        name: s.name,
        vendor: s.vendor || '',
        price_monthly: String(s.price_monthly),
        category: s.category,
        usage_percent: String(s.usage_percent),
        status: s.status,
        renewal_date: s.renewal_date || '',
        billing_cycle: s.billing_cycle || 'monthly',
        notes: s.notes || '',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    const res = await fetch(`/api/subscriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        vendor: form.vendor,
        price_monthly: parseFloat(form.price_monthly),
        category: form.category,
        usage_percent: parseInt(form.usage_percent),
        status: form.status,
        renewal_date: form.renewal_date || null,
        billing_cycle: form.billing_cycle,
        notes: form.notes || null,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      setSub(data.subscription)
      setMessage('Saved successfully')
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('Failed to save')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const res = await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/dashboard')
    } else {
      setMessage('Failed to delete')
      setDeleting(false)
    }
  }

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const statusConfig = (status: string) => {
    switch (status) {
      case 'active': return { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Active' }
      case 'unused': return { icon: TrendingDown, color: 'text-zinc-400', bg: 'bg-zinc-500/10', label: 'Unused' }
      case 'duplicate': return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Duplicate' }
      case 'cancelled': return { icon: Package, color: 'text-zinc-500', bg: 'bg-zinc-500/10', label: 'Cancelled' }
      default: return { icon: Package, color: 'text-zinc-400', bg: 'bg-zinc-500/10', label: status }
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25 transition-colors'
  const labelClass = 'text-xs font-medium text-zinc-400 mb-1.5 block'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080503] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!sub) return null

  const cfg = statusConfig(sub.status)
  const StatusIcon = cfg.icon

  return (
    <div className="min-h-screen bg-[#080503]">
      <header className="border-b border-white/5 bg-[#080503]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white truncate">{sub.name}</span>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.color} flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {cfg.label}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Usage Meter */}
        <div className="p-6 rounded-2xl border border-white/5 bg-white/[2%]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">Usage</span>
            <span className="text-2xl font-bold text-white">{sub.usage_percent}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                sub.usage_percent >= 60 ? 'bg-green-500' :
                sub.usage_percent >= 30 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(sub.usage_percent, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            {sub.usage_percent < 30
              ? 'Low usage - consider downgrading or cancelling'
              : sub.usage_percent < 60
              ? 'Moderate usage - review if full plan is needed'
              : 'Good usage - this tool is well utilized'}
          </p>
        </div>

        {/* Edit Form */}
        <div className="p-6 rounded-2xl border border-white/5 bg-white/[2%]">
          <h2 className="text-sm font-semibold text-white mb-6">Edit Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Vendor</label>
              <input
                type="text"
                value={form.vendor}
                onChange={(e) => update('vendor', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Monthly Price (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price_monthly}
                onChange={(e) => update('price_monthly', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Usage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.usage_percent}
                onChange={(e) => update('usage_percent', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-zinc-900">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Billing Cycle</label>
              <select
                value={form.billing_cycle}
                onChange={(e) => update('billing_cycle', e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="monthly" className="bg-zinc-900">Monthly</option>
                <option value="annual" className="bg-zinc-900">Annual</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Renewal Date</label>
              <input
                type="date"
                value={form.renewal_date}
                onChange={(e) => update('renewal_date', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                className={`${inputClass} h-20 resize-none`}
                placeholder="Any notes about this subscription..."
              />
            </div>
          </div>

          {message && (
            <p className={`text-xs text-center mt-4 ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-6 py-3 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-3 rounded-xl border border-white/10 text-zinc-400 text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="px-4 py-3 rounded-xl bg-white/[1%] border border-white/5">
          <p className="text-[10px] text-zinc-600">
            Added {new Date(sub.created_at).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })}
            {sub.renewal_date && ` | Renews ${new Date(sub.renewal_date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          </p>
        </div>
      </main>
    </div>
  )
}
