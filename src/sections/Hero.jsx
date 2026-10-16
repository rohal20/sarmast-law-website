import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { siteConfig } from '../siteConfig'
import { scrollToSection } from '../utils/scrollToSection'
import topCover from '../assets/top-cover.webp'
import HeroScrollCue from '../components/HeroScrollCue'
import MagneticLink from '../components/MagneticLink'
import { useGsapContext } from '../hooks/useGsapContext'
import { splitChars, revealChars, wrapRevealBlock, revealBlock } from '../utils/gsap/text'
import { scrubParallax } from '../utils/gsap/scroll'
import { bindButtonPress } from '../utils/gsap/ui'
import { floatLoop, isMobileViewport } from '../utils/gsap/effects'

function HeroContent() {
  return (
    <div>
      <div className="gsap-hero-eyebrow flex items-center gap-3 mb-4 md:mb-6 opacity-0">
        <span className="block w-8 md:w-10 h-px shrink-0" style={{ background: 'linear-gradient(90deg, #C9A84C, #E8D49A)', boxShadow: '0 0 12px rgba(201,168,76,0.35)' }} />
        <span className="text-[0.5rem] sm:text-[0.6rem] tracking-[0.22em] sm:tracking-[0.32em] uppercase text-[#C9A84C] leading-relaxed">
          {siteConfig.hero.eyebrow}
        </span>
      </div>

      <div className="mb-4 md:mb-6">
        {siteConfig.hero.headlineLines.map((line, i) => (
          <h1
            key={i}
            className="gsap-hero-line font-display hero-headline text-[2rem] sm:text-5xl md:text-6xl xl:text-7xl font-light leading-[1.08] tracking-[-0.02em] text-parchment"
          >
            {line}
          </h1>
        ))}
        <h1 className="gsap-hero-accent font-display hero-headline display-italic hero-accent-glow text-[2rem] sm:text-5xl md:text-6xl xl:text-7xl font-light leading-[1.12] tracking-[-0.02em] relative inline-block pb-1">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(120deg, #E8C97A 0%, #C9A84C 45%, #A07C30 100%)' }}
          >
            {siteConfig.hero.headlineAccent}
          </span>
          <span
            className="gsap-hero-underline absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#C9A84C] via-[#E8C97A] to-transparent"
          />
        </h1>
      </div>

      <p className="gsap-hero-sub text-[0.76rem] sm:text-[0.82rem] leading-[1.85] sm:leading-[2] tracking-[0.02em] text-[#A89F8C] max-w-md mb-6 md:mb-10">
        {siteConfig.hero.subtext}
      </p>

      <div className="gsap-hero-cta flex flex-col sm:flex-row gap-3 sm:gap-4 opacity-0">
        <MagneticLink
          href="#contact"
          className="btn-gold btn-mobile-full text-center gsap-pressable"
          onClick={(e) => { e.preventDefault(); scrollToSection('contact') }}
        >
          Book a Consultation
        </MagneticLink>
        <a
          href="#practice"
          className="btn-outline btn-mobile-full text-center gsap-pressable"
          onClick={(e) => { e.preventDefault(); scrollToSection('practice') }}
        >
          Our Practice Areas
        </a>
      </div>

      <div className="gsap-hero-stats mt-6 md:mt-10 opacity-0">
        <div className="md:hidden grid grid-cols-2 gap-2 border border-[rgba(201,168,76,0.2)] bg-[#111110]">
          {[
            { k: 'Response', v: '24 hours' },
            { k: 'Experience', v: '20+ years' },
            { k: 'Coverage', v: 'Pakistan-wide', span: true },
          ].map((b) => (
            <div
              key={b.k}
              className={`flex flex-col items-center justify-center px-2 py-3.5 text-center border-[rgba(201,168,76,0.15)] taste-stat-chip ${b.span ? 'col-span-2 border-t' : 'odd:border-r'}`}
            >
              <span className="w-1 h-1 rounded-full mb-1.5 shrink-0" style={{ background: 'linear-gradient(90deg, #C9A84C, #2CB9A8)' }} />
              <span className="text-[0.6rem] tracking-[0.12em] uppercase text-[#8A8270] leading-none">{b.k}</span>
              <span className="text-[0.68rem] tracking-[0.04em] uppercase text-parchment/90 mt-1 leading-tight">{b.v}</span>
            </div>
          ))}
        </div>

        <div className="hidden md:flex flex-row flex-wrap gap-3">
          {[
            { k: 'Response', v: '24 hours' },
            { k: 'Experience', v: '20+ years' },
            { k: 'Coverage', v: 'Pakistan-wide' },
          ].map((b) => (
            <span
              key={b.k}
              className="flex items-center justify-start gap-2 px-3 py-2.5 border border-[rgba(201,168,76,0.18)] bg-[rgba(17,17,16,0.55)] backdrop-blur-md taste-stat-chip"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'linear-gradient(90deg, #C9A84C, #2CB9A8)' }} />
              <span className="text-[0.6rem] tracking-[0.18em] uppercase text-[#8A8270]">{b.k}</span>
              <span className="text-[0.65rem] tracking-[0.14em] uppercase text-parchment/80">{b.v}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileHeroImage() {
  return (
    <div className="relative md:hidden bg-[#0A0A08]">
      <div className="h-px mx-5 bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.35)] to-transparent" />
      <div className="relative h-[42svh] min-h-[260px] max-h-[360px] overflow-hidden">
        <img
          src={topCover}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover brightness-[1.12] contrast-[1.06] saturate-[1.08]"
          style={{ objectPosition: '72% 38%' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #0A0A08 0%, rgba(10,10,8,0.55) 10%, transparent 28%)',
          }}
        />
      </div>
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const imageWrapRef = useRef(null)
  const cueProgressRef = useRef({ value: 0 })
  const reduce = useReducedMotion()

  useGsapContext(sectionRef, (gsap, root) => {
    const mobile = isMobileViewport()
    // Only animate the visible hero tree — both mobile + desktop DOM are mounted.
    const animRoot = root.querySelector(mobile ? '.gsap-hero-mobile' : '.gsap-hero-desktop') || root
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    animRoot.querySelectorAll('.gsap-hero-eyebrow').forEach((eyebrow) => {
      tl.fromTo(eyebrow, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.7 }, 0.15)
    })

    animRoot.querySelectorAll('.gsap-hero-line').forEach((line, i) => {
      const chars = splitChars(line)
      tl.add(revealChars(gsap, chars, { duration: 0.9, stagger: 0.03 }), 0.28 + i * 0.12)
    })

    // Animate the whole accent as one block — splitting words breaks
    // background-clip:text and leaves "It's Your Right." invisible.
    animRoot.querySelectorAll('.gsap-hero-accent').forEach((accent) => {
      tl.fromTo(
        accent,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        0.55
      )
    })

    animRoot.querySelectorAll('.gsap-hero-underline').forEach((underline) => {
      tl.to(underline, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 1.05)
    })

    animRoot.querySelectorAll('.gsap-hero-sub').forEach((sub) => {
      const inner = wrapRevealBlock(sub)
      tl.add(revealBlock(gsap, inner, { duration: 0.8 }), 0.78)
    })

    animRoot.querySelectorAll('.gsap-hero-cta').forEach((cta) => {
      tl.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.92)
    })

    animRoot.querySelectorAll('.gsap-hero-stats').forEach((stats) => {
      tl.fromTo(stats, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.65 }, 1.05)
    })

    const desktopImage = imageWrapRef.current
    if (desktopImage && !mobile) {
      scrubParallax(gsap, desktopImage, {
        trigger: root,
        y: 100,
        start: 'top top',
        end: 'bottom top',
      })
      gsap.to(desktopImage, {
        scale: 1.14,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })
    }

    const heroShapes = root.querySelectorAll('.gsap-hero-shape')
    if (heroShapes.length && !mobile) {
      floatLoop(gsap, heroShapes, { y: 22, rotate: 12, duration: 6 })
      heroShapes.forEach((shape, i) => {
        scrubParallax(gsap, shape, {
          trigger: root,
          y: 50 + i * 30,
          start: 'top top',
          end: 'bottom top',
        })
      })
    }

    gsap.to(cueProgressRef.current, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => { cueProgressRef.current.value = self.progress },
      },
    })

    // Blur + transform scrub is expensive on iOS and can fight native scroll.
    if (!mobile) {
      animRoot.querySelectorAll('.gsap-hero-exit').forEach((el) => {
        gsap.to(el, {
          y: -72,
          opacity: 0.25,
          filter: 'blur(6px)',
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.1,
          },
        })
      })
    }

    const contentCol = root.querySelector('.gsap-hero-content-col')
    if (contentCol && !mobile && window.matchMedia('(min-width: 768px)').matches) {
      const onMove = (e) => {
        const rect = root.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        gsap.to(contentCol, {
          x: x * 14,
          y: y * 10,
          rotationY: x * 5,
          rotationX: -y * 4,
          transformPerspective: 1200,
          transformOrigin: 'center center',
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        if (desktopImage) {
          gsap.to(desktopImage, { x: x * -20, y: y * -12, duration: 1.1, ease: 'power2.out', overwrite: 'auto' })
        }
      }
      const onLeave = () => {
        gsap.to(contentCol, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 0.9, ease: 'power2.out' })
        if (desktopImage) gsap.to(desktopImage, { x: 0, y: 0, duration: 1.1, ease: 'power2.out' })
      }
      root.addEventListener('mousemove', onMove)
      root.addEventListener('mouseleave', onLeave)

      const btnCleanup = bindButtonPress(gsap, animRoot.querySelectorAll('.gsap-pressable'))
      return () => {
        root.removeEventListener('mousemove', onMove)
        root.removeEventListener('mouseleave', onLeave)
        btnCleanup?.()
      }
    }

    return bindButtonPress(gsap, animRoot.querySelectorAll('.gsap-pressable'))
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative section-surface scroll-anchor md:min-h-[calc(100vh-4rem)] md:overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 hidden md:block overflow-hidden z-[2]" aria-hidden="true">
        <div className="gsap-hero-shape absolute top-[18%] right-[8%] w-28 h-28 rounded-full border border-[rgba(201,168,76,0.25)] opacity-60" />
        <div className="gsap-hero-shape absolute bottom-[22%] left-[42%] w-16 h-16 border border-[rgba(44,185,168,0.22)] rotate-45 opacity-50" />
        <div className="gsap-hero-shape absolute top-[42%] left-[8%] w-20 h-px opacity-40" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
      </div>

      <div
        ref={imageWrapRef}
        className="absolute inset-0 hidden md:block will-change-transform"
      >
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none z-[1]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
        <img
          src={topCover}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[98%_center]"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                to right,
                rgba(10, 10, 8, 0.97) 0%,
                rgba(10, 10, 8, 0.93) 30%,
                rgba(10, 10, 8, 0.72) 46%,
                rgba(10, 10, 8, 0.35) 62%,
                rgba(10, 10, 8, 0.08) 78%,
                rgba(10, 10, 8, 0) 92%
              )
            `,
          }}
        />
      </div>

      <div className="relative z-10 md:hidden gsap-hero-mobile">
        <div className="gsap-hero-exit px-5 pt-5 pb-7 section-surface">
          <HeroContent />
        </div>
        <MobileHeroImage />
      </div>

      <div className="relative z-10 hidden md:grid md:grid-cols-2 md:min-h-[calc(100vh-4rem)] gsap-hero-desktop">
        <div className="gsap-hero-exit gsap-hero-content-col flex flex-col justify-center px-16 py-12">
          <HeroContent />
        </div>
        <div aria-hidden="true" />
      </div>

      {!reduce && <HeroScrollCue scrollProgressRef={cueProgressRef} />}
    </section>
  )
}
