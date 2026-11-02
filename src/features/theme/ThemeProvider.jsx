import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { THEME_STORAGE_KEY, setTheme } from '@/features/theme/themeSlice'

/**
 * تم انتخابی را روی <html> اعمال و در localStorage ذخیره می‌کند.
 * تغییر تم در سایر تب‌ها هم همگام‌سازی می‌شود.
 */
export default function ThemeProvider({ children }) {
  const mode = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    root.style.colorScheme = mode
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {
      /* حالت خصوصی مرورگر یا فضای پر */
    }
  }, [mode])

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === THEME_STORAGE_KEY && (event.newValue === 'dark' || event.newValue === 'light')) {
        dispatch(setTheme(event.newValue))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [dispatch])

  return children
}
