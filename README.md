# Sarmast Law Associates — React + Tailwind Website

## Tech Stack
- **React 18** — component-based UI
- **Vite** — fast dev server & build tool
- **Tailwind CSS 3** — utility-first styling
- **Framer Motion** — smooth animations & transitions
- **Lucide React** — crisp SVG icons

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
Opens at **http://localhost:5173** — hot-reloads on save.

### 3. Build for production
```bash
npm run build
```
Output goes to `/dist` — ready to deploy to Netlify, Vercel, or any static host.

---

## Project Structure
```
sarmast-law/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx          ← React entry point
    ├── App.jsx           ← Root component (assembles all sections)
    ├── index.css         ← Tailwind directives + global styles
    ├── components/
    │   ├── Navbar.jsx    ← Sticky navbar with mobile menu
    │   └── FadeIn.jsx    ← Reusable scroll-reveal wrapper
    └── sections/
        ├── Hero.jsx      ← Full-screen split hero
        ├── Ticker.jsx    ← Animated marquee band
        ├── Practice.jsx  ← 6 practice area cards
        ├── About.jsx     ← About + animated counters
        ├── Team.jsx      ← Attorney profile cards
        ├── Contact.jsx   ← Contact form with validation
        └── Footer.jsx    ← Site footer
```

---

## Customization

### Update firm details
- **Attorney names/bios** → `src/sections/Team.jsx`
- **Address/phone/email** → `src/sections/Contact.jsx`
- **Practice areas** → `src/sections/Practice.jsx`
- **Statistics** → `src/sections/About.jsx`

### Colors & fonts
All design tokens live in `tailwind.config.js` under `theme.extend`.
- Gold accent: `#C9A84C`
- Background: `#0A0A08`
- Parchment text: `#F5F0E8`

### Connect the contact form to a real backend
In `src/sections/Contact.jsx`, replace the `setTimeout` in `handleSubmit` with a real `fetch` call:

```js
const handleSubmit = async (e) => {
  e.preventDefault()
  const errors = validate()
  if (Object.keys(errors).length) { setErrors(errors); return }
  setLoading(true)
  
  await fetch('https://your-api.com/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
  
  setLoading(false)
  setSent(true)
}
```
Popular options: **EmailJS** (free, no backend needed), **Formspree**, or your own Express/Node API.

---

## Deployment

### Vercel (recommended — free)
1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Framework: **Vite** → Deploy ✓

### Netlify
1. Run `npm run build`
2. Drag the `/dist` folder to [netlify.com/drop](https://app.netlify.com/drop)

---

Built with ❤ for Sarmast Law Associates, Karachi.
