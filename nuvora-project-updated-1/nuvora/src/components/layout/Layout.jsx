import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import CartDrawer from '@/components/layout/CartDrawer'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import PageLoader from '@/components/ui/PageLoader'
import { ScrollTrigger } from '@/lib/gsap'

/** با تغییر مسیر، صفحه به بالا برمی‌گردد (React Router به‌طور پیش‌فرض این کار را نمی‌کند). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    // ارتفاع صفحه عوض شده؛ موقعیت تریگرهای اسکرول دوباره محاسبه شود
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="site-content flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-navy"
      >
        پرش به محتوای اصلی
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main" key={pathname} className="animate-page-in flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
