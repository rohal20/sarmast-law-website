import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToSection } from '../utils/scrollToSection'

export function navigateToHomeSection(sectionId, { navigate, pathname }) {
  const id = sectionId.replace(/^#/, '')
  if (pathname === '/') {
    scrollToSection(id)
    return
  }
  navigate('/', { state: { scrollTo: id } })
}

export default function HomeSectionLink({ section, className, children, onClick, ...props }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <a
      href={`/#${section}`}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
        navigateToHomeSection(section, { navigate, pathname })
      }}
      {...props}
    >
      {children}
    </a>
  )
}
