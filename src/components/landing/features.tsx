'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
  CreditCard,
  BarChart3,
  Sparkles,
  Users,
  Bell,
  GitCompare,
  Plug,
  TrendingUp,
} from 'lucide-react'

const features = [
  {
    icon: CreditCard,
    title: 'Subscription Auto-Detection',
    description: 'Connect your bank or credit card once. VendorTracker auto-detects every recurring charge and maps it to the right vendor automatically.',
    gradient: 'from-orange-500 to-amber-500',
    glow: 'bg-orange-500/20',
    span: 'md:col-span-2',
  },
  {
    icon: BarChart3,
    title: 'Usage Analytics',
    description: 'See exactly how much each tool is used. Instantly spot subscriptions with <10% usage — the silent budget killers.',
    gradient: 'from-amber-500 to-yellow-500',
    glow: 'bg-amber-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: Sparkles,
    title: 'AI Savings Recommendations',
    description: 'Our AI analyzes your stack and surfaces concrete savings opportunities — cancel, downgrade, or consolidate with one click.',
    gradient: 'from-yellow-500 to-orange-500',
    glow: 'bg-yellow-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'See who uses which tools across your entire team. Eliminate redundant seats, rightsize licenses, and stop paying for departed employees.',
    gradient: 'from-orange-500 to-red-500',
    glow: 'bg-orange-500/20',
    span: 'md:col-span-2',
  },
  {
    icon: Bell,
    title: 'Budget Alerts',
    description: 'Set spending limits per category or vendor. Get notified before renewals, price increases, or when spend spikes unexpectedly.',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'bg-amber-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: GitCompare,
    title: 'Vendor Comparison',
    description: 'Benchmark your SaaS prices against market rates. Discover cheaper alternatives that do the same job for less.',
    gradient: 'from-orange-600 to-amber-400',
    glow: 'bg-orange-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: Plug,
    title: 'Stripe & QuickBooks Sync',
    description: 'Connect your billing tools for a single source of truth. Expenses automatically categorized and ready for your accountant.',
    gradient: 'from-green-500 to-emerald-500',
    glow: 'bg-green-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: TrendingUp,
    title: 'ROI Reports',
    description: 'Generate shareable ROI reports showing exactly how much you saved and where. Perfect for board decks and budget reviews.',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'bg-amber-500/20',
    span: 'md:col-span-1',
  },
]

export function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [20, -20])

  return (
    <section ref={ref} id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.06),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Your stack,{' '}
            <span className="gradient-text">finally under control</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Every feature you need to eliminate SaaS waste and keep your software spend lean — powered by AI.
          </p>
        </motion.div>

        <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className={`group relative p-6 rounded-2xl border border-white/5 bg-white/[2%] hover:bg-white/[4%] transition-all duration-300 overflow-hidden ${feature.span}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl ${feature.glow}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
