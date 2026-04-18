'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Gauge, CheckCircle, Clock, MapPin, Truck } from 'lucide-react'
import SectionWrapper, { SectionHeader } from '@/components/shared/SectionWrapper'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { kingstonRoute, routeStops, stopStatusMessages } from '@/data/truckRoute'
import { useTruckAnimation } from '@/hooks/useTruckAnimation'
import { useToast } from '@/hooks/useToast'

// Dynamic react-leaflet imports — prevent SSR
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer),  { ssr: false })
const TileLayer    = dynamic(() => import('react-leaflet').then(m => m.TileLayer),     { ssr: false })
const Polyline     = dynamic(() => import('react-leaflet').then(m => m.Polyline),      { ssr: false })
const Marker       = dynamic(() => import('react-leaflet').then(m => m.Marker),        { ssr: false })
const Popup        = dynamic(() => import('react-leaflet').then(m => m.Popup),         { ssr: false })

// Inner component that uses useMap — must be inside MapContainer
const MapFollower = dynamic(
  () => import('./MapFollower'),
  { ssr: false }
)

export default function LiveTracking() {
  const { toast }   = useToast()
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed,     setSpeed]     = useState<1 | 2 | 3>(1)
  const [mapReady,  setMapReady]  = useState(false)
  const [leafletL,  setLeafletL]  = useState<typeof import('leaflet') | null>(null)
  const [stepState, setStepState] = useState(0)

  useEffect(() => {
    setMapReady(true)
    const loadLeaflet = async () => {
      const L = await import('leaflet')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.default.Icon.Default.prototype as any)._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl:       '/leaflet/marker-icon.png',
        shadowUrl:     '/leaflet/marker-shadow.png',
      })
      setLeafletL(L.default as typeof import('leaflet'))
    }
    loadLeaflet()
  }, [])

  const handleStopReached = useCallback((stopIndex: number) => {
    const stop = routeStops[stopIndex]
    if (stop) {
      toast(`${stop.name} — collection ${stopIndex < 3 ? 'in progress' : 'complete'}!`, 'info')
    }
  }, [toast])

  const truckPos = useTruckAnimation(kingstonRoute, isPlaying, speed, handleStopReached)

  // Track route step for partial polyline
  useEffect(() => {
    if (isPlaying) setStepState(truckPos.stepIndex)
  }, [truckPos.stepIndex, isPlaying])

  function reset() {
    setIsPlaying(false)
    setStepState(0)
  }

  const visitedRoute: [number, number][] = [
    ...kingstonRoute.slice(0, stepState + 1),
    [truckPos.lat, truckPos.lng],
  ]

  const truckDivIcon = leafletL
    ? new leafletL.DivIcon({
        html: `<div style="transform:rotate(${truckPos.bearing}deg);font-size:28px;
                     filter:drop-shadow(0 2px 6px rgba(27,93,229,0.7));
                     transition:transform 0.3s ease">🚛</div>`,
        className: '',
        iconSize:   [36, 36],
        iconAnchor: [18, 18],
      })
    : undefined

  const depotIcon = leafletL
    ? new leafletL.DivIcon({
        html: `<div style="font-size:20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">🏭</div>`,
        className: '',
        iconSize:   [24, 24],
        iconAnchor: [12, 12],
      })
    : undefined

  return (
    <SectionWrapper id="live-tracking" bgVariant="secondary">
      <SectionHeader
        eyebrow="Demo"
        title="Live Tracking"
        subtitle="See how our GPS-tracked collection trucks operate in real time. Press Play to simulate a Kingston collection route."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card padding="none" className="overflow-hidden" style={{ height: 460 }}>
            {mapReady && leafletL ? (
              <MapContainer
                center={[18.0099, -76.7964]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
                />
                {/* Full planned route — dashed */}
                <Polyline
                  positions={kingstonRoute}
                  pathOptions={{ color: '#1B5DE5', weight: 3, dashArray: '8 6', opacity: 0.35 }}
                />
                {/* Visited route — solid gold */}
                {visitedRoute.length > 1 && (
                  <Polyline
                    positions={visitedRoute}
                    pathOptions={{ color: '#F0C646', weight: 4, opacity: 0.85 }}
                  />
                )}
                {/* Stop markers */}
                {depotIcon && routeStops.map((stop, i) => (
                  <Marker key={i} position={[stop.lat, stop.lng]} icon={depotIcon}>
                    <Popup>
                      <div className="font-body text-sm">
                        <strong>{stop.name}</strong>
                        <p className="text-xs text-gray-500">{stop.eta}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {/* Truck marker */}
                {truckDivIcon && (
                  <Marker position={[truckPos.lat, truckPos.lng]} icon={truckDivIcon}>
                    <Popup>
                      <span className="font-heading font-bold text-sm">🚛 Kaunda WM Truck #3</span>
                    </Popup>
                  </Marker>
                )}
                {/* Auto-follow */}
                {isPlaying && <MapFollower lat={truckPos.lat} lng={truckPos.lng} />}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full bg-brand-light-gray">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-body text-gray-500">Loading map…</p>
                </div>
              </div>
            )}
          </Card>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-3 px-1">
            <div className="flex items-center gap-2 text-xs font-body text-[var(--text-muted)]">
              <span className="w-6 h-0.5 bg-brand-gold rounded" />
              Route completed
            </div>
            <div className="flex items-center gap-2 text-xs font-body text-[var(--text-muted)]">
              <span className="w-6 h-0.5 bg-brand-blue/40 rounded border-t border-dashed border-brand-blue/60" />
              Planned route
            </div>
            <div className="flex items-center gap-2 text-xs font-body text-[var(--text-muted)]">
              <span>🚛</span> Collection truck
            </div>
            <div className="flex items-center gap-2 text-xs font-body text-[var(--text-muted)]">
              <span>🏭</span> Collection stop
            </div>
          </div>
        </div>

        {/* Control panel */}
        <div className="flex flex-col gap-4">
          {/* Controls */}
          <Card className="border-brand-blue/20">
            <h3 className="font-heading font-bold text-base text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-blue" /> Truck Controls
            </h3>

            <div className="flex gap-2 mb-4">
              <Button
                variant={isPlaying ? 'outline' : 'primary'}
                size="md"
                className="flex-1"
                leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                onClick={() => setIsPlaying(p => !p)}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button variant="ghost" size="md" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={reset} title="Reset" />
            </div>

            <div>
              <p className="text-xs font-semibold font-body text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" /> Playback Speed
              </p>
              <div className="flex gap-2">
                {([1,2,3] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`flex-1 py-1.5 rounded-btn text-xs font-heading font-bold border-2 transition-all ${
                      speed === s
                        ? 'bg-brand-gold text-brand-navy border-brand-gold'
                        : 'bg-transparent text-[var(--text-muted)] border-[var(--border-color)] hover:border-brand-gold/40'
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-body mb-1">
                <span className="text-[var(--text-muted)]">Route progress</span>
                <span className="font-bold text-brand-blue">{truckPos.progress}%</span>
              </div>
              <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-gold rounded-full"
                  animate={{ width: `${truckPos.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </Card>

          {/* Status panel */}
          <Card>
            <h3 className="font-heading font-bold text-sm text-[var(--text-muted)] uppercase tracking-widest mb-4">Collection Stops</h3>
            <div className="space-y-3">
              {routeStops.map((stop, i) => {
                const isDone    = truckPos.stopIndex > i
                const isCurrent = truckPos.stopIndex === i && isPlaying
                const isPending = truckPos.stopIndex < i
                return (
                  <div key={stop.name} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      isDone    ? 'bg-brand-gold'   :
                      isCurrent ? 'bg-brand-blue animate-pulse' : 'bg-[var(--bg-secondary)] border border-[var(--border-color)]'
                    }`}>
                      {isDone ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : isCurrent ? (
                        <Truck className="w-2.5 h-2.5 text-white" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-body font-semibold ${
                        isDone ? 'text-[var(--text-muted)] line-through' :
                        isCurrent ? 'text-brand-blue' : 'text-[var(--text-primary)]'
                      }`}>
                        {stop.name}
                      </p>
                      <p className="text-xs font-body text-[var(--text-muted)] flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {stop.address}
                      </p>
                      <p className="text-xs font-body text-[var(--text-muted)] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {stop.eta}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Status message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={truckPos.stopIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: 8 }}
              className="bg-brand-navy text-white rounded-card px-4 py-3 border border-brand-gold/20 text-sm font-body"
            >
              {isPlaying ? stopStatusMessages[truckPos.stopIndex] : '⏸ Press Play to start the route simulation'}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  )
}
