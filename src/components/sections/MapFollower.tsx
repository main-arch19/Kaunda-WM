'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface MapFollowerProps {
  lat: number
  lng: number
}

// This component must be rendered inside a MapContainer
export default function MapFollower({ lat, lng }: MapFollowerProps) {
  const map = useMap()

  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: false })
  }, [lat, lng, map])

  return null
}
