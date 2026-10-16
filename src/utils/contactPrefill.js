const STORAGE_KEY = 'sla_contact_prefill'

export function setContactPrefill({ area, message } = {}) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ area: area || '', message: message || '' }))
}

export function readContactPrefill() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    sessionStorage.removeItem(STORAGE_KEY)
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export { scrollToContact } from './scrollToSection'
