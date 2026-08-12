# Sendo Express 🚚📦

Frontend aplikasi **jasa pengiriman paket** (express courier). Dibangun dengan React, TypeScript, dan Vite, menyediakan panel untuk **customer**, **kurir**, **admin cabang**, dan **super admin**.

## Fitur Utama

- **Autentikasi & Registrasi** — login, register, proteksi route berbasis role & permission (`src/components/auth-guard.tsx`, `src/components/permission-guard.tsx`).
- **Dashboard per Role** — dashboard berbeda untuk `super-admin`, `admin-branch`, `courier`, dan `customer`:
  - *Super Admin*: KPI revenue/shipment, grafik revenue harian, volume per cabang, distribusi status, ranking performa cabang, alert, shipment terbaru.
  - *Admin Cabang*: paket masuk/keluar hari ini, tren aktivitas 7 hari, alert paket menumpuk, log scan terbaru.
  - *Kurir*: tugas hari ini (pickup/deliver), KPI tugas, rute harian, timeline paket berjalan.
  - *Customer*: riwayat pengiriman, cari tracking, status paket aktif.
- **Kirim Paket (Customer)** — buat pengiriman baru (jenis regular / same day / next day), kelola alamat, detail pengiriman, pembayaran via link invoice (Midtrans/Xendit `invoiceUrl`), unduh invoice PDF.
- **Lacak Paket** — cek status real-time menggunakan nomor resi, lengkap dengan timeline riwayat.
- **Daftar Pengiriman (Kurir / Super Admin)** — daftar shipment kurir dengan aksi pickup, pickup-from-branch, deliver-to-branch, dan deliver-to-customer (upload foto bukti).
- **Scan Paket Cabang** — scan QR `IN`/`OUT` di cabang menggunakan kamera (`html5-qrcode`), ringkasan paket masuk/keluar hari ini, dan log aktivitas.
- **Manajemen Cabang (Super Admin)** — CRUD cabang.
- **Manajemen Role (Super Admin)** — kelola permission per role.
- **Manajemen Karyawan (Super Admin / Admin Cabang)** — CRUD karyawan-cabang.
- **Alamat Saya (Customer)** — CRUD alamat beserta foto patokan lokasi.
- **Profil** — ubah foto avatar (upload media), nama, dan kata sandi.

## Tech Stack

| Kategori | Teknologi |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix UI, style `new-york`) |
| Data fetching | TanStack Query v5 + Axios |
| Routing | React Router v7 |
| Form & validasi | React Hook Form + Zod |
| Tabel | TanStack React Table |
| Chart | Recharts |
| QR Scanner | html5-qrcode |
| Icons | lucide-react, iconsax-reactjs |
| Notifikasi | react-hot-toast |

## Struktur Proyek

```
src/
├── components/          # UI (shadcn/ui), layout, auth & permission guard, sidebar
│   ├── ui/              # Komponen UI primitif
│   └── layouts/         # AuthenticatedLayout
├── hooks/               # Custom hooks data (use-auth, use-shipment, use-branch, ...)
├── lib/
│   ├── api/             # Axios instance + service & types per resource
│   │   ├── services/    # auth, branch, delivery, shipment, dashboard-*, ...
│   │   └── types/       # Tipe TypeScript per resource
│   ├── utils/           # cn(), error-handler, status-utils
│   └── validations/     # Skema Zod
├── pages/               # Halaman per fitur (auth, dashboard, send-package, delivery, ...)
├── App.tsx              # Definisi route + AuthGuard per role
├── main.tsx             # Entry point (QueryClient + Router + Toaster)
└── index.css            # Tema Tailwind v4 (CSS variables)
```

## Persyaratan

- Node.js 18+ (disarankan 20+)
- npm

## Instalasi

```bash
# 1. Install dependencies
npm install

# 2. Siapkan environment variable
# Salin template di bawah ke file .env (tidak ikut ter-commit, lihat .gitignore)
```

```env
VITE_API_BASE_URL="https://api.example.com"        # Base URL API produksi
VITE_API_DEV_BASE_URL="http://localhost:3000"      # Base URL API development
```

## Menjalankan

```bash
npm run dev       # Mode development (HMR)
npm run build     # Build produksi (tsc -b && vite build)
npm run preview   # Preview hasil build
npm run lint      # Lint dengan ESLint
```

## Arsitektur Data & Autentikasi

- **API Client** — instance Axios di `src/lib/api/axios.ts` dengan base URL dari `VITE_API_*_BASE_URL`, timeout 10 detik, dan interceptor yang menyisipkan header `Authorization: Bearer <token>`.
- **Autentikasi** — token disimpan di `localStorage` (`accessToken`), data user disimpan di kunci `user`. Hook `useAuth` membungkus login/logout/register dengan TanStack Query + toast.
- **Role** — `super-admin`, `admin-branch`, `courier`, `customer`. Access control dilakukan oleh `AuthGuard` (berbasis role dan/atau permission key) dan `PermissionGuard` untuk menu sidebar.
- **Hooks per resource** — semua konsumsi API dibungkus hook (mis. `useShipments`, `useBranches`, `useCourierShipments`, `useDashboard*`) dengan query key terpusat dan invalidasi otomatis.
- **Pagination & Search** — state halaman/limit/kata kunci dipersist di URL search params dan di-debounce (`useDebounce`).

## Skrip & Konvensi

| Script | Deskripsi |
| --- | --- |
| `npm run dev` | Menjalankan server dev Vite |
| `npm run build` | Type-check + build produksi |
| `npm run lint` | Menjalankan ESLint |
| `npm run preview` | Pratinjau build produksi |

Konvensi penamaan file: `kebab-case` (mis. `use-user-address.ts`, `add-employee-modal.tsx`), path alias `@` mengarah ke `src/` (dikonfigurasi di `vite.config.ts` dan `tsconfig`).
