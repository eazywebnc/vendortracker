'use client'

import { motion } from 'framer-motion'
import { ArrowRight, TrendingDown } from 'lucide-react'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute inset-0 grid-bg opacity-50" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/90 text-sm font-medium mb-6">
              <TrendingDown className="w-4 h-4" />
              Free to start — no credit card
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Stop leaking money on SaaS.
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
              Join 500+ companies that cut their software spend by 30% in the first month.
              Find your savings in under 5 minutes.
            </p>

            <Link
              href="/auth/login"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-orange-600 font-semibold text-lg hover:bg-white/90 transition-colors shadow-2xl"
            >
              Find my savings now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
