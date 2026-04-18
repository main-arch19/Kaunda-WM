'use client'

import { useState, useMemo, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, X, Calendar, Package, Calculator, BookOpen } from 'lucide-react'
import SectionWrapper, { SectionHeader } from '@/components/shared/SectionWrapper'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { schedules, collectionTypeConfig, buildWeekMap, type CollectionType } from '@/data/schedules'
import {
  calculatePrice, ADD_ONS, SERVICE_LABELS, VOLUME_LABELS,
  type ServiceType, type VolumeUnit, type Frequency
} from '@/lib/pricingCalculator'
import { useToast } from '@/hooks/useToast'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] as const

const bins = [
  {
    id:       'black' as const,
    label:    'Black Bin',
    subtitle: 'General Waste',
    emoji:    '🗑️',
    bg:       '#1a1a1a',
    accepts:  [
      'Food-contaminated packaging','Nappies & diapers','Polystyrene / Styrofoam',
      'Tissues and napkins (used)','Broken ceramics','Mirrors','Pet waste (bagged)',
      'Disposable masks & gloves','Wax-coated cartons',
    ],
    rejects:  [
      'Electronics & batteries','Garden waste','Recyclable plastics',
      'Cardboard & paper','Glass bottles','Metal cans',
    ],
    tip: 'When in doubt, black bin it out — but reduce first!',
  },
  {
    id:       'blue' as const,
    label:    'Blue Bin',
    subtitle: 'Dry Recyclables',
    emoji:    '♻️',
    bg:       '#1B5DE5',
    accepts:  [
      'Clean plastic bottles (#1 PET, #2 HDPE)','Glass bottles & jars (rinsed)',
      'Cardboard & cardboard boxes (flattened)','Aluminium & steel cans (rinsed)',
      'Newspapers, magazines & office paper','Juice cartons (Tetra Pak)',
      'Aluminium foil (clean, scrunched)','Metal lids & bottle caps',
    ],
    rejects:  [
      'Food-soiled packaging','Polystyrene foam','Batteries & electronics',
      'Nappies or sanitary items','Greasy pizza boxes','Plastic bags',
    ],
    tip: 'Rinse, don\'t wash — a quick rinse is all that\'s needed!',
  },
  {
    id:       'green' as const,
    label:    'Green Bin',
    subtitle: 'Organics & Garden',
    emoji:    '🌿',
    bg:       '#16a34a',
    accepts:  [
      'Fruit & vegetable scraps','Grass clippings & leaves',
      'Coffee grounds & tea bags','Eggshells','Bread & baked goods',
      'Cooked food scraps','Dead flowers & garden trimmings',
      'Food-soiled paper (napkins, paper plates)',
    ],
    rejects:  [
      'Plastic bags or liners','Cooking oil (contact us for collection)',
      'Metals or glass','Non-biodegradable items',
    ],
    tip: 'Jamaican staples like breadfruit peel, yam skin, and coconut husk are all welcome!',
  },
]

const serviceOptions = (Object.keys(SERVICE_LABELS) as ServiceType[]).map(k => ({ value: k, label: SERVICE_LABELS[k] }))
const volumeOptions  = (Object.keys(VOLUME_LABELS)  as VolumeUnit[]).map(k  => ({ value: k, label: VOLUME_LABELS[k]  }))

function formatJMD(n: number) {
  return new Intl.NumberFormat('en-JM', { style: 'currency', currency: 'JMD', maximumFractionDigits: 0 }).format(n)
}

