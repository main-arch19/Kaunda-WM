'use client'

import { Truck, Recycle, MapPin, Users, Leaf, Award, Clock, TreePine } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedCounter from '@/components/shared/AnimatedCounter'
import { useInView } from '@/hooks/useInView'

const stats = [
  {
    icon:    Truck,
    value:   47200,
    suffix:  '+',
    label:   'Tonnes Collected',
    sub:     'per year across Jamaica',
    color:   'text-brand-gold',
  },
  {
    icon:    Recycle,
    value:   68,
    suffix:  '%',
    label:   'Recycling Rate',
    sub:     'above national average',
    color:   'text-brand-gold',
  },
  {
    icon:    MapPin,
    value:   12,
    suffix:  '',
    label:   'Parishes Served',
    sub:     'and growing every year',
    color:   'text-brand-gold',
  },
  {
    icon:    Users,
    value:   24300,
    suffix:  '+',
    label:   'Families Served',
    sub:     'residential & commercial',
    color:   'text-brand-gold',
  },
  {
    icon:    Leaf,
    value:   8900,
    suffix:  '+',
    label:   'Tonnes CO₂ Avoided',
    sub:     'by diverting waste from landfill',
    color:   'text-brand-gold',
  },
  {
    icon:    TreePine,
    value:   12500,
    suffix:  '+',
    label:   'Tree Equivalents',
    sub:     'annual carbon offset achieved',
    color:   'text-brand-gold',
  },
  {
    icon:    Award,
    value:   15,
    suffix:  '+',
    label:   'Years Operating',
    sub:     'trusted across Jamaica',
    color:   'text-brand-gold',
  },
  {
    icon:    Clock,
    value:   98,
    suffix:  '%',
    label:   'On-Time Rate',
    sub:     'collection reliability score',
    color:   'text-brand-gold',
  },
]

export default function ImpactStats() {
  const { ref, inView } = useInView({ threshold: 0.1 })

  return (
    <section id="impact" className="bg-brand-navy py-20 relative overflow-hidden">
      {/* Subtle decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/3 opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-brand-gold text-xs font-heading font-bold tracking-widest uppercase mb-3">
            <span className="block w-8 h-0.5 bg-brand-gold" />
            Our Impact
            <span className="block w-8 h-0.5 bg-brand-gold" />
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight mb-3">
            Making Jamaica <span className="text-brand-gold">Cleaner</span>
          </h2>
          <p className="text-white/60 font-body max-w-xl mx-auto">
            Every bin collected, every item recycled — our numbers tell the story of a greener Jamaica.
          </p>
        </div>

        {/* Stats grid */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map(({ icon: Icon, value, suffix, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-card p-5 text-center
                         hover:bg-white/8 hover:border-brand-gold/20 transition-all group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-brand-gold" />
                </div>
              </div>
              <div className="font-heading font-bold text-2xl sm:text-3xl text-brand-gold mb-1">
                <AnimatedCounter end={value} suffix={suffix} duration={1800} />
              </div>
              <div className="h-0.5 w-8 bg-brand-gold/40 mx-auto my-2" />
              <p className="font-heading font-bold text-xs text-white uppercase tracking-wide mb-0.5">{label}</p>
              <p className="font-body text-xs text-white/50">{sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-10">
          <p className="text-brand-gold font-heading font-bold text-lg italic">
            &quot;Clean Solutions. Greener Future.&quot;
          </p>
          <p className="text-white/40 text-xs font-body mt-1">Regulated by NSWMA Jamaica · NEPA Compliant</p>
        </div>
      </div>
    </section>
  )
}
