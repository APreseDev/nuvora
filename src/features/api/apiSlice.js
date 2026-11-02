import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * پایه‌ی RTK Query برای نوورا.
 * اندپوینت‌های فروشگاه (محصولات، دسته‌بندی‌ها و ...) بعداً اینجا اضافه می‌شوند.
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
  tagTypes: [],
  endpoints: () => ({}),
})
