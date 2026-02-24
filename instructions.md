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
- **Tailwind CSS 3**
- **next-intl v4** (`^4.8.3`) for i18n (LT + EN, URL-based routing with `/lt/` and `/en/` prefixes)

---

## Design Direction

- Premium luxury aesthetic inspired by high-end jewelry brands (Cartier, Bulgari, Tiffany)
- Dark theme: backgrounds `#0f0f0f`, `#1a1a1a`, `#161616`, `#111`
- Gold accent color: `#C6A55C` (Tailwind token: `gold`)
- Fonts: **Playfair Display** (serif — logo, headings), **Inter** (sans-serif — body, navigation)
- Subtle animations: fade-ins, slide-ins, gold underline effects, stagger animations
- Mobile first approach — everything must look stunning on mobile
- No page builder aesthetic — clean, custom, hand-crafted feel

---

## Project Structure

```
src/
  components/       — React components
    Header.tsx      — sticky header with dropdowns, mobile menu, search/account/cart triggers
    SearchOverlay.tsx — full-screen search portal
    AccountSidebar.tsx — login/register drawer portal
    CartSidebar.tsx    — empty cart drawer portal
    HeroSection.tsx    — full-screen hero with image, animations, scroll indicator
    CategoriesSection.tsx — 3-card categories showcase with hover effects and animations
  data/             — shared data files (navigation.ts, contact.ts)
  i18n/             — internationalization setup (routing.ts, request.ts, navigation.ts)
  app/
    layout.tsx      — passthrough: return <>{children}</>
    [locale]/
      layout.tsx    — html/body, fonts, NextIntlClientProvider, Header, spacer div
      page.tsx      — homepage (HeroSection + CategoriesSection)
      juvelyrika/   — page.tsx + [category]/page.tsx
      antikvariatas/ — page.tsx + [category]/page.tsx
      akcijos/      — coming soon
      dovanu-kuponai/ — coming soon
      apie-mus/     — coming soon
      kontaktai/    — coming soon
    globals.css     — global styles, CSS keyframes, dark theme variables
messages/
  lt.json           — Lithuanian strings
  en.json           — English strings
```

URL slugs stay the same for both languages — only display text changes.

---

## i18n Setup

- `localePrefix: 'always'` — URLs are `/lt/...` and `/en/...`
- `src/i18n/routing.ts` — `defineRouting({ locales: ['lt','en'], defaultLocale: 'lt' })`
- `src/i18n/request.ts` — `getRequestConfig`, loads `messages/${locale}.json` via dynamic import
- `src/i18n/navigation.ts` — `createNavigation(routing)` → exports `Link`, `useRouter`, `usePathname`, `redirect`
- `src/middleware.ts` — `createMiddleware(routing)`, matcher excludes `_next/api/static`
- `next.config.mjs` — wrapped with `createNextIntlPlugin('./src/i18n/request.ts')`

**Translation namespaces in use:** `Navigation`, `Header`, `Search`, `Account`, `Cart`, `Hero`, `Categories`

> **Important:** `request.ts` uses dynamic `import()` for JSON files. Node.js caches these modules. If you add a new namespace to `messages/*.json`, the dev server must be restarted to pick it up — otherwise keys render as raw strings (e.g. `"cart.title"`).

---

## Navigation Structure

- **Juvelyrika** (parent) — 6 subcategories: Auksiniai žiedai, Sužadėtuvių žiedai, Auksiniai auskarai, Auksinės sagės, Grandinėlės ir pakabukai, Sidabriniai dirbiniai
- **Antikvariatas** (parent) — 3 subcategories: Antikvariniai laikrodžiai, Sidabriniai indai ir stalo įrankiai, Veidrodžiai ir rėmai
- **Akcijos ir nuolaidos**
- **Dovanų kuponai**
- **Apie mus**
- **Kontaktai**

Navigation data is in `src/data/navigation.ts`. Items use `labelKey` (not `label`) — resolved via `useTranslations('Navigation')`.

---

## What's Done

