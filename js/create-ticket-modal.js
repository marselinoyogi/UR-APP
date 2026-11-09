/**
 * Modal & Formulir Pembuatan Laporan Umpan Balik
 * Sesuai Dokumen Seksi 5: Formulir Umpan Balik & Peringatan Keamanan
 */

import { firestoreService } from './firestore-service.js';
import { authService } from './auth.js';
import { Utils } from './utils.js';
import { TicketDetail } from './ticket-detail.js';

export const CreateTicketModal = {
  selectedAttachments: [],

  async open() {
    const modal = document.getElementById('create-ticket-modal');
    if (!modal) return;

    this.selectedAttachments = [];
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    await this.render();
  },

  close() {
    const modal = document.getElementById('create-ticket-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  },

  async render() {
    const container = document.getElementById('create-ticket-content');
    if (!container) return;

    const currentUser = authService.getCurrentUser();
    const apps = await firestoreService.getAllApplications();
    const categories = await firestoreService.getAllCategories();
    const nowIso = new Date().toISOString().slice(0, 16);
    const autoDevice = Utils.detectDeviceBrowser();

    container.innerHTML = `
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
            +
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800">Formulir Laporan Umpan Balik Pengguna</h2>
            <p class="text-xs text-slate-500">Keluhan, pelaporan kesalahan sistem (bug), pertanyaan, atau saran aplikasi</p>
          </div>
        </div>
        <button onclick="window.closeCreateTicketModal()" class="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Security Disclaimer Banner (Seksi 5) -->
      <div class="mx-6 mt-5 p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl flex items-start gap-3 text-xs text-amber-900">
        <svg class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <div>
          <span class="font-bold">Peringatan Keamanan & Privasi:</span>
          Jangan pernah menyertakan kata sandi (password), kode PIN, nomor kartu/rekening rahasia, atau data pribadi yang tidak diperlukan dalam laporan ini. Petugas tidak pernah meminta kata sandi Anda.
        </div>
      </div>

      <!-- Main Form Body -->
      <form id="create-ticket-form" onsubmit="window.handleCreateTicketSubmit(event)" class="p-6 space-y-5 overflow-y-auto max-h-[calc(88vh-140px)]">
        
        <!-- Pelapor Info Bar (Readonly identity) -->
        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Identitas Akun</span>
            <span class="font-bold text-slate-800">${currentUser.name}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Email Resmi</span>
            <span class="text-slate-700">${currentUser.email}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Program / Unit</span>
            <span class="text-slate-700">${currentUser.department || 'Pengguna'}</span>
          </div>
        </div>

        <!-- 2 Columns: Application & Feedback Type -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Nama Aplikasi Terkait <span class="text-rose-500">*</span>
            </label>
            <select id="form-app-id" required class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500">
              <option value="">-- Pilih Aplikasi Kampus --</option>
              ${apps.map(a => `
                <option value="${a.id}" data-appname="${a.name}">${a.name}</option>
              `).join('')}
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Jenis Umpan Balik <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label class="flex items-center gap-1.5 p-2 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50 has-[:checked]:border-red-500 has-[:checked]:bg-red-50 font-medium">
                <input type="radio" name="feedbackType" value="Keluhan" class="text-red-600" required>
                <span>Keluhan</span>
              </label>
              <label class="flex items-center gap-1.5 p-2 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 font-medium">
                <input type="radio" name="feedbackType" value="Kesalahan" class="text-orange-600" checked>
                <span>Kesalahan (Bug)</span>
              </label>
              <label class="flex items-center gap-1.5 p-2 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50 has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 font-medium">
                <input type="radio" name="feedbackType" value="Pertanyaan" class="text-sky-600">
                <span>Pertanyaan</span>
              </label>
              <label class="flex items-center gap-1.5 p-2 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 font-medium">
                <input type="radio" name="feedbackType" value="Saran" class="text-emerald-600">
                <span>Saran</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Fitur / Menu & Judul Laporan -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="sm:col-span-1">
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Fitur atau Menu Bermasalah <span class="text-rose-500">*</span>
            </label>
            <input type="text" id="form-feature-name" required placeholder="Contoh: Menu Pengisian KRS Semester Genap"
              class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Judul Laporan / Ringkasan Masalah <span class="text-rose-500">*</span>
            </label>
            <input type="text" id="form-title" required placeholder="Contoh: Pesan Kesalahan Database Lock saat Simpan KRS"
              class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
          </div>
        </div>

        <!-- Deskripsi Masalah Lengkap -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            Deskripsi Masalah / Penjelasan Rinci <span class="text-rose-500">*</span>
          </label>
          <textarea id="form-description" rows="3" required placeholder="Jelaskan secara detail apa yang terjadi, pesan kesalahan yang muncul, atau saran yang ingin disampaikan..."
            class="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none"></textarea>
        </div>

        <!-- Langkah Kejadian (Steps to Reproduce) -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            Langkah Kejadian (Steps to Reproduce)
            <span class="text-[10px] font-normal text-slate-400 ml-1">Sangat membantu tim teknis mereplikasi masalah</span>
          </label>
          <textarea id="form-steps" rows="2" placeholder="1. Buka menu KRS&#10;2. Pilih mata kuliah X&#10;3. Klik tombol Simpan, layar memunculkan error 500"
            class="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none font-mono"></textarea>
        </div>

        <!-- 2 Columns: Waktu Kejadian & Perangkat Browser -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Waktu Kejadian
            </label>
            <input type="datetime-local" id="form-incident-time" value="${nowIso}"
              class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Perangkat & Browser (Terdeteksi Otomatis)
            </label>
            <input type="text" id="form-device-browser" value="${autoDevice}"
              class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
          </div>
        </div>

        <!-- File Upload Section (Seksi 5) -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            Unggah Lampiran Bukti (Tangkapan Layar / Dokumen Pendukung)
            <span class="text-[10px] font-normal text-slate-400 ml-1">Opsional, format JPG, PNG, PDF (Maks. 5 MB)</span>
          </label>
          <div class="border-2 border-dashed border-slate-300 hover:border-sky-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 transition"
            onclick="document.getElementById('form-file-input').click()">
            <input type="file" id="form-file-input" multiple accept="image/png,image/jpeg,image/webp,application/pdf" class="hidden"
              onchange="window.handleAttachmentSelect(event)">
            <svg class="w-8 h-8 text-slate-400 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p class="text-xs font-medium text-slate-700">Klik untuk memilih berkas atau seret berkas ke sini</p>
            <p class="text-[10px] text-slate-400 mt-0.5">Dapat memilih lebih dari 1 file lampiran</p>
          </div>

          <!-- Attachments preview list -->
          <div id="attachments-preview-list" class="flex flex-wrap gap-2 mt-3"></div>
        </div>

        <!-- Form Submit Footer -->
        <div class="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button type="button" onclick="window.closeCreateTicketModal()" class="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition">
            Batal
          </button>
          <button type="submit" id="btn-submit-ticket" class="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Kirimkan Laporan Tiket
          </button>
        </div>
      </form>
    `;
  }
};
