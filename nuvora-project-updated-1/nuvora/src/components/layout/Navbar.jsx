import { Menu, Search, ShoppingCart, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Container from '@/components/ui/Container'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { openCart, selectCartCount } from '@/features/cart/cartSlice'
import { BRAND, NAV_LINKS } from '@/lib/constants'
import { formatNumber } from '@/lib/utils'

function SearchBox({ className = '', inputClassName = '', onSubmitted }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const q = query.trim()
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
    setQuery('')
    onSubmitted?.()
  }

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="جستجوی محصول..."
        aria-label="جستجوی محصولات"
        className={`h-10 rounded-full border border-navy/15 bg-white/60 px-4 pe-10 text-sm outline-none transition-all placeholder:text-navy/40 focus:border-gold dark:border-cream/15 dark:bg-cream/5 dark:placeholder:text-cream/40 ${inputClassName}`}
      />
      <button
        type="submit"
        aria-label="جستجو"
        className="absolute end-1 top-1/2 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-navy/50 transition-colors hover:text-gold dark:text-cream/50"
      >
        <Search size={16} />
      </button>
    </form>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dispatch = useDispatch()
  const count = useSelector(selectCartCount)
  const { pathname } = useLocation()
  const [bump, setBump] = useState(false)
  const firstRender = useRef(true)
  const mobileNavRef = useRef(null)

  // سایه/تیره‌شدن هدر پس از اسکرول
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // منوی بسته‌ی موبایل از دسترس تب/صفحه‌خوان خارج شود (سازگار با React 18 و 19)
  useEffect(() => {
    mobileNavRef.current?.toggleAttribute('inert', !menuOpen)
  }, [menuOpen])

  // منوی موبایل با تغییر مسیر یا Esc بسته می‌شود
  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // جهش نشان تعداد هنگام افزودن کالا
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return undefined
    }
    setBump(true)
    const id = setTimeout(() => setBump(false), 450)
    return () => clearTimeout(id)
  }, [count])

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-300 after:absolute after:-bottom-1.5 after:start-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gold after:transition-all after:duration-300 hover:after:w-full ${
      isActive
        ? 'text-gold after:w-full'
        : 'text-navy/80 hover:text-gold dark:text-cream/80 dark:hover:text-gold'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-cream/85 backdrop-blur-md transition-shadow duration-300 dark:bg-navy-deep/85 ${
        scrolled
          ? 'border-gold/20 shadow-luxe dark:shadow-luxe-dark'
          : 'border-navy/10 dark:border-cream/10'
      }`}
    >
      <Container className="flex h-18 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label={`${BRAND.name} — صفحه اصلی`}>
          <span className="flex size-10 items-center justify-center rounded-2xl bg-navy font-display text-lg font-bold text-gold shadow-luxe dark:bg-gold dark:text-navy dark:shadow-luxe-dark">
            N
          </span>
          <span className="text-2xl font-black">
            {BRAND.name}
            <span className="ms-2 hidden font-display text-[10px] font-semibold tracking-[0.3em] text-gold sm:inline">
              {BRAND.nameEn}
            </span>
          </span>
        </Link>

        <nav aria-label="منوی اصلی" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            // بدون end، لینک «خانه» روی همه‌ی مسیرها فعال می‌شد
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <SearchBox className="hidden lg:block" inputClassName="w-52 focus:w-64" />

          <button
            type="button"
            onClick={() => dispatch(openCart())}
            aria-label={`سبد خرید، ${formatNumber(count)} کالا`}
            className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-navy text-gold transition-all duration-300 hover:scale-105 hover:bg-gold hover:text-navy dark:bg-gold dark:text-navy dark:hover:bg-gold-light"
          >
            <ShoppingCart size={18} />
            <span
              className={`absolute -end-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-black text-navy ring-2 ring-cream transition-transform dark:bg-navy dark:text-gold dark:ring-navy-deep ${
                bump ? 'animate-pop' : ''
              }`}
              style={{ height: '1.25rem' }}
            >
              {formatNumber(count)}
            </span>
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 hover:border-gold hover:text-gold-dark md:hidden dark:border-cream/20 dark:text-cream dark:hover:border-gold"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 md:hidden ${
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <nav
          ref={mobileNavRef}
          aria-label="منوی موبایل"
          className="overflow-hidden border-navy/10 bg-cream px-4 dark:border-cream/10 dark:bg-navy-deep"
        >
          <div className="flex flex-col gap-4 py-4">
            <SearchBox inputClassName="w-full" onSubmitted={() => setMenuOpen(false)} />
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-base font-medium ${isActive ? 'text-gold' : 'text-navy/80 dark:text-cream/80'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
