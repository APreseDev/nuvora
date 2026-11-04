import { useRef } from 'react'
import Container from '@/components/ui/Container'
import ProductCard from '@/components/ui/ProductCard'
import SectionHeader from '@/components/ui/SectionHeader'
import { useGSAP } from '@/lib/gsap'
import { revealUp } from '@/lib/animations'
import { featuredProducts } from '@/data/products'

export default function FeaturedProducts() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      revealUp('[data-product-card]', {
        trigger: '[data-products-grid]',
        y: 56,
        stagger: 0.12,
        duration: 1,
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="bg-white/50 py-20 sm:py-24 dark:bg-navy/30">
      <Container className="flex flex-col gap-12">
        <SectionHeader
          kicker="منتخب نوورا"
          title="محصولات ویژه"
          subtitle="گران‌قیمت‌ترین و لوکس‌ترین گجت‌های بازار، دست‌چین‌شده برای کاربرانی که کیفیت برایشان اولویت است."
          linkTo="/products"
          linkLabel="مشاهده همه محصولات"
        />
        <div data-products-grid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <div key={product.id} data-product-card>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
