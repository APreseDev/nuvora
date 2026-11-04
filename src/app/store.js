import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '@/features/api/apiSlice'
import cartReducer, { CART_STORAGE_KEY, setItems } from '@/features/cart/cartSlice'
import themeReducer from '@/features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    cart: cartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

// ذخیره‌ی سبد خرید؛ فقط وقتی آیتم‌ها واقعاً تغییر کرده باشند
let lastItems = store.getState().cart.items
store.subscribe(() => {
  const { items } = store.getState().cart
  if (items === lastItems) return
  lastItems = items
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* حالت خصوصی مرورگر یا فضای پر */
  }
})

// همگام‌سازی سبد بین تب‌ها
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== CART_STORAGE_KEY) return
    try {
      store.dispatch(setItems(JSON.parse(event.newValue || '[]')))
    } catch {
      /* مقدار خراب نادیده گرفته می‌شود */
    }
  })
}
