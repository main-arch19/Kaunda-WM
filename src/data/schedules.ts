export type CollectionType = 'general' | 'recycling' | 'organics' | 'bulky'
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export interface DaySchedule {
  day:   DayOfWeek
  types: CollectionType[]
  time:  string
}

export interface ParishSchedule {
  parish:       string
  zone:         string
  weeklyDays:   DaySchedule[]
  bulkyPickup:  { day: DayOfWeek; bookingRequired: boolean }
  nextPickup:   string
  notes:        string[]
}

const ALL_DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function getEmptyWeek(): Record<DayOfWeek, CollectionType[]> {
  return Object.fromEntries(ALL_DAYS.map(d => [d, []])) as unknown as Record<DayOfWeek, CollectionType[]>
}

export function buildWeekMap(schedule: ParishSchedule): Record<DayOfWeek, CollectionType[]> {
  const week = getEmptyWeek()
  for (const ds of schedule.weeklyDays) {
    week[ds.day] = ds.types
  }
  week[schedule.bulkyPickup.day] = [
    ...(week[schedule.bulkyPickup.day] || []),
    'bulky',
  ]
  return week
}

export const schedules: ParishSchedule[] = [
  {
    parish: 'Kingston',
    zone:   'Zone A',
    weeklyDays: [
      { day: 'Monday',    types: ['general', 'recycling'], time: '6:00 AM – 2:00 PM' },
      { day: 'Wednesday', types: ['organics'],              time: '7:00 AM – 1:00 PM' },
      { day: 'Friday',    types: ['general', 'recycling'], time: '6:00 AM – 2:00 PM' },
    ],
    bulkyPickup: { day: 'Saturday', bookingRequired: true },
    nextPickup: 'Monday',
    notes: ['Service suspended on public holidays — next available day applies', 'Green bin programme included with all Kingston accounts'],
  },
  {
    parish: 'St. Andrew',
    zone:   'Zone A',
    weeklyDays: [
      { day: 'Tuesday',   types: ['general', 'recycling'], time: '6:00 AM – 3:00 PM' },
      { day: 'Thursday',  types: ['organics'],              time: '7:00 AM – 2:00 PM' },
      { day: 'Saturday',  types: ['general', 'recycling'], time: '7:00 AM – 12:00 PM' },
    ],
    bulkyPickup: { day: 'Wednesday', bookingRequired: true },
    nextPickup: 'Tuesday',
    notes: ['Half Way Tree, Liguanea, and Constant Spring on separate sub-routes', 'Early morning collections in gated communities'],
  },
  {
    parish: 'St. Catherine',
    zone:   'Zone A',
    weeklyDays: [
      { day: 'Monday',   types: ['general'],              time: '7:00 AM – 3:00 PM' },
      { day: 'Thursday', types: ['general', 'recycling'], time: '7:00 AM – 3:00 PM' },
    ],
    bulkyPickup: { day: 'Friday', bookingRequired: true },
    nextPickup: 'Monday',
    notes: ['Portmore routes operate 6 AM start due to traffic', 'Spanish Town commercial route on Wednesday'],
  },
  {
    parish: 'Clarendon',
    zone:   'Zone B',
    weeklyDays: [
      { day: 'Tuesday', types: ['general'],              time: '7:30 AM – 4:00 PM' },
      { day: 'Friday',  types: ['general', 'recycling'], time: '7:30 AM – 4:00 PM' },
    ],
    bulkyPickup: { day: 'Saturday', bookingRequired: true },
    nextPickup: 'Tuesday',
    notes: ['May Pen town centre collected Tuesday morning', 'Outlying communities Friday afternoon'],
  },
  {
    parish: 'Manchester',
    zone:   'Zone B',
    weeklyDays: [
      { day: 'Wednesday', types: ['general'],              time: '7:00 AM – 3:00 PM' },
      { day: 'Saturday',  types: ['general', 'recycling'], time: '7:00 AM – 1:00 PM' },
    ],
    bulkyPickup: { day: 'Monday', bookingRequired: true },
    nextPickup: 'Wednesday',
    notes: ['Mandeville town serviced Wednesday', 'Christiana area on Saturday route'],
  },
  {
    parish: 'St. Elizabeth',
    zone:   'Zone B',
    weeklyDays: [
      { day: 'Monday', types: ['general'], time: '7:30 AM – 4:00 PM' },
      { day: 'Friday', types: ['general', 'recycling'], time: '7:30 AM – 4:00 PM' },
    ],
    bulkyPickup: { day: 'Thursday', bookingRequired: true },
    nextPickup: 'Monday',
    notes: ['Black River collected Monday', 'Santa Cruz Friday route'],
  },
  {
    parish: 'Westmoreland',
    zone:   'Zone B',
    weeklyDays: [
      { day: 'Tuesday',  types: ['general'], time: '7:30 AM – 4:00 PM' },
      { day: 'Saturday', types: ['general', 'recycling'], time: '7:30 AM – 1:00 PM' },
    ],
    bulkyPickup: { day: 'Wednesday', bookingRequired: true },
    nextPickup: 'Tuesday',
    notes: ['Savanna-la-Mar downtown Tuesday', 'Negril area Saturday'],
  },
  {
    parish: 'Hanover',
    zone:   'Zone C',
    weeklyDays: [
      { day: 'Wednesday', types: ['general'], time: '8:00 AM – 4:00 PM' },
    ],
    bulkyPickup: { day: 'Friday', bookingRequired: true },
    nextPickup: 'Wednesday',
    notes: ['Lucea town on Wednesday morning', 'Expanding to biweekly — contact us for updates'],
  },
  {
    parish: 'St. James',
    zone:   'Zone C',
    weeklyDays: [
      { day: 'Monday',   types: ['general', 'recycling'], time: '7:00 AM – 3:00 PM' },
      { day: 'Thursday', types: ['general'],              time: '7:00 AM – 3:00 PM' },
    ],
    bulkyPickup: { day: 'Tuesday', bookingRequired: true },
    nextPickup: 'Monday',
    notes: ['Montego Bay central on early Monday route', 'Tourist strip properties have dedicated commercial contracts'],
  },
  {
    parish: 'Trelawny',
    zone:   'Zone C',
    weeklyDays: [
      { day: 'Tuesday', types: ['general'], time: '8:00 AM – 4:00 PM' },
      { day: 'Friday',  types: ['general', 'recycling'], time: '8:00 AM – 3:00 PM' },
    ],
    bulkyPickup: { day: 'Saturday', bookingRequired: true },
    nextPickup: 'Tuesday',
    notes: ['Falmouth town Tuesday', 'Duncans and surrounding areas Friday'],
  },
  {
    parish: 'St. Ann',
    zone:   'Zone C',
    weeklyDays: [
      { day: 'Wednesday', types: ['general'],              time: '7:30 AM – 4:00 PM' },
      { day: 'Saturday',  types: ['general', 'recycling'], time: '7:30 AM – 12:00 PM' },
    ],
    bulkyPickup: { day: 'Monday', bookingRequired: true },
    nextPickup: 'Wednesday',
    notes: ['Ocho Rios and St. Ann\'s Bay on Wednesday', 'Brown\'s Town area Saturday'],
  },
  {
    parish: 'St. Mary',
    zone:   'Zone C',
    weeklyDays: [
      { day: 'Monday',   types: ['general'],              time: '8:00 AM – 4:00 PM' },
      { day: 'Thursday', types: ['general', 'recycling'], time: '8:00 AM – 3:00 PM' },
    ],
    bulkyPickup: { day: 'Wednesday', bookingRequired: true },
    nextPickup: 'Monday',
    notes: ['Port Maria on Monday', 'Annotto Bay area Thursday'],
  },
  {
    parish: 'Portland',
    zone:   'Zone C',
    weeklyDays: [
      { day: 'Tuesday', types: ['general'], time: '8:00 AM – 5:00 PM' },
    ],
    bulkyPickup: { day: 'Friday', bookingRequired: true },
    nextPickup: 'Tuesday',
    notes: ['Port Antonio town on Tuesday', 'Eco-tourism properties have premium collection options'],
  },
  {
    parish: 'St. Thomas',
    zone:   'Zone C',
    weeklyDays: [
      { day: 'Wednesday', types: ['general'],              time: '8:00 AM – 4:00 PM' },
      { day: 'Friday',    types: ['general', 'recycling'], time: '8:00 AM – 3:00 PM' },
    ],
    bulkyPickup: { day: 'Tuesday', bookingRequired: true },
    nextPickup: 'Wednesday',
    notes: ['Morant Bay Wednesday', 'Bath area Friday'],
  },
]

export const collectionTypeConfig: Record<CollectionType, {
  label: string; color: string; bgColor: string; borderColor: string; emoji: string
}> = {
  general:   { label: 'General Waste',  color: '#ffffff', bgColor: '#374151', borderColor: '#374151', emoji: '🗑️' },
  recycling: { label: 'Recycling',      color: '#ffffff', bgColor: '#1B5DE5', borderColor: '#1B5DE5', emoji: '♻️' },
  organics:  { label: 'Organics',       color: '#ffffff', bgColor: '#16a34a', borderColor: '#16a34a', emoji: '🌿' },
  bulky:     { label: 'Bulky Items',    color: '#0A1F4E', bgColor: '#F0C646', borderColor: '#D4A82E', emoji: '📦' },
}
