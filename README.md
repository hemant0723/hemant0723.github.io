# Hemant Verma — Academic Website

Personal academic website for **Hemant Verma**, Ph.D. candidate in Computational Semiconductor
Physics (National Taiwan University · Academia Sinica). First-principles DFT, electron–phonon
coupling, and NEGF quantum transport for 2D semiconductor devices.

🔗 **Live:** https://hemant0723.github.io/academic-website/

## Features

- Single-page responsive site with **dark / light theme** (remembers preference, respects system setting)
- Scroll-progress bar, scroll-spy navigation, and reveal-on-scroll animations
- Animated stats, **News & Highlights** feed, and a **typed** hero headline
- **Filterable publications** with one-click **BibTeX copy** on each paper
- **Software & Tools** showcase, timeline-style CV, and a Formspree-ready **contact form**
- SEO: JSON-LD structured data (`Person` + `ScholarlyArticle`), Open Graph / Twitter cards,
  `sitemap.xml`, `robots.txt`, and a custom `404.html`
- Accessibility: keyboard focus rings, `prefers-reduced-motion` support, semantic markup

## Tech stack

Plain **HTML + CSS + JavaScript** — no build step, no framework. Fonts (Inter, Sora) and icons
(Font Awesome) load from CDNs.

## Project structure

```
index.html              Main single-page site
404.html                Branded not-found page
robots.txt / sitemap.xml  SEO
css/style.css           Design system (light + dark themes)
js/main.js              Theme, scroll-spy, reveal, filter, cite, count-up, contact form
assets/
  cv.pdf                CV download (served by the CV header button)
  og-card.svg           Branded social-share card (export to PNG — see below)
  images/               Hero background
  photos/profile.jpg    Profile photo (add this file)
tutorials/              Tutorial article pages (Python, MATLAB, SciPy)
```

## Local preview

It's a static site, so just open `index.html` in any browser (works over `file://`).
Optionally serve it: `python -m http.server` or `npx serve`, then visit the printed URL.

## Updating content

- **Publications** — edit the `.pub-year-group` blocks in `index.html`; update each paper's hidden
  `<pre class="bibtex">` so the copy button stays accurate.
- **CV PDF** — replace `assets/cv.pdf` with a new export to update the "Download CV" button
  in the CV header.
- **Profile photo** — add `assets/photos/profile.jpg` (square works best); it appears automatically.
- **Contact form** — create a free form at [Formspree](https://formspree.io), then replace
  `YOUR_FORM_ID` in the `<form action="…">` in `index.html`.
- **Analytics (optional)** — uncomment the GoatCounter or Plausible snippet near the bottom of
  `index.html` and add your account code/domain.
- **Social share image** — open `assets/og-card.svg`, export it to a 1200×630 PNG
  (`assets/og-image.png`), and point the `og:image` / `twitter:image` meta tags at it.

## Deployment

Hosted on **GitHub Pages** from the repository root. Push to the default branch and the live site
updates automatically.
