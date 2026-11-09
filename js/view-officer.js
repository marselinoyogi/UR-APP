/**
 * Tampilan Petugas Layanan (Helpdesk / Customer Service)
 * Berdasarkan Dokumen Seksi 3, 6, 7, 10
 */

import { firestoreService } from './firestore-service.js';
import { authService } from './auth.js';
import { Utils } from './utils.js';

export const OfficerView = {
  statusFilter: 'all',
  priorityFilter: 'all',
  appFilter: 'all',
  searchQuery: '',

  async render(targetElement) {
    const currentUser = authService.getCurrentUser();
    const tickets = await firestoreService.getAllTickets();
    const apps = await firestoreService.getAllApplications();

    // Hitung metrik antrean
    const countNew = tickets.filter(t => t.status === 'Baru').length;
    const countVerified = tickets.filter(t => t.status === 'Diverifikasi').length;
    const countProcessing = tickets.filter(t => t.status === 'Diproses').length;
    const countWaitingUser = tickets.filter(t => t.status === 'Menunggu Pengguna').length;
    const countHighPriorityUnresolved = tickets.filter(t => t.priority === 'Tinggi' && !['Terselesaikan', 'Ditutup'].includes(t.status)).length;

    // Filter daftar
    let filtered = tickets;
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === this.statusFilter);
    }
    if (this.priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === this.priorityFilter);
    }
    if (this.appFilter !== 'all') {
      filtered = filtered.filter(t => t.appId === this.appFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.ticketNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.userName.toLowerCase().includes(q) ||
        t.appName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    targetElement.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Antrean & Verifikasi Tiket Layanan
              <span class="text-xs font-semibold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">Petugas Helpdesk</span>
            </h1>
            <p class="text-xs text-slate-500">Pusat penerimaan, verifikasi kelengkapan, penentuan prioritas, dan penugasan teknis.</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.refreshView()" class="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Segarkan Data
            </button>
          </div>
        </div>

        <!-- Priority Alert Bar if High Priority Open -->
        ${countHighPriorityUnresolved > 0 ? `
          <div class="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-center justify-between gap-4 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm">
                !
              </div>
              <div>
                <h4 class="text-xs font-bold text-rose-900">Perhatian: ${countHighPriorityUnresolved} Tiket Prioritas Tinggi Membutuhkan Tindakan Segera</h4>
                <p class="text-[11px] text-rose-700">Gangguan menghentikan layanan utama atau berdampak pada banyak pengguna kampus.</p>
              </div>
            </div>
            <button onclick="window.filterOfficerPriority('Tinggi')" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition whitespace-nowrap shadow-sm">
              Lihat Tiket Tinggi &rarr;
            </button>
          </div>
        ` : ''}

        <!-- Metric Stat Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div onclick="window.filterOfficerStatus('Baru')" class="bg-white p-3.5 rounded-xl border ${this.statusFilter === 'Baru' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'} shadow-sm cursor-pointer hover:border-blue-400 transition">
            <div class="text-[11px] font-semibold text-blue-600 uppercase">Perlu Verifikasi</div>
            <div class="text-xl font-black text-slate-800 mt-1">${countNew} Tiket</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Status Baru</div>
          </div>

          <div onclick="window.filterOfficerStatus('Diverifikasi')" class="bg-white p-3.5 rounded-xl border ${this.statusFilter === 'Diverifikasi' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'} shadow-sm cursor-pointer hover:border-indigo-400 transition">
            <div class="text-[11px] font-semibold text-indigo-600 uppercase">Diverifikasi</div>
            <div class="text-xl font-black text-slate-800 mt-1">${countVerified} Tiket</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Siap Ditugaskan</div>
          </div>

          <div onclick="window.filterOfficerStatus('Diproses')" class="bg-white p-3.5 rounded-xl border ${this.statusFilter === 'Diproses' ? 'border-amber-500 ring-2 ring-amber-200' : 'border-slate-200'} shadow-sm cursor-pointer hover:border-amber-400 transition">
            <div class="text-[11px] font-semibold text-amber-600 uppercase">Sedang Ditangani</div>
            <div class="text-xl font-black text-slate-800 mt-1">${countProcessing} Tiket</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Tim Teknis Aktif</div>
          </div>

          <div onclick="window.filterOfficerStatus('Menunggu Pengguna')" class="bg-white p-3.5 rounded-xl border ${this.statusFilter === 'Menunggu Pengguna' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-slate-200'} shadow-sm cursor-pointer hover:border-purple-400 transition">
            <div class="text-[11px] font-semibold text-purple-600 uppercase">Menunggu Info</div>
            <div class="text-xl font-black text-slate-800 mt-1">${countWaitingUser} Tiket</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Respons Pelapor</div>
          </div>

          <div onclick="window.filterOfficerStatus('all')" class="bg-white p-3.5 rounded-xl border ${this.statusFilter === 'all' ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200'} shadow-sm cursor-pointer hover:border-sky-400 transition">
            <div class="text-[11px] font-semibold text-slate-500 uppercase">Total Antrean</div>
            <div class="text-xl font-black text-slate-800 mt-1">${tickets.length} Tiket</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Semua Laporan</div>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <!-- Status filter -->
            <select onchange="window.filterOfficerStatus(this.value)" class="text-xs p-2 border border-slate-300 rounded-lg bg-white">
              <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>Semua Status</option>
              <option value="Baru" ${this.statusFilter === 'Baru' ? 'selected' : ''}>Baru</option>
              <option value="Diverifikasi" ${this.statusFilter === 'Diverifikasi' ? 'selected' : ''}>Diverifikasi</option>
              <option value="Diproses" ${this.statusFilter === 'Diproses' ? 'selected' : ''}>Diproses</option>
              <option value="Menunggu Pengguna" ${this.statusFilter === 'Menunggu Pengguna' ? 'selected' : ''}>Menunggu Pengguna</option>
              <option value="Terselesaikan" ${this.statusFilter === 'Terselesaikan' ? 'selected' : ''}>Terselesaikan</option>
              <option value="Ditutup" ${this.statusFilter === 'Ditutup' ? 'selected' : ''}>Ditutup</option>
            </select>

            <!-- Priority filter -->
            <select onchange="window.filterOfficerPriority(this.value)" class="text-xs p-2 border border-slate-300 rounded-lg bg-white">
              <option value="all" ${this.priorityFilter === 'all' ? 'selected' : ''}>Semua Prioritas</option>
              <option value="Tinggi" ${this.priorityFilter === 'Tinggi' ? 'selected' : ''}>Prioritas: Tinggi</option>
              <option value="Sedang" ${this.priorityFilter === 'Sedang' ? 'selected' : ''}>Prioritas: Sedang</option>
              <option value="Rendah" ${this.priorityFilter === 'Rendah' ? 'selected' : ''}>Prioritas: Rendah</option>
            </select>

            <!-- Application filter -->
            <select onchange="window.filterOfficerApp(this.value)" class="text-xs p-2 border border-slate-300 rounded-lg bg-white">
              <option value="all" ${this.appFilter === 'all' ? 'selected' : ''}>Semua Aplikasi</option>
              ${apps.map(a => `
                <option value="${a.id}" ${this.appFilter === a.id ? 'selected' : ''}>${a.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Search query -->
          <div class="relative w-full sm:w-64">
            <input type="text" value="${Utils.escapeHTML(this.searchQuery)}" placeholder="Cari tiket, nama, judul..."
              oninput="window.setOfficerSearch(this.value)"
              class="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
            <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z"></path></svg>
          </div>
        </div>

        <!-- Ticket Table -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="px-4 py-3">Nomor Tiket</th>
                  <th class="px-4 py-3">Pelapor</th>
                  <th class="px-4 py-3">Aplikasi & Judul</th>
                  <th class="px-4 py-3">Prioritas</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3">Penugasan Teknis</th>
                  <th class="px-4 py-3">Dibuat / Update</th>
                  <th class="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filtered.length === 0 ? `
                  <tr>
                    <td colspan="8" class="px-4 py-12 text-center text-slate-400">
                      Tidak ada tiket yang sesuai kriteria filter.
                    </td>
                  </tr>
                ` : filtered.map(t => `
                  <tr class="hover:bg-slate-50/80 transition cursor-pointer" onclick="window.openTicketDetail('${t.id}')">
                    <td class="px-4 py-3.5 font-mono font-bold text-sky-700 whitespace-nowrap">
                      ${t.ticketNumber}
                    </td>
                    <td class="px-4 py-3.5">
                      <div class="font-semibold text-slate-800">${t.userName}</div>
                      <div class="text-[10px] text-slate-400">${t.userEmail}</div>
                    </td>
                    <td class="px-4 py-3.5 max-w-xs">
                      <div class="flex items-center gap-1.5 mb-0.5">
                        <span class="font-semibold text-slate-600">${t.appName}</span>
                        ${Utils.getFeedbackTypeBadge(t.feedbackType)}
                      </div>
                      <div class="font-medium text-slate-800 truncate" title="${t.title}">${Utils.escapeHTML(t.title)}</div>
                    </td>
                    <td class="px-4 py-3.5 whitespace-nowrap">
                      ${Utils.getPriorityBadge(t.priority)}
                    </td>
                    <td class="px-4 py-3.5 whitespace-nowrap">
                      ${Utils.getStatusBadge(t.status)}
                    </td>
                    <td class="px-4 py-3.5 whitespace-nowrap">
                      ${t.assignedTechName ? `
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200">
                          🛠 ${t.assignedTechName}
                        </span>
                      ` : `
                        <span class="text-slate-400 italic text-[11px]">Belum ditugaskan</span>
                      `}
                    </td>
                    <td class="px-4 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                      ${Utils.timeAgo(t.updatedAt || t.createdAt)}
                    </td>
                    <td class="px-4 py-3.5 text-right whitespace-nowrap" onclick="event.stopPropagation()">
                      <div class="flex items-center justify-end gap-1.5">
                        ${t.status === 'Baru' ? `
                          <button onclick="window.handleQuickVerify('${t.id}')"
                            class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition">
                            Verifikasi
                          </button>
                        ` : ''}
                        <button onclick="window.openTicketDetail('${t.id}')"
                          class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition">
                          Detail &rarr;
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
};
