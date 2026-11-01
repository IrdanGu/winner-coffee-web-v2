# DESIGN.md — WatchHouse Visual Design System & Implementation Reference

Extracted from: [https://watchhouse.com/](https://watchhouse.com/)
Captured via: Firecrawl CLI (`branding, markdown, images, full-page-screenshot`)
Reference Asset: `.firecrawl/design-reference.png`
Scrape ID: `01a19476-3b0a-74b2-840c-80cdaeb159ed`

---

## 1. Aesthetic Identity & Philosophy

WatchHouse manifests an **Architectural / Modernist Luxury Coffee House** aesthetic:
- **Atmosphere**: Considered, minimal, editorial, warm yet uncompromisingly precise.
- **Form Factor**: Clean rectilinear geometry (`border-radius: 0px` or subtle `2px-4px`), razor-thin hairline grid lines (`1px solid #111111` or `#E5DFD7`), expansive whitespace, and strong editorial typography hierarchy.
- **Copy & Typography Tone**: Understated elegance, sentence case with distinct period punctuation on titles (`House favourites.`, `Our menu.`, `Our story.`, `For the moments between.`).
- **Photography Treatment**: Rich, warm, documentary-grade food, architectural interior, and barista equipment photography.

---

## 2. Design Tokens

### Color Palette

| Semantic Role | Hex | Observed Use |
| :--- | :--- | :--- |
| **Canvas Background** | `#F9F4EE` | Warm ecru/ivory background that replaces generic sterile white. |
| **Secondary Background** | `#F4EFE6` / `#F8F2DE` | Muted parchment stone for cards, product frames, and sections. |
| **Foreground / Ink** | `#111111` / `#000000` | Deepest charcoal/black for razor-sharp typography and borders. |
| **Subtle Border / Hairline** | `#E5DFD7` / `#D9D2C7` | Crisp 1px division lines separating grid cells and navigation. |
| **Forest Accent / Green** | `#108474` / `#0E6E60` | Deep botanical/forest spruce for primary highlights and links. |
| **Dark Inverted Canvas** | `#121212` / `#0A0A0A` | Solid dark footer and dramatic architectural statement sections. |
| **Inverted Text** | `#FFFFFF` / `#F9F4EE` | Pristine contrast on dark banners and buttons. |

### Typography

| Role | Font Family | Tailwind Class | Notes |
| :--- | :--- | :--- | :--- |
| **Headings & Editorial Titles** | Tiempos Headline (or *Newsreader* / *Playfair Display* / serif) | `font-serif` | High contrast, elegant tracking, sentence case with ending periods (`.`). |
| **Body & Metadata** | Balto (or *Geist* / *Inter* / sans-serif) | `font-sans` | Crisp, high legibility, neutral geometric sans. |
| **Subheadings & Badges** | Monospace or uppercase sans tracking | `tracking-widest uppercase text-xs` | Precise architectural labeling. |

### Geometry & Spacing

- **Border Radius**: Sharp `rounded-none` or subtle `rounded-sm` (0px–2px). Strict avoidance of pill/bubbly rounded shapes.
- **Borders**: Sharp 1px hairlines (`border border-neutral-300` or `border-black/10`).
- **Buttons**:
  - *Primary Button*: Crisp rectangle with 1px border. `#111111` background with `#FFFFFF` text, or `#F9F4EE` with black border, inverting on hover (`hover:bg-black hover:text-white`).
  - *Secondary / Text Action*: Inline text with arrow or period link (`Discover now →`).

---

## 3. Core Component Patterns

### 1. Minimalist Top Bar & Navigation
- Flat, non-sticky or transparent hairline header.
- Brand name / wordmark in classic serif or condensed geometric type.
- Clean category links separated with generous spacing (`Merch.`, `Equipment.`, `Visit us.`, `Menu.`, `Reservasi.`).
- Right utility actions: Cart / WhatsApp Admin with minimalist icon.

### 2. Split Editorial Hero
- 2-column or asymmetrical editorial split grid.
- Full-bleed rich photography paired with minimalist editorial quote:
  > *"For the moments between."*
  > *"Our pursuit of excellence: exceptional coffee, considered design, and an experience that anticipates every detail."*

### 3. Hairline Grid Catalog
- Clean grid layout with 1px solid borders dividing items (like a luxury print publication).
- Each cell features neutral warm beige background, high-contrast typography, category tag, and price.
- Minimalist interaction: hovering reveals subtle elevation or clean border focus.

### 4. Monochromatic Deep Contrast Footer
- Rich dark charcoal (`#111111`) base.
- Multi-column clean sans/serif layout with operational hours, location addresses, and newsletter/WhatsApp signup with clean underline inputs.

---

## 4. Implementation Plan for Winner Coffee

1. **Global Styles & Palette (`app/globals.css`)**:
   - Set base background to `#F9F4EE` and text to `#111111`.
   - Configure warm neutral variables (`--bg-surface: #F4EFE6`, `--border-hairline: #E5DFD7`).
   - Introduce serif font for luxury editorial headings.
2. **Navbar (`components/navbar.tsx`)**:
   - Refactor to WatchHouse clean editorial aesthetic with razor-thin borders, uppercase/period styling, and sharp button geometry.
3. **Hero & Homepage (`app/page.tsx`)**:
   - Replace generic gradients with WatchHouse-style split visual blocks, bold poetic serif statements (*"Kopi Berkualitas, Ruang Bernyanyi, & Studio Musik."*), and crisp hairline cards.
4. **Katalog Menu (`app/menu/page.tsx`)**:
   - Layout menu items in a clean architectural grid with 1px borders, warm stone cards, and minimalist search/tabs.
5. **Form Reservasi (`app/booking/page.tsx` & `components/booking-confirmation-card.tsx`)**:
   - Form inputs with crisp square borders, warm ecru styling, and elegant pricing summary.
6. **Footer (`components/footer.tsx`)**:
   - Dark, sophisticated architectural footer matching WatchHouse footer layout.
