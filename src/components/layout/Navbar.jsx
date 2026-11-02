import { Menu, Search, ShoppingCart, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Container from '@/components/ui/Container'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { BRAND, NAV_LINKS } from '@/lib/constants'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-300 after:absolute after:-bottom-1.5 after:start-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gold after:transition-all after:duration-300 hover:after:w-full ${
      isActive
        ? 'text-gold after:w-full'
        : 'text-navy/80 hover:text-gold dark:text-cream/80 dark:hover:text-gold'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-cream/85 backdrop-blur-md dark:border-cream/10 dark:bg-navy-deep/85">
      <Container className="flex h-18 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-navy font-display text-lg font-bold text-gold shadow-luxe dark:bg-gold dark:text-navy dark:shadow-luxe-dark">
            N
          </span>
          <span className="text-2xl font-black">
            {BRAND.name}
            <span className="mr-2 hidden font-display text-[10px] font-semibold tracking-[0.3em] text-gold sm:inline">
              {BRAND.nameEn}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="relative hidden lg:block">
            <input
              type="search"
              placeholder="جستجوی محصول..."
              aria-label="جستجوی محصولات"
              className="h-10 w-52 rounded-full border border-navy/15 bg-white/60 px-4 pe-10 text-sm outline-none transition-all placeholder:text-navy/40 focus:w-64 focus:border-gold dark:border-cream/15 dark:bg-cream/5 dark:placeholder:text-cream/40"
            />
            <Search
              size={16}
              className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-navy/50 dark:text-cream/50"
            />
          </div>

          <button
            type="button"
            aria-label="سبد خرید"
            className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-navy text-gold transition-all duration-300 hover:bg-gold hover:text-navy dark:bg-gold dark:text-navy dark:hover:bg-gold-light"
          >
            <ShoppingCart size={18} />
            <span className="absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-black text-navy ring-2 ring-cream dark:bg-navy dark:text-gold dark:ring-navy-deep">
              ۰
            </span>
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 hover:border-gold hover:text-gold-dark md:hidden dark:border-cream/20 dark:text-cream dark:hover:border-gold"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>

      {menuOpen && (
        <nav className="border-t border-navy/10 bg-cream px-4 py-4 md:hidden dark:border-cream/10 dark:bg-navy-deep">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium ${
                    isActive ? 'text-gold' : 'text-navy/80 dark:text-cream/80'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
