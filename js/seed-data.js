/**
 * Data Awal & Skenario SIMRS Skala Rumah Sakit (Hospital IT Support System)
 * Sesuai Dokumen Konsep Pengelolaan Umpan Balik Pengguna & Dukungan Teknis IT RS
 */

export const InitialSeedData = {
  users: [
    {
      id: 'user-dokter-1',
      email: 'dr.bambang.sppd@rsud-sehat.go.id',
      name: 'dr. Bambang Hermanto, Sp.PD',
      role: 'pengguna',
      department: 'Instalasi Rawat Jalan (Poli Penyakit Dalam & IGD)',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&h=120&fit=crop&crop=faces',
      createdAt: '2026-09-01T08:00:00Z'
    },
    {
      id: 'user-perawat-1',
      email: 'ns.ratna@rsud-sehat.go.id',
      name: 'Ns. Ratna Sari, S.Kep',
      role: 'pengguna',
      department: 'Instalasi Gawat Darurat (IGD) & Triase',
      avatar: 'https://images.unsplash.com/photo-1594824813593-3929e0618063?w=120&h=120&fit=crop&crop=faces',
      createdAt: '2026-09-05T09:30:00Z'
    },
    {
      id: 'user-farmasi-1',
      email: 'apt.dewi@rsud-sehat.go.id',
      name: 'Apt. Dewi Lestari, S.Farm',
      role: 'pengguna',
      department: 'Instalasi Farmasi & Depo Obat Rawat Jalan',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=faces',
      createdAt: '2026-09-10T10:00:00Z'
    },
    {
      id: 'user-rekammedis-1',
      email: 'fatimah.rekammedis@rsud-sehat.go.id',
      name: 'Siti Fatimah, A.Md.RMIK',
      role: 'pengguna',
      department: 'Unit Pendaftaran, Admisi Pasien & BPJS Center',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
      createdAt: '2026-09-15T08:00:00Z'
    },
    {
      id: 'user-helpdesk-1',
      email: 'helpdesk.it@rsud-sehat.go.id',
      name: 'Budi Prasetyo, S.Kom (Helpdesk IT RS)',
      role: 'petugas',
      department: 'Instalasi Teknologi Informasi & Helpdesk SIMRS',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces',
      createdAt: '2026-08-01T08:00:00Z'
    },
    {
      id: 'user-programmer-1',
      email: 'hendra.kusuma@rsud-sehat.go.id',
      name: 'Hendra Kusuma, S.T (Programmer SIMRS & Bridging)',
      role: 'teknis',
      department: 'Sub-Bagian Software & Integrasi SIMRS-SatuSehat',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
      createdAt: '2026-08-01T08:00:00Z'
    },
    {
      id: 'user-jaringan-1',
      email: 'bayu.it@rsud-sehat.go.id',
      name: 'Bayu Setiawan, A.Md (Teknisi Jaringan & Server RS)',
      role: 'teknis',
      department: 'Sub-Bagian Infrastruktur Jaringan, Server & Hardware RS',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=faces',
      createdAt: '2026-08-10T08:00:00Z'
    },
    {
      id: 'user-admin-1',
      email: 'admin.simrs@rsud-sehat.go.id',
      name: 'Ir. Andi Wijaya, M.Kom (Kepala Instalasi IT RS)',
      role: 'admin',
      department: 'Instalasi Sistem Informasi Manajemen Rumah Sakit (SIMRS)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces',
      createdAt: '2026-07-01T08:00:00Z'
    },
    {
      id: 'user-direktur-1',
      email: 'direktur.pelayanan@rsud-sehat.go.id',
      name: 'dr. H. Soebroto, Sp.OT, M.Kes (Direktur Pelayanan Medik)',
      role: 'pimpinan',
      department: 'Direksi Pelayanan Medik & Penunjang Rumah Sakit',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
      createdAt: '2026-07-01T08:00:00Z'
    }
  ],

  applications: [
    {
      id: 'app-simrs-rajal',
      name: 'SIMRS Medika - Rawat Jalan & Poli Spesialis',
      description: 'Pencatatan antrean poliklinik, asesmen medis dokter, e-resep, dan rujukan internal.',
      active: true
    },
    {
      id: 'app-simrs-igd',
      name: 'SIMRS Medika - IGD & Triage Kritis',
      description: 'Pendaftaran gawat darurat, triase ATS, observasi, dan transfer pasien rawat inap.',
      active: true
    },
    {
      id: 'app-simrs-rme',
      name: 'SIMRS Medika - Rekam Medis Elektronik (RME / SatuSehat)',
      description: 'Pengisian CPPT terintegrasi, rekam medis digital, persetujuan tindakan medis, dan integrasi SatuSehat Kemenkes.',
      active: true
    },
    {
      id: 'app-simrs-farmasi',
      name: 'SIMRS Medika - Farmasi, Depo Obat & E-Prescription',
      description: 'Penerimaan resep elektronik, telaah obat, peracikan, persediaan gudang farmasi, dan telaah interaksi obat.',
      active: true
    },
    {
      id: 'app-simrs-bpjs',
      name: 'SIMRS Medika - Bridging BPJS Kesehatan (VClaim / E-Klaim)',
      description: 'Penerbitan SEP online, bridging rujukan PCare/FKTP, validasi fingerprint pasien, dan bundling berkas e-klaim.',
      active: true
    },
    {
      id: 'app-simrs-lis',
      name: 'SIMRS Medika - Laboratorium & Radiologi (LIS / PACS)',
      description: 'Order pemeriksaan penunjang lab darah, imaging rontgen/CT-Scan, dan hasil expertise digital.',
      active: true
    },
    {
      id: 'app-simrs-kasir',
      name: 'SIMRS Medika - Billing Kasir & Keuangan Pasien',
      description: 'Perhitungan tarif tindakan, rincian biaya rawat inap, deposit, dan cetak kuitansi pembayaran.',
      active: true
    }
  ],

  categories: [
    {
      id: 'cat-bpjs-bridging',
      name: 'Bridging BPJS V-Claim & SatuSehat',
      description: 'Kendala timeout webservice BPJS, gagal cetak SEP, verifikasi fingerprint, atau sync rekam medis SatuSehat.',
      defaultPriority: 'Tinggi'
    },
    {
      id: 'cat-e-resep',
      name: 'E-Resep & Antrean Farmasi',
      description: 'Resep dokter tidak terbaca di apotek, stok depo tidak sinkron, atau printer etiket obat bermasalah.',
      defaultPriority: 'Tinggi'
    },
    {
      id: 'cat-rme-cppt',
      name: 'Pengisian RME, CPPT & Asesmen Medis',
      description: 'Form SOAP dokter tidak bisa disimpan, template asesmen hilang, tanda tangan digital (TTE) bermasalah.',
      defaultPriority: 'Sedang'
    },
    {
      id: 'cat-billing-kasir',
      name: 'Billing Kasir & Pasien Pulang',
      description: 'Kalkulasi tarif tindakan salah, rincian biaya terkunci, atau status kepulangan pasien macet.',
      defaultPriority: 'Tinggi'
    },
    {
      id: 'cat-hardware-jaringan',
      name: 'Jaringan RS, PC Ruangan & Printer Medis',
      description: 'Koneksi LAN putus di poliklinik/IGD, printer barcode gelang pasien macet, scanner resep offline.',
      defaultPriority: 'Sedang'
    },
    {
      id: 'cat-akun-login',
      name: 'Akun Login & Hak Akses SIMRS',
      description: 'Akun dokter/perawat terkunci, mutasi ruangan, permohonan hak akses modul SIMRS baru.',
      defaultPriority: 'Sedang'
    },
    {
      id: 'cat-saran-simrs',
      name: 'Usulan Fitur & Peningkatan Alur Klinis',
      description: 'Usulan penambahan template klinis, perbaikan tata letak UI SIMRS untuk kecepatan nakes.',
      defaultPriority: 'Rendah'
    }
  ],

  faqs: [
    {
      id: 'faq-rs-1',
      title: 'Apa yang harus dilakukan jika Bridging BPJS V-Claim muncul "Error 504 Gateway Timeout"?',
      category: 'Bridging BPJS',
      snippet: 'Periksa koneksi jaringan VPN BPJS RS. Jika massal, gunakan prosedur pendaftaran manual darurat.',
      content: '1. Periksa apakah lampu indikator internet VPN BPJS di router admisi menyala normal.<br>2. Coba refresh halaman bridging SEP (tekan F5).<br>3. Jika seluruh loket admisi mengalami hal yang sama, server BPJS pusat sedang mengalami lonjakan antrean transaksi.<br>4. Segera lapor ke IT RS melalui tiket prioritas "Tinggi", dan aktifkan form pendaftaran berkas darurat sesuai SOP Pelayanan BPJS No. 402/SOP-RS.'
    },
    {
      id: 'faq-rs-2',
      title: 'Resep elektronik dari poliklinik tidak muncul di layar depo farmasi rawat jalan?',
      category: 'E-Resep',
      snippet: 'Pastikan status kunjungan pasien di Poli sudah berstatus "Selesai Pemeriksaan" dan resep telah di-Finalisasi.',
      content: 'Resep elektronik hanya akan terkirim ke antrean apotek jika dokter telah menekan tombol <strong>"Finalisasi & Kunci Resep"</strong>. Jika status resep masih berupa "Draft", resep belum ditransmisikan ke depo farmasi. Minta dokter pemeriksa untuk memverifikasi kembali status penguncian resep.'
    },
    {
      id: 'faq-rs-3',
      title: 'Printer barcode gelang pasien di IGD tidak merespons atau salah kalibrasi?',
      category: 'Hardware & Jaringan',
      snippet: 'Nyalakan ulang printer TSC/Zebra dan tekan tombol feed selama 3 detik untuk auto-kalibrasi.',
      content: '1. Matikan saklar power printer barcode, tunggu 5 detik, lalu nyalakan kembali.<br>2. Tahan tombol <strong>FEED</strong> sampai lampu berkedip hijau 2 kali untuk kalibrasi ukuran sensor stiker gelang.<br>3. Periksa apakah kabel USB atau kabel LAN terhubung kuat ke PC perawat triage.<br>4. Jika masih bergeser, buat tiket kategori Hardware agar teknisi IT RS mengganti pita ribbon.'
    },
    {
      id: 'faq-rs-4',
      title: 'Bagaimana SOP penanganan gangguan sistem gawat darurat (Kondisi Red Code IT IGD & OK)?',
      category: 'Pelayanan Darurat',
      snippet: 'Layanan IGD dan Kamar Bedah diprioritaskan dengan SLA tanggap di bawah 15 menit.',
      content: 'Sesuai regulasi mutu pelayanan RS, gangguan sistem yang menghentikan alur pelayanan di IGD, ICU, dan Kamar Bedah (OK) dikategorikan sebagai <strong>Prioritas Sangat Tinggi</strong>. Tim IT RS standby 24/7 dan wajib melakukan kontak pertama dalam waktu &le; 10 menit setelah tiket dibuat.'
    }
  ],

  tickets: [
    {
      id: 'ticket-bpjs-001',
      ticketNumber: 'TKT-20261109-0001',
      userId: 'user-rekammedis-1',
      userName: 'Siti Fatimah, A.Md.RMIK',
      userEmail: 'fatimah.rekammedis@rsud-sehat.go.id',
      appId: 'app-simrs-bpjs',
      appName: 'SIMRS Medika - Bridging BPJS Kesehatan (VClaim / E-Klaim)',
      featureName: 'Penerbitan Surat Eligibilitas Peserta (SEP) Rawat Jalan & IGD',
      feedbackType: 'Kesalahan',
      title: 'Bridging BPJS V-Claim Timeout "Error 504: Gateway Timeout" di Loket Admisi IGD',
      description: 'Saat melakukan klik tombol "Terbitkan SEP IGD" untuk pasien rujukan emergency, modul bridging berputar lama (loading 45 detik) lalu memunculkan pesan "Gagal menghubungi service BPJS (Error 504)". Pasien gawat darurat tidak dapat diterbitkan berkas klaimnya sehingga antrean admisi menumpuk.',
      stepsToReproduce: '1. Masuk SIMRS modul Admisi Pasien > Registrasi BPJS.\n2. Masukkan NIK / Nomor Kartu BPJS pasien gawat darurat.\n3. Klik "Ambil Data Peserta & Terbitkan SEP".\n4. Sistem menampilkan modal peringatan timeout server BPJS.',
      incidentTime: '2026-11-09T08:15:00Z',
      deviceBrowser: 'Windows 11 / Google Chrome 120.0 (PC Admisi IGD 02)',
      priority: 'Tinggi',
      status: 'Ditutup',
      assignedOfficerId: 'user-helpdesk-1',
      assignedOfficerName: 'Budi Prasetyo, S.Kom (Helpdesk IT RS)',
      assignedTechId: 'user-programmer-1',
      assignedTechName: 'Hendra Kusuma, S.T (Programmer SIMRS)',
      attachments: [
        {
          id: 'att-rs-1',
          name: 'error-timeout-vclaim-bpjs-admisi.png',
          type: 'image/png',
          size: '410 KB',
          url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
        }
      ],
      createdAt: '2026-11-09T08:20:00Z',
      updatedAt: '2026-11-09T09:40:00Z',
      firstResponseTime: '2026-11-09T08:28:00Z',
      resolvedAt: '2026-11-09T09:15:00Z',
      closedAt: '2026-11-09T09:40:00Z',
      reopenedCount: 0,
      reopenReason: null
    },
    {
      id: 'ticket-farmasi-002',
      ticketNumber: 'TKT-20261109-0002',
      userId: 'user-dokter-1',
      userName: 'dr. Bambang Hermanto, Sp.PD',
      userEmail: 'dr.bambang.sppd@rsud-sehat.go.id',
      appId: 'app-simrs-farmasi',
      appName: 'SIMRS Medika - Farmasi, Depo Obat & E-Prescription',
      featureName: 'Antrean Resep Elektronik Poliklinik Penyakit Dalam',
      feedbackType: 'Keluhan',
      title: 'E-Resep Dokter Spesialis Tidak Tampil di Display Farmasi Rawat Jalan',
      description: 'Sudah 5 pasien berturut-turut yang saya periksa di Poliklinik Penyakit Dalam telah saya resepkan obat kronis dan dikunci di SIMRS, tetapi petugas di Depo Farmasi Rawat Jalan menyatakan antrean resep tidak masuk ke layar peracikan. Pasien komplain menunggu lebih dari 45 menit.',
      stepsToReproduce: '1. Dokter login modul Rawat Jalan > Poli Spesialis Penyakit Dalam.\n2. Input resep racikan insulin dan obat oral hipertensi.\n3. Klik "Finalisasi & Kirim ke Farmasi".\n4. Di layar Farmasi Rawat Jalan, nomor resep tidak muncul di daftar tunggu.',
      incidentTime: '2026-11-09T10:00:00Z',
      deviceBrowser: 'Windows 10 / Google Chrome (PC Ruang Poli Interna 04)',
      priority: 'Tinggi',
      status: 'Diproses',
      assignedOfficerId: 'user-helpdesk-1',
      assignedOfficerName: 'Budi Prasetyo, S.Kom (Helpdesk IT RS)',
      assignedTechId: 'user-programmer-1',
      assignedTechName: 'Hendra Kusuma, S.T (Programmer SIMRS)',
      attachments: [
        {
          id: 'att-rs-2',
          name: 'antrean-farmasi-kosong.png',
          type: 'image/png',
          size: '380 KB',
          url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80'
        }
      ],
      createdAt: '2026-11-09T10:15:00Z',
      updatedAt: '2026-11-09T10:30:00Z',
      firstResponseTime: '2026-11-09T10:22:00Z',
      resolvedAt: null,
      closedAt: null,
      reopenedCount: 0,
      reopenReason: null
    },
    {
      id: 'ticket-printer-003',
      ticketNumber: 'TKT-20261109-0003',
      userId: 'user-perawat-1',
      userName: 'Ns. Ratna Sari, S.Kep',
      userEmail: 'ns.ratna@rsud-sehat.go.id',
      appId: 'app-simrs-igd',
      appName: 'SIMRS Medika - IGD & Triage Kritis',
      featureName: 'Pencetakan Barcode Gelang Pasien & Label Sampel Darah',
      feedbackType: 'Kesalahan',
      title: 'Printer Barcode Gelang Pasien IGD Macet & Lampu Indikator Merah Berkedip',
      description: 'Printer cetak gelang pasien baru di meja Triage IGD tidak dapat mencetak. Lampu merah berkedip terus dan kertas gelang tergulung di dalam rol drum. Pasien IGD baru terpaksa diberi label manual.',
      stepsToReproduce: '1. Klik Cetak Gelang Identitas Pasien Dewasa (Biru/Merah Muda).\n2. Printer bunyi bip 3 kali dan lampu error menyala merah.',
      incidentTime: '2026-11-08T14:00:00Z',
      deviceBrowser: 'Windows 11 / Edge 119 (PC Triage IGD)',
      priority: 'Sedang',
      status: 'Diproses',
      assignedOfficerId: 'user-helpdesk-1',
      assignedOfficerName: 'Budi Prasetyo, S.Kom (Helpdesk IT RS)',
      assignedTechId: 'user-jaringan-1',
      assignedTechName: 'Bayu Setiawan, A.Md (Teknisi Jaringan & Hardware RS)',
      attachments: [],
      createdAt: '2026-11-08T14:15:00Z',
      updatedAt: '2026-11-09T08:30:00Z',
      firstResponseTime: '2026-11-08T14:25:00Z',
      resolvedAt: '2026-11-08T16:00:00Z',
      closedAt: null,
      reopenedCount: 1,
      reopenReason: 'Setelah diperbaiki kemarin sore sempat bisa 3 gelang, pagi ini saat ada pasien rujukan baru macet kembali di rol pemutar stiker.'
    },
    {
      id: 'ticket-template-004',
      ticketNumber: 'TKT-20261109-0004',
      userId: 'user-dokter-1',
      userName: 'dr. Bambang Hermanto, Sp.PD',
      userEmail: 'dr.bambang.sppd@rsud-sehat.go.id',
      appId: 'app-simrs-rme',
      appName: 'SIMRS Medika - Rekam Medis Elektronik (RME / SatuSehat)',
      featureName: 'Pengisian CPPT & Formulir Pengkajian Pasien Geriatri',
      feedbackType: 'Saran',
      title: 'Usulan Template Pengkajian Khusus Pasien Geriatri Terintegrasi pada RME',
      description: 'Mohon ditambahkan sub-template skor ADL (Barthel Index) dan skrining risiko dekubitus Norton otomatis pada lembar CPPT dokter rawat jalan dan rawat inap untuk memenuhi standar kepatuhan akreditasi rumah sakit (STARKES Kemenkes).',
      stepsToReproduce: 'Usulan penambahan dropdown pada form Asesmen Awal Medis RME.',
      incidentTime: '2026-11-09T11:00:00Z',
      deviceBrowser: 'macOS / Safari (Tablet Visite Dokter)',
      priority: 'Rendah',
      status: 'Baru',
      assignedOfficerId: null,
      assignedOfficerName: null,
      assignedTechId: null,
      assignedTechName: null,
      attachments: [],
      createdAt: '2026-11-09T11:10:00Z',
      updatedAt: '2026-11-09T11:10:00Z',
      firstResponseTime: null,
      resolvedAt: null,
      closedAt: null,
      reopenedCount: 0,
      reopenReason: null
    }
  ],

  ticket_messages: [
    {
      id: 'msg-rs-1',
      ticketId: 'ticket-bpjs-001',
      senderId: 'user-rekammedis-1',
      senderName: 'Siti Fatimah, A.Md.RMIK',
      senderRole: 'pengguna',
      message: 'Mohon bantuan segera tim IT RS, ada 12 pasien gawat darurat di IGD yang tertahan pendaftarannya karena bridging BPJS V-Claim timeout terus.',
      isInternal: false,
      attachments: [],
      createdAt: '2026-11-09T08:20:00Z'
    },
    {
      id: 'msg-rs-2',
      ticketId: 'ticket-bpjs-001',
      senderId: 'user-helpdesk-1',
      senderName: 'Budi Prasetyo, S.Kom (Helpdesk IT RS)',
      senderRole: 'petugas',
      message: 'Laporan diterima dan diverifikasi dengan Prioritas TINGGI (Layanan Darurat IGD). Telah ditugaskan ke Mas Hendra (Programmer SIMRS) untuk memeriksa konektivitas VPN IP-Sec BPJS dan service bridging.',
      isInternal: false,
      attachments: [],
      createdAt: '2026-11-09T08:28:00Z'
    },
    {
      id: 'msg-rs-3',
      ticketId: 'ticket-bpjs-001',
      senderId: 'user-programmer-1',
      senderName: 'Hendra Kusuma, S.T (Programmer SIMRS)',
      senderRole: 'teknis',
      message: 'Catatan Teknis IT: Terjadi connection socket reset pada port 8080 service bridging VClaim BPJS akibat sertifikat SSL expired di router gateway BPJS lokal.',
      isInternal: true,
      attachments: [],
      createdAt: '2026-11-09T08:45:00Z'
    },
    {
      id: 'msg-rs-4',
      ticketId: 'ticket-bpjs-001',
      senderId: 'user-programmer-1',
      senderName: 'Hendra Kusuma, S.T (Programmer SIMRS)',
      senderRole: 'teknis',
      message: 'Service bridging telah di-restart dan koneksi VPN dialihkan ke backup tunnel BPJS. Uji coba pembuatan SEP simulasi pada NIK admisi berhasil diterbitkan dalam waktu 2,4 detik. Mohon dicoba kembali di loket IGD.',
      isInternal: false,
      attachments: [],
      createdAt: '2026-11-09T09:15:00Z'
    },
    {
      id: 'msg-rs-5',
      ticketId: 'ticket-bpjs-001',
      senderId: 'user-rekammedis-1',
      senderName: 'Siti Fatimah, A.Md.RMIK',
      senderRole: 'pengguna',
      message: 'Alhamdulillah sudah normal kembali dan SEP 12 pasien IGD sudah berhasil dicetak semua. Terima kasih atas respon daruratnya yang sangat cepat tim IT!',
      isInternal: false,
      attachments: [],
      createdAt: '2026-11-09T09:35:00Z'
    }
  ],

  ticket_history: [
    {
      id: 'hist-rs-1',
      ticketId: 'ticket-bpjs-001',
      actorId: 'user-rekammedis-1',
      actorName: 'Siti Fatimah, A.Md.RMIK',
      actorRole: 'pengguna',
      action: 'TIKET_DIBUAT',
      details: 'Tiket insiden pelayanan IGD dibuat dengan status "Baru" dan kategori Bridging BPJS.',
      timestamp: '2026-11-09T08:20:00Z'
    },
    {
      id: 'hist-rs-2',
      ticketId: 'ticket-helpdesk-1',
      actorId: 'user-helpdesk-1',
      actorName: 'Budi Prasetyo, S.Kom',
      actorRole: 'petugas',
      action: 'DIVERIFIKASI',
      details: 'Helpdesk IT RS memverifikasi urgensi pelayanan kritis dan menetapkan Prioritas "Tinggi".',
      timestamp: '2026-11-09T08:25:00Z'
    },
    {
      id: 'hist-rs-3',
      ticketId: 'ticket-helpdesk-1',
      actorId: 'user-helpdesk-1',
      actorName: 'Budi Prasetyo, S.Kom',
      actorRole: 'petugas',
      action: 'PENUGASAN_TEKNIS',
      details: 'Tiket ditugaskan ke Hendra Kusuma, S.T (Programmer SIMRS). Status berubah menjadi "Diproses".',
      timestamp: '2026-11-09T08:28:00Z'
    },
    {
      id: 'hist-rs-4',
      ticketId: 'ticket-bpjs-001',
      actorId: 'user-programmer-1',
      actorName: 'Hendra Kusuma, S.T',
      actorRole: 'teknis',
      action: 'SOLUSI_DIBERIKAN',
      details: 'Tim teknis menyelesaikan failover tunnel VPN BPJS dan mengubah status menjadi "Terselesaikan".',
      timestamp: '2026-11-09T09:15:00Z'
    },
    {
      id: 'hist-rs-5',
      ticketId: 'ticket-bpjs-001',
      actorId: 'user-rekammedis-1',
      actorName: 'Siti Fatimah, A.Md.RMIK',
      actorRole: 'pengguna',
      action: 'KONFIRMASI_SELESAI',
      details: 'Petugas Admisi IGD mengonfirmasi bridging lancar. Status tiket menjadi "Ditutup".',
      timestamp: '2026-11-09T09:40:00Z'
    },
    {
      id: 'hist-rs-6',
      ticketId: 'ticket-bpjs-001',
      actorId: 'user-rekammedis-1',
      actorName: 'Siti Fatimah, A.Md.RMIK',
      actorRole: 'pengguna',
      action: 'PENILAIAN_DIBERIKAN',
      details: 'Petugas admisi memberikan skor kepuasan 5 bintang atas kecepatan penanganan IT.',
      timestamp: '2026-11-09T09:41:00Z'
    }
  ],

  ratings: [
    {
      id: 'rate-rs-1',
      ticketId: 'ticket-bpjs-001',
      userId: 'user-rekammedis-1',
      userName: 'Siti Fatimah, A.Md.RMIK',
      score: 5,
      comment: 'Penanganan insiden IGD sangat sigap dan tanggap dalam waktu kurang dari 1 jam. Pelayanan admisi pasien darurat dapat terselamatkan tanpa kendala klaim.',
      createdAt: '2026-11-09T09:41:00Z'
    }
  ]
};
