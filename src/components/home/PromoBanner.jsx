import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { gsap, useGSAP } from '@/lib/gsap'
import { parallaxY, prefersReducedMotion } from '@/lib/animations'
import promoProduct from '@/assets/img/products/amazon-echo-plus.webp'

export default function PromoBanner() {
  const sectionRef = useRef(null)
  const panelRef = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: panelRef.current, start: 'top 80%', once: true },
      })
      timeline
        .from('[data-promo-badge]', { y: 20, opacity: 0, duration: 0.5 })
        .from('[data-promo-title]', { y: 32, opacity: 0, duration: 0.8 }, '-=0.2')
        .from('[data-promo-text]', { y: 24, opacity: 0, duration: 0.7 }, '-=0.4')
        .from('[data-promo-actions]', { y: 24, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('[data-promo-image]', { x: -70, opacity: 0, scale: 0.9, duration: 1 }, '-=0.9')

      // شناوری ملایم محصول پس از ورود
      gsap.to('[data-promo-image]', {
        y: -12,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.4,
      })

      // پارالاکس هاله‌های نوری داخل بنر
      parallaxY('[data-promo-glow-a]', { trigger: panelRef.current, y: -60 })
      parallaxY('[data-promo-glow-b]', { trigger: panelRef.current, y: 50 })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="py-20 sm:py-24">
      <Container>
        <div
          ref={panelRef}
          className="relative overflow-hidden rounded-[2.5rem] bg-navy-deep px-6 py-14 shadow-luxe-dark sm:px-12 lg:px-16"
        >
          <div
            aria-hidden="true"
            data-promo-glow-a
            className="pointer-events-none absolute -top-24 start-1/3 size-72 rounded-full bg-gold/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            data-promo-glow-b
            className="pointer-events-none absolute -bottom-32 end-0 size-80 rounded-full bg-gold/10 blur-3xl"
          />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col items-start gap-5 text-start">
              <span
                data-promo-badge
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-bold text-gold"
              >
                ✦ حراج پاییزه
              </span>
              <h2 data-promo-title className="text-3xl font-black leading-snug text-cream sm:text-4xl lg:text-[2.6rem]">
                تا <span className="text-gold">۴۰٪ تخفیف</span>
                <br />
                روی لوازم جانبی منتخب
              </h2>
              <p
                data-promo-text
                className="max-w-md text-sm leading-7 text-cream/70 sm:text-base"
              >
                فرصتی محدود برای تجهیز کردن دنیای دیجیتال شما؛ شارژرها،
                پاوربانک‌ها و گجت‌های اورجینال با بهترین قیمت سال.
              </p>
              <div data-promo-actions className="flex items-center gap-4">
                <Link to="/products">
                  <Button className="px-8">همین حالا بخرید</Button>
                </Link>
                <span className="text-xs font-bold text-cream/60">تا پایان هفته ⏳</span>
              </div>
            </div>

            <div className="relative mx-auto w-48 sm:w-56 lg:w-64">
              <img
                data-promo-image
                src={promoProduct}
                alt="اسپیکر هوشمند اکو پلاس"
                loading="lazy"
                className="w-full drop-shadow-[0_25px_45px_rgba(198,167,107,0.35)]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 scale-125 rounded-full bg-gold/15 blur-2xl"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
