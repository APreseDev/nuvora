import { Check, Eye, Heart, ImageOff, LoaderCircle, ShoppingBag, Star } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addItem } from '@/features/cart/cartSlice'
import { cx, formatNumber, formatPrice } from '@/lib/utils'

function Rating({ value }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`امتیاز ${formatNumber(value)} از ۵`}>
      <Star size={14} className="text-gold transition-transform duration-500 group-hover:rotate-[72deg]" fill="currentColor" />
      <span className="text-xs font-bold">{formatNumber(value)}</span>
    </div>
  )
}

/** حالت دکمه‌ی افزودن به سبد: idle ← loading ← added ← idle */
function useAddToCart(productId) {
  const dispatch = useDispatch()
  const [status, setStatus] = useState('idle')
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const add = useCallback(() => {
    if (status !== 'idle') return
    setStatus('loading')
    timers.current.push(
      setTimeout(() => {
        dispatch(addItem(productId))
        setStatus('added')
        timers.current.push(setTimeout(() => setStatus('idle'), 1500))
      }, 450),
    )
  }, [dispatch, productId, status])

  return [status, add]
}

export default function ProductCard({ product }) {
  const cardRef = useRef(null)
  const [imgState, setImgState] = useState('loading') // loading | loaded | error
  const [liked, setLiked] = useState(false)
  const [status, add] = useAddToCart(product.id)

  // تصویرِ کش‌شده ممکن است پیش از اتصال onLoad کامل شده باشد
  const imgRef = useCallback((node) => {
    if (node?.complete && node.naturalWidth > 0) setImgState('loaded')
  }, [])

  // نور دنبال‌کننده‌ی ماوس (فقط متغیر CSS؛ بدون رندر مجدد ری‌اکت)
  const onMouseMove = (event) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  const busy = status !== 'idle'

  return (
    <article
      ref={cardRef}
      onMouseMove={onMouseMove}
      className="product-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white/70 shadow-luxe transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gold/70 hover:bg-white hover:shadow-gold dark:border-cream/10 dark:bg-navy/40 dark:shadow-luxe-dark dark:hover:bg-navy/70 dark:hover:shadow-[0_30px_60px_-22px_rgb(198_167_107/0.35)]"
    >
      <div className="product-sheen relative aspect-square overflow-hidden bg-gradient-to-bl from-navy/5 via-transparent to-gold/10 transition-colors duration-500 group-hover:from-gold/15 group-hover:to-gold/25 dark:from-cream/5 dark:to-gold/5 dark:group-hover:from-gold/10 dark:group-hover:to-gold/20">
        {imgState !== 'loaded' && imgState !== 'error' && (
          <div aria-hidden="true" className="skeleton absolute inset-6 rounded-2xl" />
        )}
        {imgState === 'error' ? (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-navy/40 dark:text-cream/40">
            <ImageOff size={32} />
            <span className="text-xs">تصویر در دسترس نیست</span>
          </div>
        ) : (
          <div data-product-image className="size-full p-7">
            <img
              ref={imgRef}
              src={product.image}
              alt={product.name}
              width="1000"
              height="1000"
              loading="lazy"
              decoding="async"
              onLoad={() => setImgState('loaded')}
              onError={() => setImgState('error')}
              className={cx(
                'size-full object-contain drop-shadow-md transition-all duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110 group-hover:drop-shadow-[0_18px_28px_rgba(198,167,107,0.45)]',
                imgState === 'loaded' ? 'opacity-100' : 'opacity-0',
              )}
            />
          </div>
        )}

        {product.badge && (
          <span className="absolute top-4 start-4 z-10 rounded-full bg-navy px-3.5 py-1.5 text-[11px] font-bold text-gold shadow-lg transition-all duration-300 group-hover:bg-gold group-hover:text-navy dark:bg-gold dark:text-navy dark:group-hover:bg-cream">
            {product.badge}
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-4 end-4 z-10 rounded-full bg-gradient-to-l from-red-500 to-rose-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
            {formatNumber(product.discount)}٪ تخفیف
          </span>
        )}

        <button
          type="button"
          onClick={() => setLiked((value) => !value)}
          aria-pressed={liked}
          aria-label={liked ? `حذف ${product.name} از علاقه‌مندی‌ها` : `افزودن ${product.name} به علاقه‌مندی‌ها`}
          className={cx(
            'absolute bottom-4 end-4 z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-90',
            'translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100',
            liked
              ? 'border-rose-500/40 bg-rose-500 text-white'
              : 'border-navy/10 bg-white/80 text-navy hover:text-rose-500 dark:border-cream/15 dark:bg-navy/70 dark:text-cream',
          )}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} className={liked ? 'animate-pop' : ''} />
        </button>

        <div
          aria-hidden="true"
          className="absolute bottom-4 start-4 z-10 hidden translate-y-3 items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-[11px] font-bold text-cream opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex"
        >
          <Eye size={13} className="text-gold" />
          نگاه سریع
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-2.5 p-5 pt-2">
        <span className="text-xs font-medium text-navy/50 transition-colors duration-300 group-hover:text-gold-dark dark:text-cream/50 dark:group-hover:text-gold">
          {product.category}
        </span>
        <h3 className="min-h-14 text-[15px] font-bold leading-7 transition-colors duration-300 group-hover:text-gold-dark dark:group-hover:text-gold-light">
          {product.name}
        </h3>
        <Rating value={product.rating} />

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-navy/40 line-through dark:text-cream/40">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-lg font-extrabold text-navy transition-colors duration-300 group-hover:text-gold-dark dark:text-cream dark:group-hover:text-gold">
              {formatPrice(product.price)}
              <span className="ms-1.5 text-[11px] font-medium text-navy/60 dark:text-cream/60">تومان</span>
            </span>
          </div>

          <button
            type="button"
            onClick={add}
            disabled={busy}
            aria-busy={status === 'loading'}
            aria-label={
              status === 'added' ? `${product.name} به سبد اضافه شد` : `افزودن ${product.name} به سبد خرید`
            }
            className={cx(
              'inline-flex size-11 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-gold active:scale-90 disabled:cursor-default',
              status === 'added'
                ? 'bg-emerald-500 text-white'
                : 'bg-navy text-gold hover:bg-gold hover:text-navy dark:bg-gold dark:text-navy dark:hover:bg-gold-light',
            )}
          >
            {status === 'loading' && <LoaderCircle size={18} className="animate-spin" />}
            {status === 'added' && <Check size={18} className="animate-pop" />}
            {status === 'idle' && <ShoppingBag size={18} className="transition-transform duration-300 group-hover:-rotate-12" />}
          </button>
        </div>
        <span role="status" aria-live="polite" className="sr-only">
          {status === 'added' ? `${product.name} به سبد خرید اضافه شد` : ''}
        </span>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white/50 dark:border-cream/10 dark:bg-navy/30"
    >
      <div className="skeleton aspect-square" />
      <div className="flex flex-1 flex-col gap-3 p-5 pt-4">
        <div className="skeleton h-3 w-20 rounded-full" />
        <div className="skeleton h-4 w-full rounded-full" />
        <div className="skeleton h-4 w-2/3 rounded-full" />
        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="skeleton h-6 w-28 rounded-full" />
          <div className="skeleton size-11 rounded-full" />
        </div>
      </div>
    </div>
  )
}
