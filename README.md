# Winner Coffee Web v2

Kanal resmi web untuk **Winner Coffee** — Kafe, Ruang Karaoke Privat & Studio Musik Akustik di Kuningan, Jawa Barat.

Aplikasi web modern berbasis **Next.js (App Router)**, **Tailwind CSS**, dan **Supabase Cloud**, dirancang dengan estetika *Architectural Modernist Luxury Coffee House* (terinspirasi dari WatchHouse).

---

## ☕ Fitur Utama

- **Katalog Menu Digital ([`/menu`](http://localhost:3000/menu))**:
  - Daftar kopi espresso-based, artisan tea, hidangan utama, dan pastry.
  - Indikator ketersediaan real-time (*Tersedia* / *Habis*) dan badge rekomendasi (*Favorit*, *Promo*).
- **Reservasi Ruangan ([`/booking`](http://localhost:3000/booking))**:
  - Reservasi Ruang Karaoke privat (minimum 3 jam) dan Studio Musik akustik (fleksibel per jam).
  - Validasi jadwal operasional kafe, kalkulasi estimasi otomatis, dan integrasi WhatsApp Admin.
- **Admin Dashboard Kasir & Pengelola ([`/admin`](http://localhost:3000/admin))**:
  - Login aman berbasis PIN pengelola.
  - Quick 1-tap availability toggle untuk barista/kasir saat stok menu habis.
  - Full CRUD menu, upload foto ke Supabase Storage, dan pengelolaan kategori dinamis.
  - Desain responsif dioptimalkan untuk tablet kasir dan smartphone.

---

## 📖 Dokumentasi Proyek

Seluruh referensi arsitektur dan sistem desain tersentralisasi di dalam folder [`docs/`](docs/):

- **[`docs/DESIGN.md`](docs/DESIGN.md)**: Panduan sistem desain visual, palet warna, tipografi Newsreader/Geist, dan standar fotografi.
- **[`docs/GLOSSARY.md`](docs/GLOSSARY.md)**: Kamus istilah domain resmi (*Ruang Karaoke*, *Studio Musik*, *Kode Booking*, dll.).
- **[`docs/supabase-schema.sql`](docs/supabase-schema.sql)**: Skema DDL tabel database PostgreSQL dan bucket object storage.
- **[`docs/references/watchhouse/`](docs/references/watchhouse/)**: Arsip screenshot acuan desain dan metadata visual.
- **[`docs/archive/menu-scans/`](docs/archive/menu-scans/)**: Arsip scan buku menu fisik Winner Coffee (Juni 2026).

---

## 🚀 Memulai Pengembangan Lokal

### Prasyarat
- Node.js 20+ / 24+
- npm

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Lingkungan (`.env.local`)
Salin atau buat file `.env.local`:
```env
# Supabase Database & Storage
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Admin Dashboard PIN
ADMIN_PIN=123456
```

### 3. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka:
- Halaman Pengunjung: [http://localhost:3000](http://localhost:3000)
- Menu Pengunjung: [http://localhost:3000/menu](http://localhost:3000/menu)
- Portal Admin Kasir: [http://localhost:3000/admin](http://localhost:3000/admin)

### 4. Pengujian & Build
```bash
# Menjalankan unit tests
npm test

# Build produksi Turbopack
npm run build
```

---

## 🔒 Lisensi
© 2026 Winner Coffee. All rights reserved.
