import { useEffect, useRef, useState } from 'react'

/* ════════════════════════════════════════════════════════════════════
   DIAN INTRO — انیمیشن ورودی لوگو (Canvas 2D، بدون وابستگی)
   دریا ← قطره ← جرقه و آتش ← ظهور «دایان» با باد خنک ← ذرات ← محو
   رویداد پایان: window 'dian-intro:done'  |  کلاس روی <html>: dian-intro-done
   هر فریم تابع خالصی از زمان t است؛ منطق و زمان‌بندی با فایل مرجع یکسان است.
   ════════════════════════════════════════════════════════════════════ */

const BASE = import.meta.env.BASE_URL

/* ───── تنظیمات ───── */
const CFG = {
  once: false, // true = فقط یک بار در هر نشست (sessionStorage)
  allowSkip: true,
  // پس‌زمینه‌ی اینترو تیره است (لوگو برای پس‌زمینه‌ی تیره طراحی شده)؛
  // در تم تیره با رنگ پس‌زمینه‌ی سایت هم‌خانواده می‌شود تا پرش دیده نشود.
  bgDark: [11, 17, 32],
  bgLight: [2, 5, 11],
  particles: { desktop: 26000, mobile: 9000 },
  // ضریب سرعت پخش: ۱ = زمان‌بندی اصلی (۱۲ ثانیه)، ۱.۵ = ۸ ثانیه، ۲ = ۶ ثانیه.
  // کل خط زمانی یکنواخت تند می‌شود؛ ترتیب و نسبت مراحل و ظاهر هر فریم تغییر نمی‌کند.
  speed: 1.5,
}
const T = {
  // زمان‌بندی (ثانیه)
  sea0: 0,
  morph0: 1.8,
  morph1: 3.1,
  bounce1: 3.75,
  spark: 3.55,
  fire0: 4.0,
  fire1: 5.9,
  type: [5.3, 5.85, 6.35, 6.75],
  typeDur: 1.05,
  wind0: 5.1,
  wind1: 8.1,
  hold: 8.3,
  diss0: 9.3,
  ov0: 10.6,
  ov1: 11.8,
  end: 12.0,
}

