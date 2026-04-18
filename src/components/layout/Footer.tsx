'use client'

import { useState, FormEvent } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, CheckCircle, ExternalLink } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'

const quickLinks = [
  { label: 'Check My Schedule',     href: '#schedule'      },
  { label: 'Identify My Waste',     href: '#waste-wizard'  },
  { label: 'Sustainability Impact', href: '#sustainability' },
  { label: 'Live Tracking Demo',    href: '#live-tracking' },
  { label: 'Get a Quote',           href: '#schedule'      },
]

const resources = [
  { label: 'NSWMA Jamaica',   href: 'https://nswma.gov.jm',       note: 'National Solid Waste Mgmt' },
  { label: 'NEPA Jamaica',    href: 'https://nepa.gov.jm',        note: 'National Environment' },
  { label: 'PIOJ',            href: 'https://pioj.gov.jm',        note: 'Planning Institute' },
  { label: 'Kingston & St. Andrew Corporation', href: 'https://ksac.gov.jm', note: 'Municipal Authority' },
]

interface FormData {
  name: string; email: string; phone: string; message: string
}

function handleNavClick(href: string) {
  const el = document.querySelector(href)
  el?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  const { toast } = useToast()
  const [form, setForm]           = useState<FormData>({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors]       = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted]   = useState(false)

  function validate(): boolean {
    const e: Partial<FormData> = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSubmitting(false)
    setIsSubmitted(true)
    toast("Message sent! We'll respond within 1 business day.", 'success')
  }

  return (
    <footer id="contact" className="bg-brand-navy text-white">
      {/* Gold divider */}
      <div className="gold-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Image src="/logo.png" alt="Kaunda WM" width={160} height={44} className="h-11 w-auto mb-4" />
            <p className="text-white/70 text-sm font-body leading-relaxed mb-5">
              Jamaica&apos;s trusted waste management partner. Serving residential, commercial, and municipal clients with sustainable, efficient solutions.
            </p>
            <p className="text-brand-gold text-sm font-heading font-bold italic mb-5">&quot;Clean Solutions. Greener Future.&quot;</p>

            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span className="text-white/70 text-xs font-body">Half Way Tree Road, Kingston 10, Jamaica</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <a href="tel:+18761234567" className="text-white/70 hover:text-white text-xs font-body transition-colors">876-123-4567</a>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <a href="mailto:info@kaundawm.com.jm" className="text-white/70 hover:text-white text-xs font-body transition-colors">info@kaundawm.com.jm</a>
            </div>

            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold/20 border border-white/10 hover:border-brand-gold/40 flex items-center justify-center transition-all">
                  <Icon className="w-4 h-4 text-white/70 hover:text-brand-gold" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-brand-gold mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={e => { e.preventDefault(); handleNavClick(l.href) }}
                    className="text-white/70 hover:text-white text-sm font-body transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/50 group-hover:bg-brand-gold transition-colors" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-brand-gold mt-8 mb-5">Jamaica Resources</h4>
            <ul className="space-y-2.5">
              {resources.map(r => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white text-sm font-body transition-colors flex items-start gap-2 group"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mt-0.5 text-brand-gold/50 group-hover:text-brand-gold transition-colors flex-shrink-0" />
                    <span>
                      <span className="block">{r.label}</span>
                      <span className="text-xs text-white/40">{r.note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance + Services */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-brand-gold mb-5">Our Services</h4>
            <ul className="space-y-2 text-sm font-body text-white/70">
              {['Residential Collection', 'Commercial & Industrial', 'Recycling Programme', 'Hazardous Waste', 'Bulk & Bulky Removal', 'E-Waste Collection', 'Composting Service', 'Roll-Off Containers'].map(s => (
                <li key={s} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-6 bg-white/5 border border-white/10 rounded-card p-4">
              <p className="text-xs font-body text-white/50 mb-1">Regulated by</p>
              <p className="text-sm font-heading font-bold text-brand-gold">NSWMA Jamaica</p>
              <p className="text-xs font-body text-white/50 mt-1">National Solid Waste Management Authority</p>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-brand-gold mb-5">Send Us a Message</h4>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-blue/20 border border-brand-blue/30 rounded-card p-6 text-center"
              >
                <CheckCircle className="w-10 h-10 text-brand-gold mx-auto mb-3" />
                <p className="font-heading font-bold text-white mb-1">Message Sent!</p>
                <p className="text-sm font-body text-white/70">We&apos;ll respond within 1 business day.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-input px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-gold transition-colors"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-input px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-gold transition-colors"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-input px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-gold transition-colors"
                />
                <div>
                  <textarea
                    rows={4}
                    placeholder="Your message..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-input px-3 py-2.5 text-sm font-body focus:outline-none focus:border-brand-gold transition-colors resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>
                <Button variant="secondary" size="md" className="w-full" isLoading={isSubmitting} type="submit">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs font-body">
            &copy; {new Date().getFullYear()} Kaunda Waste Management LTD. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-body text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
            <span className="text-brand-gold/50">Regulated by NSWMA Jamaica</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
