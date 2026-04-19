'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import ThemeToggle from '@/components/shared/ThemeToggle'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const navLinks = [
  { label: 'Services',      href: '#schedule'      },
  { label: 'Waste Wizard',  href: '#waste-wizard'  },
  { label: 'Sustainability',href: '#sustainability' },
  { label: 'Live Tracking', href: '#live-tracking' },
  { label: 'Contact',       href: '#contact'       },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function handleNavClick(href: string) {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 bg-white dark:bg-brand-navy transition-all duration-300',
        isScrolled && 'shadow-sm shadow-gray-200 dark:shadow-brand-navy/30 border-b border-gray-200 dark:border-brand-gold/20'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="#hero"
            onClick={e => { e.preventDefault(); handleNavClick('#hero') }}
            className="flex-shrink-0"
          >
            <Image
              src="/logo.png"
              alt="Kaunda Waste Management LTD"
              width={160}
              height={44}
              className="h-11 w-auto"
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); handleNavClick(link.href) }}
                className="text-brand-navy/80 dark:text-white/80 hover:text-brand-blue dark:hover:text-brand-gold font-body text-sm font-semibold
                           transition-colors duration-150 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-brand-blue dark:bg-brand-gold
                                 group-hover:w-full transition-all duration-200" />
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="tel:+18761234567"
              className="hidden sm:flex items-center gap-1.5 text-brand-navy/60 dark:text-white/70 hover:text-brand-navy dark:hover:text-white text-xs font-body transition-colors px-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>876-123-4567</span>
            </a>
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => handleNavClick('#schedule')}
            >
              Get a Quote
            </Button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-1.5 text-brand-navy dark:text-white hover:text-brand-blue dark:hover:text-brand-gold transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white dark:bg-brand-navy border-t border-gray-200 dark:border-brand-gold/20"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => { e.preventDefault(); handleNavClick(link.href) }}
                  className="text-brand-navy/80 dark:text-white/80 hover:text-brand-blue dark:hover:text-brand-gold font-body text-sm font-semibold
                             py-2.5 border-b border-gray-100 dark:border-white/5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Button
                variant="secondary"
                size="sm"
                className="mt-3 w-full"
                onClick={() => handleNavClick('#schedule')}
              >
                Get a Quote
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
