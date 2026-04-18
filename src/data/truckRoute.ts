// Kingston collection route — Half Way Tree → New Kingston → Downtown → back to depot
// 26 waypoints, roughly 300m apart for smooth animation

export const kingstonRoute: [number, number][] = [
  [18.0099, -76.7964], // 0: Half Way Tree Depot (start)
  [18.0120, -76.7950], // 1
  [18.0135, -76.7932], // 2
  [18.0148, -76.7910], // 3: Half Way Tree Road heading east
  [18.0155, -76.7880], // 4
  [18.0152, -76.7850], // 5: New Kingston area begins
  [18.0145, -76.7825], // 6: Knutsford Boulevard
  [18.0130, -76.7805], // 7: Oxford Road area
  [18.0110, -76.7800], // 8
  [18.0085, -76.7795], // 9: New Kingston business district
  [18.0060, -76.7790], // 10: Trafalgar Road
  [18.0035, -76.7785], // 11
  [18.0010, -76.7780], // 12: Cross Roads vicinity
  [17.9985, -76.7775], // 13
  [17.9960, -76.7772], // 14: Upper King Street
  [17.9935, -76.7768], // 15
  [17.9910, -76.7765], // 16: Downtown Kingston begins
  [17.9890, -76.7768], // 17: King Street Downtown
  [17.9875, -76.7780], // 18: Near waterfront
  [17.9865, -76.7800], // 19: Kingston Harbour area
  [17.9875, -76.7830], // 20: Heading back north
  [17.9890, -76.7855], // 21: Spanish Town Road
  [17.9910, -76.7875], // 22
  [17.9940, -76.7900], // 23: Washington Boulevard turn
  [17.9975, -76.7930], // 24: Heading back to Half Way Tree
  [18.0030, -76.7950], // 25
  [18.0099, -76.7964], // 26: Back to depot (loop complete)
]

export interface RouteStop {
  name:         string
  address:      string
  eta:          string
  arrivalStep:  number // which step in kingstonRoute array corresponds to this stop
  lat:          number
  lng:          number
}

export const routeStops: RouteStop[] = [
  {
    name:        'Half Way Tree Depot',
    address:     'Half Way Tree Road, Kingston 10',
    eta:         'Departed 6:00 AM',
    arrivalStep: 0,
    lat:         18.0099,
    lng:         -76.7964,
  },
  {
    name:        'New Kingston Zone',
    address:     'Knutsford Blvd / Oxford Rd',
    eta:         'ETA 7:15 AM',
    arrivalStep: 7,
    lat:         18.0145,
    lng:         -76.7825,
  },
  {
    name:        'Downtown Kingston',
    address:     'King Street, Kingston',
    eta:         'ETA 8:45 AM',
    arrivalStep: 17,
    lat:         17.9890,
    lng:         -76.7768,
  },
  {
    name:        'Return to Depot',
    address:     'Half Way Tree Road, Kingston 10',
    eta:         'ETA 10:00 AM',
    arrivalStep: 26,
    lat:         18.0099,
    lng:         -76.7964,
  },
]

export const stopStatusMessages = [
  '🚛 Truck is en route — departed Half Way Tree Depot',
  '♻️ Collecting in New Kingston Zone — 15 properties remaining',
  '🏙️ Downtown Kingston collection in progress — almost done!',
  '✅ Collection complete — truck returning to depot',
]
