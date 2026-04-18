'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Camera, Recycle, RotateCcw, Leaf, Zap, Clock, Lightbulb, ArrowRight } from 'lucide-react'
import SectionWrapper, { SectionHeader } from '@/components/shared/SectionWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { wasteItems, type WasteItem, type BinColor } from '@/data/wasteItems'
import { fuzzySearch } from '@/lib/fuzzySearch'

const binConfig: Record<BinColor, { label: string; color: string; bg: string; emoji: string; text: string }> = {
  blue:    { label: 'Blue Bin — Recycling',  color: '#1B5DE5', bg: 'bg-brand-blue',      emoji: '♻️',  text: 'text-white' },
  green:   { label: 'Green Bin — Organics',  color: '#16a34a', bg: 'bg-green-600',        emoji: '🌿',  text: 'text-white' },
  black:   { label: 'Black Bin — General',   color: '#1a1a1a', bg: 'bg-gray-900',         emoji: '🗑️', text: 'text-white' },
  special: { label: 'Special Disposal',      color: '#D4A82E', bg: 'bg-brand-dark-gold',  emoji: '⚠️',  text: 'text-white' },
}

// Sample photo items for simulation
const photoItems = [
  wasteItems.find(i => i.id === 1)!,   // plastic bottle
  wasteItems.find(i => i.id === 96)!,  // banana peel
  wasteItems.find(i => i.id === 126)!, // phone
  wasteItems.find(i => i.id === 76)!,  // wine bottle
  wasteItems.find(i => i.id === 151)!, // aluminium can
  wasteItems.find(i => i.id === 41)!,  // cardboard box
]

const categoryEmojis: Record<string, string> = {
  plastic:   '🧴', glass: '🍶', paper: '📦', organic: '🌱',
  electronic:'💻', hazardous: '⚠️', metal: '🔩', textile: '👕', general: '🗑️',
}

