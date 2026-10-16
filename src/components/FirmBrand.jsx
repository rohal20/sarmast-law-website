import { siteConfig } from '../siteConfig'

const sizes = {
  nav: 'text-[0.85rem] sm:text-[1.05rem] tracking-[0.1em] sm:tracking-[0.13em]',
  footer: 'text-[0.85rem] sm:text-[1.05rem] tracking-[0.1em] sm:tracking-[0.13em]',
  menu: 'text-[1.05rem] sm:text-[1.15rem] tracking-[0.1em] sm:tracking-[0.12em]',
}

function BrandText() {
  const [first, ...rest] = siteConfig.firmName.split(' ')
  return (
    <>
      <span className="font-semibold text-[#C9A84C]">{first}</span>
      {rest.length > 0 && (
        <span className="font-light text-parchment"> {rest.join(' ')}</span>
      )}
    </>
  )
}

export default function FirmBrand({ size = 'nav', href, className = '', onClick }) {
  const base = `font-display uppercase ${sizes[size]} ${className}`

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={`${base} no-underline inline-flex items-center leading-none transition-[filter,opacity] duration-300 hover:brightness-110${size === 'nav' ? ' translate-y-[2px]' : ''}`}
      >
        <BrandText />
      </a>
    )
  }

  return (
    <span className={`${base} inline-flex items-center leading-none`}>
      <BrandText />
    </span>
  )
}
