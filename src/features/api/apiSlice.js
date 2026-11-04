import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { products } from '@/data/products'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * پایه‌ی RTK Query برای نوورا.
 * تا زمانی که بک‌اند آماده نشده، اندپوینت محصولات با queryFn از داده‌ی محلی
 * (و کمی تأخیر شبیه‌سازی‌شده) پاسخ می‌دهد تا حالت‌های لودینگ/خطا واقعی تست شوند.
 * هنگام اتصال به سرور فقط `queryFn` را با `query: () => '/products'` عوض کنید.
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      headers.set('Accept-Language', 'fa-IR')
      return headers
    },
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      async queryFn() {
        await sleep(900)
        return { data: products }
      },
      providesTags: ['Product'],
    }),
  }),
})

export const { useGetProductsQuery } = apiSlice
