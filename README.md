#  Arngren.net Redesign - Working Website

> **Final Project — Extra Credit Option B**
> A complete e-commerce website built with HTML, CSS, and JavaScript
> Aligned with the Arngren.net redesign pre-production documents

---

##  Live Demo

Once deployed on GitHub Pages, your site will be live at:
**`https://YOUR-USERNAME.github.io/arngren-website/`**


---

##  Project Structure

```
arngren-website/
├── index.html          # Homepage with hero + categories
├── category.html       # Electric Vehicles listing with filters
├── product.html        # Urban E-Bike Pro detail page
├── cart.html           # Shopping cart with order summary
├── about.html          # About Us / Our Story page
├── css/
│   └── styles.css      # Complete design system (single file)
├── js/
│   └── main.js         # Cart, mobile menu, filters, gallery
├── images/             # Local images (currently uses Unsplash CDN)
└── README.md           # This file
```

**5 fully functional pages** 

---

##  Design Process

### How the Website Aligns with Pre-Production Documents

The website is built directly from the design system established in:
- **W6A2 Mood Board** — keywords: Precision, Craftsmanship, Modern, Sustainable, Purposeful
- **W7 User Persona** — Lars Andersen, 38, Civil Engineer, Bergen
- **W8 Site Map** — 7 main categories, 3-level hierarchy
- **W9A2 Standards Guide** — colors, typography, spacing, logo rules
- **W10A1 Storyboards** — hand-drawn layouts
- **W11A2 Wireframes** — black-and-white digital wireframes
- **W12A2 Final Figma** — full-color desktop and tablet mockups

### Color Palette (Exact Match to Standards Guide)

| Color | Hex | Where it appears in code |
|-------|-----|--------------------------|
| **Sustainable Teal** | `#23A792` | Primary buttons, eco badges, accents |
| **Craftsman Tan** | `#AE9A81` | Section backgrounds, image placeholders, borders |
| **Precision Blue** | `#3193DA` | Links, secondary buttons, product counts |
| **Workshop Charcoal** | `#413B2D` | Body text, footer background, logo |
| **Clean White** | `#FEFEFE` | Page backgrounds (75% of design) |

These are defined as CSS custom properties in `:root` for consistency across all pages.

### Typography (Three-Font Hierarchy)

Loaded from Google Fonts:
```css
font-family: 'Poppins'   → Headlines (h1, h2, .nav__logo)
font-family: 'Inter'     → Body copy, navigation, buttons
font-family: 'Roboto Mono' → Technical specs, eyebrow labels
```

This matches the persona's needs: as an engineer, Lars expects technical specs in a monospace font where `750W / 48V / 28mph` reads precisely.

### 8-Point Grid Spacing System

```css
--space-xs:  8px   /* between related items */
--space-sm:  16px  /* between sub-sections */
--space-md:  24px  /* between cards/components */
--space-lg:  32px  /* between sections */
--space-xl:  48px  /* major page divisions */
--space-2xl: 64px  /* section padding */
```

### Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| **Desktop** | 1025px+ | 4-column category grid, 3-column products, full nav |
| **Tablet** | 769–1024px | 3-column categories, 2-column products, condensed nav |
| **Mobile** | ≤768px | Single column stack, hamburger menu, full-width buttons |

---

## How It Was Built (My Process)

### Step 1: Plan the Information Architecture
I started with the site map from W8 to decide which 4-5 pages were most critical. The cart-to-checkout flow tells the most important user story, so I prioritized: **Home → Category → Product → Cart**.

### Step 2: Build the Design System First
Before writing any HTML, I built `styles.css` with all CSS variables, base styles, and reusable components (buttons, cards, navigation). This ensured **every page would be consistent** without duplicating styles.

### Step 3: Translate Figma to HTML
Each page in Figma became a corresponding `.html` file. I used semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) for accessibility and Search Engine Optimization.

### Step 4: Add Interactivity with JavaScript
The `main.js` file handles:
- **Mobile menu toggle** (hamburger icon ⇄ open menu)
- **Add to cart** (with animated toast notifications)
- **Cart state** (persists across pages via `sessionStorage`)
- **Cart count badge** in nav (updates in real-time)
- **Quantity controls** (− / + buttons with input sync)
- **Filter checkboxes** (live product filtering on category page)
- **Product gallery** (clicking thumbnails swaps the main image)
- **Smooth scroll animations** (cards fade in on scroll)
- **Search feedback** (Enter key triggers a toast notification)

### Step 5: Polish & Accessibility
- Added focus states (`:focus-visible`) for keyboard navigation
- ARIA labels on icon buttons (cart, menu, sort)
- Semantic landmarks (`<nav aria-label="Main navigation">`)
- Reduced motion support for users who prefer less animation
- 44px minimum touch targets on mobile (Apple guidelines)

---

##  Troubleshooting

| Problem | Solution |
|---------|----------|
| Site shows 404 | Wait 5 minutes, then refresh. GitHub Pages takes time to build. |
| Images broken | The site uses Unsplash URLs — they need internet. Check connection. |

---

## 📋 Browser Support

Tested and working in:
- ✅ Chrome / Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android)

Uses modern CSS (Grid, Flexbox, custom properties) and ES6+ JavaScript.

---


## Credits

**Designed and built by:** Aboubakar Felix Amadou
**Project:** Arngren.net Redesign Final Project
**Year:** 2026

**Photos:** [Unsplash](https://unsplash.com) (free for commercial use)
**Fonts:** [Google Fonts](https://fonts.google.com) — Poppins, Inter, Roboto Mono
**Color Inspiration:** Scandinavian design principles, sustainability research

---

*"Specifications, not sales pitches. Built for makers, by makers."*
