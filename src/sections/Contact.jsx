import { useState, useEffect, useRef } from 'react'
import { MapPin, Phone, Mail, Clock, ArrowRight, ChevronDown } from 'lucide-react'
import RevealCard from '../components/RevealCard'
import InquirySuccess from '../components/InquirySuccess'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '../siteConfig'
import { readContactPrefill } from '../utils/contactPrefill'
import { useGsapContext } from '../hooks/useGsapContext'
import { bindInputFocus, bindButtonPress } from '../utils/gsap/ui'
import { wrapRevealBlock, revealBlock } from '../utils/gsap/text'

const contactDetails = [
  { Icon: MapPin, label: 'Address', value: siteConfig.location.addressLines.join('\n') },
  { Icon: Phone, label: 'Phone', value: siteConfig.contact.phoneDisplay },
  { Icon: Mail, label: 'Email', value: siteConfig.contact.email },
  { Icon: Clock, label: 'Office Hours', value: siteConfig.contact.hours },
]

const areas = siteConfig.practiceAreas.map(p => p.title)

const inputClass = 'form-input'
const labelClass = 'text-[0.65rem] sm:text-[0.55rem] tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[#8A8270] block mb-1.5'

const errorClass = `text-[0.65rem] text-red-400 mt-1 block`

export default function Contact() {
  const [form, setForm] = useState({
    fname: '',
    lname: '',
    email: '',
    confirmEmail: '',
    phone: '',
    area: '',
    message: '',
    website: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [startedAt] = useState(() => Date.now())
  const sectionRef = useRef(null)

  useGsapContext(sectionRef, (gsap, root) => {
    const title = root.querySelector('.gsap-contact-title')
    if (title) {
      const inner = wrapRevealBlock(title)
      revealBlock(gsap, inner, {
        scrollTrigger: { trigger: title, start: 'top 82%', toggleActions: 'play none none none' },
      })
    }

    root.querySelectorAll('.gsap-contact-detail').forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        x: -20,
        duration: 0.65,
        delay: i * 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' },
      })
    })

    const formWrap = root.querySelector('.gsap-contact-form')
    if (formWrap) {
      gsap.from(formWrap, {
        opacity: 0,
        y: 32,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: formWrap, start: 'top 82%', toggleActions: 'play none none none' },
      })
    }

    const inputCleanup = bindInputFocus(gsap, root.querySelectorAll('.form-input'))
    const btnCleanup = bindButtonPress(gsap, root.querySelectorAll('.btn-gold, button[type="submit"]'))

    return () => {
      inputCleanup?.()
      btnCleanup?.()
    }
  }, [sent])

  useEffect(() => {
    const prefill = readContactPrefill()
    if (!prefill) return
    setForm(f => ({
      ...f,
      area: prefill.area || f.area,
      message: prefill.message || f.message,
    }))
  }, [])

  const validate = () => {
    const e = {}
    const email = form.email.trim().toLowerCase()
    const confirmEmail = form.confirmEmail.trim().toLowerCase()
    if (!form.fname.trim())  e.fname   = 'First name is required.'
    if (!form.lname.trim())  e.lname   = 'Last name is required.'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = 'Enter a valid email address.'
    if (!confirmEmail) {
      e.confirmEmail = 'Please confirm your email address.'
    } else if (email !== confirmEmail) {
      e.confirmEmail = 'Email addresses do not match.'
    }
    if (!form.area)          e.area    = 'Please select a practice area.'
    if (!form.message.trim()) e.message = 'Please describe your matter briefly.'
    return e
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (submitError) setSubmitError('')
    if (errors[name]) setErrors(er => { const n = { ...er }; delete n[name]; return n })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    setSubmitError('')
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          email: form.email.trim().toLowerCase(),
          confirmEmail: undefined,
          startedAt,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Could not send enquiry.')
      }
      setSent(true)
    } catch (err) {
      setSubmitError(err?.message || 'Could not send enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      fname: '',
      lname: '',
      email: '',
      confirmEmail: '',
      phone: '',
      area: '',
      message: '',
      website: '',
    })
    setErrors({})
    setSubmitError('')
    setSent(false)
  }

  return (
    <section ref={sectionRef} id="contact" className="section-surface scroll-anchor py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 border-t border-[rgba(201,168,76,0.18)]">
      <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 sm:gap-16 lg:gap-24">

        <RevealCard index={0} variant="left">
          <div className="relative">
            <span
              className="absolute -top-6 sm:-top-8 left-0 font-display font-light leading-none select-none pointer-events-none text-[#C9A84C]/[0.07]"
              style={{ fontSize: 'clamp(4.5rem, 12vw, 8rem)' }}
              aria-hidden="true"
            >
              06
            </span>
          <div className="section-label">Get in Touch</div>
          <h2 className="gsap-contact-title font-display text-[2rem] sm:text-[2.5rem] font-light leading-[1.15] mb-8 sm:mb-10">
            Begin Your <em className="italic text-[#C9A84C]">Legal Journey</em><br />With Us Today
          </h2>
          <div className="space-y-5 sm:space-y-6">
            {contactDetails.map(({ Icon, label, value }) => (
              <div key={label} className="gsap-contact-detail flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 border border-[rgba(201,168,76,0.25)] flex items-center justify-center flex-shrink-0 text-[#C9A84C]">
                  <Icon size={14} className="sm:hidden" />
                  <Icon size={15} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] sm:text-[0.55rem] tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[#8A8270] mb-1">{label}</p>
                  <p className="text-[0.8125rem] sm:text-[0.77rem] text-parchment leading-[1.65] whitespace-pre-line break-words">{value}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </RevealCard>

        <RevealCard index={1} variant="right">
          <div className="gsap-contact-form gradient-border-wrap">
            <div className="gradient-border-inner liquid-glass p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <InquirySuccess email={form.email} onReset={resetForm} />
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[['fname','First Name','Ahmad'], ['lname','Last Name','Khan']].map(([name, label, ph]) => (
                    <div key={name}>
                      <label className={labelClass}>{label}</label>
                      <input name={name} type="text" placeholder={ph} value={form[name]} onChange={handleChange}
                        className={`${inputClass} ${errors[name] ? 'border-red-500/60' : ''}`} />
                      {errors[name] && <span className={errorClass}>{errors[name]}</span>}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="sr-only" htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={handleChange}
                    className="hidden"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <label className={labelClass}>Email Address</label>
                  <input name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
                    className={`${inputClass} ${errors.email ? 'border-red-500/60' : ''}`} />
                  {errors.email && <span className={errorClass}>{errors.email}</span>}
                </div>

                <div>
                  <label className={labelClass}>Confirm Email Address</label>
                  <input
                    name="confirmEmail"
                    type="email"
                    inputMode="email"
                    autoComplete="off"
                    placeholder="Re-enter your email"
                    value={form.confirmEmail}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.confirmEmail ? 'border-red-500/60' : ''}`}
                  />
                  {errors.confirmEmail && <span className={errorClass}>{errors.confirmEmail}</span>}
                </div>

                <div>
                  <label className={labelClass}>Phone Number <span className="text-[#8A8270]/50 normal-case tracking-normal">(optional)</span></label>
                  <input name="phone" type="tel" placeholder="+92 300 000 0000" value={form.phone} onChange={handleChange}
                    className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Practice Area</label>
                  <div className="relative">
                  <select name="area" value={form.area} onChange={handleChange}
                    className={`${inputClass} cursor-pointer pr-10 ${errors.area ? 'border-red-500/60' : ''}`}
                    style={{ appearance: 'none' }}
                  >
                    <option value="">Select a legal matter</option>
                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8270]" />
                  </div>
                  {errors.area && <span className={errorClass}>{errors.area}</span>}
                </div>

                <div>
                  <label className={labelClass}>Brief Description</label>
                  <textarea name="message" rows={4} placeholder="Please describe your legal matter in a few words..."
                    value={form.message} onChange={handleChange}
                    className={`${inputClass} resize-none ${errors.message ? 'border-red-500/60' : ''}`} />
                  {errors.message && <span className={errorClass}>{errors.message}</span>}
                </div>

                <button type="submit" disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                  {loading ? (
                    <span className="flex items-center gap-2" aria-live="polite">
                      <span className="taste-skeleton h-3 w-24 rounded-sm" aria-hidden="true" />
                      <span className="sr-only">Sending enquiry</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Send Enquiry <ArrowRight size={14} /></span>
                  )}
                </button>
                {submitError && (
                  <p className="text-[0.72rem] text-red-300 mt-2 text-center leading-relaxed">
                    {submitError}
                    <br />
                    <span className="text-[#8A8270]">
                      Or call{' '}
                      <a
                        href={`tel:${siteConfig.contact.phoneE164 || siteConfig.contact.phoneDisplay}`}
                        className="text-[#C9A84C] no-underline hover:underline"
                      >
                        {siteConfig.contact.phoneDisplay}
                      </a>
                      {' · '}
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="text-[#C9A84C] no-underline hover:underline"
                      >
                        {siteConfig.contact.email}
                      </a>
                    </span>
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
            </div>
          </div>
        </RevealCard>
      </div>
    </section>
  )
}
