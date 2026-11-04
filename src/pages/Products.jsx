import { ChevronDown, PackageSearch, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import PageHeader from '@/components/ui/PageHeader'
import ProductCard, { ProductCardSkeleton } from '@/components/ui/ProductCard'
import { categories } from '@/data/categories'
import { useGetProductsQuery } from '@/features/api/apiSlice'
import { usePageTitle } from '@/lib/usePageTitle'
import { cx, formatNumber } from '@/lib/utils'

const SORTS = [
  { id: 'default', label: 'پیش‌فرض', fn: null },
  { id: 'rating', label: 'بیشترین امتیاز', fn: (a, b) => b.rating - a.rating },
  { id: 'cheap', label: 'ارزان‌ترین', fn: (a, b) => a.price - b.price },
  { id: 'expensive', label: 'گران‌ترین', fn: (a, b) => b.price - a.price },
  { id: 'discount', label: 'بیشترین تخفیف', fn: (a, b) => b.discount - a.discount },
]

/** یکسان‌سازی حروف عربی/فارسی و حذف نیم‌فاصله برای جستجوی دقیق‌تر */
const normalize = (text) =>
  text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[‌‏]/g, '')
    .toLowerCase()
    .trim()

export default function Products() {
  const [params, setParams] = useSearchParams()
  const { data: products = [], isLoading, isError, isFetching, refetch } = useGetProductsQuery()

  const category = params.get('category') ?? 'all'
  const q = params.get('q') ?? ''
  const sortId = SORTS.some((s) => s.id === params.get('sort')) ? params.get('sort') : 'default'
  const activeCategory = categories.find((c) => c.id === category)

  usePageTitle(activeCategory ? activeCategory.label : 'محصولات')

  const update = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const visible = useMemo(() => {
    const term = normalize(q)
    const list = products.filter(
      (p) =>
        (category === 'all' || p.categoryId === category) &&
        (!term || normalize(p.name).includes(term) || normalize(p.category).includes(term)),
    )
    const sorter = SORTS.find((s) => s.id === sortId)?.fn
    return sorter ? [...list].sort(sorter) : list
  }, [products, category, q, sortId])

  const hasFilters = category !== 'all' || q || sortId !== 'default'

  return (
    <>
      <PageHeader
        kicker="فروشگاه نوورا"
        title={activeCategory ? activeCategory.label : 'همه محصولات'}
        subtitle="کالاهای اورجینال با ضمانت اصالت؛ فیلتر کنید، مرتب کنید و بهترین انتخاب را بیابید."
      />

      <Container className="flex flex-col gap-8 py-10 sm:py-14">
        <div className="flex flex-col gap-5">
          <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="دسته‌بندی">
            {[{ id: 'all', label: 'همه' }, ...categories].map((c) => {
              const active = c.id === category
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => update('category', c.id, 'all')}
                  aria-pressed={active}
                  className={cx(
                    'shrink-0 cursor-pointer rounded-full border px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5',
                    active
                      ? 'border-gold bg-gold text-navy shadow-luxe dark:shadow-luxe-dark'
                      : 'border-navy/15 text-navy/80 hover:border-gold hover:text-gold-dark dark:border-cream/20 dark:text-cream/80 dark:hover:text-gold',
                  )}
                >
                  {c.label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type="search"
                value={q}
                onChange={(event) => update('q', event.target.value, '')}
                placeholder="جستجو در محصولات..."
                aria-label="جستجو در محصولات"
                className="h-12 w-full rounded-full border border-navy/15 bg-white/70 px-5 pe-12 text-sm outline-none transition-colors placeholder:text-navy/40 focus:border-gold dark:border-cream/15 dark:bg-navy/40 dark:placeholder:text-cream/40"
              />
              <Search size={17} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-navy/50 dark:text-cream/50" />
            </div>

            <label className="relative flex items-center">
              <span className="sr-only">مرتب‌سازی</span>
              <SlidersHorizontal size={16} className="pointer-events-none absolute start-4 text-gold" />
              <select
                value={sortId}
                onChange={(event) => update('sort', event.target.value, 'default')}
                className="h-12 w-full cursor-pointer appearance-none rounded-full border border-navy/15 bg-white/70 ps-11 pe-10 text-sm font-medium outline-none transition-colors focus:border-gold sm:w-56 dark:border-cream/15 dark:bg-navy-deep"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute end-4 text-navy/50 dark:text-cream/50" />
            </label>
          </div>

          <div className="flex min-h-6 items-center justify-between text-sm text-navy/60 dark:text-cream/60" aria-live="polite">
            <span>{isLoading ? 'در حال دریافت محصولات…' : `${formatNumber(visible.length)} محصول یافت شد`}</span>
            {hasFilters && (
              <button
                type="button"
                onClick={() => setParams({}, { replace: true })}
                className="inline-flex cursor-pointer items-center gap-1.5 font-bold text-gold-dark transition-colors hover:text-gold dark:text-gold"
              >
                <X size={14} />
                پاک‌کردن فیلترها
              </button>
            )}
          </div>
        </div>

        {isError ? (
          <div role="alert" className="flex flex-col items-center gap-4 rounded-3xl border border-red-500/30 bg-red-500/5 px-6 py-16 text-center">
            <p className="text-lg font-extrabold">دریافت محصولات با مشکل روبه‌رو شد</p>
            <p className="text-sm text-navy/60 dark:text-cream/60">اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
            <Button onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
              تلاش دوباره
            </Button>
          </div>
        ) : isLoading ? (
          <div aria-busy="true" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-gold/40 px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold">
              <PackageSearch size={30} />
            </span>
            <p className="text-lg font-extrabold">محصولی با این مشخصات پیدا نشد</p>
            <p className="text-sm text-navy/60 dark:text-cream/60">عبارت دیگری را جستجو کنید یا فیلترها را پاک کنید.</p>
            <Button variant="outline" onClick={() => setParams({}, { replace: true })}>
              نمایش همه محصولات
            </Button>
          </div>
        ) : (
          <div key={`${category}|${q}|${sortId}`} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(index, 11) * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