### Header
- 4-layer: 1px gold top line → top bar (#111) → main header (#1a1a1a) → nav (#141414)
- Gold top line + top bar hide on scroll > 30px; main header shrinks; tagline hides
- Mega dropdown for Juvelyrika (full-width, CSS grid height animation, grain texture overlay)
- Standard dropdown for Antikvariatas (280px, same dark style)
- Mobile menu: hamburger overlay, full-screen, accordion submenus, stagger animations
- Sticky header with scroll behavior
- Language switcher (LT/EN) via `router.replace(pathname, { locale })`

### Header Overlays (portals)
- **SearchOverlay** — full-screen, `z-[70]`, focus trap, Escape closes, gold underline on input (peer/peer-focus pattern), auto-focus via `setTimeout(..., 50)`
- **AccountSidebar** — right-side drawer, slide animation with `visible` + `animatingOut` two-state pattern for exit animation before unmount, login form, register link, focus trap
- **CartSidebar** — right-side drawer, same animation pattern, empty state with icon + CTA

All three are triggered from `Header.tsx` (state: `searchOpen`, `accountOpen`, `cartOpen`), rendered at bottom of Header's JSX fragment.

### Homepage
- **HeroSection** — full-screen (`minHeight: 100vh`), background image (`/images/hero-ring.png`), two gradient overlays (mobile: bottom-to-top, desktop: left-to-right), staggered `heroFadeUp` keyframe animation on text (gated by `mounted` state to prevent SSR flash), scroll indicator that fades after 100px scroll
- **CategoriesSection** — 3-card showcase (`/images/category-jewellery.png`, `category-antiques.png`, `category-offers.png`), image zoom on hover, two-layer gradient overlay, arrow translate on hover, scroll-triggered fade-in animations

---

## What's Next (in order)

1. **Footer**
2. **Featured products section** (homepage)
3. **About teaser section** (homepage)
4. **Testimonials section** (homepage)
5. **Newsletter section** (homepage)
6. **Inner page designs** if needed

---

## Development Rules

- **Mobile first** — use Tailwind responsive classes (`md:`, `lg:`)
- **Animations** — CSS transitions and `@keyframes` only, no heavy animation libraries
- **Icons** — inline SVGs only, no external icon libraries
- **No jQuery**
- **Semantic HTML** with `aria-label` attributes for accessibility
- **TypeScript types** for all data structures
- **Translations** — all user-facing text must go through next-intl (`messages/*.json`), never hardcode Lithuanian or English UI strings in JSX
- **Do NOT run `npm run build`** — work exclusively in dev mode (`npm run dev`)
- **One component per file** — keep components modular
- **Commit after each meaningful feature**
- `npm run dev` runs with `-H 0.0.0.0` — accessible on the local network at `http://<local-ip>:3000`

---

## Known Technical Gotchas

These issues have already been hit. Do not repeat these mistakes:

### 1. Tailwind arbitrary height values are unreliable on mobile
`h-[420px]`, `h-[580px]` etc. via Tailwind classes do NOT reliably apply on mobile in this build. **Always use JS-driven inline styles for card/section heights.**
```tsx
const [cardHeight, setCardHeight] = useState(420);
useEffect(() => {
  const update = () => setCardHeight(window.innerWidth >= 1024 ? 580 : 420);
  update();
  window.addEventListener('resize', update);
  return () => window.removeEventListener('resize', update);
}, []);
// Then: style={{ height: `${cardHeight}px` }}
```

### 2. Flex containers break inline `height` on mobile
When a parent has `display: flex`, all children become flex items — their `display: block` and `height` inline styles are overridden by the flex algorithm. On mobile, **never use a flex container for the cards row**. Use a plain `<div>` with no layout styles; cards stack as normal block elements. Use an `isMobile` state to switch between layouts:
```tsx
const [isMobile, setIsMobile] = useState(true); // SSR default: true
useEffect(() => {
  const update = () => setIsMobile(window.innerWidth < 1024);
  update();
  window.addEventListener('resize', update);
  return () => window.removeEventListener('resize', update);
}, []);
// Container: style={isMobile ? undefined : { display: 'flex', ... }}
// Cards: style={isMobile ? { display: 'block', height: '420px', ... } : { flex: 1, height: '580px', ... }}
```

### 3. CSS `transitionDelay` must be a fixed value — never conditional on the animated state
Changing `transitionDelay` and `opacity` in the same React render causes inconsistent browser behavior. **Always set a fixed delay that never changes:**
```tsx
// WRONG — changes delay and opacity in same render:
transitionDelay: visible ? '0.2s' : '0s',

// CORRECT — delay is fixed, only opacity/transform change:
transitionDelay: '0.2s',
opacity: visible ? 1 : 0,
```

### 4. IntersectionObserver unreliable when section is already in viewport on mobile
On mobile, sections are often already visible when the page loads (no scrolling needed). The observer may never fire. For mobile: skip the observer and set `visible = true` immediately on mount. Combine with the `isMobile` state:
```tsx
useEffect(() => {
  if (isMobile) { setVisible(true); return; }
  // ... IntersectionObserver setup for desktop only
}, [isMobile]);
```

### 5. Portal SSR safety
Components using `createPortal(children, document.body)` will crash during SSR because `document` doesn't exist. Always gate portals with a `mounted` state:
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
return createPortal(<>...</>, document.body);
```

### 6. Sidebar/drawer exit animations — two-state pattern
To animate a drawer closing before unmounting it from the DOM:
```tsx
const [visible, setVisible] = useState(false);
const [animatingOut, setAnimatingOut] = useState(false);
useEffect(() => {
  if (isOpen) { setVisible(true); setAnimatingOut(false); }
  else { setAnimatingOut(true); const t = setTimeout(() => setVisible(false), 350); return () => clearTimeout(t); }
}, [isOpen]);
if (!visible) return null;
// Apply closing animation when animatingOut === true
```

---

## globals.css — Defined Keyframes

- `heroFadeUp` — used by HeroSection for entrance text animations
- `scrollBounce` — used by HeroSection scroll indicator chevron
- `searchOverlayFadeIn`, `searchContentSlideUp` — used by SearchOverlay
- `sidebarSlideIn`, `sidebarSlideOut`, `sidebarFadeBackdrop`, `sidebarFadeBackdropOut` — used by AccountSidebar and CartSidebar
- `dropdownItemIn` — used by Header dropdown menu items
- `mobileItemIn` — used by Header mobile menu items
- `.dropdown-grid-wrapper` / `.dropdown-grid-inner` — CSS grid height animation trick for dropdowns

---

## Contact / Author

**Developer:** Simas Jankūnas
**Company:** LogicX MB — [logicx.lt](https://logicx.lt)
**GitHub:** [github.com/simasjankun](https://github.com/simasjankun)