/* ───── ابزارها ───── */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const ss = (x, a, b) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const eo = (x) => {
  x = clamp(x)
  return 1 - Math.pow(1 - x, 3)
}
const eio = (x) => {
  x = clamp(x)
  return x * x * (3 - 2 * x)
}
const elastic = (x) => {
  x = clamp(x)
  return x === 0 || x === 1 ? x : 1 - Math.exp(-7 * x) * Math.cos(11 * x)
}
const lerp = (a, b, t) => a + (b - a) * t
function rng(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const mk = (w, h) => {
  const c = document.createElement('canvas')
  c.width = Math.max(1, w | 0)
  c.height = Math.max(1, h | 0)
  return c
}

function tint(img, rgb) {
  const c = mk(img.width, img.height)
  const x = c.getContext('2d')
  x.drawImage(img, 0, 0)
  x.globalCompositeOperation = 'source-in'
  x.fillStyle = 'rgb(' + rgb.join(',') + ')'
  x.fillRect(0, 0, c.width, c.height)
  return c
}
function blurCanvas(src, f) {
  const w = src.width
  const h = src.height
  const a = mk(w / f, h / f)
  a.getContext('2d').drawImage(src, 0, 0, a.width, a.height)
  const b = mk(w / (f / 2.6), h / (f / 2.6))
  b.getContext('2d').drawImage(a, 0, 0, b.width, b.height)
  const c = mk(w, h)
  c.getContext('2d').drawImage(b, 0, 0, w, h)
  return c
}
function glowSprite(img, P, f, boost) {
  const c = mk(img.width + 2 * P, img.height + 2 * P)
  const x = c.getContext('2d')
  x.drawImage(img, P, P)
  const b = blurCanvas(c, f)
  if (boost) {
    const x2 = b.getContext('2d')
    x2.globalCompositeOperation = 'lighter'
    x2.drawImage(b, 0, 0)
  }
  return b
}

export default function DianIntro() {
  const rootRef = useRef(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    const cv = root.querySelector('canvas')
    const ctx = cv.getContext('2d')
    const skipBtn = root.querySelector('.skip')
    const html = document.documentElement

    /* ───── بارگذاری تصاویر و متا ───── */
    const LAY = {}
    let META = null
    let IMG = {}

    // بارگذاری مقاوم: اگر meta.json یا هر لایه‌ای لود نشود (۴۰۴، قطع شبکه، تایم‌اوت)
    // reject می‌شود تا سایت هرگز پشت اینترو گیر نکند.
    const LOAD_TIMEOUT = 12000
    function loadImage(src) {
      return new Promise((res, rej) => {
        const im = new Image()
        im.onload = () => res(im)
        im.onerror = () => rej(new Error('intro layer failed: ' + src))
        im.src = src
      })
    }
    function loadAll() {
      const job = fetch(BASE + 'dian-intro/meta.json')
        .then((r) => {
          if (!r.ok) throw new Error('intro meta failed: ' + r.status)
          return r.json()
        })
        .then((data) => {
          META = data.meta
          const SRC = data.layers
          return Promise.all(
            Object.keys(SRC).map((k) =>
              loadImage(BASE + 'dian-intro/' + k + '.png').then((im) => {
                IMG[k] = im
              }),
            ),
          ).then(() => SRC)
        })
      const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('intro load timeout')), LOAD_TIMEOUT))
      return Promise.race([job, timeout])
    }

    /* ───── چیدمان ───── */
    let W, H, dpr, k, ox, oy, Cd, flameBase
    let particles = null
    const NR = 200
    function layout() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.round(innerWidth * dpr)
      H = Math.round(innerHeight * dpr)
      cv.width = W
      cv.height = H
      const lw = Math.min(
        innerWidth * (innerWidth < 700 ? 0.86 : 0.62),
        innerHeight * 0.62 * (META.W / META.H),
        1180,
      )*dpr
      k = lw / META.W
      ox = (W - META.W * k) / 2
      oy = (H - META.H * k) / 2
      Cd = [ox + META.drop.cx * k, oy + META.drop.cy * k]
      flameBase = [ox + META.flameBase[0] * k, oy + META.flameBase[1] * k]
      particles = null
    }

    /* ───── پس‌زمینه ───── */
    function drawBG(a) {
      if (a <= 0) return
      ctx.globalAlpha = a
      const g = ctx.createRadialGradient(W / 2, H * 0.5, 0, W / 2, H * 0.5, Math.max(W, H) * 0.7)
      g.addColorStop(0, 'rgb(7,11,22)')
      g.addColorStop(1, 'rgb(' + CFG.bg.join(',') + ')')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 1
    }

    /* ───── دریا ← قطره ───── */
    const SEA_LAYERS = [
      // [index, deep color, top color, alpha, droplet scale]
      [2, [0, 52, 118], [0, 96, 176], 0.6, 1.55],
      [1, [0, 92, 168], [0, 134, 218], 0.78, 1.25],
      [0, [0, 100, 190], [96, 205, 255], 0.94, 1.0],
    ]
    function seaBase(t) {
      return H * (1.04 - 0.44 * eo((t - T.sea0) / 1.25))
    }
    function seaSurf(x, t, layer) {
      const u = x / W
      const b = seaBase(t) - layer * H * 0.03
      const a = H * 0.034 * (0.7 + 0.6 * ss(t, 0, 1.4))
      return (
        b +
        a *
          (0.6 * Math.sin(u * 9.4 - t * 2.3 + layer * 1.7) +
            0.36 * Math.sin(u * 17.1 + t * 3.2 + layer * 0.9) +
            0.22 * Math.sin(u * 4.3 - t * 1.4 + layer * 0.4))
      )
    }
    function seaRadial(t, layer, Co) {
      const rmax = Math.hypot(W, H * 1.4)
      const out = new Float32Array(NR)
      const yb = H * 1.16
      for (let i = 0; i < NR; i++) {
        const th = (2 * Math.PI * i) / NR
        const dx = Math.cos(th)
        const dy = Math.sin(th)
        let lo = 0
        let hi = rmax
        for (let n = 0; n < 22; n++) {
          const m = (lo + hi) / 2
          const x = Co[0] + dx * m
          const y = Co[1] + dy * m
          const inside = x > -W * 0.04 && x < W * 1.04 && y <= yb && y >= seaSurf(x, t, layer)
          if (inside) lo = m
          else hi = m
        }
        out[i] = lo
      }
      return out
    }
    let satellites = null
    function initSatellites() {
      const r = rng(99)
      satellites = []
      for (let i = 0; i < 16; i++)
        satellites.push({ u: r(), d: r() * 0.55, s: 0.012 + r() * 0.02, arc: (r() - 0.5) * 0.5 })
    }
    function drawSea(t) {
      if (t > T.bounce1) return
      const ee0 = clamp((t - T.morph0) / (T.morph1 - T.morph0))
      for (const [li, deep, top, al, sc] of SEA_LAYERS) {
        const delay = li * 0.05
        const ee = clamp((ee0 - delay) / (1 - delay))
        const base = seaBase(t) - li * H * 0.03
        const Co = [W / 2, (base + H * 1.16) / 2]
        const ro = seaRadial(t, li, Co)
        const E = eio(ee)
        const R = eo(ee) + 0.06 * Math.sin(ee * Math.PI * 2.5) * ee * (1 - ee) * 4 * (li === 0 ? 1 : 0)
        const lift = -H * 0.16 * Math.sin(ee * Math.PI) * (1 - ee * 0.4)
        const C = [lerp(Co[0], Cd[0], E), lerp(Co[1], Cd[1], E) + lift]
        let a = al * (li === 0 ? 1 - ss(ee, 0.93, 1.0) : 1 - ss(ee, 0.55, 0.95))
        if (t < 0.05 || a <= 0.003) continue
        ctx.beginPath()
        let ymin = 1e9
        let ymax = -1e9
        const wob = (1 - ee) * ee * 0.1 * 4
        const RR = new Float32Array(NR)
        for (let i = 0; i < NR; i++) {
          const th = (2 * Math.PI * i) / NR
          const rd = META.drop.rd[i] * k * sc
          RR[i] = lerp(ro[i], rd, clamp(R, 0, 1.06)) * (1 + wob * Math.sin(th * 3 + t * 9) * 0.5)
        }
        const m = Math.round(16 * Math.sin(Math.PI * clamp(ee * 1.1))) // نرم‌کردن گوشه‌ها در میانه‌ی تبدیل
        for (let i = 0; i < NR; i++) {
          const th = (2 * Math.PI * i) / NR
          let r = RR[i]
          if (m > 0) {
            let sum = 0
            for (let j = -m; j <= m; j++) sum += RR[(i + j + NR) % NR]
            r = sum / (2 * m + 1)
          }
          const px = C[0] + Math.cos(th) * r
          const py = C[1] + Math.sin(th) * r
          if (py < ymin) ymin = py
          if (py > ymax) ymax = py
          if (i) ctx.lineTo(px, py)
          else ctx.moveTo(px, py)
        }
        ctx.closePath()
        const g = ctx.createLinearGradient(
          0,
          ymin,
          0,
          Math.min(ymax, ymin + Math.max(H * 0.5, (ymax - ymin) * 0.9)),
        )
        const mix = ee // رنگ‌ها هنگام تبدیل شدن به قطره به رنگ قطره نزدیک می‌شوند
        g.addColorStop(
          0,
          'rgb(' + top.map((v, j) => Math.round(lerp(v, [70, 170, 240][j], mix))).join(',') + ')',
        )
        g.addColorStop(0.18, 'rgb(0,' + Math.round(lerp(134, 125, mix)) + ',218)')
        g.addColorStop(1, 'rgb(' + deep.join(',') + ')')
        ctx.globalAlpha = a
        ctx.fillStyle = g
        ctx.fill()
        if (li === 0) {
          // لبه‌ی کف‌آلود
          ctx.globalAlpha = a * 0.75 * (1 - ee * 0.8)
          ctx.strokeStyle = 'rgba(205,240,255,.85)'
          ctx.lineWidth = 2.2 * dpr
          ctx.lineJoin = 'round'
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      }
      // قطره‌های ریز که به قطره‌ی اصلی می‌پیوندند
      if (!satellites) initSatellites()
      if (ee0 > 0 && ee0 < 1) {
        for (const s of satellites) {
          const u = clamp((ee0 - s.d) / (1 - s.d))
          if (u <= 0 || u >= 1) continue
          const sx = s.u * W
          const sy = seaSurf(sx, T.morph0, 0)
          const e = eio(u)
          const px = lerp(sx, Cd[0], e) + Math.sin(u * Math.PI) * s.arc * W * 0.2
          const py = lerp(sy, Cd[1], e) - Math.sin(u * Math.PI) * H * 0.18
          ctx.globalAlpha = 0.9 * (1 - ss(u, 0.85, 1))
          ctx.fillStyle = 'rgb(40,160,240)'
          ctx.beginPath()
          ctx.arc(px, py, Math.min(W, H) * s.s * 1.25 * (1 - u * 0.5), 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }
    }

    /* ───── قطره‌ی لوگو ───── */
    function drawDrop(t) {
      const L = LAY.drop
      const ee = clamp((t - T.morph0) / (T.morph1 - T.morph0))
      const a = ss(ee, 0.9, 1.0)
      if (a <= 0) return
      const p = clamp((t - T.morph1) / (T.bounce1 - T.morph1))
      const sq = p < 1 ? Math.sin(p * Math.PI * 3) * (1 - p) * 0.1 : 0
      const sx = 1 - sq
      const sy = 1 + sq * 1.2
      const bx = ox + META.drop.cx * k
      const by = oy + META.drop.bottom * k
      // هاله‌ی آبی
      const gl = 0.55 * (0.4 + 0.6 * ss(t, T.morph0, T.morph1)) * (1 - ss(t, T.fire0, T.hold))
      if (gl > 0.01) {
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = gl * a
        const P = L.glowP
        ctx.drawImage(L.glow, ox + (L.x - P) * k, oy + (L.y - P) * k, (L.w + 2 * P) * k, (L.h + 2 * P) * k)
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
      }
      ctx.save()
      ctx.translate(bx, by)
      ctx.scale(sx, sy)
      ctx.translate(-bx, -by)
      ctx.globalAlpha = a
      ctx.drawImage(L.img, ox + L.x * k, oy + L.y * k, L.w * k, L.h * k)
      ctx.restore()
      ctx.globalAlpha = 1
    }

    /* ───── جرقه و آتش ───── */
    const spk = (() => {
      const r = rng(3)
      const a = []
      for (let i = 0; i < 36; i++)
        a.push({ ang: ((r() * 120 - 60) * Math.PI) / 180, sp: 380 + r() * 720, life: 0.25 + r() * 0.4, dly: r() * 0.1 })
      return a
    })()
    const emb = (() => {
      const r = rng(11)
      const a = []
      for (let i = 0; i < 46; i++)
        a.push({ t0: r() * 2.8, life: 0.8 + r() * 0.9, x0: -20 + r() * 90, vx: -40 + r() * 100, vy: 120 + r() * 140, rad: 1.5 + r() * 1.7, ph: r() * 6 })
      return a
    })()
    function windI(t) {
      return ss(t, T.wind0, T.wind0 + 0.5) * (1 - ss(t, T.wind1 - 0.9, T.wind1 + 0.2))
    }
    function drawSpark(t) {
      const ts = t - T.spark
      if (ts < 0 || ts > 1.0) return
      const bx = flameBase[0]
      const by = flameBase[1] - 6 * dpr
      ctx.globalCompositeOperation = 'lighter'
      const fl = Math.exp(-Math.pow((ts - 0.08) / 0.06, 2))
      if (fl > 0.01) {
        const R = (90 + 130 * fl) * dpr
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, R)
        g.addColorStop(0, 'rgba(255,245,210,' + Math.min(1, fl * 1.2) + ')')
        g.addColorStop(0.25, 'rgba(255,200,110,' + fl * 0.55 + ')')
        g.addColorStop(1, 'rgba(255,150,60,0)')
        ctx.fillStyle = g
        ctx.fillRect(bx - R, by - R, R * 2, R * 2)
      }
      ctx.lineCap = 'round'
      ctx.strokeStyle = 'rgb(255,225,140)'
      ctx.lineWidth = 2.6 * dpr
      for (const s of spk) {
        const u = ts - s.dly
        if (u < 0 || u > s.life) continue
        const pos = (uu) => [bx + Math.sin(s.ang) * s.sp * uu * 0.8 * dpr, by - Math.cos(s.ang) * s.sp * uu * dpr + 620 * uu * uu * dpr]
        const p1 = pos(u)
        const p0 = pos(Math.max(0, u - 0.035))
        ctx.globalAlpha = (1 - u / s.life) * 0.95
        ctx.beginPath()
        ctx.moveTo(p0[0], p0[1])
        ctx.lineTo(p1[0], p1[1])
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }
    function drawFlame(t) {
      const g = (t - T.fire0) / (T.fire1 - T.fire0)
      if (g <= 0) return
      const gg = Math.min(g, 1)
      const gs = eo(gg)
      const F = LAY.flame
      const sy = 0.1 + 0.9 * gs
      const sx = 0.3 + 0.7 * Math.pow(gs, 0.6)
      const wob = 1 - ss(t, T.fire1 - 0.2, T.hold - 0.2)
      const wind = windI(t)
      const bx = flameBase[0]
      const by = flameBase[1]
      const fb = META.flameBase[1]
      const ftop = F.y
      ctx.save()
      ctx.translate(bx, by)
      ctx.scale(sx, sy)
      ctx.translate(-bx, -by)
      // هاله
      const glowK = 0.8 * Math.min(gg * 2.5, 1) * (1 - ss(t, T.fire1 + 0.4, T.hold - 0.3)) * (1 + 0.06 * wob * Math.sin(t * 37))
      if (glowK > 0.01) {
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = glowK
        const P = F.glowP
        ctx.drawImage(F.glow, ox + (F.x - P) * k, oy + (F.y - P) * k, (F.w + 2 * P) * k, (F.h + 2 * P) * k)
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
      }
      // بدنه‌ی شعله: نوار به نوار با تابِ باد
      const hot = Math.pow(1 - gs, 1.4)
      const strip = 4
      const nz = (yl) => Math.sin(0.022 * yl + 9 * t) + 0.6 * Math.sin(0.051 * yl - 13 * t + 1.3) + 0.35 * Math.sin(0.093 * yl + 19 * t + 2.1)
      const passes = [[F.img, 1]]
      if (hot > 0.02) passes.push([F.hotImg, hot * 0.75])
      const still = wob < 0.001 && wind < 0.001 && gs > 0.999 // در حالت ثابت، شعله یک‌تکه کشیده می‌شود (بدون درز)
      for (const [img, al] of passes) {
        ctx.globalAlpha = al
        if (still) {
          ctx.drawImage(img, ox + F.x * k, oy + F.y * k, F.w * k, F.h * k)
          continue
        }
        for (let y = 0; y < F.h; y += strip) {
          const sh = Math.min(strip, F.h - y)
          const yl = F.y + y + sh / 2
          const rows = clamp((fb - yl) / (fb - ftop), 0, 1.15)
          const dx = (22 * Math.pow(1 - gs, 0.8) + 9 * wob) * nz(yl) * Math.pow(rows, 1.3) + 30 * wind * Math.pow(rows, 1.4)
          ctx.drawImage(img, 0, y, F.w, sh, ox + (F.x + dx) * k, oy + (F.y + y) * k, F.w * k, (sh + 0.35) * k)
        }
      }
      ctx.globalAlpha = 1
      ctx.restore()
      // شعله‌ی آبی‌رنگِ فندک در ابتدا
      if (g < 0.35) {
        const bb = 1 - g / 0.35
        const R = 24 * dpr
        const gr = ctx.createRadialGradient(bx, by - 8 * dpr, 0, bx, by - 8 * dpr, R * 1.8)
        gr.addColorStop(0, 'rgba(120,170,255,' + 0.85 * bb + ')')
        gr.addColorStop(1, 'rgba(60,110,255,0)')
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = gr
        ctx.fillRect(bx - R * 2, by - R * 3, R * 4, R * 4)
        ctx.globalCompositeOperation = 'source-over'
      }
      // جرقه‌های بالا‌رونده
      ctx.globalCompositeOperation = 'lighter'
      for (const e of emb) {
        const u = t - (T.fire0 + 0.1 + e.t0)
        if (u < 0 || u > e.life) continue
        const x = bx + (e.x0 + e.vx * u + 18 * Math.sin(5 * u + e.ph)) * dpr
        const y = by - 30 * dpr - e.vy * u * dpr
        ctx.globalAlpha = Math.pow(1 - u / e.life, 1.2) * Math.min(1, gg * 3) * (1 - ss(t, T.hold - 0.6, T.hold))
        ctx.fillStyle = 'rgb(255,170,60)'
        ctx.beginPath()
        ctx.arc(x, y, e.rad * dpr, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    /* ───── باد خنک ───── */
    const wind = (() => {
      const r = rng(21)
      const a = []
      for (let i = 0; i < 44; i++)
        a.push({ y: 0.16 + 0.68 * r(), len: 0.1 + 0.26 * r(), sp: 0.55 + 0.7 * r(), t0: T.wind0 + r() * 1.9, life: 1.5 + r() * 0.9, th: 0.8 + r() * 1.5, al: 0.1 + 0.3 * r(), amp: r() * 0.012, fq: 4 + r() * 5 })
      return a
    })()
    const dust = (() => {
      const r = rng(5)
      const a = []
      for (let i = 0; i < 90; i++)
        a.push({ y: r(), x: r(), sp: 0.25 + 0.9 * r(), rad: 0.6 + r() * 1.4, al: 0.15 + r() * 0.4, ph: r() * 6 })
      return a
    })()
    function drawWind(t) {
      const wi = windI(t)
      if (wi <= 0.005) return
      ctx.globalCompositeOperation = 'lighter'
      // مه‌ی سرد که از چپ به راست می‌گذرد
      const fx = lerp(-0.25 * W, 1.25 * W, ss(t, T.wind0, T.wind1 - 0.4))
      const bw = W * 0.42
      const hg = ctx.createLinearGradient(fx - bw, 0, fx + bw, 0)
      hg.addColorStop(0, 'rgba(110,180,255,0)')
      hg.addColorStop(0.5, 'rgba(130,200,255,' + 0.075 * wi + ')')
      hg.addColorStop(1, 'rgba(110,180,255,0)')
      ctx.fillStyle = hg
      ctx.fillRect(0, 0, W, H)
      // رگه‌های باد
      ctx.lineCap = 'round'
      for (const s of wind) {
        const u = t - s.t0
        if (u < 0 || u > s.life) continue
        const len = s.len * W
        const x = -len + s.sp * W * u * 0.9
        const y = s.y * H
        const env = Math.sin((Math.PI * u) / s.life) * wi
        const g = ctx.createLinearGradient(x, 0, x + len, 0)
        g.addColorStop(0, 'rgba(170,220,255,0)')
        g.addColorStop(0.7, 'rgba(190,230,255,' + s.al * env + ')')
        g.addColorStop(1, 'rgba(255,255,255,' + s.al * env * 0.8 + ')')
        ctx.strokeStyle = g
        ctx.lineWidth = s.th * dpr
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.bezierCurveTo(x + len * 0.33, y - s.amp * H * Math.sin(u * s.fq), x + len * 0.66, y + s.amp * H * Math.sin(u * s.fq + 1.2), x + len, y)
        ctx.stroke()
      }
      // ذرات ریز همراه باد
      ctx.fillStyle = 'rgb(190,225,255)'
      for (const d of dust) {
        const x = (((d.x + d.sp * (t - T.wind0) * 0.55) % 1.3) - 0.15) * W
        const y = (d.y + 0.015 * Math.sin(t * 2 + d.ph)) * H
        ctx.globalAlpha = d.al * wi * 0.8
        ctx.beginPath()
        ctx.arc(x, y, d.rad * dpr, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    /* ───── ظهور «دایان» از چپ به راست با باد ───── */
    const gR = rng(8)
    const gJit = [0, 1, 2, 3].map(() => ({ dy: (gR() - 0.5) * 2, rot: (gR() - 0.5) * 2 }))
    function drawGroupAt(L, cx, cy, baseY, sk, rot, alpha, img) {
      if (alpha <= 0.002) return
      ctx.save()
      ctx.globalAlpha = Math.min(1, alpha)
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      ctx.transform(1, 0, -sk, 1, sk * (baseY - cy), 0)
      ctx.drawImage(img, (-L.w * k) / 2, (-L.h * k) / 2, L.w * k, L.h * k)
      ctx.restore()
      ctx.globalAlpha = 1
    }
    function drawType(t) {
      META.groups.forEach((name, gi) => {
        const L = LAY[name]
        const p = (t - T.type[gi]) / T.typeDur
        if (p <= 0) return
        const e = eo(Math.min(p, 1))
        const inv = 1 - e
        const cx = ox + (L.x + L.w / 2) * k
        const cy = oy + (L.y + L.h / 2) * k
        const baseY = oy + (L.y + L.h) * k
        const dist = META.W * k * (0.2 + 0.03 * gi)
        const sk = inv * 0.42
        const rot = gJit[gi].rot * inv * 0.16
        const jy = gJit[gi].dy * inv * H * 0.05
        const a = ss(p, 0, 0.35)
        // سایه‌های حرکتی سرد پشت حرف (جهت باد)
        if (inv > 0.03) {
          ctx.globalCompositeOperation = 'lighter'
          for (let j = 6; j >= 1; j--) {
            const f = j / 6
            drawGroupAt(L, cx - dist * inv - f * dist * 0.28 * inv, cy + jy, baseY + jy, sk, rot, 0.16 * Math.pow(1 - f, 1.3) * a * inv * 2, L.frost)
          }
          ctx.globalCompositeOperation = 'source-over'
        }
        drawGroupAt(L, cx - dist * inv, cy + jy, baseY + jy, sk, rot, a, L.img)
      })
      // نقطه‌های «ی»
      const yp = T.type[1] + T.typeDur * 0.78
      ;['dot1', 'dot2'].forEach((nm, i) => {
        const L = LAY[nm]
        if (!L) return
        const p = (t - (yp + i * 0.13)) / 0.4
        if (p <= 0) return
        const s = Math.max(0.0001, elastic(p))
        const cx = ox + (L.x + L.w / 2) * k
        const cy = oy + (L.y + L.h / 2) * k
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(s, s)
        ctx.globalAlpha = Math.min(1, p * 4)
        ctx.drawImage(L.img, (-L.w * k) / 2, (-L.h * k) / 2, L.w * k, L.h * k)
        ctx.restore()
        ctx.globalAlpha = 1
      })
    }

    /* ───── ذرات ───── */
    function buildParticles() {
      const lw = Math.ceil(META.W * k)
      const lh = Math.ceil(META.H * k)
      const oc = mk(lw, lh)
      const o = oc.getContext('2d')
      const put = (n) => {
        const L = LAY[n]
        if (L) o.drawImage(L.img, L.x * k, L.y * k, L.w * k, L.h * k)
      }
      META.groups.forEach(put)
      put('dot1')
      put('dot2')
      put('flame')
      put('drop')
      const data = o.getImageData(0, 0, lw, lh).data
      let cnt = 0
      for (let y = 0; y < lh; y += 2) for (let x = 0; x < lw; x += 2) if (data[(y * lw + x) * 4 + 3] > 70) cnt++
      const area = cnt * 4
      const mobile = W * H < 700000 || innerWidth < 700
      const target = mobile ? CFG.particles.mobile : CFG.particles.desktop
      const stride = Math.max((1.6 * dpr) / (dpr > 1 ? 1 : 1), Math.sqrt(area / target))
      const r = rng(1234)
      const P = []
      const cxm = lw / 2
      const cym = lh / 2
      const VP = Math.max(W, H)
      const buckets = new Map()
      for (let y = 0; y < lh; y += stride)
        for (let x = 0; x < lw; x += stride) {
          const ix = (Math.round(y) * lw + Math.round(x)) * 4
          if (data[ix + 3] <= 70) continue
          const key = ((data[ix] >> 4) << 8) | ((data[ix + 1] >> 4) << 4) | (data[ix + 2] >> 4)
          const px = ox + x
          const py = oy + y
          const rx = (x - cxm) / lw
          const ry = (y - cym) / lh
          const rl = Math.hypot(rx, ry) || 1
          const wdx = 1
          const wdy = -0.18
          const rn1 = r() * 2 - 1
          const rn2 = r() * 2 - 1
          let vx = 0.55 * wdx + (0.55 * rx) / rl + 0.95 * rn1
          let vy = 0.55 * wdy + (0.55 * ry) / rl + 0.95 * rn2
          const vl = Math.hypot(vx, vy) || 1
          const sp = (0.18 + r() * 1.25) * VP / 2.2
          P.push({ x: px, y: py, vx: (vx / vl) * sp, vy: (vy / vl) * sp, d: (x / lw) * 0.95 + r() * 0.3, life: 1.7 + r() * 1.0, ph: r() * 6.28, s0: stride * 1.04, s1: (0.8 + r() * 1.6) * dpr, key, perp: (r() - 0.5) * 2 })
          if (!buckets.has(key)) buckets.set(key, [])
          buckets.get(key).push(P.length - 1)
        }
      const groups = []
      for (const [key, idx] of buckets) {
        const rr = ((key >> 8) & 15) * 17
        const gg = ((key >> 4) & 15) * 17
        const bb = (key & 15) * 17
        const cr = Math.min(255, rr + 8)
        const cg = Math.min(255, gg + 8)
        const cb = Math.min(255, bb + 8)
        const cool = cb > cr
        const tr = cool ? 140 : 255
        const tg = cool ? 200 : 230
        const tb = cool ? 255 : 170
        const mx = cool ? 0.62 : 0.18
        const L = (a, b) => Math.round(a + (b - a) * mx)
        groups.push({ fill: 'rgb(' + cr + ',' + cg + ',' + cb + ')', fillFree: 'rgb(' + L(cr, tr) + ',' + L(cg, tg) + ',' + L(cb, tb) + ')', idx })
      }
      particles = { P, groups }
    }
    function drawParticles(t) {
      if (!particles) buildParticles()
      const { P, groups } = particles
      const u0 = t - T.diss0
      for (const g of groups) {
        ctx.fillStyle = g.fill
        ctx.beginPath()
        const free = new Path2D()
        let nFree = 0
        for (const i of g.idx) {
          const p = P[i]
          const u = u0 - p.d
          let x = p.x
          let y = p.y
          let s = p.s0
          if (u > 0) {
            const dsp = u * (0.25 + 0.75 * ss(u, 0, 0.9))
            const turb = Math.sin(u * 4 + p.ph) * 16 * dpr * ss(u, 0, 0.6) * p.perp
            x += p.vx * dsp + turb * 0.4
            y += p.vy * dsp + turb
            s = lerp(p.s0, p.s1, ss(u, 0, 0.3)) * (1 - ss(u, p.life - 0.9, p.life))
            if (s >= 0.25) {
              free.rect(x - s / 2, y - s / 2, s, s)
              nFree++
            }
            continue
          }
          ctx.rect(x - s / 2, y - s / 2, s, s)
        }
        ctx.fill()
        if (nFree) {
          ctx.fillStyle = g.fillFree
          ctx.fill(free)
        }
      }
    }

    /* ───── فریم ───── */
    function frame(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.clearRect(0, 0, W, H)
      drawBG(1 - ss(t, T.ov0, T.ov1))
      if (t < T.diss0) {
        const z = 1 + 0.05 * (1 - eio(t / T.hold))
        ctx.save()
        ctx.translate(W / 2, H / 2)
        ctx.scale(z, z)
        ctx.translate(-W / 2, -H / 2)
        drawSea(t)
        drawType(t)
        drawDrop(t)
        drawFlame(t)
        drawSpark(t)
        drawWind(t)
        ctx.restore()
      } else drawParticles(t)
      // لودینگ فقط پس از رسم اولین فریم برداشته می‌شود (بدون لحظه‌ی خالی/فلش)
      if (root.classList.contains('is-loading')) root.classList.remove('is-loading')
    }

    /* ───── اجرا ───── */
    let t0 = null
    let rafId = 0
    let skipAt = null
    let finished = false
    let cancelled = false
    function finish() {
      if (finished) return
      finished = true
      cancelAnimationFrame(rafId)
      root.style.display = 'none'
      html.classList.remove('dian-intro-playing')
      html.classList.add('dian-intro-done')
      if (CFG.once) {
        try {
          sessionStorage.setItem('dian-intro-seen', '1')
        } catch {
          /* حالت خصوصی مرورگر */
        }
      }
      window.dispatchEvent(new CustomEvent('dian-intro:done'))
      setGone(true)
    }
    function tick(now) {
      if (cancelled) return
      if (t0 === null) t0 = now
      let t = ((now - t0) / 1000) * CFG.speed
      if (skipAt !== null) {
        // پرش: محو سریع
        const q = (now - skipAt) / 450
        root.style.opacity = String(1 - clamp(q))
        if (q >= 1) {
          finish()
          return
        }
        t = Math.min(t, T.diss0 - 0.01)
      } else if (t >= T.end) {
        frame(T.end)
        finish()
        return
      }
      if (t > 0.8) skipBtn.classList.add('show')
      frame(t)
      rafId = requestAnimationFrame(tick)
    }
    function skip() {
      if (skipAt === null && !finished) skipAt = performance.now()
    }

    async function start() {
      const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
      let seen = false
      try {
        seen = CFG.once && sessionStorage.getItem('dian-intro-seen')
      } catch {
        /* حالت خصوصی مرورگر */
      }
      if (reduce || seen) {
        finish()
        return
      }
      let SRC
      try {
        SRC = await loadAll()
      } catch (err) {
        if (!cancelled) {
          console.warn('[DianIntro]', err)
          finish()
        }
        return
      }
      // در StrictMode (یا unmount) اجرای قبلی نباید ادامه پیدا کند
      if (cancelled || finished) return
      for (const name of Object.keys(SRC)) {
        const m = SRC[name]
        const img = IMG[name]
        LAY[name] = { img, x: m.x, y: m.y, w: m.w, h: m.h }
      }
      const fl = LAY.flame
      fl.hotImg = tint(fl.img, [255, 226, 140])
      fl.glowP = 70
      fl.glow = glowSprite(fl.img, fl.glowP, 10, true)
      const dr = LAY.drop
      dr.glowP = 60
      dr.glow = glowSprite(tint(dr.img, [30, 150, 255]), dr.glowP, 9, true)
      META.groups.forEach((n) => {
        LAY[n].frost = tint(LAY[n].img, [110, 175, 240])
      })
      CFG.bg = html.classList.contains('dark') ? CFG.bgDark : CFG.bgLight
      layout()
      addEventListener('resize', layout)
      if (CFG.allowSkip) {
        root.addEventListener('click', skip)
        skipBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          skip()
        })
        addEventListener('keydown', onKey)
      } else {
        skipBtn.remove()
      }
      // حالت آزمایشی: #t=5.4 یک فریم ثابت نشان می‌دهد
      const m = /[#&?]t=([\d.]+)/.exec(location.hash + location.search)
      window.DIAN_INTRO = {
        seek(t) {
          cancelAnimationFrame(rafId)
          layout()
          frame(t)
        },
        skip,
        T,
        replay() {
          location.reload()
        },
      }
      if (m) {
        window.DIAN_INTRO.seek(parseFloat(m[1]))
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    function onKey(e) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') skip()
    }

    html.classList.add('dian-intro-playing')
    start()

    return () => {
      cancelled = true
      finished = true
      cancelAnimationFrame(rafId)
      removeEventListener('resize', layout)
      removeEventListener('keydown', onKey)
      delete window.DIAN_INTRO
    }
  }, [])

  if (gone) return null
  return (
    <div id="dian-intro" ref={rootRef} className="is-loading" role="presentation">
      <canvas aria-hidden="true" />
      {/* لودینگ تا آماده‌شدن لایه‌های انیمیشن؛ با شروع اینترو حذف می‌شود */}
      <div className="intro-loader" role="status" aria-live="polite">
        <span className="intro-loader__ring" aria-hidden="true" />
        <span className="intro-loader__label">در حال آماده‌سازی…</span>
      </div>
      <button type="button" className="skip">
        رد کردن
      </button>
    </div>
  )
}
