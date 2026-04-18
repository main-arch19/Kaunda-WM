import { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'blue' | 'gold' | 'navy' | 'green' | 'red' | 'gray'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?:    'sm' | 'md'
}

const variantClasses: Record<BadgeVariant, string> = {
  blue:  'bg-brand-blue/15 text-brand-blue border border-brand-blue/30',
  gold:  'bg-brand-gold/20 text-amber-700 border border-brand-gold/40 dark:text-brand-gold',
  navy:  'bg-brand-navy text-white border border-brand-navy',
  green: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  red:   'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300',
  gray:  'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export default function Badge({ variant = 'blue', size = 'md', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-body font-semibold rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
