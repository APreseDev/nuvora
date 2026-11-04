import { Moon, Sun } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '@/features/theme/themeSlice'

export default function ThemeToggle({ className = '' }) {
  const mode = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={mode === 'dark' ? 'فعال‌سازی حالت روشن' : 'فعال‌سازی حالت تاریک'}
      title={mode === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
      className={`inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 hover:border-gold hover:text-gold-dark dark:border-cream/20 dark:text-cream dark:hover:border-gold dark:hover:text-gold ${className}`}
    >
      {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
