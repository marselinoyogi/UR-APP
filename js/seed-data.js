/**
 * Data Awal & Contoh Skenario (Academic Campus Scenario)
 * Berdasarkan Dokumen Konsep Web Aplikasi Pengelolaan Umpan Balik Pengguna
 */

export const InitialSeedData = {
  users: [
    {
      id: 'user-mhs-1',
      email: 'budi.santoso@kampus.ac.id',
      name: 'Budi Santoso (Mahasiswa)',
      role: 'pengguna',
      department: 'S1 Teknik Informatika (NIM 220101050)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      createdAt: '2026-10-01T08:00:00Z'
    },
    {
      id: 'user-mhs-2',
      email: 'anisa.putri@kampus.ac.id',
      name: 'Anisa Putri (Mahasiswa)',
      role: 'pengguna',
      department: 'S1 Sistem Informasi (NIM 220202014)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      createdAt: '2026-10-05T09:30:00Z'
    },
    {
      id: 'user-petugas-1',
      email: 'petugas.siti@kampus.ac.id',
      name: 'Siti Rahma, S.Kom',
      role: 'petugas',
      department: 'Unit Layanan Terpadu & Helpdesk Akademik',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces',
      createdAt: '2026-09-01T08:00:00Z'
    },
    {
      id: 'user-teknis-1',
      email: 'ahmad.fauzi@kampus.ac.id',
      name: 'Ahmad Fauzi (Tim Teknis SIAKAD)',
      role: 'teknis',
      department: 'Divisi Pengembangan Aplikasi & Basis Data PUSDATIN',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces',
      createdAt: '2026-09-01T08:00:00Z'
    },
    {
      id: 'user-admin-1',
      email: 'admin.pusdatin@kampus.ac.id',
      name: 'Administrator Sistem',
      role: 'admin',
      department: 'Pusat Data dan Teknologi Informasi (PUSDATIN)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
      createdAt: '2026-08-01T08:00:00Z'
    },
    {
      id: 'user-pimpinan-1',
      email: 'hendra.wijaya@kampus.ac.id',
      name: 'Prof. Hendra Wijaya, Ph.D',
      role: 'pimpinan',
      department: 'Wakil Rektor Bidang Sistem Informasi & Perencanaan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      createdAt: '2026-08-01T08:00:00Z'
    }
  ],

  applications: [
    {
      id: 'app-siakad',
      name: 'SIAKAD (Sistem Informasi Akademik)',
      description: 'Aplikasi pengelolaan KRS, KHS, jadwal kuliah, dan transkrip nilai akademik.',
      active: true
    },
    {
      id: 'app-portal',
      name: 'Portal Mahasiswa Terpadu',
      description: 'Layanan terpadu mahasiswa untuk pengumuman, biodata, dan beasiswa.',
      active: true
    },
    {
      id: 'app-elibrary',
      name: 'Perpustakaan Online (E-Library)',
      description: 'Peminjaman buku digital, repositori skripsi, dan jurnal ilmiah kampus.',
      active: true
    },
    {
      id: 'app-lms',
      name: 'LMS EduLearn',
      description: 'Sistem pembelajaran daring kampus, pengumpulan tugas, dan kuis online.',
      active: true
    }
  ],

  categories: [
    {
      id: 'cat-krs',
      name: 'Pengisian & Revisi KRS',
      description: 'Kendala seputar pemilihan mata kuliah, kuota kelas, atau bentrok jadwal.',
      defaultPriority: 'Tinggi'
    },
    {
      id: 'cat-ukt',
      name: 'Pembayaran UKT & Keuangan',
      description: 'Verifikasi pembayaran virtual account, beasiswa, dan bukti transfer.',
      defaultPriority: 'Tinggi'
    },
    {
      id: 'cat-auth',
      name: 'Akun, Login & Sandi',
      description: 'Kendala lupa kata sandi, akun terkunci, atau integrasi Single Sign-On (SSO).',
      defaultPriority: 'Sedang'
    },
    {
      id: 'cat-bug',
      name: 'Kesalahan Sistem (Bug/Error)',
      description: 'Pesan galat 500, tombol tidak berfungsi, atau halaman crash.',
      defaultPriority: 'Sedang'
    },
    {
      id: 'cat-saran',
      name: 'Saran Fitur & Peningkatan UI',
      description: 'Usulan desain baru, penambahan fitur kenyamanan penggunaan aplikasi.',
      defaultPriority: 'Rendah'
    },
    {
      id: 'cat-pertanyaan',
      name: 'Pertanyaan Umum Layanan',
      description: 'Pertanyaan tata cara pengoperasian dan regulasi akademik.',
      defaultPriority: 'Rendah'
    }
  ],

  faqs: [
    {
      id: 'faq-1',
      title: 'Bagaimana cara mengatasi error saat menyimpan KRS?',
      category: 'Pengisian KRS',
      snippet: 'Pastikan koneksi stabil dan kuota mata kuliah belum penuh. Jika kuota penuh, hubungi dosen PA.',
      content: '1. Periksa apakah masa pengisian KRS masih dalam periode aktif di kalender akademik.<br>2. Hapus cache browser Anda (Ctrl+Shift+R atau Cmd+Shift+R).<br>3. Pastikan tidak ada mata kuliah dengan jadwal bentrok.<br>4. Jika masih muncul pesan "Database Lock", kirim laporan dengan menyertakan tangkapan layar kesalahan.'
    },
    {
      id: 'faq-2',
      title: 'Berapa lama batas waktu verifikasi pembayaran UKT?',
      category: 'Keuangan',
      snippet: 'Pembayaran melalui Virtual Account otomatis terverifikasi dalam 10-15 menit.',
      content: 'Sistem perbankan kampus terhubung langsung dengan SIAKAD. Apabila setelah 1 jam status pembayaran belum berubah, mohon buat laporan tiket pada kategori "Pembayaran UKT" dengan melampirkan bukti struk/mutasi bank.'
    },
    {
      id: 'faq-3',
      title: 'Bagaimana prosedur reset kata sandi akun SSO kampus?',
      category: 'Akun & Login',
      snippet: 'Gunakan tombol "Lupa Kata Sandi" di halaman utama login untuk menerima tautan di email institusi.',
      content: 'Tautan reset sandi dikirimkan ke email resmi mahasiswa (@kampus.ac.id). Jika Anda kehilangan akses ke email institusi, laporkan ke Unit Layanan Terpadu dengan menyertakan foto Kartu Tanda Mahasiswa (KTM).'
    },
    {
      id: 'faq-4',
      title: 'Berapa batas ukuran dan format lampiran yang diterima?',
      category: 'Umum',
      snippet: 'Format JPG, PNG, PDF dengan ukuran maksimal 5 MB per berkas.',
      content: 'Untuk menjaga keamanan dan kecepatan proses tiket, lampiran dibatasi pada tangkapan layar (screenshot format .jpg/.png) atau dokumen pendukung (.pdf) dengan ukuran maksimum 5MB. Jangan mengunggah berkas zip/exe atau menyertakan data sensitif seperti password akun.'
    }
  ],

  tickets: [
    {
      id: 'ticket-krs-001',
      ticketNumber: 'TKT-20261109-0001',
      userId: 'user-mhs-1',
      userName: 'Budi Santoso (Mahasiswa)',
      userEmail: 'budi.santoso@kampus.ac.id',
      appId: 'app-siakad',
      appName: 'SIAKAD (Sistem Informasi Akademik)',
      featureName: 'Formulir Pemilihan Mata Kuliah KRS Semester Genap',
      feedbackType: 'Kesalahan',
      title: 'Pesan Kesalahan "Error 500: Database Deadlock" saat Simpan KRS',
      description: 'Setiap kali saya mengklik tombol "Simpan & Kunci KRS", aplikasi berputar selama 30 detik kemudian memunculkan pesan error 500 dan mata kuliah yang saya centang hilang kembali.',
      stepsToReproduce: '1. Masuk ke SIAKAD menu Akademik > Pengisian KRS.\n2. Pilih 6 mata kuliah pilihan (total 21 SKS).\n3. Klik tombol biru "Simpan & Kunci KRS".\n4. Layar menampilkan modal "Terjadi kesalahan internal server (500)".',
      incidentTime: '2026-11-09T09:15:00Z',
      deviceBrowser: 'macOS / Google Chrome 120.0',
      priority: 'Tinggi',
      status: 'Ditutup',
      assignedOfficerId: 'user-petugas-1',
      assignedOfficerName: 'Siti Rahma, S.Kom',
      assignedTechId: 'user-teknis-1',
      assignedTechName: 'Ahmad Fauzi (Tim Teknis SIAKAD)',
      attachments: [
        {
          id: 'att-1',
          name: 'screenshot-error-500-krs.png',
          type: 'image/png',
          size: '340 KB',
          url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
        }
      ],
      createdAt: '2026-11-09T09:20:00Z',
      updatedAt: '2026-11-09T11:45:00Z',
      firstResponseTime: '2026-11-09T09:35:00Z',
      resolvedAt: '2026-11-09T11:15:00Z',
      closedAt: '2026-11-09T11:45:00Z',
      reopenedCount: 0,
      reopenReason: null
    },
    {
      id: 'ticket-ukt-002',
      ticketNumber: 'TKT-20261109-0002',
      userId: 'user-mhs-2',
      userName: 'Anisa Putri (Mahasiswa)',
      userEmail: 'anisa.putri@kampus.ac.id',
      appId: 'app-portal',
      appName: 'Portal Mahasiswa Terpadu',
      featureName: 'Menu Verifikasi Pembayaran UKT Semester Genap',
      feedbackType: 'Keluhan',
      title: 'Status Pembayaran UKT Masih "Belum Lunas" padahal Transaksi Bank Berhasil',
      description: 'Saya sudah mentransfer melalui Virtual Account BNI kemarin sore pukul 16.00 WIB dan menerima notifikasi SMS sukses dari bank. Namun saat memeriksa menu KRS di SIAKAD, sistem masih mengunci dengan status UKT Belum Lunas.',
      stepsToReproduce: '1. Bayar via ATM BNI VA 8808123456.\n2. Login Portal Mahasiswa > Riwayat Pembayaran.\n3. Status masih tertulis Belum Terverifikasi.',
      incidentTime: '2026-11-08T16:05:00Z',
      deviceBrowser: 'Windows 11 / Microsoft Edge 119.0',
      priority: 'Tinggi',
      status: 'Diproses',
      assignedOfficerId: 'user-petugas-1',
      assignedOfficerName: 'Siti Rahma, S.Kom',
      assignedTechId: 'user-teknis-1',
      assignedTechName: 'Ahmad Fauzi (Tim Teknis SIAKAD)',
      attachments: [
        {
          id: 'att-2',
          name: 'bukti-transfer-bni-va.jpg',
          type: 'image/jpeg',
          size: '512 KB',
          url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
        }
      ],
      createdAt: '2026-11-09T08:10:00Z',
      updatedAt: '2026-11-09T10:00:00Z',
      firstResponseTime: '2026-11-09T08:25:00Z',
      resolvedAt: null,
      closedAt: null,
      reopenedCount: 0,
      reopenReason: null
    },
    {
      id: 'ticket-khs-003',
      ticketNumber: 'TKT-20261109-0003',
      userId: 'user-mhs-1',
      userName: 'Budi Santoso (Mahasiswa)',
      userEmail: 'budi.santoso@kampus.ac.id',
      appId: 'app-siakad',
      appName: 'SIAKAD (Sistem Informasi Akademik)',
      featureName: 'Cetak Kartu Hasil Studi (KHS) PDF',
      feedbackType: 'Kesalahan',
      title: 'Tombol Cetak KHS Membuka Halaman Kosong (Blank White)',
      description: 'Ketika menekan tombol Cetak KHS Semester Ganjil, tab baru terbuka namun isinya hanya layar putih kosong dan dokumen PDF tidak terunduh.',
      stepsToReproduce: '1. Masuk menu Akademik > Hasil Studi (KHS).\n2. Pilih Semester Ganjil 2025/2026.\n3. Klik icon "Cetak PDF".',
      incidentTime: '2026-11-07T14:00:00Z',
      deviceBrowser: 'iPadOS / Safari Mobile',
      priority: 'Sedang',
      status: 'Diproses',
      assignedOfficerId: 'user-petugas-1',
      assignedOfficerName: 'Siti Rahma, S.Kom',
      assignedTechId: 'user-teknis-1',
      assignedTechName: 'Ahmad Fauzi (Tim Teknis SIAKAD)',
      attachments: [],
      createdAt: '2026-11-07T14:30:00Z',
      updatedAt: '2026-11-09T09:00:00Z',
      firstResponseTime: '2026-11-07T15:00:00Z',
      resolvedAt: '2026-11-08T10:00:00Z',
      closedAt: null,
      reopenedCount: 1,
      reopenReason: 'Perbaikan sebelumnya sudah dicoba, tetapi di Safari iPadOS masih tetap blank putih, baru berfungsi di Chrome PC.'
    },
    {
      id: 'ticket-darkmode-004',
      ticketNumber: 'TKT-20261109-0004',
      userId: 'user-mhs-2',
      userName: 'Anisa Putri (Mahasiswa)',
      userEmail: 'anisa.putri@kampus.ac.id',
      appId: 'app-portal',
      appName: 'Portal Mahasiswa Terpadu',
      featureName: 'Tampilan Utama Portal & LMS',
      feedbackType: 'Saran',
      title: 'Usulan Penambahan Fitur Tema Gelap (Dark Mode) untuk Kenyamanan Belajar Malam',
      description: 'Mohon dipertimbangkan untuk menambahkan tombol toggle Dark Mode pada dashboard portal mahasiswa dan LMS, agar mata tidak cepat lelah saat mengerjakan kuis atau membaca modul pada malam hari.',
      stepsToReproduce: 'Usulan antarmuka baru di bagian pengaturan profil.',
      incidentTime: '2026-11-09T13:00:00Z',
      deviceBrowser: 'Android 14 / Google Chrome Mobile',
      priority: 'Rendah',
      status: 'Baru',
      assignedOfficerId: null,
      assignedOfficerName: null,
      assignedTechId: null,
      assignedTechName: null,
      attachments: [],
      createdAt: '2026-11-09T13:10:00Z',
      updatedAt: '2026-11-09T13:10:00Z',
      firstResponseTime: null,
      resolvedAt: null,
      closedAt: null,
      reopenedCount: 0,
      reopenReason: null
    }
  ],

  ticket_messages: [
    {
      id: 'msg-krs-1',
      ticketId: 'ticket-krs-001',
      senderId: 'user-mhs-1',
      senderName: 'Budi Santoso',
      senderRole: 'pengguna',
      message: 'Halo Petugas, mohon bantuannya karena batas pengisian KRS berakhir besok sore dan saya tidak bisa menyimpan mata kuliah wajib semester ini.',
      isInternal: false,
      attachments: [],
      createdAt: '2026-11-09T09:20:00Z'
    },
    {
      id: 'msg-krs-2',
      ticketId: 'ticket-krs-001',
      senderId: 'user-petugas-1',
      senderName: 'Siti Rahma, S.Kom',
      senderRole: 'petugas',
      message: 'Halo Budi, terima kasih atas laporannya. Laporan sudah diverifikasi dan dikategorikan sebagai prioritas Tinggi. Kami telah menugaskan Mas Ahmad dari Tim Teknis SIAKAD untuk memeriksa lock transaksi pada basis data.',
      isInternal: false,
      attachments: [],
      createdAt: '2026-11-09T09:35:00Z'
    },
    {
      id: 'msg-krs-3',
      ticketId: 'ticket-krs-001',
      senderId: 'user-teknis-1',
      senderName: 'Ahmad Fauzi (Tim Teknis SIAKAD)',
      senderRole: 'teknis',
      message: 'Catatan Teknis Internal: Terjadi connection pooling timeout dan deadlock pada tabel krs_detail saat verifikasi prasyarat mata kuliah berbarengan dengan 1.200 request aktif.',
      isInternal: true,
      attachments: [],
      createdAt: '2026-11-09T10:15:00Z'
    },
    {
      id: 'msg-krs-4',
      ticketId: 'ticket-krs-001',
      senderId: 'user-teknis-1',
      senderName: 'Ahmad Fauzi (Tim Teknis SIAKAD)',
      senderRole: 'teknis',
      message: 'Perbaikan telah kami terapkan: index basis data telah dioptimalkan dan transaction isolation level disesuaikan. Kami telah menguji simulasi simpan pada akun Anda dan berhasil. Silakan dicoba kembali pengisian KRS Anda.',
      isInternal: false,
      attachments: [],
      createdAt: '2026-11-09T11:15:00Z'
    },
    {
      id: 'msg-krs-5',
      ticketId: 'ticket-krs-001',
      senderId: 'user-mhs-1',
      senderName: 'Budi Santoso',
      senderRole: 'pengguna',
      message: 'Sudah saya coba barusan dan langsung sukses tersimpan tanpa error lagi! Terima kasih banyak atas respons cepatnya tim helpdesk dan teknis.',
      isInternal: false,
      attachments: [],
      createdAt: '2026-11-09T11:40:00Z'
    }
  ],

  ticket_history: [
    {
      id: 'hist-krs-1',
      ticketId: 'ticket-krs-001',
      actorId: 'user-mhs-1',
      actorName: 'Budi Santoso',
      actorRole: 'pengguna',
      action: 'TIKET_DIBUAT',
      details: 'Tiket berhasil dibuat dengan nomor TKT-20261109-0001 dan status "Baru".',
      timestamp: '2026-11-09T09:20:00Z'
    },
    {
      id: 'hist-krs-2',
      ticketId: 'ticket-krs-001',
      actorId: 'user-petugas-1',
      actorName: 'Siti Rahma, S.Kom',
      actorRole: 'petugas',
      action: 'DIVERIFIKASI',
      details: 'Petugas memeriksa kelengkapan bukti dan menetapkan status "Diverifikasi" dengan prioritas "Tinggi".',
      timestamp: '2026-11-09T09:30:00Z'
    },
    {
      id: 'hist-krs-3',
      ticketId: 'ticket-krs-001',
      actorId: 'user-petugas-1',
      actorName: 'Siti Rahma, S.Kom',
      actorRole: 'petugas',
      action: 'PENUGASAN_TEKNIS',
      details: 'Tiket ditugaskan kepada Ahmad Fauzi (Tim Teknis SIAKAD). Status berubah menjadi "Diproses".',
      timestamp: '2026-11-09T09:35:00Z'
    },
    {
      id: 'hist-krs-4',
      ticketId: 'ticket-krs-001',
      actorId: 'user-teknis-1',
      actorName: 'Ahmad Fauzi',
      actorRole: 'teknis',
      action: 'SOLUSI_DIBERIKAN',
      details: 'Tim teknis mencatat perbaikan deadlock basis data dan mengubah status tiket menjadi "Terselesaikan".',
      timestamp: '2026-11-09T11:15:00Z'
    },
    {
      id: 'hist-krs-5',
      ticketId: 'ticket-krs-001',
      actorId: 'user-mhs-1',
      actorName: 'Budi Santoso',
      actorRole: 'pengguna',
      action: 'KONFIRMASI_SELESAI',
      details: 'Pengguna mengonfirmasi bahwa kendala telah selesai. Status tiket menjadi "Ditutup".',
      timestamp: '2026-11-09T11:45:00Z'
    },
    {
      id: 'hist-krs-6',
      ticketId: 'ticket-krs-001',
      actorId: 'user-mhs-1',
      actorName: 'Budi Santoso',
      actorRole: 'pengguna',
      action: 'PENILAIAN_DIBERIKAN',
      details: 'Pengguna memberikan penilaian layanan skor 5 bintang dengan komentar kepuasan.',
      timestamp: '2026-11-09T11:46:00Z'
    }
  ],

  ratings: [
    {
      id: 'rate-1',
      ticketId: 'ticket-krs-001',
      userId: 'user-mhs-1',
      userName: 'Budi Santoso',
      score: 5,
      comment: 'Penanganan sangat cepat dan solutif! Dalam waktu 2 jam kendala database lock berhasil diperbaiki sehingga saya tidak terlambat mengisi KRS.',
      createdAt: '2026-11-09T11:46:00Z'
    }
  ]
};
