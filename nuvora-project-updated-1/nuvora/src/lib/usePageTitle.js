import { useEffect } from 'react'
import { BRAND } from '@/lib/constants'

/** عنوان تب مرورگر را برای هر صفحه تنظیم می‌کند. */
export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} | ${BRAND.name}` : `${BRAND.name} — ${BRAND.tagline}`
    return () => {
      document.title = previous
    }
  }, [title])
}
