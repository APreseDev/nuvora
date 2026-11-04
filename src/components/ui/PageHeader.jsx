import Container from '@/components/ui/Container'

/** سربرگ صفحات داخلی با هاله‌ی طلایی */
export default function PageHeader({ kicker, title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden border-b border-navy/10 dark:border-cream/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 start-1/3 size-96 rounded-full bg-gold/20 blur-3xl"
      />
      <Container className="relative flex flex-col items-center gap-4 py-14 text-center sm:py-20">
        {kicker && (
          <span className="flex items-center gap-3 text-sm font-bold tracking-wide text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            {kicker}
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
          </span>
        )}
        <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && (
          <p className="max-w-2xl text-sm leading-8 text-navy/65 sm:text-base dark:text-cream/65">{subtitle}</p>
        )}
        {children}
      </Container>
    </section>
  )
}
