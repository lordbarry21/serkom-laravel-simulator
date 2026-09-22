# DESIGN.md — Serkom Laravel Simulator

Arahan desain resmi untuk simulator interaktif uji kompetensi kejuruan (LSP/BNSP Serkom) Rekayasa Perangkat Lunak.

---

## 1. Identitas & Filosofi Desain

- **Karakter**: *Focused Utilitarian Developer Workbench*.
- **Tujuan Pengguna**: Membantu siswa dan peserta uji kompetensi memahami logika backend Laravel, struktur file MVC, perintah Artisan, serta kriteria kelulusan penguji secara nyata tanpa distraksi kosmetik buatan AI.
- **Prinsip**: Setiap elemen grafis dan teks memiliki alasan fungsional (*Craftsmanship C-1*). Tidak ada gradien kosmetik berlebihan, tidak ada animasi tiada henti, dan tidak ada elemen interaktif palsu.

---

## 2. Nilai Dials (Liveliness System)

| Dial | Nilai | Implementasi Nyata |
|---|---|---|
| **ENERGY** | **1 (Calm)** | Lingkungan kerja bergaya dark IDE yang tenang, tanpa warna pelangi neon atau background blur bertumpuk. |
| **RHYTHM** | **2 (Structured)** | Tiga panel ergonomis: Panel Panduan (pedagogis & jelas), Panel Editor (fokus & padat), Panel Runtime (feedback instan terminal / browser preview). |
| **MOTION** | **1 (Functional)** | Hanya transisi mikro fungsional (hover halus 150ms, fade modal 150ms). Dilarang keras menggunakan loop abadi (*infinite pulse/bounce*). |

---

## 3. Palet Warna (Color System)

Membatasi palet aktif menjadi 3 warna inti netral + 1 warna aksen identitas (*R-29*):

- **Background Netral (Base Chrome)**:
  - Surface Utama: `#09090b` (Zinc 950)
  - Surface Panel / Cards: `#141416` / `#18181b` (Zinc 900)
  - Border & Dividers: `#27272a` (Zinc 800) / `#3f3f46` (Zinc 700)
- **Aksen Identitas (Laravel Ecosystem)**:
  - Primary Accent: `#e11d48` (Rose/Red 600) & `#dc2626` (Red 600)
  - Accent Hover: `#f43f5e` (Rose 500)
- **Warna Status & Umpan Balik (Semantic Only)**:
  - Sukses / Valid: `#10b981` (Emerald 500) / `#047857` (Emerald 700)
  - Peringatan / Tips: `#f59e0b` (Amber 500) / `#b45309` (Amber 700)
  - Informasi / Perintah: `#38bdf8` (Sky 400) / `#0284c7` (Sky 600)
- **Rasio Kontras**:
  - Semua teks reguler wajib memenuhi minimal **4.5:1** terhadap latar belakang (WCAG AA). Teks redup menggunakan `text-zinc-400` atau lebih terang, menghindari `text-zinc-500` yang gagal pada kontras gelap.

---

## 4. Tipografi

- **UI & Teks**: Sans-serif sistem berkecepatan tinggi (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`).
- **Kode & Terminal**: Monospace murni (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`).
- **Aturan Bebas Slop**:
  - Dilarang keras menggunakan huruf kapital penuh (*ALL CAPS*) yang berteriak.
  - Dilarang keras menggunakan tanda pisah em dash (`—`) pada teks UI (*R-02*).

---

## 5. Aksesibilitas Manusia (Human Standard)

- **Keyboard First**: Seluruh modal wajib dapat ditutup dengan menekan tombol `Escape` (*R-26*, *R-32*).
- **Fokus Terlihat**: Elemen interaktif mempertahankan cincin fokus kontras tinggi `:focus-visible` (*3:1*).
- **Status Jelas**: Status kriteria didukung oleh ikon dan label teks deskriptif, bukan warna saja.
