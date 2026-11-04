import { CircleCheck, Clock, LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import PageHeader from '@/components/ui/PageHeader'
import { revealUp } from '@/lib/animations'
import { useGSAP } from '@/lib/gsap'
import { usePageTitle } from '@/lib/usePageTitle'

const INFO = [
  { icon: MapPin, title: 'نشانی', lines: ['تهران، خیابان ولیعصر، برج نوورا، طبقه ۱۲'] },
  { icon: Phone, title: 'تلفن', lines: ['۰۲۱ - ۹۱۰۰ ۸۸۰۰'], ltr: true },
  { icon: Mail, title: 'ایمیل', lines: ['hello@nuvora.ir'], ltr: true },
  { icon: Clock, title: 'ساعت پاسخ‌گویی', lines: ['شنبه تا پنجشنبه، ۹ تا ۱۸'] },
]

const TOPICS = ['پیگیری سفارش', 'مشاوره خرید', 'ضمانت و بازگشت کالا', 'همکاری و تأمین', 'سایر موارد']

const EMPTY = { name: '', email: '', topic: TOPICS[0], message: '' }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'نام خود را وارد کنید.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'ایمیل معتبر وارد کنید.'
  if (values.message.trim().length < 10) errors.message = 'پیام باید حداقل ۱۰ نویسه باشد.'
  return errors
}

const fieldClass = (invalid) =>
  `w-full rounded-2xl border bg-white/70 px-5 py-3 text-sm outline-none transition-colors placeholder:text-navy/40 focus:border-gold dark:bg-navy/40 dark:placeholder:text-cream/40 ${
    invalid ? 'border-red-500' : 'border-navy/15 dark:border-cream/15'
  }`

export default function Contact() {
  usePageTitle('تماس با ما')
  const ref = useRef(null)
  const timer = useRef(null)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent

  useEffect(() => () => clearTimeout(timer.current), [])

  useGSAP(
    () => {
      revealUp('[data-contact-info]', { trigger: '[data-contact-infos]', y: 30, stagger: 0.1 })
      revealUp('[data-contact-form]', { y: 40 })
    },
    { scope: ref },
  )

  const onChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (status === 'sending') return
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      ref.current?.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    setStatus('sending')
    // شبیه‌سازی ارسال تا اتصال به سرور
    timer.current = setTimeout(() => {
      setStatus('sent')
      setValues(EMPTY)
    }, 1100)
  }

  return (
    <div ref={ref}>
      <PageHeader
        kicker="تماس با نوورا"
        title="در خدمت شما هستیم"
        subtitle="سؤال، پیشنهاد یا نیاز به راهنمایی برای خرید دارید؟ پیام بگذارید؛ در اسرع وقت پاسخ می‌دهیم."
      />

      <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
        <div data-contact-infos className="flex flex-col gap-4">
          {INFO.map(({ icon: Icon, title, lines, ltr }) => (
            <div
              key={title}
              data-contact-info
              className="group flex items-center gap-4 rounded-2xl border border-navy/10 bg-white/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 dark:border-cream/10 dark:bg-navy/40"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-navy dark:bg-gold dark:text-navy">
                <Icon size={20} />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-navy/50 dark:text-cream/50">{title}</span>
                {lines.map((line) => (
                  <span key={line} dir={ltr ? 'ltr' : undefined} className={`text-sm font-bold ${ltr ? 'text-start' : ''}`}>
                    {line}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          data-contact-form
          className="rounded-[2rem] border border-gold/30 bg-gradient-to-bl from-gold/10 via-transparent to-navy/5 p-6 sm:p-10 dark:to-navy/30"
        >
          {status === 'sent' ? (
            <div role="status" className="animate-fade-in flex flex-col items-center gap-4 py-10 text-center">
              <CircleCheck size={56} className="text-emerald-500" />
              <h2 className="text-xl font-extrabold">پیام شما ارسال شد</h2>
              <p className="text-sm leading-7 text-navy/60 dark:text-cream/60">
                از تماس شما سپاسگزاریم؛ همکاران ما به‌زودی پاسخ خواهند داد.
              </p>
              <Button variant="outline" onClick={() => setStatus('idle')}>
                ارسال پیام جدید
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-bold">
                  نام و نام خانوادگی
                  <input
                    name="name"
                    value={values.name}
                    onChange={onChange}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'err-name' : undefined}
                    className={fieldClass(errors.name)}
                  />
                  {errors.name && <span id="err-name" className="text-xs font-medium text-red-500">{errors.name}</span>}
                </label>
                <label className="flex flex-col gap-2 text-sm font-bold">
                  ایمیل
                  <input
                    name="email"
                    type="email"
                    dir="ltr"
                    value={values.email}
                    onChange={onChange}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'err-email' : undefined}
                    className={`${fieldClass(errors.email)} text-start`}
                  />
                  {errors.email && <span id="err-email" className="text-xs font-medium text-red-500">{errors.email}</span>}
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-bold">
                موضوع
                <select name="topic" value={values.topic} onChange={onChange} className={`${fieldClass(false)} cursor-pointer dark:bg-navy-deep`}>
                  {TOPICS.map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-bold">
                پیام شما
                <textarea
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'err-message' : undefined}
                  className={`${fieldClass(errors.message)} resize-none`}
                />
                {errors.message && <span id="err-message" className="text-xs font-medium text-red-500">{errors.message}</span>}
              </label>

              <Button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'} className="self-start px-10 py-3.5">
                {status === 'sending' ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Send size={16} className="scale-x-[-1]" />
                )}
                {status === 'sending' ? 'در حال ارسال…' : 'ارسال پیام'}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  )
}
