import { useEffect, useRef } from 'react'
import Navbar from './Navbar'
import Footer from '../sections/Footer'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import ScrollProgress from './ScrollProgress'
import LuxuryBackdrop from './LuxuryBackdrop'
import ScrollAmbientShapes from './ScrollAmbientShapes'
import MagneticButtons from './MagneticButtons'

export default function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const reduce = useReducedMotion()
  const pageRef = useRef(null)

  // Manual history.scrollRestoration — jump to top on real page changes only.
  // Keep position when Home is deep-linking via hash / state.scrollTo.
  useEffect(() => {
    const deepLink =
      location.pathname === '/' &&
      (Boolean(location.hash) || Boolean(location.state?.scrollTo))
    if (deepLink) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  // A lingering transform/filter on this wrapper would create a containing block
  // that breaks GSAP ScrollTrigger's position:fixed pinning. Clear it once the
  // page-enter transition settles so pinned sections behave correctly.
  const clearTransitionStyles = () => {
    const node = pageRef.current
    if (!node) return
    node.style.transform = ''
    node.style.filter = ''
    node.style.willChange = ''
    // Soft refresh only where pins exist — never dispatch a synthetic resize
    // (that snaps mobile scroll when the address bar / keyboard resizes).
    if (window.matchMedia('(min-width: 1024px)').matches) {
      import('../utils/gsap/loadGsap').then(({ refreshScrollTrigger }) => {
        refreshScrollTrigger(80)
      })
    }
  }

  return (
    <div className="bg-site text-parchment min-h-screen font-sans w-full max-w-full overflow-x-clip">
      <LuxuryBackdrop />
      <ScrollAmbientShapes />
      <div className="relative z-[1] w-full max-w-full min-w-0">
        <ScrollProgress />
        <MagneticButtons />
        <Navbar />
        <main className="pt-[calc(4rem+env(safe-area-inset-top,0px))] w-full max-w-full overflow-x-clip min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              ref={pageRef}
              initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={reduce ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduce ? undefined : { opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={reduce ? undefined : clearTransitionStyles}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  )
}
