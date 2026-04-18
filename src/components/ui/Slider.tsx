'use client'

import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label:    string
  unit:     string
  min:      number
  max:      number
  step?:    number
  value:    number
  onChange: (value: number) => void
  hint?:    string
}

export default function Slider({ label, unit, min, max, step = 1, value, onChange, hint, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold font-body text-[var(--text-primary)]">{label}</span>
        <span className="inline-flex items-center gap-1 bg-brand-gold/20 text-amber-700 dark:text-brand-gold border border-brand-gold/40 rounded-full px-2.5 py-0.5 text-sm font-bold font-heading">
          {value} <span className="text-xs font-normal">{unit}</span>
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #F0C646 ${pct}%, var(--border-color) ${pct}%)`,
          }}
          className={cn(
            'w-full h-2 rounded-full appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-brand-gold/40',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:bg-brand-gold [&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white',
            '[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform',
            '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:bg-brand-gold [&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white',
            className
          )}
        />
      </div>
      <div className="flex justify-between text-xs text-[var(--text-muted)] font-body">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
      {hint && <p className="text-xs text-[var(--text-muted)] font-body">{hint}</p>}
    </div>
  )
}
