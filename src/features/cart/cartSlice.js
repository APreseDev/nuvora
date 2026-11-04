import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getProductById } from '@/data/products'

export const CART_STORAGE_KEY = 'nuvora-cart'
const MAX_QTY = 10

/** سبد ذخیره‌شده را می‌خواند و آیتم‌های نامعتبر/محصولات حذف‌شده را کنار می‌گذارد. */
export function sanitizeItems(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item) => item && getProductById(item.id) && Number.isInteger(item.qty) && item.qty > 0)
    .map((item) => ({ id: item.id, qty: Math.min(item.qty, MAX_QTY) }))
}

function loadItems() {
  try {
    return sanitizeItems(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'))
  } catch {
    return []
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadItems(), open: false },
  reducers: {
    setItems(state, { payload }) {
      state.items = sanitizeItems(payload)
    },
    addItem(state, { payload: id }) {
      const found = state.items.find((item) => item.id === id)
      if (found) found.qty = Math.min(found.qty + 1, MAX_QTY)
      else state.items.push({ id, qty: 1 })
    },
    setQty(state, { payload: { id, qty } }) {
      if (qty <= 0) {
        state.items = state.items.filter((item) => item.id !== id)
        return
      }
      const found = state.items.find((item) => item.id === id)
      if (found) found.qty = Math.min(qty, MAX_QTY)
    },
    removeItem(state, { payload: id }) {
      state.items = state.items.filter((item) => item.id !== id)
    },
    clearCart(state) {
      state.items = []
    },
    openCart(state) {
      state.open = true
    },
    closeCart(state) {
      state.open = false
    },
  },
})

export const { setItems, addItem, setQty, removeItem, clearCart, openCart, closeCart } = cartSlice.actions
export { MAX_QTY }

const selectItems = (state) => state.cart.items

/** آیتم‌های سبد همراه با اطلاعات کامل محصول */
export const selectDetailedItems = createSelector([selectItems], (items) =>
  items
    .map((item) => ({ ...item, product: getProductById(item.id) }))
    .filter((item) => item.product),
)
export const selectCartCount = createSelector([selectItems], (items) =>
  items.reduce((sum, item) => sum + item.qty, 0),
)
export const selectCartTotal = createSelector([selectDetailedItems], (items) =>
  items.reduce((sum, item) => sum + item.product.price * item.qty, 0),
)
export const selectCartSavings = createSelector([selectDetailedItems], (items) =>
  items.reduce((sum, { product, qty }) => sum + ((product.oldPrice ?? product.price) - product.price) * qty, 0),
)

export default cartSlice.reducer
