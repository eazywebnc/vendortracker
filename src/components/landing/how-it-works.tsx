'use client'

import { motion } from 'framer-motion'
import { Link2, Search, FileBarChart2, Scissors } from 'lucide-react'

const steps = [
  {
    icon: Link2,
    title: 'Connect your bank',
    description: 'Securely link your bank account or upload statements. Read-only access — we never move your money.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    icon: Search,
    title: 'Auto-detect subscriptions',
    description: 'VendorTracker scans transactions, identifies recurring charges, and maps them to vendors within seconds.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: FileBarChart2,
    title: 'Get your savings report',
    description: 'Receive a detailed breakdown showing unused tools, duplicates, and AI-powered recommendations to cut costs.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: Scissors,
    title: 'Cancel & optimize',
    description: 'Cancel subscriptions in one click, rightsize plans, or consolidate vendors. Track your cumulative savings grow.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Start saving in under 5 minutes. No spreadsheets, no manual data entry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-orange-500/20 to-transparent" />
              )}

              <div className={`w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-4`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <div className="text-xs text-zinc-600 font-mono mb-2">Step {i + 1}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
