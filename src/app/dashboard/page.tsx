'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  DollarSign,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  LogOut,
  Plus,
  Zap,
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
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login'
        return
      }
      setUser({ email: user.email || '' })

      // Ensure settings exist
      const { data: existingSettings } = await supabase
        .from('vt_settings')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (!existingSettings) {
        await supabase.from('vt_settings').insert({ user_id: user.id })
      }

      // Fetch subscriptions
      const { data } = await supabase
        .from('vt_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('price_monthly', { ascending: false })

      setSubscriptions(data || [])
      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const totalMonthly = subscriptions.reduce((a, s) => a + s.price_monthly, 0)
  const savingsFound = subscriptions
    .filter(s => s.status !== 'active')
    .reduce((a, s) => a + s.price_monthly, 0)
  const unusedCount = subscriptions.filter(s => s.usage_percent < 20).length

  const statusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Active' }
      case 'unused':
        return { icon: TrendingDown, color: 'text-zinc-400', bg: 'bg-zinc-500/10', label: 'Unused' }
      case 'duplicate':
        return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Duplicate' }
      default:
        return { icon: Package, color: 'text-zinc-400', bg: 'bg-zinc-500/10', label: status }
    }
  }

  const categoryColor = (category: string) => {
    const map: Record<string, string> = {
      Communication: 'bg-orange-500/20 text-orange-300',
      Design: 'bg-purple-500/20 text-purple-300',
      CRM: 'bg-blue-500/20 text-blue-300',
      Productivity: 'bg-amber-500/20 text-amber-300',
      Video: 'bg-cyan-500/20 text-cyan-300',
      Security: 'bg-red-500/20 text-red-300',
      Analytics: 'bg-green-500/20 text-green-300',
    }
    return map[category] || 'bg-zinc-500/20 text-zinc-300'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080503] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080503]">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-[#080503]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">VendorTracker</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500">{user?.email}</span>
            <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-white transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Software Stack</h1>
            <p className="text-sm text-zinc-500">Track your SaaS expenses and find savings</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium flex items-center gap-2 hover:from-orange-600 hover:to-amber-600 transition-all">
            <Plus className="w-4 h-4" /> Add subscription
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: DollarSign,
              label: 'Monthly Spend',
              value: `$${totalMonthly.toFixed(0)}`,
              sub: `$${(totalMonthly * 12).toFixed(0)}/yr`,
              color: 'text-orange-400',
              bg: 'bg-orange-500/10',
            },
            {
              icon: Zap,
              label: 'Savings Found',
              value: `$${savingsFound.toFixed(0)}`,
              sub: 'per month',
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
            {
              icon: TrendingDown,
              label: 'Unused Tools',
              value: String(unusedCount),
              sub: 'under 20% usage',
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
            },
            {
              icon: BarChart3,
              label: 'Total Tools',
              value: String(subscriptions.length),
              sub: 'tracked',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
          ].map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div key={label} className="p-5 rounded-2xl border border-white/5 bg-white/[2%]">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Subscription list */}
        <div className="rounded-2xl border border-white/5 bg-white/[2%] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Subscriptions</h2>
            <BarChart3 className="w-4 h-4 text-zinc-500" />
          </div>

          {subscriptions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <DollarSign className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
              <p className="text-sm text-zinc-500 mb-2">No subscriptions yet</p>
              <p className="text-xs text-zinc-600">
                Connect your bank account or add subscriptions manually to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {subscriptions.map((sub) => {
                const cfg = statusConfig(sub.status)
                const StatusIcon = cfg.icon
                return (
                  <div key={sub.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-white/[1%] transition-colors">
                    {/* Status icon */}
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                    </div>

                    {/* Name & category */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm text-white font-medium truncate">{sub.name}</p>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium shrink-0 ${categoryColor(sub.category)}`}>
                          {sub.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">{sub.vendor}</p>
                    </div>

                    {/* Usage bar */}
                    <div className="hidden sm:block w-24 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-white/5">
                          <div
                            className={`h-full rounded-full transition-all ${
                              sub.usage_percent >= 60 ? 'bg-green-500' :
                              sub.usage_percent >= 30 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(sub.usage_percent, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500 w-7 text-right">{sub.usage_percent}%</span>
                      </div>
                      <p className="text-[9px] text-zinc-600 mt-0.5">usage</p>
                    </div>

                    {/* Price & renewal */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-white">${sub.price_monthly.toFixed(0)}<span className="text-zinc-600 text-[10px] font-normal">/mo</span></p>
                      {sub.renewal_date && (
                        <p className="text-[10px] text-zinc-600">
                          Renews {new Date(sub.renewal_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>

                    {/* Status badge */}
                    <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
