import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-6xl font-extrabold text-gold">۴۰۴</p>
      <h1 className="mt-4 text-2xl font-bold">صفحه مورد نظر یافت نشد</h1>
      <p className="mt-2 text-navy/70 dark:text-cream/70">
        به نظر می‌رسد آدرس وارد شده وجود ندارد.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button>بازگشت به خانه</Button>
        </Link>
      </div>
    </Container>
  )
}
