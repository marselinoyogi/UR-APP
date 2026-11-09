# SIMRS Care & IT Support RS (UR-APP Medika)

Sistem Web Pengelolaan Insiden, Keluhan, dan Dukungan Teknis **SIMRS (Sistem Informasi Manajemen Rumah Sakit)** berbasis **JavaScript** dan **Firebase** (Cloud Firestore & Authentication), dirancang khusus untuk skala operasional rumah sakit sesuai dengan **Standar Akreditasi Rumah Sakit (STARKES Kemenkes)** dan regulasi **Rekam Medis Elektronik (Permenkes No. 24/2022)**.

---

## 🏥 Ruang Lingkup SIMRS & Modul Rumah Sakit

Sistem ini memfasilitasi pelaporan gangguan, eskalasi penanganan, dan komunikasi antara seluruh unit klinis rumah sakit dengan **Instalasi Teknologi Informasi & SIMRS (IT RS)**:

| Modul SIMRS | Deskripsi Layanan Klinis | Kategori Insiden Umum |
| :--- | :--- | :--- |
| **Bridging BPJS (V-Claim / E-Klaim)** | Penerbitan SEP online, bridging rujukan PCare, dan validasi fingerprint pasien. | *Timeout Webservice BPJS (Error 504), SEP Gagal Terbit, Fingerprint Error.* |
| **Farmasi & E-Prescription** | Transmisi resep elektronik dokter poli ke antrean peracikan obat apotek rawat jalan & ranap. | *Resep Dokter Tidak Muncul di Depo, Printer Etiket Macet, Stok Depo Tidak Sinkron.* |
| **IGD & Triage Darurat** | Registrasi gawat darurat, triase ATS, dan transfer pasien cepat. | *Printer Barcode Gelang Pasien Macet, Form Triase Error, Jaringan LAN IGD Offline.* |
| **Rekam Medis Elektronik (RME)** | Pengisian CPPT terintegrasi (SOAP), asesmen awal medis/keperawatan, dan bridging SatuSehat. | *Gagal Kunci CPPT Dokter, Template Asesmen Hilang, Tanda Tangan Elektronik (TTE) Macet.* |
| **Rawat Jalan & Poli Spesialis** | Panggilan antrean poliklinik, riwayat kunjungan pasien, dan rujukan internal. | *Antrean Poli Tidak Memanggil, Status Pemeriksaan Pasien Terkunci.* |
| **Laboratorium & Radiologi (LIS/RIS)** | Order pemeriksaan darah, imaging rontgen/CT-Scan, dan transmisi hasil expertise. | *Koneksi Alat Analyzer Lab Terputus, Viewer PACS Radiologi Blank.* |
| **Kasir & Billing Pasien** | Kalkulasi tarif tindakan, rincian biaya kamar ranap, deposit, dan cetak kuitansi. | *Rincian Tarif Tindakan Terkunci, Perhitungan Selisih Biaya Pasien BPJS Naik Kelas.* |

---

## 👥 5 Peran Pengguna Rumah Sakit (RBAC)

Aplikasi dilengkapi fitur **Beralih Peran RS** di navigasi atas untuk pengujian instan:

1. **Nakes / Ruangan (Pengguna)**:
   - *dr. Bambang Hermanto, Sp.PD* (Dokter Spesialis Penyakit Dalam)
   - *Ns. Ratna Sari, S.Kep* (Perawat Triage IGD)
   - *Apt. Dewi Lestari, S.Farm* (Apoteker Depo Rawat Jalan)
   - *Siti Fatimah, A.Md.RMIK* (Perekam Medis Admisi BPJS)
   - *Hak Akses:* Melaporkan gangguan modul SIMRS, memantau penanganan teknis, konfirmasi penyelesaian, dan memberikan penilaian kepuasan (CSAT).
2. **Helpdesk IT RS (Petugas Layanan)**:
   - *Budi Prasetyo, S.Kom* (Helpdesk & Call Center SIMRS)
   - *Hak Akses:* Triage insiden IT, memverifikasi tingkat kegentingan (Tinggi/Kritis, Sedang, Rendah), menugaskan programmer/teknisi jaringan, dan membalas tanggapan ruangan.
3. **Tim IT RS (Tim Teknis)**:
   - *Hendra Kusuma, S.T* (Programmer SIMRS & Integrasi BPJS/SatuSehat)
   - *Bayu Setiawan, A.Md* (Teknisi Jaringan, Server & Hardware RS)
   - *Hak Akses:* Menangani tiket penugasan, menambahkan **Catatan Teknis Internal**, mencatat tindakan perbaikan database/jaringan, dan mengubah status ke *Terselesaikan*.
