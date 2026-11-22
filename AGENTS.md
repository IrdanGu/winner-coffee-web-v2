<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Winner Coffee Developer & Agent Guidelines

Welcome to Winner Coffee Web v2. When developing, extending features, or making architectural decisions, always refer to the authoritative documentation centralized in the [`docs/`](docs/) directory:

## Central Documentation Structure

1. **[`docs/DESIGN.md`](docs/DESIGN.md) — Visual Design System & Aesthetic Identity**
   - **Identity**: *Architectural / Modernist Luxury Coffee House* (inspired by WatchHouse).
   - **Tokens**: Warm ecru canvas (`#F9F4EE`), deep charcoal ink (`#111111`), forest spruce accent (`#108474`), and subtle hairline borders (`#E5DFD7`).
   - **Typography**: Editorial serif headings with sentence case and terminal periods (`House favourites.`, `Our menu.`), paired with clean sans-serif body copy.
   - **Layout Rules**: Rectilinear geometry, razor-thin borders, generous whitespace, and documentary-grade photography.

2. **[`docs/GLOSSARY.md`](docs/GLOSSARY.md) — Domain Language & Nomenclature**
   - Strictly adhere to ubiquitous terms:
     - `Ruang Karaoke` (not room KTV, minimum 3 jam)
     - `Studio Musik` (not rental musik, flexible hourly)
     - `Booking` & `Kode Booking` (format: `WIN-XXXXXX`)
     - `Status Booking` (Menunggu Konfirmasi, Dikonfirmasi, Dibatalkan)
     - `Estimasi Biaya` (perkiraan tarif sewa awal sebelum verifikasi admin)

3. **[`docs/supabase-schema.sql`](docs/supabase-schema.sql) — Database & Storage Architecture**
   - Tables: `public.categories` and `public.menu_items`.
   - Object Storage bucket: `menu-images` for dynamic menu photography.
   - Row Level Security (RLS) policies and performance indexes.

4. **[`docs/references/watchhouse/`](docs/references/watchhouse/) — Design Benchmark References**
   - High-fidelity full-page screenshots, section crops, and design token metadata captured from WatchHouse.

5. **[`docs/archive/menu-scans/`](docs/archive/menu-scans/) — Raw Printed Menu Scans**
   - 38 high-resolution page scans of the original physical Winner Coffee booklet (June 2026) for recipe, item name, and price audits (kept in local gitignore to conserve bandwidth).

---

## 🛠️ Key Architectural Invariants
- **Public vs Admin Layout**: Public routes (`/`, `/menu`, `/booking`) render customer navigation and footer via [`components/conditional-shell.tsx`](components/conditional-shell.tsx). The Admin Dashboard (`/admin`, `/admin/login`) is strictly isolated with its own dedicated cashier header and no customer footer.
- **Data Persistence**: Primary dynamic menu data lives in Supabase with automatic graceful fallback to [`data/menu.json`](data/menu.json) if credentials are absent.
- **Instant Revalidation**: All mutations in Server Actions call `revalidatePath('/menu')` and `revalidatePath('/')` for zero-latency live updates across visitor sessions.
