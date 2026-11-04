import { BadgeCheck, Gem, HeartHandshake, Search, ShieldCheck, Truck } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import PageHeader from '@/components/ui/PageHeader'
import SectionHeader from '@/components/ui/SectionHeader'
import { revealUp } from '@/lib/animations'
import { useGSAP } from '@/lib/gsap'
import { usePageTitle } from '@/lib/usePageTitle'

const STATS = [
  { value: '۱۲ هزار+', label: 'مشتری وفادار' },
  { value: '۵۴۰+', label: 'محصول اورجینال' },
  { value: '۴.۹', label: 'امتیاز رضایت' },
  { value: '۲۴/۷', label: 'پشتیبانی فارسی' },
]

const VALUES = [
  { icon: ShieldCheck, title: 'اصالت پیش از هر چیز', desc: 'هر کالا پیش از عرضه بررسی می‌شود و با گارانتی معتبر به دست شما می‌رسد.' },
  { icon: Gem, title: 'تجربه‌ی لوکس', desc: 'از طراحی فروشگاه تا بسته‌بندی؛ خرید از نوورا باید حس خوبی داشته باشد.' },
  { icon: HeartHandshake, title: 'احترام به مشتری', desc: 'پاسخ‌گویی صادقانه و ۷ روز مهلت بازگشت، بدون قید و شرط.' },
  { icon: Truck, title: 'ارسال سریع', desc: 'تحویل اکسپرس در تهران و ارسال مطمئن به سراسر ایران.' },
]

const STEPS = [
  { icon: Search, title: 'انتخاب دقیق', desc: 'فقط از تأمین‌کنندگان معتبر و رسمی خرید می‌کنیم.' },
  { icon: BadgeCheck, title: 'بررسی اصالت', desc: 'سریال، پلمپ و گارانتی هر کالا کنترل می‌شود.' },
  { icon: Truck, title: 'بسته‌بندی و ارسال', desc: 'کالا با بسته‌بندی ایمن و سریع تحویل داده می‌شود.' },
]

export default function About() {
  usePageTitle('درباره ما')
  const ref = useRef(null)

  useGSAP(
    () => {
      revealUp('[data-about-stat]', { trigger: '[data-about-stats]', y: 30, stagger: 0.1 })
      revealUp('[data-about-value]', { trigger: '[data-about-values]', y: 40, stagger: 0.1 })
      revealUp('[data-about-step]', { trigger: '[data-about-steps]', y: 40, stagger: 0.12 })
    },
    { scope: ref },
  )

  return (
    <div ref={ref}>
      <PageHeader
        kicker="درباره نوورا"
        title="جایی که تکنولوژی با ظرافت روبه‌رو می‌شود"
        subtitle="نوورا با یک هدف ساده ساخته شد: تجربه‌ای لوکس و قابل اعتماد از خرید گجت‌های دیجیتال اورجینال در ایران."
      />

      <Container className="py-14 sm:py-20">
        <div data-about-stats className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              data-about-stat
              className="flex flex-col items-center gap-1 rounded-3xl border border-navy/10 bg-white/70 px-4 py-8 text-center shadow-luxe transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-gold dark:border-cream/10 dark:bg-navy/40 dark:shadow-luxe-dark"
            >
              <span className="text-3xl font-black text-gold">{stat.value}</span>
              <span className="text-sm text-navy/60 dark:text-cream/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </Container>

      <section className="bg-white/50 py-16 sm:py-20 dark:bg-navy/30">
        <Container className="flex flex-col gap-12">
          <SectionHeader kicker="ارزش‌های ما" title="آنچه برای ما اهمیت دارد" />
          <div data-about-values className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                data-about-value
                className="group flex flex-col gap-4 rounded-3xl border border-navy/10 bg-white/70 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:bg-white dark:border-cream/10 dark:bg-navy/40 dark:hover:bg-navy/70"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-navy text-gold transition-all duration-500 group-hover:rotate-6 group-hover:bg-gold group-hover:text-navy dark:bg-gold dark:text-navy">
                  <Icon size={22} />
                </span>
                <h3 className="text-base font-extrabold">{title}</h3>
                <p className="text-sm leading-7 text-navy/60 dark:text-cream/60">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="flex flex-col gap-12 py-16 sm:py-20">
        <SectionHeader kicker="فرایند ما" title="اصالت را چگونه تضمین می‌کنیم؟" />
        <ol data-about-steps className="grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, desc }, index) => (
            <li
              key={title}
              data-about-step
              className="relative flex flex-col items-center gap-3 rounded-3xl border border-gold/30 bg-gradient-to-bl from-gold/10 to-transparent p-8 text-center"
            >
              <span className="absolute -top-4 flex size-9 items-center justify-center rounded-full bg-gold text-sm font-black text-navy">
                {(index + 1).toLocaleString('fa-IR')}
              </span>
              <Icon size={28} className="text-gold" />
              <h3 className="text-base font-extrabold">{title}</h3>
              <p className="text-sm leading-7 text-navy/60 dark:text-cream/60">{desc}</p>
            </li>
          ))}
        </ol>
        <div className="flex justify-center">
          <Link to="/products">
            <Button className="px-10 py-3.5">مشاهده محصولات</Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
