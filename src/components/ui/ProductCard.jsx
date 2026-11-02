import { ShoppingBag, Star } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@/lib/gsap'
import { revealUp } from '@/lib/animations'
import { formatNumber, formatPrice } from '@/lib/utils'

function Rating({ value }) {
  return (
    <div className="flex items-center gap-1" aria-label={`امتیاز ${formatNumber(value)} از ۵`}>
      <Star size={14} className="text-gold" fill="currentColor" />
      <span className="text-xs font-bold">{formatNumber(value)}</span>
    </div>
  )
}

export default function ProductCard({ product }) {
  const cardRef = useRef(null)

  // نمایان‌شدن تصویر محصول هنگام ورود کارت به ناحیه دید (یک‌بار)
  useGSAP(
    () => {
      const image = cardRef.current?.querySelector('[data-product-image]')
      if (image) {
        revealUp(image, { trigger: cardRef.current, y: 24, duration: 0.9, start: 'top 90%' })
      }
    },
    { scope: cardRef },
  )

  return (
    <article
      ref={cardRef}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white/70 shadow-luxe transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 dark:border-cream/10 dark:bg-navy/40 dark:shadow-luxe-dark dark:hover:border-gold/60"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-bl from-navy/5 via-transparent to-gold/10 dark:from-cream/5 dark:via-transparent dark:to-gold/5">
        <div data-product-image className="size-full p-7">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
        {product.badge && (
          <span className="absolute top-4 start-4 rounded-full bg-navy px-3.5 py-1.5 text-[11px] font-bold text-gold shadow-lg dark:bg-gold dark:text-navy">
            {product.badge}
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-4 end-4 rounded-full bg-red-500 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg">
            {formatNumber(product.discount)}٪ تخفیف
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5 pt-2">
        <span className="text-xs font-medium text-navy/50 dark:text-cream/50">{product.category}</span>
        <h3 className="min-h-14 text-[15px] font-bold leading-7">{product.name}</h3>
        <Rating value={product.rating} />

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-navy/40 line-through dark:text-cream/40">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-lg font-extrabold text-navy dark:text-cream">
              {formatPrice(product.price)}
              <span className="mr-1.5 text-[11px] font-medium text-navy/60 dark:text-cream/60">تومان</span>
            </span>
          </div>

          <button
            type="button"
            aria-label={`افزودن ${product.name} به سبد خرید`}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-navy text-gold shadow-lg transition-all duration-300 hover:bg-gold hover:text-navy active:scale-95 dark:bg-gold dark:text-navy dark:hover:bg-gold-light"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}
