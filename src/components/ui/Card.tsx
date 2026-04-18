import { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?:  boolean
  bordered?:   boolean
  padding?:    'none' | 'sm' | 'md' | 'lg'
}

export default function Card({
  hoverable = false,
  bordered  = false,
  padding   = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--bg-card)] rounded-card shadow-card',
        'border border-[var(--border-color)]',
        bordered && 'border-brand-blue/20',
        hoverable && 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-card-hover cursor-pointer',
        padding === 'none' && 'p-0',
        padding === 'sm'   && 'p-3',
        padding === 'md'   && 'p-4',
        padding === 'lg'   && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
