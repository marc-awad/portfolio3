# Marc Awad — Portfolio

> Personal portfolio of Marc Awad, Full-Stack Developer.
> Live: **[marcawad.vercel.app](https://marcawad.vercel.app/)** · Bilingual EN/FR · Hand-coded.

A **minimalist, black-and-white** portfolio built entirely with vanilla HTML/CSS/JS — no React, no frameworks, no build step beyond a tiny Node script. Showcases my projects, skills, certifications, and experience.

---

## ✨ Highlights

- **Performance**: ~90 Lighthouse mobile, **A+** on [securityheaders.com](https://securityheaders.com)
- **SEO**: Schema.org JSON-LD enriched (`Person`, `ProfilePage`, `ItemList`, `EducationalOccupationalCredential`, `Occupation`, `Language`, `EducationalOrganization`); full Open Graph (incl. `image:width/height/alt`)
- **Accessibility**: ARIA roles, semantic HTML, skip-to-content link, `prefers-reduced-motion` support, focus-managed carousel (`inert` on off-screen slides), `aria-current` on active language, no `user-scalable=no`
- **Security**: strict CSP with **no `unsafe-inline` at all** (`script-src 'self'`, `style-src 'self'`), Permissions-Policy disabling 12 features
- **Bilingual**: parallel EN/FR pages with `hreflang` SEO
- **Zero third-party requests**: fonts self-hosted, no jQuery/Font Awesome/analytics — the only external call is the Formspree POST on form submit
- **CI**: GitHub Actions validates HTML markup and checks every link/asset on each push

---

## 🧠 Tech decisions (why this stack)

### Why vanilla JS over React/Vue?
A portfolio is a **read-mostly site with a few interactive bits** (carousel, form, navigation). Adding React would mean:
- 40+ KB of framework JS on a 16 KB total budget
- A build step and hot-reload tooling for ~5 components
- Loss of direct HTML/CSS control

Vanilla JS (5 files, **16 KB total**) lets me hand-tune every interaction without abstraction overhead. The carousel state machine, the form spinner, the article navigation — they're all simpler in vanilla.

### Why WebP for all images?
Converted every JPG to WebP via [`scripts/optimize-images.mjs`](scripts/optimize-images.mjs) (sharp, quality 75, max width 1920). Result: **13 MB → 720 KB total** (-95%). Browser support is at 97%+ in 2026.

### Why inline SVG for icons (no Font Awesome)?
Font Awesome was loading **~76 KB of CSS + 4 woff2 font files** to render **10 icons**. Inline SVG = **~3 KB total**, zero render-blocking requests, no third-party dependency. Win-win-win.

### Why self-host the fonts (no Google Fonts CDN)?
Source Sans Pro is downloaded once via [`scripts/fetch-fonts.mjs`](scripts/fetch-fonts.mjs) (latin + latin-ext subsets, 4 styles, `woff2`) and served from `/assets/webfonts/`. This removes the render-blocking Google stylesheet **and** the two `preconnect` requests, drops the last non-Formspree third party (privacy win — no IP leak to Google), and lets the CSP tighten to `style-src 'self'` / `font-src 'self'` with **zero `unsafe-inline`**. The two primary weights are `<link rel="preload">`-ed; the rest load on demand via `unicode-range`.

### Why no analytics?
Privacy by default. The contact form goes through Formspree (only third party), and I don't need to know visitor counts to ship the site.

### Why two separate HTML files (EN + FR) instead of i18n?
For 2 pages, a templating engine is over-engineering. The duplication is **manageable manually**, with a discipline of always editing both. Migration to Astro is on the table if I ever add a third language or more pages.

### Why Vercel?
Free tier, fast CDN, automatic deploys from Git, easy custom headers in `vercel.json`. Also, the [`update-sitemap.mjs`](scripts/update-sitemap.mjs) build script automatically refreshes the sitemap `<lastmod>` and the footer year on every deploy — zero manual maintenance.

---

## 📦 Project structure

```
├── index.html           EN portfolio page
├── fr.html              FR portfolio page (parallel content)
├── 404.html             Custom 404 page (styles live in main.css, no inline <style>)
├── sitemap.xml          Auto-updated by build script
├── robots.txt
├── vercel.json          Headers (CSP, Permissions-Policy, cache), build config
├── .htmlvalidate.json   html-validate config (used by CI)
├── .github/workflows/
│   └── ci.yml           HTML validation + link/asset check on every push
├── assets/
│   ├── css/main.css     Hand-trimmed; includes self-hosted @font-face + a11y rules
│   ├── js/
│   │   ├── main.js      Article navigation + header
│   │   ├── util.js      Carousel logic (inert/aria on inactive slides)
│   │   ├── contact.js   Form submission with bilingual messages
│   │   ├── breakpoints.min.js
│   │   └── browser.min.js
│   ├── webfonts/        Self-hosted Source Sans Pro woff2 (latin + latin-ext)
│   └── sass/            Source SASS (kept for future iterations)
├── images/              WebP previews, hero pics, OG card (1200×630)
├── files/               CV PDFs (EN + FR)
└── scripts/
    ├── update-sitemap.mjs   Runs at Vercel build: updates sitemap dates + footer year
    ├── optimize-images.mjs  One-shot JPG→WebP converter
    ├── fetch-fonts.mjs      One-shot Google-Fonts → self-hosted woff2 downloader
    └── trim-css.mjs         One-shot CSS dead-code remover
```

---

## 🚀 Local development

```bash
# Just serve the static files
python -m http.server 8765
# Then open http://127.0.0.1:8765/
```

No npm install, no bundler, no hot-reload. Just edit and refresh.

---

## 📬 Contact

- **Email:** awad.marc@outlook.com
- **LinkedIn:** [https://www.linkedin.com/in/marc-awad](https://www.linkedin.com/in/marc-awad)
- **GitHub:** [https://github.com/marc-awad](https://github.com/marc-awad)

---

## 📜 License

Based on the [Dimension](https://html5up.net/dimension) template by [@ajlkn](https://html5up.net/) under [CCA 3.0](https://html5up.net/license). Custom content, code refactoring, and additions are mine.
