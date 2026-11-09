# UR-APP: Sistem Web Pengelolaan Umpan Balik Pengguna & Pelaporan Tiket

Aplikasi web modern berbasis **JavaScript** dan **Firebase** (Cloud Firestore & Authentication) yang dibangun sesuai dengan dokumen spesifikasi: **"Konsep Web Aplikasi Pengelolaan Umpan Balik Pengguna (Layanan Keluhan, Pelaporan Kesalahan, Pertanyaan, dan Saran Pengguna Aplikasi)"**.

---

## 🌟 Fitur Utama Berdasarkan Dokumen Spesifikasi

| Seksi Dokumen | Fitur di UR-APP | Deskripsi Implementasi |
| :--- | :--- | :--- |
| **Seksi 1 & 9** | Skenario Aplikasi Akademik Kampus | Dilengkapi data riil kampus: Kasus KRS Mahasiswa (Error 500 Deadlock), Pembayaran UKT, Cetak KHS, dan Saran Dark Mode. |
| **Seksi 3** | 5 Peran Pengguna (RBAC) | **Pengguna (Mahasiswa)**, **Petugas Layanan (Helpdesk)**, **Tim Teknis (Developer)**, **Administrator (PUSDATIN)**, dan **Pimpinan (Wakil Rektor)**. Dilengkapi panel cepat *Beralih Peran* di header untuk pengujian instan. |
| **Seksi 4 & 5** | Formulir Umpan Balik Lengkap | Input nama aplikasi, menu/fitur, jenis umpan balik (Keluhan, Bug, Pertanyaan, Saran), judul, deskripsi rinci, langkah kejadian (*steps to reproduce*), waktu kejadian, deteksi otomatis perangkat & browser, serta lampiran berkas (gambar/PDF maks 5 MB). Disertai **Banner Peringatan Keamanan** (larangan memasukkan kata sandi / PIN). |
| **Seksi 4** | Nomor Tiket Otomatis | Penomoran unik berformat standar `TKT-YYYYMMDD-XXXX`. |
| **Seksi 6** | Aturan Prioritas Cerdas | Pengelompokan `Tinggi`, `Sedang`, `Rendah` berdasarkan dampak operasional dan urgensi layanan. |
| **Seksi 7 & 8** | Siklus Status & Alur Penanganan | Siklus lengkap: `Baru` &rarr; `Diverifikasi` &rarr; `Diproses` &rarr; `Menunggu Pengguna` &rarr; `Terselesaikan` &rarr; `Ditutup`. |
| **Seksi 8** | Pembukaan Kembali Tiket (*Reopen*) | Pengguna dapat membuka kembali tiket terselesaikan jika masalah belum tuntas. Sistem mengembalikan status ke `Diproses` dan mencatat alasan pembukaan kembali. |
| **Seksi 4 & 12** | Percakapan Tiket (*Threaded Chat*) | Saluran komunikasi interaktif antara pengguna, petugas, dan tim teknis. Tim teknis dapat mengirim **Catatan Internal** yang hanya terlihat oleh staf. |
| **Seksi 4, 12, 14** | Penilaian Layanan (CSAT) | Skor bintang 1 s/d 5 dan ulasan kepuasan pengguna setelah tiket diselesaikan. |
| **Seksi 12 & 13** | Riwayat Aktivitas (*Audit Trail*) | Setiap perubahan status, penugasan petugas, pengiriman solusi, dan pemberian rating tercatat otomatis lengkap dengan waktu dan pelakunya. |
| **Seksi 10 & 14** | Dashboard Evaluasi Pimpinan | 6 Indikator Evaluasi Layanan: Waktu Respons Pertama, Waktu Penyelesaian, Persentase Selesai, Rasio Reopen, Indeks Kepuasan Pengguna (CSAT), dan Grafik Chart.js (Distribusi Aplikasi & Jenis Umpan Balik). |
| **Seksi 4 & 10** | Pusat Bantuan & FAQ | Panduan mandiri untuk kendala yang sering muncul sebelum pengguna membuat tiket. |
| **Seksi 3 & 12** | Panel Administrator | Kelola akun pengguna, master aplikasi kampus, master kategori masalah, pencadangan data JSON, dan integrasi Firebase. |

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi dibangun menggunakan **HTML5, Tailwind CSS, Modular JavaScript (ES Modules), dan Firebase SDK v10**. Aplikasi dapat langsung dijalankan tanpa perlu proses *build* yang rumit!

### Menjalankan Server Lokal (Disarankan):
Buka terminal pada direktori proyek `/Users/user/Documents/GitHub/UR-APP` dan jalankan salah satu perintah berikut:

