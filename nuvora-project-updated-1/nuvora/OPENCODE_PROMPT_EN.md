# Master Prompt for OpenCode — "Dian" Logo Intro

> Give OpenCode the file `dian-intro.html` together with this prompt (place it inside the project folder).

---

## Prompt (copy this)

You are a senior front-end engineer. The file `dian-intro.html` in the project root is a complete intro animation for the "Dian" logo, written with Canvas 2D and zero dependencies. Your job is to **recreate this exact animation** inside this project's real website as the opening hero intro, which plays first and then reveals the site.

### Hard rules (do not change)
1. **Do not redraw or redesign the logo.** The layer images (`flame`, `drop`, `ring`, `ya`, `alef`, `dal`, `dot1`, `dot2`) are embedded as base64 in the `ASSETS` variable inside the file. Extract them into separate PNG files (e.g. `public/dian-intro/*.png`) and use them together with `meta` (JSON). The logo must stay pixel-identical to the reference file.
2. **Keep the timing and rendering logic.** Every frame is a pure function of time `t` (`frame(t)`). Do not change the timing constants in `T` unless I ask.
3. The site content must stay hidden until the intro finishes, then appear with an entrance animation.

### Animation storyboard (to make sure it is recreated correctly)
1. **Sea → droplet (0 to 3.8 s):** A wavy sea (3 blue layers with a foamy edge) rises first. Then the whole sea gathers itself and turns into the logo's droplet. The droplet must not pop out of the middle of the sea; the sea itself becomes the droplet. Small satellite droplets merge into it. The main logo droplet settles into its final position with a slight squash-and-stretch bounce.
2. **Spark and fire (3.5 to 6 s):** A lighter-style spark, a small blue flame, then the flame grows from its base with natural flicker and glow. It starts hot yellow and settles into the logo's own colors, with embers rising.
3. **"Dian" reveal with a cool wind (5.3 to 8.1 s):** The letters arrive **left to right**, one after another. Each letter starts skewed, rotated, slightly offset up or down, and trailed by a cold motion ghost from the left. The wind pulls it together and it settles precisely into its final place, tidy and aligned. At the same time, wind streaks, a cold haze and tiny dust specks sweep left to right, and the flame leans slightly to the right. The dots of the "ی" pop in last.
4. **Short pause (8.3 to 9.3 s):** The complete logo is static, with no glow.
5. **Particles (9.3 to about 12 s):** The logo turns into very fine particles (about 26,000 on desktop, 9,000 on mobile). A wave sweeps across from the left, the wind carries the particles across the entire page, and they fade out. From 10.6 s the intro's background fades too, so the site shows through.

### What to do
- Implement the intro as a standalone component/module in the project's current framework (Next.js/React: a Client Component using `useEffect`, with no SSR for the canvas; for Vue/Nuxt, Astro or plain HTML, follow that stack). Use a full-screen `div` (`position: fixed; inset: 0;` with a high `z-index`) containing a `canvas`.
- At start, put the class `dian-intro-playing` on `<html>` (scroll locked, site content `visibility: hidden`). At the end remove it, add the class `dian-intro-done`, and dispatch a `dian-intro:done` event on `window`. Hook the hero entrance animations and the rest of the site to that class/event.
- Keep these features: a "Skip" button, plus click / `Esc` / `Space` to skip (quick 0.45 s fade-out); respect `prefers-reduced-motion` (no intro); a `once` option to play only once per session (off by default); and window resize handling.
- Test on desktop and on a narrow mobile viewport. Performance target: 60 fps, with `devicePixelRatio` capped at 2.
- Keep the debug hook: `window.DIAN_INTRO.seek(t)` draws a still frame at time `t`, and the URL `#t=5.4` does the same.
- Do not touch the site's real content; only mount the intro in front of it. Match the intro's background color (`CFG.bg`) to the site's background color so there is no visible jump when it fades out.

### Acceptance criteria
- The final logo frame (around 8.5 s) is identical to the reference file.
- The stages run in the order of the storyboard above, and after the intro the site appears without any jump.
- No console errors.
- At the end, give a short summary of the files you created or changed.
