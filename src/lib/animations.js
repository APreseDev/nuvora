import { gsap } from '@/lib/gsap'

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function firstElement(targets) {
  if (Array.isArray(targets)) return targets[0] ?? targets
  if (targets && typeof targets.length === 'number') return targets[0] ?? targets
  return targets
}

/**
 * نمایان‌شدن یک‌باره عناصر هنگام ورود به ناحیه دید.
 * با prefers-reduced-motion هیچ انیمیشنی ساخته نمی‌شود.
 */
export function revealUp(targets, options = {}) {
  const {
    trigger,
    y = 40,
    stagger = 0.1,
    duration = 0.9,
    start = 'top 85%',
    delay = 0,
  } = options

  if (prefersReducedMotion() || !targets) return undefined

  return gsap.from(targets, {
    y,
    opacity: 0,
    duration,
    stagger,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: trigger ?? firstElement(targets),
      start,
      once: true,
    },
  })
}

/**
 * پارالاکس نرم بر اساس اسکرول (scrub) — عنصر با سرعت متفاوت از صفحه حرکت می‌کند.
 */
export function parallaxY(target, { trigger, y = -60, start = 'top bottom', end = 'bottom top' } = {}) {
  if (prefersReducedMotion() || !target) return undefined

  return gsap.to(target, {
    y,
    ease: 'none',
    scrollTrigger: { trigger, start, end, scrub: true },
  })
}
