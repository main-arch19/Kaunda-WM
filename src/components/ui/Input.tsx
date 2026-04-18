'use client'

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:      string
  error?:      string
  leftIcon?:   ReactNode
  rightIcon?:  ReactNode
  hint?:       string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, hint, className, id, ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold font-body text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[var(--text-muted)] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full font-body text-sm bg-[var(--bg-card)] text-[var(--text-primary)]',
              'border border-[var(--border-color)] rounded-input',
              'py-2.5 px-3 outline-none',
              'focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20',
              'placeholder:text-[var(--text-muted)]',
              'transition-all duration-150',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
              leftIcon  && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[var(--text-muted)] pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>
        {hint  && !error && <p className="text-xs text-[var(--text-muted)] font-body">{hint}</p>}
        {error &&           <p className="text-xs text-red-500 font-body">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
