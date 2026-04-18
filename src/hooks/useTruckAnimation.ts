'use client'

import { useEffect, useRef, useState } from 'react'

export interface TruckPosition {
  lat:       number
  lng:       number
  bearing:   number
  progress:  number
  stopIndex: number
  stepIndex: number
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function useTruckAnimation(
  route: [number, number][],
  isPlaying: boolean,
  speed: 1 | 2 | 3 = 1,
  onStopReached?: (stopIndex: number) => void
): TruckPosition {
  const tRef         = useRef(0)
  const lastTimeRef  = useRef<number | null>(null)
  const rafRef       = useRef<number | null>(null)
  const prevStopIdx  = useRef(-1)
  const playingRef   = useRef(isPlaying)
  const speedRef     = useRef(speed)

  const [pos, setPos] = useState<TruckPosition>(() => ({
    lat:       route[0][0],
    lng:       route[0][1],
    bearing:   0,
    progress:  0,
    stopIndex: 0,
    stepIndex: 0,
  }))

  useEffect(() => { playingRef.current = isPlaying }, [isPlaying])
  useEffect(() => { speedRef.current = speed }, [speed])

  useEffect(() => {
    if (route.length < 2) return

    const totalSegments = route.length - 1

    function tick(now: number) {
      if (!playingRef.current) {
        lastTimeRef.current = null
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = now
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const dt = (now - lastTimeRef.current) / 1000
      lastTimeRef.current = now

      // speed=1 => 0.9 segments/s, speed=2 => 1.8/s, speed=3 => 2.7/s (matching old 900ms/step)
      const rate = speedRef.current / 0.9
      tRef.current += dt * rate
      if (tRef.current >= totalSegments) tRef.current = 0

      const t    = tRef.current
      const i    = Math.min(Math.floor(t), totalSegments - 1)
      const frac = t - i

      const cur  = route[i]
      const next = route[i + 1] ?? route[i]

      const lat = lerp(cur[0], next[0], frac)
      const lng = lerp(cur[1], next[1], frac)

      const dLat = next[0] - cur[0]
      const dLng = next[1] - cur[1]
      const bearing = (Math.atan2(dLng, dLat) * 180) / Math.PI

      const progress  = Math.round((t / totalSegments) * 100)
      const stopCount = 4
      const stopIndex = Math.min(
        Math.floor((t / totalSegments) * stopCount),
        stopCount - 1
      )

      setPos({ lat, lng, bearing, progress, stopIndex, stepIndex: i })
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [route])

  useEffect(() => {
    if (pos.stopIndex !== prevStopIdx.current) {
      prevStopIdx.current = pos.stopIndex
      onStopReached?.(pos.stopIndex)
    }
  }, [pos.stopIndex, onStopReached])

  return pos
}
