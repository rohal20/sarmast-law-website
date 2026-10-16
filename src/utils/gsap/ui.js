export function bindCardHover(gsap, cards) {
  const cleanups = []

  cards.forEach((card) => {
    const onEnter = () => {
      gsap.to(card, {
        y: -6,
        scale: 1.01,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
    const onLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)
    card.addEventListener('focusin', onEnter)
    card.addEventListener('focusout', onLeave)
    cleanups.push(() => {
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
      card.removeEventListener('focusin', onEnter)
      card.removeEventListener('focusout', onLeave)
    })
  })

  return () => cleanups.forEach((fn) => fn())
}

export function bindButtonPress(gsap, buttons) {
  const cleanups = []

  buttons.forEach((btn) => {
    const onDown = () => gsap.to(btn, { scale: 0.97, duration: 0.12, ease: 'power2.out', overwrite: 'auto' })
    const onUp = () => gsap.to(btn, { scale: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
    btn.addEventListener('pointerdown', onDown)
    btn.addEventListener('pointerup', onUp)
    btn.addEventListener('pointerleave', onUp)
    cleanups.push(() => {
      btn.removeEventListener('pointerdown', onDown)
      btn.removeEventListener('pointerup', onUp)
      btn.removeEventListener('pointerleave', onUp)
    })
  })

  return () => cleanups.forEach((fn) => fn())
}

export function bindInputFocus(gsap, inputs) {
  const cleanups = []

  inputs.forEach((input) => {
    const onFocus = () => {
      gsap.to(input, {
        boxShadow: '0 0 0 3px rgba(201,168,76,0.12), 0 0 28px rgba(201,168,76,0.08)',
        borderColor: 'rgba(201,168,76,0.55)',
        duration: 0.35,
        ease: 'power2.out',
      })
    }
    const onBlur = () => {
      gsap.to(input, {
        boxShadow: '0 0 0 0px rgba(201,168,76,0)',
        borderColor: 'rgba(201,168,76,0.2)',
        duration: 0.35,
        ease: 'power2.out',
      })
    }
    input.addEventListener('focus', onFocus)
    input.addEventListener('blur', onBlur)
    cleanups.push(() => {
      input.removeEventListener('focus', onFocus)
      input.removeEventListener('blur', onBlur)
    })
  })

  return () => cleanups.forEach((fn) => fn())
}
