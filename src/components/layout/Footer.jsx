import { AtSign, Globe, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import { BRAND, NAV_LINKS } from '@/lib/constants'
import { categories } from '@/data/categories'
import { currentJalaliYear } from '@/lib/utils'

const SOCIALS = [
  { icon: AtSign, label: 'اینستاگرام' },
  { icon: Send, label: 'تلگرام' },
  { icon: MessageCircle, label: 'واتساپ' },
  { icon: Globe, label: 'وبلاگ نوورا' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-cream">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-2xl font-black text-cream">
              {BRAND.name}
            </span>
            <span className="font-display text-sm font-semibold tracking-[0.3em] text-gold">
              {BRAND.nameEn}
            </span>
          </Link>
          <p className="text-sm leading-7 text-cream/60">
            نوورا، فروشگاه لوکس گجت‌های دیجیتال؛ مقصد شما برای خرید مطمئن
            تکنولوژی اورجینال با ضمانت اصالت و ارسال سریع به سراسر ایران.
          </p>
          <div className="flex items-center gap-2.5">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                onClick={(event) => event.preventDefault()}
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-all duration-300 hover:border-gold hover:text-gold"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-base font-extrabold text-gold">دسترسی سریع</h3>
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="w-fit text-sm text-cream/70 transition-colors duration-300 hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-base font-extrabold text-gold">دسته‌بندی‌ها</h3>
          <nav className="flex flex-col gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="w-fit text-sm text-cream/70 transition-colors duration-300 hover:text-gold"
              >
                {category.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-base font-extrabold text-gold">اطلاعات تماس</h3>
          <ul className="flex flex-col gap-3.5 text-sm text-cream/70">
            <li className="flex items-center gap-2.5">
              <MapPin size={16} className="shrink-0 text-gold" />
              تهران، خیابان ولیعصر، برج نوورا، طبقه ۱۲
            </li>
            <li className="flex items-center gap-2.5" dir="ltr">
              <Phone size={16} className="shrink-0 text-gold" />
              <span className="font-display tracking-wider">۰۲۱ - ۹۱۰۰ ۸۸۰۰</span>
            </li>
            <li className="flex items-center gap-2.5" dir="ltr">
              <Mail size={16} className="shrink-0 text-gold" />
              <span className="font-display tracking-wider">hello@nuvora.ir</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-cream/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream/50 sm:flex-row">
          <span>© {currentJalaliYear()} فروشگاه نوورا — تمامی حقوق محفوظ است.</span>
          <span className="flex items-center gap-1.5">
            طراحی‌شده با
            <span aria-hidden="true" className="text-gold">◆</span>
            و دقتِ بسیار
          </span>
        </Container>
      </div>
    </footer>
  )
}
