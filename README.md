<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 11">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18">
  <img src="https://img.shields.io/badge/Inertia.js-v1.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js">
  <img src="https://img.shields.io/badge/TailwindCSS-v3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License">
</p>

# Portal Dakwah Abu Haidar

Platform web dakwah Islam modern yang dibangun menggunakan **Laravel 11**, **Inertia.js**, **React**, dan **TypeScript**.

Portal ini dirancang untuk menyediakan ruang publikasi artikel kajian Islam, kutipan ayat Al-Qur'an dan hadits, pengelolaan kategori kajian, serta area khusus jamaah untuk menyimpan kajian dan mengelola profil.

---

## 📖 Tentang Project

**Portal Dakwah Abu Haidar** menggunakan pendekatan **Modern Monolithic / Single Page Application (SPA)** dengan Laravel sebagai backend dan React sebagai frontend melalui Inertia.js.

Sistem memiliki tiga area utama:

- **Website Publik** — dapat diakses oleh seluruh pengunjung untuk membaca artikel dan kajian.
- **Admin Portal** — digunakan untuk mengelola artikel, kategori, kutipan, pengguna, dan konten website.
- **Member Area / Jamaah** — digunakan oleh pengguna terdaftar untuk membaca kajian, menyimpan artikel favorit, dan mengelola profil.

### Role & Hak Akses

| Role                | Akses                                                          |
| ------------------- | -------------------------------------------------------------- |
| **Public**          | Beranda, kategori, artikel, dan konten publik                  |
| **Member / Jamaah** | Dashboard, artikel, bookmark, dan profil                       |
| **Admin**           | Dashboard, artikel, kategori, pengguna, dan pengelolaan konten |

---

## 🚀 Tech Stack

### Backend

- **Laravel 11** — Framework utama aplikasi
- **PHP 8.2+** — Runtime backend
- **Inertia.js** — Penghubung Laravel dan React
- **Eloquent ORM** — Database ORM
- **MySQL / MariaDB** — Database relasional
- **Laravel Middleware** — Authentication & authorization
- **Laravel Storage** — Pengelolaan file dan gambar

### Frontend

- **React 18** — Library antarmuka
- **TypeScript** — Type-safe development
- **Tailwind CSS 3** — Utility-first CSS framework
- **Framer Motion** — Animasi dan transisi antarmuka
- **Lucide React** — Icon library
- **Vite** — Frontend build tool dan development server

---

## ✨ Fitur Utama

### 1. 🛡️ Admin Dashboard

Panel administrasi untuk mengelola seluruh konten portal.

#### Manajemen Artikel

- Membuat artikel kajian baru
- Mengubah dan menghapus artikel
- Slug otomatis untuk URL artikel
- Upload cover image
- Dukungan gambar dari URL eksternal
- Preview cover artikel
- Integrasi kutipan ayat Al-Qur'an dan hadits
- Terjemahan bahasa Indonesia
- Referensi ayat / kitab
- Sanitasi dan normalisasi teks

#### Manajemen Kategori

Kategori dapat digunakan untuk mengelompokkan artikel berdasarkan topik, seperti:

- Fiqih
- Aqidah
- Tafsir
- Adab
- Sirah
- Akhlak
- dan kategori lainnya

Fitur kategori meliputi:

- Tambah kategori
- Edit kategori
- Hapus kategori
- Perhitungan jumlah artikel per kategori
- Proteksi penghapusan kategori yang masih digunakan artikel

#### Manajemen Pengguna

Admin dapat:

- Melihat daftar pengguna
- Memantau akun jamaah
- Mengelola role pengguna
- Mengatur akses administrator

---

### 2. 📚 Portal Publik

Website publik yang dapat digunakan tanpa login.

Fitur utama:

- Beranda portal
- Daftar artikel kajian
- Filter berdasarkan kategori
- Halaman detail artikel
- Kutipan ayat Al-Qur'an
- Kutipan hadits
- Referensi sumber
- Cover artikel
- Tampilan responsif desktop dan mobile

---

### 3. 👤 Member / Jamaah Area

Area khusus pengguna yang telah melakukan autentikasi.

Fitur:

- Dashboard jamaah
- Membaca artikel kajian
- Menyimpan artikel sebagai bookmark
- Melihat daftar kajian tersimpan
- Pengelolaan profil
- Pengaturan akun
- Pengubahan password

