import { createSlice } from '@reduxjs/toolkit'

export const THEME_STORAGE_KEY = 'nuvora-theme'

/**
 * تم اولیه را از <html> می‌خواند؛ اسکریپت هم‌زمان در index.html
 * پیش از رندر ری‌اکت، کلاس dark را بر اساس localStorage یا تنظیمات
 * سیستم کاربر اعمال کرده است. این کار از فلش تم جلوگیری می‌کند.
 */
const getInitialTheme = () => {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    setTheme(state, action) {
      state.mode = action.payload
    },
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
    },
  },
})

export const { setTheme, toggleTheme } = themeSlice.actions

export default themeSlice.reducer
