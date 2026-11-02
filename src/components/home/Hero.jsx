import { Headphones, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { gsap, useGSAP } from '@/lib/gsap'
import { parallaxY, prefersReducedMotion } from '@/lib/animations'
import heroProduct from '@/assets/img/products/apple-airpods-max-silver.webp'

const STATS = [
  { value: '۱۲هزار+', label: 'مشتری وفادار' },
  { value: '۵۴۰+', label: 'محصول اورجینال' },
  { value: '۴.۹', label: 'امتیاز رضایت' },
]

/** کلمه با ماسک reveal — برای انیمیشن staggered متن */
function MaskedWord({ children, className = '' }) {
  return (
    <span aria-hidden="true" className={`inline-block overflow-hidden align-bottom ${className}`}>
      <span data-word className="inline-block">
        {children}
      </span>
    </span>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .from('[data-hero-badge]', { y: 20, opacity: 0, duration: 0.6 })
        .from(
          '[data-word]',
          { yPercent: 130, opacity: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out' },
          '-=0.2',
        )
        .from('[data-hero-paragraph]', { y: 24, opacity: 0, duration: 0.7 }, '-=0.55')
        .from('[data-hero-actions] > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
        .from('[data-hero-stat]', { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.45')
        .from('[data-hero-image]', { scale: 0.85, opacity: 0, duration: 1.2 }, 0.25)
        .from(
          '[data-hero-card]',
          { scale: 0.6, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.8)' },
          '-=0.6',
        )

      // شناوری ملایم و بی‌پایان کارت‌های شیشه‌ای
      gsap.to('[data-hero-card]', {
        y: -10,
        duration: 2.6,
        stagger: 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      // پارالاکس اسکرول: تصویر و هاله‌های رنگی با سرعت‌های متفاوت
      parallaxY('[data-hero-image]', {
        trigger: sectionRef.current,
        y: 90,
        start: 'top top',
        end: 'bottom top',
      })
      parallaxY('[data-hero-glow-a]', {
        trigger: sectionRef.current,
        y: -120,
        start: 'top top',
        end: 'bottom top',
      })
      parallaxY('[data-hero-glow-b]', {
        trigger: sectionRef.current,
        y: 90,
        start: 'top top',
        end: 'bottom top',
      })

      // چرخش ملایم تصویر با حرکت ماوس (فقط نشانگر دقیق و بدون reduce-motion)
      if (imageRef.current && window.matchMedia('(pointer: fine)').matches) {
        gsap.set(imageRef.current, { transformPerspective: 1000 })
        const rotX = gsap.quickTo(imageRef.current, 'rotationX', { duration: 0.7, ease: 'power2.out' })
        const rotY = gsap.quickTo(imageRef.current, 'rotationY', { duration: 0.7, ease: 'power2.out' })

        const onMove = (event) => {
          const rect = imageRef.current.getBoundingClientRect()
          const x = (event.clientX - rect.left) / rect.width - 0.5
          const y = (event.clientY - rect.top) / rect.height - 0.5
          rotY(x * 8)
          rotX(y * -6)
        }
        const onLeave = () => {
          rotX(0)
          rotY(0)
        }

        const element = imageRef.current
        element.addEventListener('mousemove', onMove)
        element.addEventListener('mouseleave', onLeave)
        return () => {
          element.removeEventListener('mousemove', onMove)
          element.removeEventListener('mouseleave', onLeave)
        }
      }
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div
        aria-hidden="true"
        data-hero-glow-a
        className="pointer-events-none absolute -top-40 start-1/4 size-[28rem] rounded-full bg-gold/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        data-hero-glow-b
        className="pointer-events-none absolute -bottom-40 -start-20 size-[26rem] rounded-full bg-navy/10 blur-3xl dark:bg-gold/10"
      />

      <Container className="relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col items-start gap-6 text-start">
          <span
            data-hero-badge
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-bold text-gold-dark dark:text-gold"
          >
            <Sparkles size={14} />
            کالکشن جدید پاییز ۱۴۰۴
          </span>

          <h1
            aria-label="تکنولوژی، به روایت لوکس و اصالت"
            className="text-4xl font-black leading-[1.25] sm:text-5xl lg:text-[3.4rem]"
          >
            <MaskedWord>تکنولوژی،</MaskedWord>{' '}
            <MaskedWord>به</MaskedWord>{' '}
            <MaskedWord>روایت</MaskedWord>{' '}
            <MaskedWord className="pb-2 -mb-2">
              <span className="relative inline-block text-gold">
                لوکس
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-2 rounded-full bg-gold/25"
                />
              </span>
            </MaskedWord>{' '}
            <MaskedWord>و</MaskedWord>{' '}
            <MaskedWord>اصالت</MaskedWord>
          </h1>

          <p
            data-hero-paragraph
            className="max-w-lg text-base leading-8 text-navy/70 sm:text-lg dark:text-cream/70"
          >
            نوورا، مقصد شما برای گجت‌های دیجیتال اورجینال است؛ از هدفون‌های
            پرچمدار تا ساعت‌های هوشمند و اسپیکرهای حرفه‌ای، با ضمانت اصالت و
            تجربه خریدی بی‌نظیر.
          </p>

          <div data-hero-actions className="flex flex-wrap items-center gap-4">
            <Link to="/products">
              <Button className="px-8 py-3.5">مشاهده محصولات</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="px-8 py-3.5">
                داستان نوورا
              </Button>
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} data-hero-stat className="flex flex-col">
                <span className="text-2xl font-black text-gold">{stat.value}</span>
                <span className="text-xs text-navy/60 dark:text-cream/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-8 rounded-full bg-gradient-to-br from-gold/30 via-navy/10 to-navy/5 blur-2xl dark:from-gold/20 dark:to-transparent"
          />
          <img
            ref={imageRef}
            data-hero-image
            src={heroProduct}
            alt="هدفون بی‌سیم ایرپادز مکس"
            className="relative z-10 mx-auto w-full max-w-lg drop-shadow-2xl"
          />

          <div
            data-hero-card
            className="absolute top-6 -start-2 z-20 flex items-center gap-2.5 rounded-2xl border border-navy/10 bg-white/80 px-4 py-3 shadow-luxe backdrop-blur-md sm:start-4 dark:border-cream/15 dark:bg-navy/70 dark:shadow-luxe-dark"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-navy text-gold dark:bg-gold dark:text-navy">
              <ShieldCheck size={18} />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold">تضمین اصالت کالا</span>
              <span className="text-[10px] text-navy/60 dark:text-cream/60">۱۰۰٪ اورجینال</span>
            </div>
          </div>

          <div
            data-hero-card
            className="absolute bottom-10 -end-2 z-20 flex items-center gap-2.5 rounded-2xl border border-navy/10 bg-white/80 px-4 py-3 shadow-luxe backdrop-blur-md sm:end-6 dark:border-cream/15 dark:bg-navy/70 dark:shadow-luxe-dark"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-navy text-gold dark:bg-gold dark:text-navy">
              <Truck size={18} />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold">ارسال سریع و رایگان</span>
              <span className="text-[10px] text-navy/60 dark:text-cream/60">
                برای سفارش‌های بالای ۵ میلیون
              </span>
            </div>
          </div>

          <div
            data-hero-card
            className="absolute -bottom-2 start-8 z-20 hidden items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-4 py-2 text-xs font-bold text-gold-dark backdrop-blur-md sm:flex dark:text-gold"
          >
            <Headphones size={14} />
            صدای بی‌نقص
          </div>
        </div>
      </Container>
    </section>
  )
}