```bash
# Menggunakan Python 3:
python3 -m http.server 3000

# Atau menggunakan npm:
npm start
```

Kemudian buka peramban (*browser*) Anda di:
👉 **`http://localhost:3000`**

---

## 🗄️ Konfigurasi Database Firebase (Cloud Firestore)

UR-APP memiliki arsitektur **Dual-Engine Firebase**:
1. **Mode Demo / Local Storage (Bawaan Aktif):**
   Aplikasi langsung dapat digunakan dan diuji coba seketika tanpa perlu konfigurasi awal. Seluruh data (skenario mahasiswa KRS, helpdesk, tim teknis, pimpinan) sudah terisi otomatis.
2. **Mode Live Firebase Cloud Firestore:**
   Untuk menghubungkan ke Firebase Anda secara langsung:
   - Buat proyek di [Firebase Console](https://console.firebase.google.com).
   - Aktifkan **Cloud Firestore** pada menu *Build > Firestore Database*.
   - Buka menu **Admin** di aplikasi UR-APP, pilih tab **🔥 Pengaturan Firebase (Database)**.
   - Masukkan konfigurasi `apiKey`, `projectId`, dll., lalu klik **Simpan & Terapkan Konfigurasi**.
   - Klik tombol **"↑ Unggah Data Contoh ke Firestore"** untuk langsung menyinkronkan seluruh master data ke cloud!
   - File keamanan [firestore.rules](firestore.rules) telah disiapkan sesuai dengan matriks hak akses Seksi 13.

---

## 👥 Akun Contoh & Pengujian Peran (Quick Role Switcher)

Anda dapat berganti peran secara instan melalui tombol **Beralih Peran** di navigasi atas:

1. **Pengguna (Mahasiswa)**: `budi.santoso@kampus.ac.id` (Budi Santoso)
   - Buat tiket baru, pantau status tiket KRS, kirim balasan chat, beri rating bintang 5.
2. **Petugas Layanan (Helpdesk)**: `petugas.siti@kampus.ac.id` (Siti Rahma, S.Kom)
   - Antrean tiket baru, verifikasi laporan, ubah prioritas, dan tugaskan tim teknis.
3. **Tim Teknis (Developer)**: `ahmad.fauzi@kampus.ac.id` (Ahmad Fauzi)
   - Tangani tiket penugasan, catat catatan investigasi internal, dan kirim solusi perbaikan deadlock database.
4. **Pimpinan (Wakil Rektor)**: `hendra.wijaya@kampus.ac.id` (Prof. Hendra Wijaya, Ph.D)
   - Pantau metrik SLA waktu respons pertama, persentase resolusi, dan grafik visual Chart.js.
5. **Administrator (PUSDATIN)**: `admin.pusdatin@kampus.ac.id`
   - Manajemen master aplikasi, kategori, pengguna, cadangan data JSON, dan koneksi Firebase.

---

## 📁 Struktur Direktori Proyek

```
UR-APP/
├── index.html                 # Shell antarmuka utama (SPA), navigasi, dan modal
├── css/
│   └── styles.css             # Desain kustom, tipografi, dan format cetak tiket
├── js/
│   ├── app.js                 # Router, inisialisasi aplikasi, dan event controller
│   ├── firebase-config.js     # Manajer inisialisasi Firebase SDK v10 (Live & Local)
│   ├── firestore-service.js   # Layanan basis data Firestore (CRUD tiket, chat, audit)
│   ├── seed-data.js           # Dataset awal skenario akademik kampus (KRS, UKT, dsb)
│   ├── auth.js                # Layanan autentikasi & manajemen sesi peran
│   ├── utils.js               # Helper format tanggal, badge status, generator tiket, toast
│   ├── ticket-detail.js       # Komponen modal detail tiket, chat thread, dan tindakan peran
│   ├── create-ticket-modal.js # Formulir buat laporan umpan balik & unggah lampiran
│   ├── view-user.js           # Tampilan dashboard pengguna / mahasiswa
│   ├── view-officer.js        # Tampilan dashboard petugas helpdesk & verifikasi
│   ├── view-tech.js           # Tampilan dashboard tim teknis & pencatatan perbaikan
│   ├── view-executive.js      # Tampilan dashboard pimpinan & indikator evaluasi Chart.js
│   ├── view-admin.js          # Tampilan manajemen aplikasi, kategori, user & Firebase
│   └── view-helpcenter.js     # Pusat bantuan & FAQ kendala umum
├── firestore.rules            # Aturan keamanan Cloud Firestore berbasis peran (RBAC)
├── firebase.json              # Konfigurasi hosting & aturan Firebase
├── package.json               # Konfigurasi proyek npm
└── README.md                  # Dokumentasi teknis aplikasi
```
