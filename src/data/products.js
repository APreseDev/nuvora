import airpodsMax from '@/assets/img/products/apple-airpods-max-silver.webp'
import appleWatch from '@/assets/img/products/apple-watch-series-4-gold.webp'
import homePodMini from '@/assets/img/products/apple-homepod-mini-cosmic-grey.webp'
import beatsFlex from '@/assets/img/products/beats-flex-wireless-earphones.webp'
import airPods from '@/assets/img/products/apple-airpods.webp'
import magsafePack from '@/assets/img/products/apple-magsafe-battery-pack.webp'
import airpower from '@/assets/img/products/apple-airpower-wireless-charger.webp'
import iphoneCharger from '@/assets/img/products/apple-iphone-charger.webp'
import echoPlus from '@/assets/img/products/amazon-echo-plus.webp'
import iphoneCase from '@/assets/img/products/iphone-12-silicone-case-with-magsafe-plum.webp'

export const products = [
  {
    id: 1,
    name: 'هدفون بی‌سیم ایرپادز مکس نقره‌ای',
    category: 'هدفون و ایربادز',
    categoryId: 'headphones',
    price: 24500000,
    oldPrice: 27900000,
    discount: 12,
    rating: 4.9,
    badge: 'پرچمدار',
    image: airpodsMax,
  },
  {
    id: 2,
    name: 'ساعت هوشمند اپل واچ طلایی',
    category: 'ساعت هوشمند',
    categoryId: 'smartwatches',
    price: 18900000,
    oldPrice: null,
    discount: 0,
    rating: 4.8,
    badge: 'جدید',
    image: appleWatch,
  },
  {
    id: 3,
    name: 'اسپیکر هوشمند هوم‌پاد مینی',
    category: 'اسپیکر',
    categoryId: 'speakers',
    price: 7400000,
    oldPrice: null,
    discount: 0,
    rating: 4.7,
    badge: null,
    image: homePodMini,
  },
  {
    id: 4,
    name: 'هدفون بی‌سیم بیتس فلکس',
    category: 'هدفون و ایربادز',
    categoryId: 'headphones',
    price: 3200000,
    oldPrice: 3900000,
    discount: 18,
    rating: 4.5,
    badge: 'پیشنهاد ویژه',
    image: beatsFlex,
  },
  {
    id: 5,
    name: 'ایربادز اپل ایرپادز',
    category: 'هدفون و ایربادز',
    categoryId: 'headphones',
    price: 9800000,
    oldPrice: null,
    discount: 0,
    rating: 4.8,
    badge: 'پرفروش',
    image: airPods,
  },
  {
    id: 6,
    name: 'پاوربانک مگ‌سیف اپل',
    category: 'لوازم جانبی موبایل',
    categoryId: 'accessories',
    price: 4300000,
    oldPrice: null,
    discount: 0,
    rating: 4.4,
    badge: 'پرفروش',
    image: magsafePack,
  },
  {
    id: 7,
    name: 'شارژر بی‌سیم اپل ایرپاور',
    category: 'لوازم جانبی موبایل',
    categoryId: 'accessories',
    price: 3800000,
    oldPrice: 4500000,
    discount: 15,
    rating: 4.3,
    badge: 'پرفروش',
    image: airpower,
  },
  {
    id: 8,
    name: 'شارژر اورجینال اپل آیفون',
    category: 'لوازم جانبی موبایل',
    categoryId: 'accessories',
    price: 1900000,
    oldPrice: null,
    discount: 0,
    rating: 4.6,
    badge: 'پرفروش',
    image: iphoneCharger,
  },
  {
    id: 9,
    name: 'اسپیکر هوشمند آمازون اکو پلاس',
    category: 'گجت‌های هوشمند',
    categoryId: 'gadgets',
    price: 6900000,
    oldPrice: 8200000,
    discount: 16,
    rating: 4.6,
    badge: 'پیشنهاد ویژه',
    image: echoPlus,
  },
  {
    id: 10,
    name: 'قاب سیلیکونی آیفون ۱۲ مگ‌سیف بنفش',
    category: 'لوازم جانبی موبایل',
    categoryId: 'accessories',
    price: 1450000,
    oldPrice: null,
    discount: 0,
    rating: 4.5,
    badge: 'جدید',
    image: iphoneCase,
  },
]

export const getProductById = (id) => products.find((product) => product.id === id)

// محصولات ویژه: گران‌ترین‌های کاتالوگ (۴ مورد)؛ پرفروش‌ها: بر اساس نشان «پرفروش».
// به‌جای slice روی ایندکس، از فیلتر استفاده شده تا افزودن محصول جدید چیدمان را نشکند.
export const featuredProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 4)

export const bestSellingProducts = products.filter((product) => product.badge === 'پرفروش').slice(0, 4)