export default function ScheduleServices() {
  const { toast } = useToast()

  // Schedule tab
  const [parish, setParish]     = useState('Kingston')
  const parishSchedule          = schedules.find(s => s.parish === parish) ?? schedules[0]
  const weekMap                 = buildWeekMap(parishSchedule)

  // Bin guide
  const [activeBin, setActiveBin] = useState<string | null>(null)

  // Pricing
  const [serviceType, setServiceType] = useState<ServiceType>('residential-standard')
  const [volume,      setVolume]      = useState<VolumeUnit>('1-bin')
  const [frequency,   setFrequency]   = useState<Frequency>('weekly')
  const [addOnIds,    setAddOnIds]    = useState<string[]>([])

  const pricing = useMemo(
    () => calculatePrice(serviceType, volume, frequency, addOnIds),
    [serviceType, volume, frequency, addOnIds]
  )

  function toggleAddOn(id: string) {
    setAddOnIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id])
  }

  // Booking modal
  const [modalOpen, setModalOpen]   = useState(false)
  const [bookForm,  setBookForm]    = useState({ name: '', email: '', phone: '', address: '', notes: '' })
  const [bookErrors,setBookErrors]  = useState<Partial<typeof bookForm>>({})
  const [booking,   setBooking]     = useState(false)

  function validateBook() {
    const e: Partial<typeof bookForm> = {}
    if (!bookForm.name.trim())  e.name  = 'Required'
    if (!bookForm.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+/.test(bookForm.email)) e.email = 'Invalid email'
    if (!bookForm.phone.trim()) e.phone = 'Required'
    setBookErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleBook(e: FormEvent) {
    e.preventDefault()
    if (!validateBook()) return
    setBooking(true)
    await new Promise(r => setTimeout(r, 900))
    setBooking(false)
    setModalOpen(false)
    toast("Booking submitted! Our team will contact you within 24 hours.", 'success')
    setBookForm({ name: '', email: '', phone: '', address: '', notes: '' })
  }

  const [activeTab, setActiveTab] = useState<'schedule' | 'bins' | 'pricing'>('schedule')

  return (
    <SectionWrapper id="schedule">
      <SectionHeader
        eyebrow="Services"
        title="Schedule & Services"
        subtitle="Check your collection calendar, learn what goes in each bin, and get an instant price estimate."
      />

      {/* Tab nav */}
      <div className="flex gap-2 mb-8 border-b border-[var(--border-color)]">
        {[
          { id: 'schedule', label: 'My Schedule',       icon: Calendar  },
          { id: 'bins',     label: 'Bin Guide',          icon: Package   },
          { id: 'pricing',  label: 'Price Calculator',   icon: Calculator},
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-heading font-bold border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── SCHEDULE TAB ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-6 max-w-xs">
              <Select
                label="Select your parish"
                value={parish}
                onChange={setParish}
                options={schedules.map(s => ({ value: s.parish, label: `${s.parish} (${s.zone})` }))}
              />
            </div>

            {/* Week grid */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {DAYS.map(day => {
                const types = weekMap[day] ?? []
                return (
                  <div key={day} className="flex flex-col gap-1.5">
                    <p className="text-xs font-heading font-bold text-center text-[var(--text-muted)] uppercase">
                      {day.slice(0,3)}
                    </p>
                    <div className={`min-h-[80px] rounded-card border p-1.5 flex flex-col gap-1 ${
                      types.length > 0
                        ? 'border-brand-blue/20 bg-brand-blue/5'
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                    }`}>
                      {types.length === 0 ? (
                        <span className="text-xs text-center text-[var(--text-muted)] font-body mt-2">—</span>
                      ) : (
                        types.map(t => {
                          const cfg = collectionTypeConfig[t]
                          return (
                            <span
                              key={t}
                              title={cfg.label}
                              className="flex items-center justify-center gap-0.5 text-xs px-1 py-0.5 rounded text-white font-body"
                              style={{ backgroundColor: cfg.bgColor }}
                            >
                              <span>{cfg.emoji}</span>
                            </span>
                          )
                        })
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-4">
              {(Object.keys(collectionTypeConfig) as CollectionType[]).map(t => {
                const cfg = collectionTypeConfig[t]
                return (
                  <span key={t} className="flex items-center gap-1.5 text-xs font-body text-[var(--text-secondary)]">
                    <span className="text-base">{cfg.emoji}</span> {cfg.label}
                  </span>
                )
              })}
            </div>

            {/* Notes */}
            {parishSchedule.notes.map(n => (
              <div key={n} className="flex items-start gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-card px-4 py-2.5 mb-2">
                <BookOpen className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs font-body text-[var(--text-secondary)]">{n}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* ─── BIN GUIDE TAB ─────────────────────────────── */}
        {activeTab === 'bins' && (
          <motion.div
            key="bins"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {bins.map(bin => (
              <div key={bin.id} className="flex flex-col">
                <button
                  onClick={() => setActiveBin(activeBin === bin.id ? null : bin.id)}
                  className="flex flex-col items-center gap-3 rounded-card p-5 transition-all group border-2 border-transparent hover:border-white/20"
                  style={{ backgroundColor: bin.bg }}
                >
                  <span className="text-4xl">{bin.emoji}</span>
                  <div className="text-center">
                    <p className="font-heading font-bold text-white text-lg">{bin.label}</p>
                    <p className="font-body text-white/70 text-sm">{bin.subtitle}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-body text-white/60 transition-transform ${activeBin === bin.id ? 'rotate-0' : ''}`}>
                    <span>{activeBin === bin.id ? 'Hide guide' : 'Show what goes in'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeBin === bin.id ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {activeBin === bin.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{    height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <Card className="rounded-t-none border-t-0 mt-0">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-xs font-heading font-bold uppercase text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> What goes in
                            </p>
                            <ul className="space-y-1">
                              {bin.accepts.map(a => (
                                <li key={a} className="flex items-start gap-1.5 text-xs font-body text-[var(--text-secondary)]">
                                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-heading font-bold uppercase text-red-500 mb-2 flex items-center gap-1">
                              <X className="w-3.5 h-3.5" /> What doesn&apos;t
                            </p>
                            <ul className="space-y-1">
                              {bin.rejects.map(r => (
                                <li key={r} className="flex items-start gap-1.5 text-xs font-body text-[var(--text-secondary)]">
                                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span> {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-3 bg-brand-gold/10 border border-brand-gold/20 rounded px-3 py-2">
                          <p className="text-xs font-body text-[var(--text-secondary)] italic">&quot;{bin.tip}&quot;</p>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}

        {/* ─── PRICING TAB ───────────────────────────────── */}
        {activeTab === 'pricing' && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-5">
                <Select
                  label="Service Type"
                  value={serviceType}
                  onChange={v => setServiceType(v as ServiceType)}
                  options={serviceOptions}
                />
                <Select
                  label="Volume / Number of Bins"
                  value={volume}
                  onChange={v => setVolume(v as VolumeUnit)}
                  options={volumeOptions}
                />
                <div>
                  <label className="text-sm font-semibold font-body text-[var(--text-primary)] block mb-2">Collection Frequency</label>
                  <div className="flex gap-2">
                    {(['weekly','biweekly','monthly'] as Frequency[]).map(f => (
                      <button
                        key={f}
                        onClick={() => setFrequency(f)}
                        className={`flex-1 py-2 rounded-btn text-xs font-heading font-bold transition-all border-2 ${
                          frequency === f
                            ? 'bg-brand-blue text-white border-brand-blue'
                            : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-brand-blue/50'
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <label className="text-sm font-semibold font-body text-[var(--text-primary)] block mb-2">Optional Add-ons</label>
                  <div className="space-y-2">
                    {ADD_ONS.map(ao => (
                      <label key={ao.id} className={`flex items-center gap-3 p-3 rounded-card border cursor-pointer transition-all ${
                        addOnIds.includes(ao.id)
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-[var(--border-color)] hover:border-brand-blue/30'
                      }`}>
                        <input
                          type="checkbox"
                          checked={addOnIds.includes(ao.id)}
                          onChange={() => toggleAddOn(ao.id)}
                          className="accent-brand-blue"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-body font-semibold text-[var(--text-primary)]">{ao.name}</p>
                          <p className="text-xs font-body text-[var(--text-muted)]">{ao.description}</p>
                        </div>
                        <span className="text-xs font-heading font-bold text-brand-blue">+{formatJMD(ao.priceMonthly)}/mo</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <Card className="border-brand-blue/20 sticky top-24">
                  <h3 className="font-heading font-bold text-lg text-[var(--text-primary)] mb-4">Your Estimate</h3>

                  <div className="text-center bg-brand-navy rounded-card p-5 mb-4">
                    <p className="text-white/60 text-xs font-body uppercase tracking-widest mb-1">Monthly Total</p>
                    <p className="font-heading font-bold text-4xl text-brand-gold">
                      {formatJMD(pricing.monthlyTotal)}
                    </p>
                    <p className="text-white/50 text-xs font-body mt-1">
                      ≈ {formatJMD(pricing.perCollection)} per collection
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[var(--bg-secondary)] rounded-card p-3 text-center">
                      <p className="text-xs font-body text-[var(--text-muted)]">Annual</p>
                      <p className="font-heading font-bold text-lg text-[var(--text-primary)]">{formatJMD(pricing.annualTotal)}</p>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-card p-3 text-center">
                      <p className="text-xs font-body text-[var(--text-muted)]">Base</p>
                      <p className="font-heading font-bold text-lg text-[var(--text-primary)]">{formatJMD(pricing.baseMonthly)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-heading font-bold uppercase text-[var(--text-muted)] mb-2">What&apos;s included:</p>
                    <ul className="space-y-1">
                      {pricing.includes.map(i => (
                        <li key={i} className="flex items-center gap-2 text-xs font-body text-[var(--text-secondary)]">
                          <Check className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" /> {i}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-xs font-body text-[var(--text-muted)] mb-4 italic">
                    * Estimate in JMD. Final pricing subject to site assessment. Prices exclude GCT.
                  </p>

                  <Button variant="primary" size="lg" className="w-full" onClick={() => setModalOpen(true)}>
                    Book This Service
                  </Button>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Book Your Service"
        size="md"
      >
        <form onSubmit={handleBook} className="space-y-4">
          <div className="bg-brand-navy/10 dark:bg-white/5 rounded-card px-4 py-3 mb-2">
            <p className="text-xs font-body text-[var(--text-muted)]">Service selected:</p>
            <p className="font-heading font-bold text-sm text-brand-blue">{SERVICE_LABELS[serviceType]} — {VOLUME_LABELS[volume]}</p>
            <p className="font-heading font-bold text-lg text-brand-navy dark:text-brand-gold">{formatJMD(pricing.monthlyTotal)}/month</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name *"       value={bookForm.name}    onChange={e => setBookForm(f => ({...f, name:    e.target.value}))} error={bookErrors.name}    placeholder="John Brown" />
            <Input label="Email Address *"   value={bookForm.email}   onChange={e => setBookForm(f => ({...f, email:   e.target.value}))} error={bookErrors.email}   placeholder="john@example.com" type="email" />
            <Input label="Phone Number *"    value={bookForm.phone}   onChange={e => setBookForm(f => ({...f, phone:   e.target.value}))} error={bookErrors.phone}   placeholder="876-XXX-XXXX" />
            <Input label="Service Address"   value={bookForm.address} onChange={e => setBookForm(f => ({...f, address: e.target.value}))} placeholder="Kingston, Jamaica" />
          </div>
          <div>
            <label className="text-sm font-semibold font-body text-[var(--text-primary)] block mb-1">Additional Notes</label>
            <textarea
              rows={3}
              value={bookForm.notes}
              onChange={e => setBookForm(f => ({...f, notes: e.target.value}))}
              placeholder="Special requirements, access instructions, etc."
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-input px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-blue resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" size="md" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md" className="flex-1" isLoading={booking}>Confirm Booking</Button>
          </div>
        </form>
      </Modal>
    </SectionWrapper>
  )
}
