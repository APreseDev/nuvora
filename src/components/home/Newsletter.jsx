import { MailCheck, Send } from 'lucide-react'
import { useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/animations'

export default function Newsletter() {
  const sectionRef = useRef(null)
  const panelRef = useRef(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: panelRef.current, start: 'top 82%', once: true },
      })
      timeline
        .from(panelRef.current, { y: 48, opacity: 0, duration: 0.9 })
        .from('[data-newsletter-item]', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.35')
    },
    { scope: sectionRef },
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <section ref={sectionRef} className="pb-20 pt-4 sm:pb-24">
      <Container>
        <div
          ref={panelRef}
          className="relative overflow-hidden rounded-[2.5rem] border border-gold/30 bg-gradient-to-bl from-gold/15 via-transparent to-navy/10 px-6 py-14 text-center sm:px-12 dark:from-gold/10 dark:to-navy/40"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 start-10 size-56 rounded-full bg-gold/20 blur-3xl"
          />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-5">
            <span
              data-newsletter-item
              className="flex size-14 items-center justify-center rounded-2xl bg-navy text-gold shadow-lg dark:bg-gold dark:text-navy"
            >
              <MailCheck size={24} />
            </span>
            <h2 data-newsletter-item className="text-2xl font-extrabold sm:text-3xl">
              از تخفیف‌های اختصاصی نوورا زودتر باخبر شوید
            </h2>
            <p
              data-newsletter-item
              className="text-sm leading-7 text-navy/60 sm:text-base dark:text-cream/60"
            >
              هر هفته کالکشن‌های جدید، کدهای تخفیف و پیشنهادهای ویژه را در
              ایمیل خود دریافت کنید. هر زمان بخواهید می‌توانید لغو عضویت کنید.
            </p>

            {subscribed ? (
              <p className="rounded-full border border-gold/50 bg-gold/15 px-6 py-3 text-sm font-bold text-gold-dark dark:text-gold">
                ✓ عضویت شما با موفقیت ثبت شد؛ خوش آمدید!
              </p>
            ) : (
              <form
                data-newsletter-item
                onSubmit={handleSubmit}
                className="flex w-full max-w-md items-center gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  aria-label="آدرس ایمیل"
                  className="h-12 flex-1 rounded-full border border-navy/15 bg-white/80 px-5 text-sm outline-none transition-colors placeholder:text-navy/40 focus:border-gold dark:border-cream/15 dark:bg-navy/50 dark:placeholder:text-cream/40"
                />
                <Button type="submit" className="shrink-0 !px-6">
                  <Send size={16} className="scale-x-[-1]" />
                  عضویت
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