Sistem menggunakan **Smart Gateway** untuk mengarahkan pengguna ke dashboard sesuai role setelah login.

---

## 📂 Struktur Direktori

```text
abu-haidar-portal/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── ...
│   │   └── Middleware/
│   │       └── ...
│   │
│   └── Models/
│       ├── Article.php
│       ├── Category.php
│       ├── Quote.php
│       └── User.php
│
├── bootstrap/
│   └── ...
│
├── config/
│   └── ...
│
├── database/
│   ├── migrations/
│   └── seeders/
│
├── public/
│   ├── build/
│   ├── storage/
│   ├── LOGO.png
│   └── index.php
│
├── resources/
│   ├── css/
│   │   └── app.css
│   │
│   └── js/
│       ├── Components/
│       ├── Layouts/
│       ├── Pages/
│       │   ├── Admin/
│       │   ├── User/
│       │   └── Public/
│       └── app.tsx
│
├── routes/
│   ├── web.php
│   └── auth.php
│
├── storage/
│   ├── app/
│   ├── framework/
│   └── logs/
│
├── .env.example
├── artisan
├── composer.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Persyaratan Sistem

Pastikan environment development atau server memenuhi persyaratan berikut:

| Komponen | Versi Minimum |
| -------- | ------------- |
| PHP      | 8.2+          |
| Composer | 2.x           |
| Node.js  | 18.x+         |
| NPM      | 9.x+          |
| MySQL    | 8.0+          |
| MariaDB  | 10.4+         |

### PHP Extensions

Pastikan ekstensi berikut tersedia:

- BCMath
- Ctype
- cURL
- DOM
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PDO
- Tokenizer
- XML

---

# 🛠️ Instalasi Localhost

## 1. Clone Repository

```bash
git clone https://github.com/username-anda/abu-haidar-portal.git
cd abu-haidar-portal
```

> Ganti URL repository dengan URL repository GitHub yang sebenarnya.

---

## 2. Install Dependency Backend

```bash
composer install
```

---

## 3. Install Dependency Frontend

```bash
npm install
```

---

## 4. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`.

### Linux / macOS

```bash
cp .env.example .env
```

### Windows

```cmd
copy .env.example .env
```

Kemudian sesuaikan konfigurasi database pada file `.env`:

```env
APP_NAME="Portal Dakwah Abu Haidar"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=abu_haidar_db
DB_USERNAME=root
DB_PASSWORD=
```

---

## 5. Generate Application Key

```bash
php artisan key:generate
```

---

## 6. Buat Storage Link

```bash
php artisan storage:link
```

Perintah ini membuat symbolic link dari:

```text
storage/app/public
```

ke:

```text
public/storage
```

sehingga file yang di-upload dapat diakses melalui browser.

---

## 7. Migrasi Database & Seeder

```bash
php artisan migrate --seed
```

Perintah tersebut akan membuat struktur database sekaligus menjalankan database seeder yang tersedia.

> Pastikan database `abu_haidar_db` sudah dibuat sebelum menjalankan perintah ini.

---

## 8. Jalankan Laravel

Buka terminal pertama:

```bash
php artisan serve
```

Laravel akan tersedia di:

```text
http://localhost:8000
```

---

## 9. Jalankan Vite

Buka terminal kedua:

```bash
npm run dev
```

Vite akan menjalankan development server untuk React dan asset frontend.

---

## 🌐 Deployment ke cPanel / Shared Hosting

Project dapat dideploy pada hosting yang mendukung Laravel, PHP, MySQL/MariaDB, Composer, dan konfigurasi document root.

### 1. Build Frontend

Sebelum melakukan upload ke server, jalankan:

```bash
npm run build
```

Hasil build akan berada pada:

```text
public/build/
```

---

### 2. Struktur Hosting

Disarankan struktur server dibuat seperti berikut:

```text
/home/username/
│
├── laravel_app/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── artisan
│   └── ...
│
└── public_html/
    ├── build/
    ├── storage/
    ├── .htaccess
    ├── index.php
    └── ...
```

Core Laravel sebaiknya berada di luar `public_html` agar file aplikasi seperti `.env`, `app/`, `config/`, dan `vendor/` tidak dapat diakses langsung melalui browser.

