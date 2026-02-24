# Karatas Antik — Project Instructions

Context document for AI assistants (Claude Code, Claude web, etc.) working on this project.

---

## Project Overview

**Project:** Karatas Antik — premium jewelry e-commerce store demo
**Purpose:** This is a demo/pitch to convince an existing client to redesign their outdated WooCommerce store. We're building an impressive homepage (and supporting pages) to show what's possible.

The client currently has a poorly designed, slow WordPress + WooCommerce site selling handcrafted jewelry and antiques in Lithuania. If the client approves, the final product will be rebuilt as a WordPress + WooCommerce custom theme. This Next.js version is the design demo only.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **next-intl** for i18n (LT + EN, URL-based routing with `/lt/` and `/en/` prefixes)

---

## Design Direction

- Premium luxury aesthetic inspired by high-end jewelry brands (Cartier, Bulgari, Tiffany)
- Dark theme: backgrounds `#0f0f0f`, `#1a1a1a`, `#161616`, `#111`
- Gold accent color: `#C6A55C`
- Fonts: **Playfair Display** (serif — logo, headings), **Inter** (sans-serif — body, navigation)
- Subtle animations: fade-ins, slide-ins, gold underline effects, stagger animations
- Mobile first approach — everything must look stunning on mobile
- No page builder aesthetic — clean, custom, hand-crafted feel

---

## Project Structure

```
src/
  components/       — React components (Header.tsx exists)
  data/             — shared data files (navigation.ts, contact.ts)
  i18n/             — internationalization setup (routing, request, navigation)
  app/
    [locale]/       — all pages with locale-based routing
    globals.css     — global styles, CSS animations, dark theme variables
messages/
  lt.json           — Lithuanian strings
  en.json           — English strings
```

URL slugs stay the same for both languages — only display text changes.

---

## Navigation Structure

- **Juvelyrika** (parent) — 6 subcategories: Auksiniai žiedai, Sužadėtuvių žiedai, Auksiniai auskarai, Auksinės sagės, Grandinėlės ir pakabukai, Sidabriniai dirbiniai
- **Antikvariatas** (parent) — 3 subcategories: Antikvariniai laikrodžiai, Sidabriniai indai ir stalo įrankiai, Veidrodžiai ir rėmai
- **Akcijos ir nuolaidos**
- **Dovanų kuponai**
- **Apie mus**
- **Kontaktai**

---

## What's Done

- Full header with top bar, main header, navigation bar
- Mega dropdown for Juvelyrika, standard dropdown for Antikvariatas
- Mobile menu with hamburger, full-screen overlay, accordion submenus
- Sticky header with scroll behavior (gold top line + top bar hide, header shrinks, tagline hides)
- i18n with next-intl, working language switcher (LT/EN), all route pages created
- All pages show placeholder "Coming soon"

---

## What's Next (in order)

1. **Footer**
2. **Header interactions** — search overlay, cart sidebar, account dropdown
3. **Homepage sections** — hero, featured products, categories showcase, about teaser, testimonials, newsletter
4. **Inner page designs** if needed

---

## Development Rules

- **Mobile first** — use Tailwind responsive classes (`md:`, `lg:`)
- **Animations** — CSS transitions and `@keyframes` only, no heavy animation libraries
- **Icons** — inline SVGs only, no external icon libraries
- **No jQuery**
- **Semantic HTML** with `aria-label` attributes for accessibility
- **TypeScript types** for all data structures
- **Translations** — all user-facing text must go through next-intl (`messages/*.json`), never hardcode Lithuanian or English UI strings
- **Do NOT run `npm run build`** — work exclusively in dev mode (`npm run dev`)
- **One component per file** — keep components modular
- **Commit after each meaningful feature**

---

## Contact / Author

**Developer:** Simas Jankūnas
**Company:** LogicX MB — [logicx.lt](https://logicx.lt)
**GitHub:** [github.com/simasjankun](https://github.com/simasjankun)
