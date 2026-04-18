import { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BgVariant = 'primary' | 'secondary' | 'navy' | 'transparent'

interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  bgVariant?: BgVariant
  noPadding?: boolean
}

const bgClasses: Record<BgVariant, string> = {
  primary:     'bg-[var(--bg-primary)]',
  secondary:   'bg-[var(--bg-secondary)]',
  navy:        'bg-brand-navy',
  transparent: 'bg-transparent',
}

export default function SectionWrapper({
  bgVariant = 'primary',
  noPadding = false,
  className,
  children,
  id,
  ...props
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        bgClasses[bgVariant],
        !noPadding && 'py-20',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  eyebrow?:  string
  title:     string
  subtitle?: string
  centered?: boolean
  light?:    boolean
}

export function SectionHeader({ eyebrow, title, subtitle, centered = false, light = false }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12', centered && 'text-center')}>
      {eyebrow && (
        <div className={cn(
          'inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3',
          light ? 'text-brand-gold' : 'text-brand-blue'
        )}>
          <span className={cn('block w-8 h-0.5', light ? 'bg-brand-gold' : 'bg-brand-blue')} />
          {eyebrow}
          <span className={cn('block w-8 h-0.5', light ? 'bg-brand-gold' : 'bg-brand-blue')} />
        </div>
      )}
      <h2 className={cn(
        'font-heading font-bold text-3xl sm:text-4xl uppercase tracking-tight',
        light ? 'text-white' : 'text-[var(--text-primary)]'
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          'mt-3 text-base max-w-2xl font-body',
          centered && 'mx-auto',
          light ? 'text-white/70' : 'text-[var(--text-secondary)]'
        )}>
          {subtitle}
        </p>
      )}
      <div className={cn(
        'mt-4 h-1 w-16 rounded-full',
        centered && 'mx-auto',
        light ? 'bg-brand-gold' : 'bg-brand-blue'
      )} />
    </div>
  )
}
