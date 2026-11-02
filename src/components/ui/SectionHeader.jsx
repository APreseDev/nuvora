import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/animations'

export default function SectionHeader({ kicker, title, subtitle, linkTo, linkLabel, align = 'center' }) {
  const ref = useRef(null)
  const alignment = align === 'start' ? 'items-start text-start' : 'items-center text-center'

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from(ref.current.children, {
        y: 26,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 88%',
          once: true,
        },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={`flex flex-col gap-3 ${alignment}`}>
      {kicker && (
        <span className="flex items-center gap-3 text-sm font-bold tracking-wide text-gold">
          <span aria-hidden="true" className="h-px w-8 bg-gold" />
          {kicker}
          <span aria-hidden="true" className={`h-px w-8 bg-gold ${align === 'start' ? 'hidden' : ''}`} />
        </span>
      )}
      <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">{title}</h2>
      {subtitle && (
        <p className="max-w-xl text-sm leading-7 text-navy/60 sm:text-base dark:text-cream/60">
          {subtitle}
        </p>
      )}
      {linkTo && (
        <Link
          to={linkTo}
          className="group mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-gold transition-colors hover:text-gold-dark"
        >
          {linkLabel}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
        </Link>
      )}
    </div>
  )
}
