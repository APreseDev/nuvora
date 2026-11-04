import { useRef } from 'react'
import CategoryCard from '@/components/ui/CategoryCard'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import { useGSAP } from '@/lib/gsap'
import { revealUp } from '@/lib/animations'
import { categories } from '@/data/categories'

export default function Categories() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      revealUp('[data-category-card]', {
        trigger: '[data-category-grid]',
        y: 52,
        stagger: 0.09,
        duration: 1,
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeader
          kicker="دسته‌بندی‌ها"
          title="دنیای گجت‌ها را کشف کنید"
          subtitle="از هر دسته‌ای که به دنبالش هستید، بهترین‌ها را با ضمانت اصالت در نوورا پیدا کنید."
        />
        <div data-category-grid className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
          {categories.map((category) => (
            <div key={category.id} data-category-card>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
