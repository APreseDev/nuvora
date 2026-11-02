import { useRef } from 'react'
import Container from '@/components/ui/Container'
import ProductCard from '@/components/ui/ProductCard'
import SectionHeader from '@/components/ui/SectionHeader'
import { useGSAP } from '@/lib/gsap'
import { revealUp } from '@/lib/animations'
import { bestSellingProducts } from '@/data/products'

export default function BestSellers() {
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
    <section ref={sectionRef} className="py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeader
          kicker="محبوب‌ترین‌ها"
          title="پرفروش‌ترین محصولات"
          subtitle="انتخاب هزاران مشتری نوورا در ماه‌های گذشته؛ محصولاتی که امتیاز رضایت بالایی داشته‌اند."
          linkTo="/products"
          linkLabel="مشاهده لیست کامل"
        />
        <div data-products-grid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellingProducts.map((product) => (
            <div key={product.id} data-product-card>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
