import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import {
  MAX_QTY,
  clearCart,
  closeCart,
  removeItem,
  selectCartCount,
  selectCartSavings,
  selectCartTotal,
  selectDetailedItems,
  setQty,
} from '@/features/cart/cartSlice'
import { formatNumber, formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.cart.open)
  const items = useSelector(selectDetailedItems)
  const count = useSelector(selectCartCount)
  const total = useSelector(selectCartTotal)
  const savings = useSelector(selectCartSavings)
  const closeRef = useRef(null)
  const asideRef = useRef(null)
  const lastFocused = useRef(null)

  // inert با toggleAttribute تا با React 18 و 19 هر دو سازگار باشد
  useEffect(() => {
    asideRef.current?.toggleAttribute('inert', !open)
  }, [open])

  // قفل اسکرول، Esc و مدیریت فوکوس
  useEffect(() => {
    if (!open) return undefined
    const html = document.documentElement
    lastFocused.current = document.activeElement
    html.classList.add('cart-open')
    closeRef.current?.focus()
    const onKey = (event) => event.key === 'Escape' && dispatch(closeCart())
    window.addEventListener('keydown', onKey)
    return () => {
      html.classList.remove('cart-open')
      window.removeEventListener('keydown', onKey)
      lastFocused.current?.focus?.()
    }
  }, [open, dispatch])

  return (
    <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={() => dispatch(closeCart())}
        className={`absolute inset-0 bg-navy-deep/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        ref={asideRef}
        role="dialog"
        aria-modal="true"
        aria-label="سبد خرید"
        className={`absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-navy-deep ${
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-navy/10 px-6 py-5 dark:border-cream/10">
          <h2 className="flex items-center gap-2.5 text-lg font-extrabold">
            <ShoppingBag size={20} className="text-gold" />
            سبد خرید
            {count > 0 && (
              <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-gold-dark dark:text-gold">
                {formatNumber(count)} کالا
              </span>
            )}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => dispatch(closeCart())}
            aria-label="بستن سبد خرید"
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-navy/15 transition-all duration-300 hover:rotate-90 hover:border-gold hover:text-gold-dark dark:border-cream/20 dark:hover:text-gold"
          >
            <X size={18} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-gold/15 text-gold">
              <ShoppingBag size={34} />
            </span>
            <p className="text-lg font-extrabold">سبد خرید شما خالی است</p>
            <p className="text-sm leading-7 text-navy/60 dark:text-cream/60">
              محصولات مورد علاقه‌تان را اضافه کنید تا اینجا ببینید.
            </p>
            <Link to="/products" onClick={() => dispatch(closeCart())}>
              <Button>مشاهده محصولات</Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
              {items.map(({ product, qty }) => (
                <li
                  key={product.id}
                  className="animate-fade-in flex gap-4 rounded-2xl border border-navy/10 bg-white/70 p-3 transition-colors duration-300 hover:border-gold/50 dark:border-cream/10 dark:bg-navy/40"
                >
                  <img
                    src={product.image}
                    alt=""
                    width="80"
                    height="80"
                    className="size-20 shrink-0 rounded-xl bg-gradient-to-bl from-navy/5 to-gold/10 object-contain p-2 dark:from-cream/5"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold leading-6">{product.name}</h3>
                      <button
                        type="button"
                        onClick={() => dispatch(removeItem(product.id))}
                        aria-label={`حذف ${product.name} از سبد`}
                        className="shrink-0 cursor-pointer rounded-full p-1.5 text-navy/40 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:text-cream/40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-navy/15 dark:border-cream/20">
                        <button
                          type="button"
                          onClick={() => dispatch(setQty({ id: product.id, qty: qty - 1 }))}
                          aria-label="کم کردن تعداد"
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gold/20"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-6 text-center text-sm font-bold">{formatNumber(qty)}</span>
                        <button
                          type="button"
                          onClick={() => dispatch(setQty({ id: product.id, qty: qty + 1 }))}
                          disabled={qty >= MAX_QTY}
                          aria-label="زیاد کردن تعداد"
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-extrabold">
                        {formatPrice(product.price * qty)}
                        <span className="ms-1 text-[10px] font-medium text-navy/60 dark:text-cream/60">تومان</span>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="flex flex-col gap-3 border-t border-navy/10 px-6 py-5 dark:border-cream/10">
              {savings > 0 && (
                <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400">
                  <span>سود شما از تخفیف</span>
                  <span className="font-bold">{formatPrice(savings)} تومان</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy/70 dark:text-cream/70">جمع کل</span>
                <span className="text-xl font-black text-gold-dark dark:text-gold">
                  {formatPrice(total)}
                  <span className="ms-1.5 text-xs font-medium text-navy/60 dark:text-cream/60">تومان</span>
                </span>
              </div>
              <Button className="w-full py-3.5">ادامه و ثبت سفارش</Button>
              <button
                type="button"
                onClick={() => dispatch(clearCart())}
                className="cursor-pointer text-xs text-navy/50 transition-colors hover:text-red-500 dark:text-cream/50"
              >
                خالی کردن سبد خرید
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
