import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Hero from '../sections/Hero'
import Ticker from '../sections/Ticker'
import Practice from '../sections/Practice'
import CourtBulletin from '../sections/CourtBulletin'
import Statement from '../sections/Statement'
import ClientJourney from '../sections/ClientJourney'
import Clients from '../sections/Clients'
import Team from '../sections/Team'
import Contact from '../sections/Contact'
import SectionBreak from '../components/SectionBreak'
import FloatingSectionNav from '../components/FloatingSectionNav'
import { scrollToSection } from '../utils/scrollToSection'

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const scrolledToRef = useRef(null)

  useEffect(() => {
    const fromState = location.state?.scrollTo
    const fromHash = location.hash ? location.hash.slice(1) : ''
    const id = fromState || fromHash
    if (!id) return undefined

    // After state→hash replace, skip the duplicate scroll for the same target.
    if (!fromState && scrolledToRef.current === id) return undefined

    const timer = setTimeout(() => {
      scrolledToRef.current = id
      scrollToSection(id)
      if (fromState) {
        navigate(`/#${id}`, { replace: true, state: null })
      }
    }, 280)

    return () => clearTimeout(timer)
  }, [location.hash, location.state?.scrollTo, navigate])

  return (
    <>
      <FloatingSectionNav />
      <Hero />
      <Ticker />
      <Practice />
      <div className="px-5 sm:px-8 md:px-16">
        <SectionBreak />
      </div>
      <CourtBulletin />
      <Statement />
      <Team />
      <div className="px-5 sm:px-8 md:px-16">
        <SectionBreak />
      </div>
      <Clients />
      <div className="px-5 sm:px-8 md:px-16">
        <SectionBreak />
      </div>
      <ClientJourney />
      <div className="px-5 sm:px-8 md:px-16">
        <SectionBreak />
      </div>
      <Contact />
    </>
  )
}
