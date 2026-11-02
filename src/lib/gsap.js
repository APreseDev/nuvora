import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ثبت افزونه‌ها فقط یک‌بار در کل برنامه — همه کامپوننت‌ها از اینجا import می‌کنند
gsap.registerPlugin(ScrollTrigger, useGSAP)

gsap.defaults({ ease: 'power3.out', duration: 0.8 })

// پس از لود کامل تصاویر، موقعیت تریگرها دوباره محاسبه شود
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    ScrollTrigger.refresh()
  } else {
    window.addEventListener('load', () => ScrollTrigger.refresh())
  }
}

export { gsap, ScrollTrigger, useGSAP }
