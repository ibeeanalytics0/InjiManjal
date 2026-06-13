# InjiManjal — Project 331

> Organic Food. At the Price it Should Always Be.

Pesticide-free, non-GMO, indigenous food sourced from Tamil Nadu — delivered directly, cutting every middleman.

---

## File Structure

```
InjiManjal/
├── index.html      ← Full single-page site (Home, About, Products, Pricing, Contact)
├── style.css       ← All styles — edit this directly, no build step needed
├── script.js       ← Page navigation, intro screen, mobile menu, animations
├── .gitignore      ← Ignores node_modules, .env, logs
└── README.md       ← This file
```

## How to Run

```bash
git clone https://github.com/ibeeanalytics0/InjiManjal.git
cd InjiManjal
# Open index.html in your browser — done.
```

No npm. No build step. No dependencies.

## How to Make Changes

1. Pull main: `git pull origin main`
2. Create a branch: `git checkout -b your-branch-name`
3. Edit `index.html`, `style.css`, or `script.js` directly
4. Push: `git push origin your-branch-name`
5. Open a Pull Request on GitHub

## Deployed On

- **Vercel**: [inji-manjal.vercel.app](https://inji-manjal.vercel.app)

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| HTML     | Plain HTML5, single file      |
| CSS      | Plain CSS (compiled once from Tailwind, now static) |
| JS       | Vanilla JS, no frameworks     |
| Fonts    | Google Fonts (Playfair Display, Cormorant Garamond, DM Sans) |
| Images   | Hosted on postimg.cc + Unsplash |
| Deploy   | Vercel (drag and drop or GitHub auto-deploy) |
