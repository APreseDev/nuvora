const VARIANTS = {
  primary:
    'bg-gold text-navy hover:bg-gold-light focus-visible:outline-gold shadow-luxe dark:shadow-luxe-dark',
  outline:
    'border border-navy/30 text-navy hover:border-gold hover:text-gold-dark dark:border-cream/25 dark:text-cream dark:hover:border-gold dark:hover:text-gold',
  ghost:
    'text-navy hover:bg-navy/5 dark:text-cream dark:hover:bg-cream/10',
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
