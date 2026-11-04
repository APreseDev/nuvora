import BestSellers from '@/components/home/BestSellers'
import BrandIntro from '@/components/home/BrandIntro'
import Categories from '@/components/home/Categories'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Hero from '@/components/home/Hero'
import Newsletter from '@/components/home/Newsletter'
import PromoBanner from '@/components/home/PromoBanner'

import { usePageTitle } from '@/lib/usePageTitle'

// هر بخش، انیمیشن‌های خودش را داخل useGSAP مخصوص به خود مدیریت می‌کند؛
// به این ترتیب پاک‌سازی (cleanup) و چرخه‌ی حیات ScrollTriggerها محلی و بدون نشتی است.
export default function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <PromoBanner />
      <BestSellers />
      <BrandIntro />
      <Newsletter />
    </>
  )
}
