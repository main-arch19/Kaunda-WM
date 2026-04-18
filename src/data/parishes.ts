export type ServiceZone = 'zone-a' | 'zone-b' | 'zone-c'

export interface Parish {
  id:               string
  name:             string
  center:           [number, number]
  serviceZone:      ServiceZone
  collectionDays:   string[]
  coveragePercent:  number
  population:       number
  description:      string
}

export const parishes: Parish[] = [
  {
    id: 'kingston',
    name: 'Kingston',
    center: [17.9970, -76.7936],
    serviceZone: 'zone-a',
    collectionDays: ['Monday', 'Wednesday', 'Friday'],
    coveragePercent: 98,
    population: 96_000,
    description: 'Full city coverage including Downtown, New Kingston, and Cross Roads.',
  },
  {
    id: 'st-catherine',
    name: 'St. Catherine',
    center: [17.9894, -77.0062],
    serviceZone: 'zone-a',
    collectionDays: ['Monday', 'Thursday'],
    coveragePercent: 85,
    population: 519_000,
    description: 'Portmore, Spanish Town, and surrounding communities.',
  },
]

export const zoneColors: Record<ServiceZone, { fill: string; stroke: string; label: string; description: string }> = {
  'zone-a': {
    fill: '#1B5DE5',
    stroke: '#0D3A9E',
    label: 'Zone A — Core Service',
    description: 'Kingston & St. Catherine: Full collection + recycling',
  },
  'zone-b': {
    fill: '#F0C646',
    stroke: '#D4A82E',
    label: 'Zone B — Extended Service',
    description: 'Extended service area',
  },
  'zone-c': {
    fill: '#0D3A9E',
    stroke: '#0A1F4E',
    label: 'Zone C — Growing Service',
    description: 'Growing service area',
  },
}
