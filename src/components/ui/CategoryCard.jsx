import { Link } from 'react-router-dom'
import { formatNumber } from '@/lib/utils'

export default function CategoryCard({ category }) {
  return (
    <Link
      to="/products"
      className="group relative flex aspect-[4/5] flex-col items-center justify-end overflow-hidden rounded-3xl border border-navy/10 bg-gradient-to-t from-navy/95 via-navy/60 to-navy/20 shadow-luxe transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 dark:border-cream/10 dark:shadow-luxe-dark"
    >
      <img
        src={category.image}
        alt={category.label}
        loading="lazy"
        className="absolute inset-0 size-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="relative z-10 flex flex-col items-center gap-1 pb-6 text-center">
        <span className="text-sm font-extrabold text-cream">{category.label}</span>
        <span className="text-xs text-gold">{formatNumber(category.count)} محصول</span>
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-x-8 bottom-0 z-10 h-px bg-gradient-to-l from-transparent via-gold to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </Link>
  )
}
