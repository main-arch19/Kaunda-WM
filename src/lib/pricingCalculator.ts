export type ServiceType =
  | 'residential-standard'
  | 'residential-premium'
  | 'commercial-small'
  | 'commercial-large'
  | 'industrial'

export type VolumeUnit = '1-bin' | '2-bins' | '4-bins' | '8-bins' | 'bulk-truck'
export type Frequency  = 'weekly' | 'biweekly' | 'monthly'

export interface AddOn {
  id:           string
  name:         string
  description:  string
  priceMonthly: number
}

export interface PricingResult {
  baseMonthly:  number
  monthlyTotal: number
  annualTotal:  number
  perCollection:number
  frequency:    Frequency
  includes:     string[]
  addOns:       AddOn[]
}

const BASE_RATES: Record<ServiceType, number> = {
  'residential-standard': 3_500,
  'residential-premium':  6_800,
  'commercial-small':    18_500,
  'commercial-large':    45_000,
  'industrial':         120_000,
}

const VOLUME_MULTIPLIERS: Record<VolumeUnit, number> = {
  '1-bin':      1.0,
  '2-bins':     1.8,
  '4-bins':     3.2,
  '8-bins':     5.5,
  'bulk-truck': 12.0,
}

const FREQUENCY_MULTIPLIERS: Record<Frequency, number> = {
  weekly:   4.33,
  biweekly: 2.17,
  monthly:  1.0,
}

const COLLECTIONS_PER_MONTH: Record<Frequency, number> = {
  weekly:   4,
  biweekly: 2,
  monthly:  1,
}

export const SERVICE_INCLUDES: Record<ServiceType, string[]> = {
  'residential-standard': ['Weekly kerbside collection', 'Black bin waste only', 'Scheduled SMS reminders'],
  'residential-premium':  ['Weekly kerbside collection', 'Recycling (blue bin)', 'Organics (green bin)', 'SMS reminders', 'Customer portal access'],
  'commercial-small':     ['3× weekly collection', 'Dedicated account manager', 'Recycling programme', 'Monthly usage report'],
  'commercial-large':     ['Daily collection option', 'Dedicated fleet unit', 'Full recycling suite', 'Compliance reporting', '24/7 support line'],
  'industrial':           ['Custom schedule', 'Bulk roll-off containers', 'Hazardous waste handling', 'NSWMA compliance docs', 'On-site waste audit'],
}

export const ADD_ONS: AddOn[] = [
  { id: 'hazardous', name: 'Hazardous Waste Disposal', description: 'Paint, chemicals, motor oil', priceMonthly: 4_500 },
  { id: 'ewaste',    name: 'E-Waste Collection',       description: 'Electronics, batteries, bulbs', priceMonthly: 2_800 },
  { id: 'bulky',     name: 'Bulky Item Pickup',         description: 'Furniture, appliances, mattresses', priceMonthly: 3_200 },
  { id: 'compost',   name: 'Composting Programme',      description: 'Green bin + compost pickup', priceMonthly: 1_500 },
]

export function calculatePrice(
  serviceType: ServiceType,
  volume:      VolumeUnit,
  frequency:   Frequency,
  selectedAddOnIds: string[]
): PricingResult {
  const base        = BASE_RATES[serviceType] * VOLUME_MULTIPLIERS[volume]
  const baseMonthly = Math.round(base * FREQUENCY_MULTIPLIERS[frequency])

  const addOnTotal = selectedAddOnIds.reduce((sum, id) => {
    const ao = ADD_ONS.find(a => a.id === id)
    return sum + (ao?.priceMonthly ?? 0)
  }, 0)

  const monthlyTotal  = baseMonthly + addOnTotal
  const annualTotal   = monthlyTotal * 12
  const perCollection = Math.round(monthlyTotal / COLLECTIONS_PER_MONTH[frequency])

  return {
    baseMonthly,
    monthlyTotal,
    annualTotal,
    perCollection,
    frequency,
    includes: SERVICE_INCLUDES[serviceType],
    addOns:   ADD_ONS,
  }
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  'residential-standard': 'Residential Standard',
  'residential-premium':  'Residential Premium',
  'commercial-small':     'Commercial (Small)',
  'commercial-large':     'Commercial (Large)',
  'industrial':           'Industrial / Municipal',
}

export const VOLUME_LABELS: Record<VolumeUnit, string> = {
  '1-bin':      '1 Bin (≈ 120L)',
  '2-bins':     '2 Bins (≈ 240L)',
  '4-bins':     '4 Bins (≈ 480L)',
  '8-bins':     '8 Bins (≈ 960L)',
  'bulk-truck': 'Bulk Truck Load',
}
