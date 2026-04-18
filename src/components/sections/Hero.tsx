'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Recycle, Truck, Users, MapPin, Leaf, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import AnimatedCounter from '@/components/shared/AnimatedCounter'

const miniStats = [
  { icon: Truck,   value: 47200, suffix: '+', label: 'Tonnes / Year'    },
  { icon: Recycle, value: 68,    suffix: '%', label: 'Recycling Rate'   },
  { icon: MapPin,  value: 12,    suffix: '',  label: 'Parishes Served'  },
  { icon: Users,   value: 24300, suffix: '+', label: 'Families Served'  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

function handleScroll(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden
                 bg-gradient-to-br from-brand-navy via-brand-dark-blue to-brand-blue"
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/3" />
        {/* Floating leaf icon */}
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 right-[8%] text-brand-gold/20"
        >
          <Leaf className="w-24 h-24" />
        </motion.div>
        <motion.div
          animate={{ y: [8, -8, 8], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 right-[18%] text-brand-blue/20"
        >
          <Recycle className="w-16 h-16" />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          {/* Eyebrow badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-xs font-heading font-bold tracking-widest uppercase px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              Jamaica&apos;s Leading Waste Management Company
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={itemVariants}
            className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-tight mb-6"
          >
            Smart Waste{' '}
            <span className="text-brand-gold">Solutions</span>
            <br />
            for a Cleaner{' '}
            <span className="relative">
              Jamaica
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-brand-gold rounded-full origin-left"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-white/75 text-lg font-body leading-relaxed mb-8 max-w-xl">
            Reliable, professional, and eco-conscious waste management for Kingston and beyond. From kerbside collection to recycling programmes — we make sustainable easy.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => handleScroll('#schedule')}
              className="shadow-lg shadow-brand-blue/30"
            >
              Check My Pickup Schedule
            </Button>
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<Recycle className="w-5 h-5" />}
              onClick={() => handleScroll('#waste-wizard')}
            >
              Identify My Waste
            </Button>
          </motion.div>

          {/* Mini stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {miniStats.map(({ icon: Icon, value, suffix, label }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-card p-4 text-center"
              >
                <div className="flex justify-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-brand-gold" />
                  </div>
                </div>
                <div className="font-heading font-bold text-xl text-brand-gold">
                  <AnimatedCounter end={value} suffix={suffix} duration={2200} />
                </div>
                <div className="text-white/60 text-xs font-body mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => handleScroll('#service-area')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors"
      >
        <span className="text-xs font-body">Scroll to explore</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--bg-primary)" />
        </svg>
      </div>
    </section>
  )
}
