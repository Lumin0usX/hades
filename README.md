# HADES &middot; Lord of the Underworld

A dark, museum-grade web exhibit on Hades &mdash; eldest son of Cronus, ruler of the realm beneath the earth. Seven chapters: **Threshold &middot; Origin &middot; Major Myths &middot; Symbols &middot; Family &middot; Modern Legacy &middot; Sources**, with primary-source citations throughout.

Opens with a cinematic two-credit splash sequence (warm-ember atmosphere, canvas-rendered embers, breathing vignette) and reveals into an editorial site styled in black, antique gold, and ember orange.

---

## Stack

Pure static **HTML / CSS / JavaScript** &mdash; no build step, no dependencies, no framework.

- `index.html` &mdash; splash + seven sections
- `styles.css` &mdash; full stylesheet (sectioned and commented)
- `main.js` &mdash; splash sequence, scroll reveals, scrollspy, smooth nav
- `favicon.svg` &mdash; tiny gold H mark
- `.nojekyll` &mdash; tells GitHub Pages to serve files as-is

Why static: the site is a self-contained exhibit. Static deploy is instant, cache-friendly, has the smallest possible first paint, and works identically on GitHub Pages, Vercel, Netlify, or any plain HTTP server.

---

## Run locally

The site uses ES module-friendly relative paths, fetches Google Fonts over the network, and otherwise has zero runtime dependencies. Pick whichever local-server option you have:

### Easiest &mdash; just open the file

Double-click `index.html`. Modern browsers will render it from `file://`.
Caveat: some browsers throttle `file://` for security, so prefer a local server when developing.

### Python (any version &gt;= 3)

```bash
cd hades-splash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

### Node (no install needed)

```bash
cd hades-splash
npx serve .
```

### VS Code

Install the **Live Server** extension, right-click `index.html`, **Open with Live Server**.

---

## Deploy

### GitHub Pages

1. Create a new GitHub repo (e.g. `hades`) and push these files to the `main` branch.
   ```bash
   cd hades-splash
   git init
   git add .
   git commit -m "Initial: cinematic Hades exhibit"
   git branch -M main
   git remote add origin https://github.com/<you>/hades.git
   git push -u origin main
   ```
2. On GitHub: **Settings &rarr; Pages**.
3. Under **Build and deployment &rarr; Source**, pick **Deploy from a branch**.
4. Branch: `main`, folder: `/ (root)`. Save.
5. Wait ~1 minute. Your site is at `https://<you>.github.io/hades/`.

The included `.nojekyll` file tells Pages to skip Jekyll processing and serve every file verbatim.

### Vercel

1. Push the repo to GitHub (as above).
2. Visit <https://vercel.com/new>, import the repo, click **Deploy**.
3. Vercel auto-detects static sites &mdash; no settings to change.
4. You get a `https://<project>.vercel.app` URL on the spot.

To deploy without GitHub:

```bash
npm i -g vercel
cd hades-splash
vercel
```

### Netlify

Drag-and-drop the `hades-splash` folder onto <https://app.netlify.com/drop>. Done in seconds.

Or via CLI:
```bash
npm i -g netlify-cli
cd hades-splash
netlify deploy --prod --dir .
```

---

## Customization notes

### Splash sequence timing

In `main.js`:

```js
const T_START_1 = 400;                   // initial black pause
const T_START_2 = T_START_1 + 4000 + 400; // 4800ms
const T_DISMISS = T_START_2 + 4000;       // 8800ms
```

Each credit's full animation runs 4000ms (1.2s fade-in / 1.6s hold with 1.0&rarr;1.03 scale drift / 1.2s fade-out), defined by the `@keyframes revealCredit` rule in `styles.css`.

### Adding real artwork

Each image slot in `index.html` is a `<figure class="plate">` placeholder, marked with an HTML comment naming the intended artwork, artist, date, and holding museum. To replace a placeholder with a real image:

```html
<!-- BEFORE: placeholder -->
<figure class="plate plate--portrait">
  <div class="plate__frame">
    <div class="plate__label">
      <span class="plate__kicker">Plate I</span>
      <span class="plate__title">Saturn Devouring His Son</span>
      ...
    </div>
  </div>
  <figcaption class="plate__caption">...</figcaption>
</figure>

<!-- AFTER: real image -->
<figure class="plate plate--portrait">
  <img src="./images/goya-saturn.jpg"
       alt="Saturn Devouring His Son by Francisco de Goya, 1819–1823"
       loading="lazy">
  <figcaption class="plate__caption">
    Goya, <em>Saturn Devouring His Son</em>, 1819&ndash;1823 &middot; Museo del Prado &middot; Public Domain
  </figcaption>
</figure>
```

Recommended public-domain sources:

- **Wikimedia Commons** &mdash; classical paintings, Greek vases, Renaissance engravings.
- **The Metropolitan Museum of Art Open Access** &mdash; download CC0 images of Greek pottery, sculpture, and European paintings of mythological subjects.
- **NASA Image and Video Library** &mdash; Pluto and New Horizons imagery, always public domain.

The styled placeholder is intentional: even unfilled, it reads as an exhibit catalog awaiting plates, on-theme with the museum aesthetic.

### Color palette

Defined as CSS variables in `:root`:

```css
--ink:       #050302;   /* base black */
--gold:      #c9a227;   /* antique gold */
--gold-warm: #d4af37;
--ember:     #CC785C;   /* warm orange, continues from splash */
--ember-soft:#D4A27F;
--bone:      #f4ebe1;   /* warm off-white body text */
```

Adjust those and the rest of the site re-tunes accordingly.

---

## Accessibility

- Visible keyboard focus rings (ember orange) on every interactive element.
- Skip-to-content link revealed on first Tab.
- All animations and the splash sequence respect `prefers-reduced-motion: reduce` (the splash is removed entirely and reveals are shown without translation).
- Semantic landmarks: `<main>`, `<nav>`, `<header>`, `<section>`, `<article>`, `<footer>`.
- Body type contrast checked at AA against the near-black background.
- Side nav collapses into a compact bottom bar on tablet and mobile.

---

## Mythological accuracy

Content is cross-referenced against primary sources: Homer's *Iliad*, Hesiod's *Theogony*, the *Homeric Hymn to Demeter*, Virgil's *Georgics*, Ovid's *Metamorphoses*, and Apollodorus's *Bibliotheca*. Secondary sources include Walter Burkert's *Greek Religion* (1985), Robin Hard's *Routledge Handbook of Greek Mythology* (2004), and Jennifer Larson's *Ancient Greek Cults* (2007). All citations appear in the **Sources** section.

---

## Credits

Built by **Lumin0usx** (Karn Boriboon) with **Claude**, Anthropic.