---

### 3. Sesuaikan `public_html/index.php`

Jika project berada di:

```text
/home/username/laravel_app/
```

dan public directory berada di:

```text
/home/username/public_html/
```

maka `public_html/index.php` perlu menyesuaikan path Laravel.

Contoh:

```php
require __DIR__.'/../laravel_app/vendor/autoload.php';

$app = require_once __DIR__.'/../laravel_app/bootstrap/app.php';
```

> Path dapat berbeda tergantung struktur folder hosting yang digunakan.

---

### 4. Konfigurasi `.env` Production

Contoh konfigurasi:

```env
APP_NAME="Portal Dakwah Abu Haidar"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domain-anda.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=nama_user
DB_PASSWORD=password_database
```

**Jangan menggunakan `APP_DEBUG=true` pada production.**

---

### 5. Storage

Jika hosting mendukung symbolic link melalui terminal/SSH:

```bash
php artisan storage:link
```

Atau buat symlink secara manual:

```bash
ln -s /home/username/laravel_app/storage/app/public /home/username/public_html/storage
```

Sesuaikan path dengan struktur hosting sebenarnya.

---

### 6. Permission

Pastikan Laravel memiliki akses tulis terhadap:

```text
storage/
bootstrap/cache/
```

Permission yang umum digunakan:

```text
755
```

atau, jika diperlukan oleh konfigurasi server:

```text
775
```

Hindari memberikan permission `777` kecuali benar-benar diperlukan dan telah memahami konsekuensi keamanannya.

---

# 🔐 Keamanan

Project menerapkan beberapa mekanisme keamanan Laravel, antara lain:

### CSRF Protection

Form dan request yang melakukan perubahan data dilindungi menggunakan mekanisme **Cross-Site Request Forgery (CSRF)** Laravel.

### Authentication & Authorization

Akses halaman tertentu dilindungi menggunakan:

- Authentication middleware
- Role-based access control
- Middleware authorization

### SQL Injection Protection

Interaksi database menggunakan **Eloquent ORM** dan parameter binding Laravel untuk mengurangi risiko SQL Injection.

### Password Security

Password pengguna disimpan menggunakan mekanisme hashing Laravel, seperti:

- Bcrypt
- Argon2id

Password tidak disimpan dalam bentuk plaintext.

### Input Validation & Sanitization

Input pengguna divalidasi sebelum diproses dan teks artikel dinormalisasi untuk mengurangi risiko input berbahaya.

---

# 🗄️ Database

Struktur database utama mencakup beberapa entitas seperti:

```text
users
   │
   ├── articles
   │       │
   │       ├── categories
   │       └── quotes
   │
   └── bookmarks
```

Model utama aplikasi meliputi:

- `User`
- `Article`
- `Category`
- `Quote`

Relasi antar-model dikelola menggunakan **Laravel Eloquent ORM**.

---

# 🧪 Development

Untuk menjalankan project selama proses pengembangan:

### Backend

```bash
php artisan serve
```

### Frontend

```bash
npm run dev
```

### Build Production

```bash
npm run build
```

### Clear Laravel Cache

Jika terjadi masalah konfigurasi atau cache:

```bash
php artisan optimize:clear
```

---

# 📌 Catatan Pengembangan

Project ini menggunakan pendekatan **Laravel + Inertia.js + React**, sehingga tidak membutuhkan REST API terpisah untuk komunikasi utama antara frontend dan backend.

Alur aplikasi secara umum:

```text
Browser
   │
   ▼
React + Inertia.js
   │
   ▼
Laravel Routes
   │
   ▼
Controllers
   │
   ▼
Eloquent Models
   │
   ▼
MySQL / MariaDB
```

Pendekatan ini memungkinkan pengembangan antarmuka modern seperti SPA dengan tetap mempertahankan routing, authentication, authorization, dan business logic pada ekosistem Laravel.

---

# 📄 Lisensi

Project ini menggunakan lisensi **MIT License**.

Lihat file `LICENSE` untuk informasi lengkap mengenai ketentuan penggunaan dan distribusi project.

---

<p align="center">
  <strong>Portal Dakwah Abu Haidar</strong>
  <br>
  Artikel Islam & Dakwah
</p>
