import { BadgeCheck, Headset, ShieldCheck, Truck } from 'lucide-react'
import { useRef } from 'react'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion, revealUp } from '@/lib/animations'
import brandProduct from '@/assets/img/products/apple-homepod-mini-cosmic-grey.webp'

const FEATURES = [
  { icon: ShieldCheck, title: 'تضمین اصالت', desc: 'همه کالاها اورجینال و دارای گارانتی معتبر هستند' },
  { icon: Truck, title: 'ارسال سریع', desc: 'تحویل اکسپرس در تهران و ارسال به سراسر کشور' },
  { icon: Headset, title: 'پشتیبانی ۲۴/۷', desc: 'تیم پشتیبانی فارسی‌زبان همیشه کنار شماست' },
  { icon: BadgeCheck, title: '۷ روز مهلت بازگشت', desc: 'تغییر نظر شما محترم است؛ بازگشت بدون قید و شرط' },
]

export default function BrandIntro() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.from('[data-brand-image]', {
        scale: 0.8,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-brand-figure]', start: 'top 80%', once: true },
      })

      gsap.from('[data-brand-score]', {
        scale: 0.5,
        opacity: 0,
        duration: 0.7,
        delay: 0.35,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: '[data-brand-figure]', start: 'top 55%', once: true },
      })

      revealUp('[data-brand-feature]', {
        trigger: '[data-brand-features]',
        y: 32,
        stagger: 0.09,
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="bg-white/50 py-20 sm:py-24 dark:bg-navy/30">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <div data-brand-figure className="relative order-2 mx-auto w-full max-w-md lg:order-1">
          <div
            aria-hidden="true"
            className="absolute inset-10 rounded-full bg-gradient-to-tr from-gold/25 via-navy/10 to-transparent blur-2xl"
          />
          <img
            data-brand-image
            src={brandProduct}
            alt="اسپیکر هوشمند هوم‌پاد مینی"
            width="1000"
            height="1000"
            loading="lazy"
            decoding="async"
            className="relative z-10 mx-auto w-full max-w-sm drop-shadow-2xl"
          />
          <div
            data-brand-score
            className="absolute -bottom-4 start-2 z-20 flex items-center gap-2.5 rounded-2xl border border-navy/10 bg-white/85 px-5 py-4 shadow-luxe backdrop-blur-md sm:start-6 dark:border-cream/15 dark:bg-navy/70 dark:shadow-luxe-dark"
          >
            <span className="text-2xl font-black text-gold">۹.۶</span>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold">از ۱۰ — رضایت مشتریان</span>
              <span className="text-[10px] text-navy/60 dark:text-cream/60">بر اساس ۲,۴۰۰ نظر ثبت‌شده</span>
            </div>
          </div>
        </div>

        <div className="order-1 flex flex-col items-start gap-6 text-start lg:order-2">
          <SectionHeader
            align="start"
            kicker="درباره نوورا"
            title="جایی که تکنولوژی با ظرافت روبه‌رو می‌شود"
            subtitle="نوورا با یک هدف ساده متولد شد: تجربه‌ای لوکس و قابل اعتماد از خرید گجت‌های دیجیتال در ایران. ما هر محصول را پیش از عرضه بررسی می‌کنیم تا فقط اورجینال‌ترین‌ها به دست شما برسند."
          />

          <div data-brand-features className="grid w-full gap-4 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                data-brand-feature
                className="flex items-start gap-3.5 rounded-2xl border border-navy/10 bg-white/70 p-4 transition-colors duration-300 hover:border-gold/50 dark:border-cream/10 dark:bg-navy/40"
              >
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold dark:bg-gold dark:text-navy">
                  <Icon size={18} />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-extrabold">{title}</span>
                  <span className="text-xs leading-5 text-navy/60 dark:text-cream/60">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
