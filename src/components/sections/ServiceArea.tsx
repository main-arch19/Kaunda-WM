'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, CheckCircle, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionWrapper, { SectionHeader } from '@/components/shared/SectionWrapper'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import { parishes, zoneColors, type Parish } from '@/data/parishes'

// Dynamic imports — prevents SSR issues with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer    = dynamic(() => import('react-leaflet').then(m => m.TileLayer),    { ssr: false })
const Marker       = dynamic(() => import('react-leaflet').then(m => m.Marker),       { ssr: false })
const Popup        = dynamic(() => import('react-leaflet').then(m => m.Popup),        { ssr: false })
const Circle       = dynamic(() => import('react-leaflet').then(m => m.Circle),       { ssr: false })

const zoneBadgeVariant = { 'zone-a': 'blue', 'zone-b': 'gold', 'zone-c': 'navy' } as const

export default function ServiceArea() {
  const [selected, setSelected]   = useState<Parish>(parishes[0])
  const [mapReady, setMapReady]   = useState(false)
  const [leafletReady, setLeafletReady] = useState(false)

  useEffect(() => {
    setMapReady(true)
    // Fix leaflet default icon
    const fixIcons = async () => {
      const L = (await import('leaflet')).default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl:       '/leaflet/marker-icon.png',
        shadowUrl:     '/leaflet/marker-shadow.png',
      })
      setLeafletReady(true)
    }
    fixIcons()
  }, [])

  return (
    <SectionWrapper id="service-area" bgVariant="secondary">
      <SectionHeader
        eyebrow="Coverage"
        title="Service Area"
        subtitle="Kaunda WM serves all 14 parishes of Jamaica — from Kingston's urban core to the lush north coast. Click a parish to see collection details."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card padding="none" className="overflow-hidden h-[480px]">
            {mapReady && leafletReady ? (
              <MapContainer
                center={[18.1096, -77.2975]}
                zoom={8}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                />
                {parishes.map(p => {
                  const zone  = zoneColors[p.serviceZone]
                  const isSelected = selected.id === p.id
                  return (
                    <Circle
                      key={p.id}
                      center={p.center}
                      radius={isSelected ? 14000 : 10000}
                      pathOptions={{
                        color:       zone.stroke,
                        fillColor:   zone.fill,
                        fillOpacity: isSelected ? 0.5 : 0.25,
                        weight:      isSelected ? 3 : 1.5,
                      }}
                      eventHandlers={{ click: () => setSelected(p) }}
                    >
                      <Popup>
                        <div className="font-body text-sm">
                          <strong className="font-heading">{p.name}</strong>
                          <p className="text-xs text-gray-600 mt-0.5">{p.description}</p>
                          <p className="text-xs mt-1">Coverage: <strong>{p.coveragePercent}%</strong></p>
                        </div>
                      </Popup>
                    </Circle>
                  )
                })}
                {parishes.map(p => (
                  <Marker
                    key={`m-${p.id}`}
                    position={p.center}
                    eventHandlers={{ click: () => setSelected(p) }}
                  >
                    <Popup>
                      <span className="font-heading font-bold text-sm">{p.name}</span>
                    </Popup>
                  </Marker>
                ))}
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

          {/* Zone legend */}
          <div className="flex flex-wrap gap-3 mt-3">
            {Object.entries(zoneColors).map(([zone, cfg]) => (
              <div key={zone} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border-2"
                  style={{ backgroundColor: cfg.fill, borderColor: cfg.stroke }}
                />
                <span className="text-xs font-body text-[var(--text-secondary)]">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Selected parish card */}
          <Card className="border-brand-blue/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">{selected.name}</h3>
                <p className="text-xs font-body text-[var(--text-muted)] mt-0.5">{selected.description}</p>
              </div>
              <Badge variant={zoneBadgeVariant[selected.serviceZone]} size="sm">
                {selected.serviceZone.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>

            {/* Coverage bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-body mb-1">
                <span className="text-[var(--text-secondary)]">Coverage</span>
                <span className="font-bold text-brand-blue">{selected.coveragePercent}%</span>
              </div>
              <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-blue rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${selected.coveragePercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-body text-[var(--text-secondary)]">
                <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                <span>Population: ~{selected.population.toLocaleString()}</span>
              </div>
              <div>
                <p className="text-xs font-semibold font-body text-[var(--text-primary)] mb-1.5">Collection Days:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.collectionDays.map(d => (
                    <span key={d} className="bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-xs font-body px-2 py-0.5 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Parish list */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border-color)]">
              <p className="text-xs font-heading font-bold uppercase tracking-widest text-[var(--text-muted)]">All Parishes</p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {parishes.map(p => {
                const zone = zoneColors[p.serviceZone]
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--bg-secondary)] transition-colors ${
                      selected.id === p.id ? 'bg-brand-blue/10 border-l-2 border-brand-blue' : 'border-l-2 border-transparent'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: zone.fill }}
                    />
                    <span className="text-sm font-body text-[var(--text-primary)] flex-1">{p.name}</span>
                    <span className="text-xs font-body text-[var(--text-muted)]">{p.coveragePercent}%</span>
                    {selected.id === p.id && <CheckCircle className="w-4 h-4 text-brand-blue" />}
                  </button>
                )
              })}
            </div>
          </Card>

          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-card px-4 py-3 flex gap-2">
            <Info className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <p className="text-xs font-body text-[var(--text-secondary)]">
              Not seeing your area? We&apos;re expanding! Call <strong>876-123-4567</strong> to inquire about service in your community.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
