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
    id: 'st-andrew',
    name: 'St. Andrew',
    center: [18.0747, -76.7466],
    serviceZone: 'zone-a',
    collectionDays: ['Tuesday', 'Thursday', 'Saturday'],
    coveragePercent: 94,
    population: 573_000,
    description: 'Including Half Way Tree, Liguanea, Constant Spring, and surrounding communities.',
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
  {
    id: 'clarendon',
    name: 'Clarendon',
    center: [17.9534, -77.2398],
    serviceZone: 'zone-b',
    collectionDays: ['Tuesday', 'Friday'],
    coveragePercent: 75,
    population: 246_000,
    description: 'May Pen and surrounding communities. Expanding coverage.',
  },
  {
    id: 'manchester',
    name: 'Manchester',
    center: [18.0432, -77.5052],
    serviceZone: 'zone-b',
    collectionDays: ['Wednesday', 'Saturday'],
    coveragePercent: 78,
    population: 190_000,
    description: 'Mandeville and surrounding highlands communities.',
  },
  {
    id: 'st-elizabeth',
    name: 'St. Elizabeth',
    center: [17.9885, -77.7443],
    serviceZone: 'zone-b',
    collectionDays: ['Monday', 'Friday'],
    coveragePercent: 65,
    population: 151_000,
    description: 'Black River and Santa Cruz areas. Expanding rural coverage.',
  },
  {
    id: 'westmoreland',
    name: 'Westmoreland',
    center: [18.2975, -78.1454],
    serviceZone: 'zone-b',
    collectionDays: ['Tuesday', 'Saturday'],
    coveragePercent: 60,
    population: 145_000,
    description: 'Savanna-la-Mar and surrounding communities.',
  },
  {
    id: 'hanover',
    name: 'Hanover',
    center: [18.4099, -78.1334],
    serviceZone: 'zone-c',
    collectionDays: ['Wednesday'],
    coveragePercent: 55,
    population: 69_000,
    description: 'Lucea area. Expanding collection scheduled.',
  },
  {
    id: 'st-james',
    name: 'St. James',
    center: [18.4759, -77.8939],
    serviceZone: 'zone-c',
    collectionDays: ['Monday', 'Thursday'],
    coveragePercent: 82,
    population: 185_000,
    description: 'Montego Bay and surrounding tourism corridor communities.',
  },
  {
    id: 'trelawny',
    name: 'Trelawny',
    center: [18.3525, -77.6525],
    serviceZone: 'zone-c',
    collectionDays: ['Tuesday', 'Friday'],
    coveragePercent: 58,
    population: 75_000,
    description: 'Falmouth and surrounding communities.',
  },
  {
    id: 'st-ann',
    name: 'St. Ann',
    center: [18.4300, -77.2010],
    serviceZone: 'zone-c',
    collectionDays: ['Wednesday', 'Saturday'],
    coveragePercent: 70,
    population: 172_000,
    description: 'Ocho Rios, St. Ann\'s Bay, and tourism corridor.',
  },
  {
    id: 'st-mary',
    name: 'St. Mary',
    center: [18.3093, -76.9147],
    serviceZone: 'zone-c',
    collectionDays: ['Monday', 'Thursday'],
    coveragePercent: 62,
    population: 115_000,
    description: 'Port Maria and surrounding communities.',
  },
  {
    id: 'portland',
    name: 'Portland',
    center: [18.1789, -76.4513],
    serviceZone: 'zone-c',
    collectionDays: ['Tuesday'],
    coveragePercent: 50,
    population: 81_000,
    description: 'Port Antonio area. Eco-tourism corridor. Expanding service.',
  },
  {
    id: 'st-thomas',
    name: 'St. Thomas',
    center: [17.9340, -76.3537],
    serviceZone: 'zone-c',
    collectionDays: ['Wednesday', 'Friday'],
    coveragePercent: 55,
    population: 94_000,
    description: 'Morant Bay and surrounding communities.',
  },
]

export const zoneColors: Record<ServiceZone, { fill: string; stroke: string; label: string; description: string }> = {
  'zone-a': {
    fill: '#1B5DE5',
    stroke: '#0D3A9E',
    label: 'Zone A — Core Service',
    description: 'Kingston Metro Area: Full 3× weekly collection + recycling',
  },
  'zone-b': {
    fill: '#F0C646',
    stroke: '#D4A82E',
    label: 'Zone B — Extended Service',
    description: 'Central & Western Parishes: 2× weekly collection',
  },
  'zone-c': {
    fill: '#0D3A9E',
    stroke: '#0A1F4E',
    label: 'Zone C — Growing Service',
    description: 'North Coast & Eastern Parishes: Weekly collection, expanding',
  },
}
