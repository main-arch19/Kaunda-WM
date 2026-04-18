'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from 'recharts'
import { Leaf, Zap, TreePine, Trash2, Info } from 'lucide-react'
import SectionWrapper, { SectionHeader } from '@/components/shared/SectionWrapper'
import Slider from '@/components/ui/Slider'
import Card from '@/components/ui/Card'
import { useTheme } from '@/context/ThemeContext'
import { useState } from 'react'

interface Results {
  co2SavedKg:          number
  landfillReducedKg:   number
  energyKwh:           number
  treesEquivalent:     number
  breakdownPie:        { name: string; value: number; color: string }[]
  barData:             { name: string; value: number; fill: string; unit: string }[]
}

function computeResults(
  trashBagsPerWeek: number,
  recyclingKg: number,
  foodWasteKg: number,
  eWasteItems: number
): Results {
  const landfillKgWeekly     = trashBagsPerWeek * 10 * 0.65
  const landfillReducedKg    = Math.round(landfillKgWeekly * 4.33)
  const co2FromRecycling     = recyclingKg * 4.33 * 2.1
  const co2FromFood          = foodWasteKg * 4.33 * 0.5
  const co2FromEwaste        = eWasteItems * 3.5
  const totalCO2             = Math.round(co2FromRecycling + co2FromFood + co2FromEwaste)
  const energyKwh            = Math.round(recyclingKg * 4.33 * 1.8)
  const treesEquivalent      = parseFloat(((totalCO2 / 21) * 1).toFixed(1))

  const breakdownPie = [
    { name: 'Recycling',  value: Math.round(co2FromRecycling), color: '#1B5DE5' },
    { name: 'Food Waste', value: Math.round(co2FromFood),      color: '#16a34a' },
    { name: 'E-Waste',    value: Math.round(co2FromEwaste),    color: '#F0C646' },
  ].filter(d => d.value > 0)

  const barData = [
    { name: 'CO₂ Saved',   value: totalCO2,          fill: '#F0C646', unit: 'kg/mo' },
    { name: 'Landfill ↓',  value: landfillReducedKg, fill: '#1B5DE5', unit: 'kg/mo' },
    { name: 'Energy',      value: energyKwh,          fill: '#0D3A9E', unit: 'kWh/mo' },
  ]

  return { co2SavedKg: totalCO2, landfillReducedKg, energyKwh, treesEquivalent, breakdownPie, barData }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { name: string; value: number; payload: { unit: string } }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-brand-navy border border-brand-gold/30 rounded-card px-3 py-2 text-sm">
      <p className="text-white/70 text-xs mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-brand-gold font-bold">
          {p.value.toLocaleString()} {p.payload.unit}
        </p>
      ))}
    </div>
  )
}

export default function SustainabilityCalculator() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const axisColor = isDark ? '#94a3b8' : '#64748b'

  const [trashBags,   setTrashBags]   = useState(3)
  const [recyclingKg, setRecyclingKg] = useState(2)
  const [foodWasteKg, setFoodWasteKg] = useState(1)
  const [eWasteItems, setEWasteItems] = useState(0)

  const results = useMemo(
    () => computeResults(trashBags, recyclingKg, foodWasteKg, eWasteItems),
    [trashBags, recyclingKg, foodWasteKg, eWasteItems]
  )

  const summaryCards = [
    { icon: Leaf,     value: results.co2SavedKg,       unit: 'kg',  label: 'CO₂ Saved',         color: 'text-green-500',    bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: Trash2,   value: results.landfillReducedKg, unit: 'kg',  label: 'Landfill Reduced',  color: 'text-brand-blue',   bg: 'bg-blue-50 dark:bg-blue-900/20'  },
    { icon: Zap,      value: results.energyKwh,          unit: 'kWh', label: 'Energy Recovered',  color: 'text-brand-gold',   bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { icon: TreePine, value: results.treesEquivalent,   unit: '',    label: 'Tree Equivalents',   color: 'text-emerald-500',  bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ]

  return (
    <SectionWrapper id="sustainability" bgVariant="primary">
      <SectionHeader
        eyebrow="Calculator"
        title="Sustainability Impact"
        subtitle="Move the sliders to see the real environmental difference your recycling and composting habits make each month."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders */}
        <div>
          <Card className="mb-4">
            <h3 className="font-heading font-bold text-base text-[var(--text-primary)] mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center text-xs font-body">1</span>
              Your Weekly Waste
            </h3>
            <div className="space-y-6">
              <Slider
                label="Trash bags per week"
                unit="bags"
                min={0} max={20} step={1}
                value={trashBags}
                onChange={setTrashBags}
                hint="Average Jamaican household produces 2–4 bags/week"
              />
              <Slider
                label="Recyclables sorted"
                unit="kg/week"
                min={0} max={20} step={0.5}
                value={recyclingKg}
                onChange={setRecyclingKg}
                hint="Plastics, glass, cardboard, and metal combined"
              />
              <Slider
                label="Food / organic waste"
                unit="kg/week"
                min={0} max={15} step={0.5}
                value={foodWasteKg}
                onChange={setFoodWasteKg}
                hint="Fruit & veg scraps, coffee grounds, food leftovers"
              />
              <Slider
                label="E-waste disposed"
                unit="items/month"
                min={0} max={10} step={1}
                value={eWasteItems}
                onChange={setEWasteItems}
                hint="Old phones, batteries, cables, bulbs"
              />
            </div>
          </Card>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3">
            {summaryCards.map(({ icon: Icon, value, unit, label, color, bg }) => (
              <motion.div
                key={label}
                layout
                className={`${bg} rounded-card p-4 border border-[var(--border-color)]`}
              >
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <motion.p
                  key={value}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-heading font-bold text-2xl text-[var(--text-primary)]"
                >
                  {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value.toLocaleString()}
                  {unit && <span className="text-xs font-body text-[var(--text-muted)] ml-1">{unit}</span>}
                </motion.p>
                <p className="text-xs font-body text-[var(--text-muted)]">{label} / month</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="flex flex-col gap-4">
          <Card>
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Monthly Environmental Impact</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={results.barData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {results.barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">CO₂ Impact Breakdown</p>
            {results.breakdownPie.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={results.breakdownPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {results.breakdownPie.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: axisColor, fontSize: 11 }}>{value}</span>}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} kg CO₂`, '']}
                    contentStyle={{ background: '#0A1F4E', border: '1px solid rgba(240,198,70,0.3)', borderRadius: 8, color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center gap-2">
                <p className="text-3xl">📊</p>
                <p className="text-sm font-body text-[var(--text-muted)]">Move the sliders above to see<br />your sustainability impact.</p>
              </div>
            )}
          </Card>

          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-card px-4 py-3 flex gap-2">
            <Info className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <p className="text-xs font-body text-[var(--text-secondary)]">
              <strong>Science:</strong> CO₂ calculations use IPCC emission factors. Energy recovery based on Jamaican average grid mix. Landfill estimates from NSWMA Jamaica data.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
