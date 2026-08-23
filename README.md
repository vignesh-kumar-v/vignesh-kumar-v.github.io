# vignesh-kumar-v.github.io

Personal portfolio of **Vigneshkumar Venugopal** — ML systems engineer, MS Data Science @ Arizona State University.

A hand-written static site. No framework, no bundler, no `node_modules`. Three files do the work:

```
index.html              all content, semantic and crawlable
assets/css/style.css    design system + responsive layout
assets/js/main.js       canvas, palette, filters, theme
```

## Features

- **Animated neural canvas** in the hero — nodes drift, link within a radius and lean gently toward the cursor. Disabled entirely under `prefers-reduced-motion`.
- **⌘K / Ctrl+K command palette** — fuzzy jump to any section, project, paper or link. Full keyboard control (↑ ↓ ⏎ Esc).
- **Filterable project grid** — 10 projects tagged by Systems / LLM / Agentic / MLOps / Vision.
- **Light + dark themes** — follows the OS by default, remembers a manual override in `localStorage`.
- **Scroll-spy nav**, reading-progress bar, scroll-reveal animations, copy-to-clipboard email.
- Fully responsive, accessible (skip link, focus rings, ARIA states), and print-friendly.
- SEO: Open Graph tags, canonical URL, `sitemap.xml`, `robots.txt`, custom `404.html`.

## Deploying to GitHub Pages

Create a repository named exactly `vignesh-kumar-v.github.io` on your account, then:

```bash
cd portfolio
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/vignesh-kumar-v/vignesh-kumar-v.github.io.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.

The site goes live at **https://vignesh-kumar-v.github.io** within a minute or two.
`.nojekyll` is already committed so GitHub serves the files as-is.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Things to update

- **Résumé** — `assets/Vigneshkumar-Venugopal-Resume.pdf`, linked from the hero and contact section.
  Replace the file in place when you update it; the filename stays the same so no HTML changes needed.
- **Social preview card** — `assets/img/og.png` (1200×630) is what LinkedIn, Slack, X and iMessage show
  when the link is shared. It's generated from `assets/img/og-source.html`; edit that file and re-run:

  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
    --window-size=1200,630 --hide-scrollbars --virtual-time-budget=6000 \
    --screenshot="$PWD/assets/img/og.png" "file://$PWD/assets/img/og-source.html"
  ```

  Social platforms cache these aggressively — after changing it, re-scrape via
  [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and
  [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).
- **Custom domain** — add a `CNAME` file containing your domain, then point a `CNAME` DNS record at
  `vignesh-kumar-v.github.io`.
- **New projects** — copy any `<article class="proj">` block, update the `data-tags` attribute, and bump
  the count in the matching `.filter` button. Add a matching entry to `COMMANDS` in `main.js` so it
  shows up in the palette.

---

MIT licensed. Content © Vigneshkumar Venugopal.
