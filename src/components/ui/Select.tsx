'use client'

import { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options:     SelectOption[]
  label?:      string
  placeholder?: string
  onChange:    (value: string) => void
  error?:      string
}

export default function Select({ options, label, placeholder, onChange, error, className, value, id, ...props }: SelectProps) {
  const selectId = id ?? `select-${Math.random().toString(36).slice(2)}`
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-semibold font-body text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(
            'w-full appearance-none font-body text-sm',
            'bg-[var(--bg-card)] text-[var(--text-primary)]',
            'border border-[var(--border-color)] rounded-input',
            'py-2.5 pl-3 pr-10 outline-none cursor-pointer',
            'focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20',
            'transition-all duration-150',
            error && 'border-red-400',
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500 font-body">{error}</p>}
    </div>
  )
}
