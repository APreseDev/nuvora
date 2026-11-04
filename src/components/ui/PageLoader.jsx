/** فالبک Suspense هنگام بارگذاری تنبل صفحات */
export default function PageLoader() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <span className="size-11 animate-spin rounded-full border-2 border-gold/25 border-t-gold" aria-hidden="true" />
      <span className="text-sm text-navy/60 dark:text-cream/60">در حال بارگذاری…</span>
    </div>
  )
}