export default function WasteWizard() {
  const [query,        setQuery]        = useState('')
  const [results,      setResults]      = useState<WasteItem[]>([])
  const [selected,     setSelected]     = useState<WasteItem | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isSearching,  setIsSearching]  = useState(false)
  const [isFlashing,   setIsFlashing]   = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoConfidence] = useState(() => 90 + Math.floor(Math.random() * 8))
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback((q: string) => {
    setQuery(q)
    setDropdownOpen(q.length > 0)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim()) { setResults([]); return }
    setIsSearching(true)
    debounceRef.current = setTimeout(() => {
      setResults(fuzzySearch(q, wasteItems))
      setIsSearching(false)
    }, 300)
  }, [])

  function selectItem(item: WasteItem) {
    setSelected(item)
    setQuery(item.name)
    setDropdownOpen(false)
    setResults([])
  }

  function simulatePhoto() {
    setIsFlashing(true)
    setPhotoLoading(true)
    setTimeout(() => setIsFlashing(false), 300)
    setTimeout(() => {
      const randomItem = photoItems[Math.floor(Math.random() * photoItems.length)]
      setSelected(randomItem)
      setQuery(randomItem.name)
      setPhotoLoading(false)
    }, 1600)
  }

  function reset() {
    setSelected(null)
    setQuery('')
    setResults([])
  }

  const bin = selected ? binConfig[selected.bin] : null

  return (
    <SectionWrapper id="waste-wizard" bgVariant="secondary">
      <SectionHeader
        eyebrow="Waste Identifier"
        title="Waste Wizard"
        subtitle="Not sure which bin? Type any item or simulate a photo upload — get instant disposal guidance for any waste type in Jamaica."
        centered
      />

      <div className="max-w-2xl mx-auto">
        {/* Search box */}
        <Card className="mb-6 border-brand-blue/20">
          <div className="relative">
            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-input border-2 border-brand-blue/30 focus-within:border-brand-blue transition-colors px-4 py-3">
              <Search className="w-5 h-5 text-brand-gold flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => search(e.target.value)}
                placeholder="Type any item — e.g. plastic bottle, banana peel, old phone…"
                className="flex-1 bg-transparent font-body text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                onFocus={() => query && setDropdownOpen(true)}
              />
              {isSearching && (
                <div className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {/* Dropdown results */}
            <AnimatePresence>
              {dropdownOpen && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{    opacity: 0, y: -4 }}
                  className="absolute left-0 right-0 top-full mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-card shadow-xl z-20 overflow-hidden"
                >
                  {results.map(item => (
                    <button
                      key={item.id}
                      onClick={() => selectItem(item)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors text-left group"
                    >
                      <span className="text-xl">{categoryEmojis[item.category] ?? '📦'}</span>
                      <div className="flex-1">
                        <p className="text-sm font-body font-semibold text-[var(--text-primary)]">{item.name}</p>
                        <p className="text-xs font-body text-[var(--text-muted)] capitalize">{item.category}</p>
                      </div>
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                        style={{ backgroundColor: binConfig[item.bin].color }}
                        title={binConfig[item.bin].label}
                      />
                      <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-brand-blue transition-colors" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-px bg-[var(--border-color)]" />
            <span className="text-xs font-body text-[var(--text-muted)]">or</span>
            <div className="flex-1 h-px bg-[var(--border-color)]" />
          </div>

          <Button
            variant="outline"
            size="md"
            className="w-full mt-3"
            leftIcon={<Camera className="w-4 h-4" />}
            onClick={simulatePhoto}
            isLoading={photoLoading}
          >
            {photoLoading ? 'Analysing photo…' : 'Simulate Photo Upload (AI Identify)'}
          </Button>
        </Card>

        {/* Flash effect */}
        <AnimatePresence>
          {isFlashing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{    opacity: 0 }}
              className="fixed inset-0 bg-white z-50 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence mode="wait">
          {selected && bin && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Card className="border-brand-blue/20 overflow-hidden">
                {/* Bin header */}
                <div className={`${bin.bg} rounded-t-card -mx-4 -mt-4 px-6 py-5 mb-5 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{bin.emoji}</span>
                    <div>
                      <p className="text-white/70 text-xs font-body mb-0.5">{selected.name} goes in the…</p>
                      <p className="font-heading font-bold text-xl text-white">{bin.label}</p>
                      {selected.recyclable && (
                        <Badge variant="gold" className="mt-1.5">
                          <Recycle className="w-3 h-3" /> Recyclable ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="gray" size="sm" className="bg-white/20 text-white border-white/30 capitalize">
                      {categoryEmojis[selected.category]} {selected.category}
                    </Badge>
                  </div>
                </div>

                {/* Environmental impact */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-[var(--bg-secondary)] rounded-card p-3 text-center">
                    <Leaf className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="font-heading font-bold text-sm text-[var(--text-primary)]">{selected.environmentalImpact.co2SavedKg} kg</p>
                    <p className="text-xs font-body text-[var(--text-muted)]">CO₂ saved</p>
                  </div>
                  <div className="bg-[var(--bg-secondary)] rounded-card p-3 text-center">
                    <Clock className="w-5 h-5 text-brand-blue mx-auto mb-1" />
                    <p className="font-heading font-bold text-sm text-[var(--text-primary)]">
                      {selected.environmentalImpact.decompositionYears > 999_999
                        ? '1M+ yrs'
                        : selected.environmentalImpact.decompositionYears >= 1000
                        ? `${(selected.environmentalImpact.decompositionYears/1000).toFixed(0)}k yrs`
                        : `${selected.environmentalImpact.decompositionYears} yrs`}
                    </p>
                    <p className="text-xs font-body text-[var(--text-muted)]">Decomposes in</p>
                  </div>
                  <div className="bg-[var(--bg-secondary)] rounded-card p-3 text-center">
                    <Zap className="w-5 h-5 text-brand-gold mx-auto mb-1" />
                    <p className="font-heading font-bold text-xs text-[var(--text-primary)] leading-tight">
                      {selected.environmentalImpact.equivalent.length > 30
                        ? selected.environmentalImpact.equivalent.slice(0, 30) + '…'
                        : selected.environmentalImpact.equivalent}
                    </p>
                    <p className="text-xs font-body text-[var(--text-muted)]">Equivalent</p>
                  </div>
                </div>

                {/* Tips */}
                <div className="mb-4">
                  <p className="text-xs font-heading font-bold uppercase text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-brand-gold" /> Tips
                  </p>
                  <ul className="space-y-1.5">
                    {selected.tips.map(tip => (
                      <li key={tip} className="flex items-start gap-2 text-sm font-body text-[var(--text-secondary)]">
                        <span className="text-brand-gold mt-0.5 flex-shrink-0">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Aliases */}
                {selected.aliases.length > 0 && (
                  <div className="border-t border-[var(--border-color)] pt-3 mb-4">
                    <p className="text-xs font-body text-[var(--text-muted)]">Also known as: <span className="text-[var(--text-secondary)]">{selected.aliases.join(', ')}</span></p>
                  </div>
                )}

                <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={reset}>
                  Search another item
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state suggestions */}
        {!selected && !query && (
          <div className="text-center">
            <p className="text-sm font-body text-[var(--text-muted)] mb-3">Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Plastic bottle','Banana peel','Old phone','Glass jar','Cardboard box','Aluminium can'].map(s => (
                <button
                  key={s}
                  onClick={() => search(s)}
                  className="text-sm font-body text-brand-blue border border-brand-blue/30 hover:bg-brand-blue/10 rounded-full px-3 py-1.5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
