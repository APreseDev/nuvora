export function formatPrice(value) {
  return value.toLocaleString('fa-IR')
}

export function formatNumber(value) {
  return value.toLocaleString('fa-IR')
}

/** سال شمسی جاری (برای فوتر) */
export function currentJalaliYear() {
  return new Date().toLocaleDateString('fa-IR', { year: 'numeric' })
}

/** ترکیب شرطی کلاس‌ها */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}
