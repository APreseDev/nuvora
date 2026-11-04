import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import DianIntro from "@/components/intro/DianIntro";
import ThemeProvider from "@/features/theme/ThemeProvider";
import Home from "@/pages/Home";

// صفحات ثانویه تنبل بارگذاری می‌شوند تا باندل اولیه (و زمان رسیدن به هیرو) سبک بماند؛
// مرز Suspense داخل Layout است تا هدر/فوتر هنگام بارگذاری صفحه دوباره ساخته نشوند
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Products = lazy(() => import("@/pages/Products"));

export default function App() {
  return (
    // basename باید با base تنظیم‌شده در vite.config هم‌خوان باشد، وگرنه
    // مسیر «/nuvora/» به جای خانه به Route * (یافت نشد) می‌خورد
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <DianIntro />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