4. **Direksi Rumah Sakit (Pimpinan)**:
   - *dr. H. Soebroto, Sp.OT, M.Kes* (Direktur Pelayanan Medik & Penunjang)
   - *Hak Akses:* Memantau kepatuhan target SLA IT RS (&le; 15 menit respon awal untuk unit darurat), rasio uptime modul SIMRS, pola gangguan berulang per modul, dan grafik Chart.js.
5. **Admin SIMRS (Administrator)**:
   - *Ir. Andi Wijaya, M.Kom* (Kepala Instalasi SIMRS)
   - *Hak Akses:* Manajemen master modul SIMRS, kategori gangguan medis, akun staf medis & IT, unduh cadangan data JSON, dan integrasi Firebase Cloud Firestore.

---

## 🔒 Kepatuhan Privasi Data Medis (Permenkes No. 24/2022 & UU PDP)

Formulir laporan insiden dilengkapi **Banner Peringatan Kerahasiaan Data Medis**:
> *"Dilarang menyertakan Nomor NIK, Nama Lengkap Pasien, atau data rekam medis rahasia pada tangkapan layar publik demi mematuhi privasi data medis pasien dan UU Perlindungan Data Pribadi."*

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi dibangun menggunakan **HTML5, Tailwind CSS, Modular JavaScript (ES Modules), dan Firebase SDK v10**.

### Menjalankan Server Lokal:
Aplikasi saat ini telah berjalan pada port 3000. Untuk menjalankan ulang melalui terminal:
```bash
cd /Users/user/Documents/GitHub/UR-APP
python3 -m http.server 3000
# atau
npm start
```
Buka di browser:
👉 **`http://localhost:3000`**

---

## 🗄️ Konfigurasi Database Firebase (Cloud Firestore)

1. **Mode Local Storage RS (Default):**
   Langsung aktif dengan data contoh insiden rumah sakit (Bridging BPJS IGD, E-Resep Poli Dalam, Printer Barcode Gelang Pasien).
2. **Mode Live Firebase Cloud Firestore:**
   - Buka menu **Admin SIMRS** &rarr; tab **🔥 Pengaturan Firebase (Database)**.
   - Masukkan `apiKey`, `projectId`, dll. dari Firebase Console.
   - Klik **Simpan & Terapkan Konfigurasi** lalu klik **"↑ Unggah Data Contoh ke Firestore"**.
   - Berkas keamanan [firestore.rules](firestore.rules) telah disesuaikan dengan matriks hak akses staf medis dan IT rumah sakit.

---

## 📁 Struktur Berkas Proyek

```
UR-APP/
├── index.html                 # Antarmuka utama SIMRS Care & IT Support RS
├── css/
│   └── styles.css             # Tema rumah sakit, tipografi & format cetak bukti insiden
├── js/
│   ├── app.js                 # Router aplikasi SIMRS, controller peran & modal
│   ├── firebase-config.js     # Manajer inisialisasi Firebase Cloud Firestore
│   ├── firestore-service.js   # Layanan basis data (Tiket insiden, chat nakes, audit trail)
│   ├── seed-data.js           # Dataset skenario rumah sakit (IGD, Farmasi, BPJS, RME)
│   ├── auth.js                # Layanan sesi autentikasi staf rumah sakit
│   ├── utils.js               # Helper tanggal Indonesia, badge prioritas RS, notifikasi toast
│   ├── ticket-detail.js       # Komponen detail insiden klinis & percakapan nakes-IT
│   ├── create-ticket-modal.js # Formulir lapor gangguan SIMRS & verifikasi privasi medis
│   ├── view-user.js           # Dashboard tenaga medis / perawat / dokter
│   ├── view-officer.js        # Dashboard triage & antrean helpdesk IT RS
│   ├── view-tech.js           # Dashboard programmer & teknisi jaringan IT RS
│   ├── view-executive.js      # Dashboard evaluasi mutu & kepatuhan SLA Direksi RS
│   ├── view-admin.js          # Panel master modul SIMRS, kategori, dan user RS
│   └── view-helpcenter.js     # Pusat bantuan & SOP penanganan gangguan sistem RS
├── firestore.rules            # Aturan keamanan database Cloud Firestore berbasis peran
├── firebase.json              # Konfigurasi hosting Firebase
├── package.json               # Konfigurasi proyek npm
└── README.md                  # Dokumentasi teknis SIMRS Care
```
