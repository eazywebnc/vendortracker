'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, DollarSign, TrendingDown, AlertCircle, CheckCircle2, Zap } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ---- Subscription Dashboard Mockup ---- */
function DashboardMockup() {
  const subscriptions = [
    { name: 'Slack', category: 'Communication', price: 87.50, usage: 92, status: 'active' },
    { name: 'Figma', category: 'Design', price: 45.00, usage: 15, status: 'unused' },
    { name: 'Notion', category: 'Productivity', price: 32.00, usage: 8, status: 'unused' },
    { name: 'HubSpot', category: 'CRM', price: 450.00, usage: 55, status: 'active' },
    { name: 'Zoom', category: 'Video', price: 23.50, usage: 78, status: 'active' },
    { name: 'Asana', category: 'PM', price: 120.00, usage: 3, status: 'duplicate' },
  ]

  const totalMonthly = subscriptions.reduce((a, s) => a + s.price, 0)
  const potentialSavings = subscriptions
    .filter(s => s.status !== 'active')
    .reduce((a, s) => a + s.price, 0)

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-6 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 rounded-3xl blur-2xl" />

      <div className="relative rounded-2xl border border-orange-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-orange-500/10 glow-orange">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <DollarSign className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-medium text-white/70">VendorTracker — Software Stack</span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-400 font-medium">Live sync</span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Spend summary */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-2"
          >
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-zinc-500 mb-1">Monthly spend</p>
              <p className="text-lg font-bold text-white">${totalMonthly.toFixed(0)}<span className="text-xs font-normal text-zinc-500">/mo</span></p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-[10px] text-green-500 mb-1">Savings found</p>
              <p className="text-lg font-bold text-green-400">${potentialSavings.toFixed(0)}<span className="text-xs font-normal text-green-600">/mo</span></p>
            </div>
          </motion.div>

          {/* Expense bars */}
          <div className="space-y-1.5">
            {[
              { label: 'Communication', amount: 87.5, pct: 11, color: 'bg-orange-500' },
              { label: 'CRM', amount: 450, pct: 58, color: 'bg-amber-500' },
              { label: 'Design', amount: 45, pct: 6, color: 'bg-red-400' },
              { label: 'Other', amount: 175.5, pct: 25, color: 'bg-orange-400/50' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-[9px] text-zinc-500 w-20 shrink-0">{item.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
                <span className="text-[9px] text-zinc-400 w-10 text-right">${item.amount}</span>
              </div>
            ))}
          </div>

          {/* Subscription list */}
          <div className="space-y-1">
            {subscriptions.slice(0, 4).map((sub, i) => (
              <motion.div
                key={sub.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/[0.02] transition-colors"
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                  sub.status === 'active' ? 'bg-orange-500/20' :
                  sub.status === 'duplicate' ? 'bg-red-500/20' : 'bg-zinc-500/20'
                }`}>
                  {sub.status === 'active'
                    ? <CheckCircle2 className="w-3 h-3 text-orange-400" />
                    : sub.status === 'duplicate'
                    ? <AlertCircle className="w-3 h-3 text-red-400" />
                    : <TrendingDown className="w-3 h-3 text-zinc-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-white truncate">{sub.name}</p>
                  <p className="text-[9px] text-zinc-600">{sub.category} · {sub.usage}% usage</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-semibold text-white">${sub.price.toFixed(0)}</p>
                  {sub.status !== 'active' && (
                    <p className="text-[9px] text-red-400">Cancel?</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-200 leading-relaxed">
              <span className="font-semibold">AI insight:</span> Figma + Asana are unused. Cancel both to save <span className="text-green-400 font-bold">$197/mo</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.to(textRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-orange-500/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 grid-bg" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — Text */}
        <div ref={textRef} className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-sm mb-8"
          >
            <TrendingDown className="w-4 h-4" />
            AI-powered SaaS cost optimizer
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            {['Stop', 'overpaying'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="inline-block mr-[0.3em] text-foreground"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <span className="text-foreground">for </span>
            <span className="gradient-text">
              {Array.from('SaaS.').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, delay: 0.42 + i * 0.04 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="text-green-400"
            >
              Save thousands.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-10"
          >
            VendorTracker auto-detects every subscription, tracks usage, and surfaces
            unused tools draining your budget — so you only pay for what you actually use.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-12"
          >
            <Link
              href="/auth/login"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center gap-2"
            >
              Find my waste
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-2xl border border-white/10 text-zinc-300 font-medium text-lg hover:bg-white/5 transition-colors"
            >
              See how it works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-8 justify-center lg:justify-start"
          >
            {[
              { label: 'Avg annual waste', value: '$135K', color: 'text-orange-400' },
              { label: 'Avg savings', value: '30%', color: 'text-amber-400' },
              { label: 'Companies saved', value: '500+', color: 'text-green-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center lg:text-left">
                <div className={`text-xl font-bold ${color} mb-0.5`}>{value}</div>
                <p className="text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  )
}
