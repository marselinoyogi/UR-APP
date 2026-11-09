/**
 * Tampilan Pengguna Rumah Sakit (Dokter, Perawat, Nakes, Admisi & Farmasi)
 * Berdasarkan Dokumen Seksi 3, 5, 10
 */

import { firestoreService } from './firestore-service.js';
import { authService } from './auth.js';
import { Utils } from './utils.js';

export const UserView = {
  currentTab: 'all', // all, active, resolved, closed
  searchQuery: '',

  async render(targetElement) {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    const allTickets = await firestoreService.getAllTickets();
    const userTickets = allTickets.filter(t => t.userId === currentUser.id);

    // Hitung ringkasan
    const activeCount = userTickets.filter(t => ['Baru', 'Diverifikasi', 'Diproses', 'Menunggu Pengguna'].includes(t.status)).length;
    const resolvedCount = userTickets.filter(t => t.status === 'Terselesaikan').length;
    const closedCount = userTickets.filter(t => t.status === 'Ditutup').length;

    // Filter berdasarkan tab & search
    let filtered = userTickets;
    if (this.currentTab === 'active') {
      filtered = filtered.filter(t => ['Baru', 'Diverifikasi', 'Diproses', 'Menunggu Pengguna'].includes(t.status));
    } else if (this.currentTab === 'resolved') {
      filtered = filtered.filter(t => t.status === 'Terselesaikan');
    } else if (this.currentTab === 'closed') {
      filtered = filtered.filter(t => t.status === 'Ditutup');
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.ticketNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.appName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    targetElement.innerHTML = `
      <div class="space-y-6">
        <!-- Top Welcome & Quick Actions (Hospital Style) -->
        <div class="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
          <div class="space-y-1">
            <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-teal-100">
              Instalasi SIMRS & TI Rumah Sakit
            </span>
            <h1 class="text-2xl font-black tracking-tight">Selamat Bertugas, ${currentUser.name}!</h1>
            <p class="text-sm text-teal-100 max-w-xl">
              Pusat pelaporan insiden sistem SIMRS, kendala bridging BPJS, antrean e-resep, dan perangkat IT ruangan medis. Pantau penanganan laporan Anda secara real-time.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="window.openCreateTicketModal()" class="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
              Laporkan Gangguan SIMRS
            </button>
            <button onclick="window.navigateTo('helpcenter')" class="px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-semibold text-white border border-white/20 transition flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              SOP Gangguan IT RS
            </button>
          </div>
        </div>

        <!-- Metric Stat Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
              ${userTickets.length}
            </div>
            <div>
              <div class="text-xs text-slate-500 font-medium">Total Laporan Ruangan</div>
              <div class="text-lg font-black text-slate-800">${userTickets.length} Tiket</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
              ${activeCount}
            </div>
            <div>
              <div class="text-xs text-slate-500 font-medium">Ditangani Tim IT RS</div>
              <div class="text-lg font-black text-amber-600">${activeCount} Tiket</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
              ${resolvedCount}
            </div>
            <div>
              <div class="text-xs text-slate-500 font-medium">Menunggu Konfirmasi Nakes</div>
              <div class="text-lg font-black text-emerald-600">${resolvedCount} Tiket</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-lg">
              ${closedCount}
            </div>
            <div>
              <div class="text-xs text-slate-500 font-medium">Insiden Selesai / Normal</div>
              <div class="text-lg font-black text-slate-700">${closedCount} Tiket</div>
            </div>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <!-- Status Tabs -->
          <div class="flex items-center gap-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button onclick="window.setUserTab('all')" class="px-3 py-1.5 rounded-md transition ${this.currentTab === 'all' ? 'bg-white shadow text-slate-800 font-bold' : 'text-slate-600 hover:text-slate-900'}">
              Semua Laporan (${userTickets.length})
            </button>
            <button onclick="window.setUserTab('active')" class="px-3 py-1.5 rounded-md transition ${this.currentTab === 'active' ? 'bg-white shadow text-amber-600 font-bold' : 'text-slate-600 hover:text-slate-900'}">
              Diproses IT (${activeCount})
            </button>
            <button onclick="window.setUserTab('resolved')" class="px-3 py-1.5 rounded-md transition ${this.currentTab === 'resolved' ? 'bg-white shadow text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'}">
              Perlu Konfirmasi (${resolvedCount})
            </button>
            <button onclick="window.setUserTab('closed')" class="px-3 py-1.5 rounded-md transition ${this.currentTab === 'closed' ? 'bg-white shadow text-slate-700 font-bold' : 'text-slate-600 hover:text-slate-900'}">
              Ditutup (${closedCount})
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative w-full sm:w-72">
            <input type="text" id="user-search-input" value="${Utils.escapeHTML(this.searchQuery)}" placeholder="Cari nomor tiket, modul, judul..."
              oninput="window.setUserSearch(this.value)"
              class="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z"></path></svg>
          </div>
        </div>

        <!-- Ticket Table / Card List -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="px-5 py-3">Nomor Tiket</th>
                  <th class="px-5 py-3">Modul SIMRS & Ruangan</th>
                  <th class="px-5 py-3">Jenis & Judul Insiden</th>
                  <th class="px-5 py-3">Status</th>
                  <th class="px-5 py-3">Prioritas</th>
                  <th class="px-5 py-3">Pembaruan</th>
                  <th class="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filtered.length === 0 ? `
                  <tr>
                    <td colspan="7" class="px-5 py-12 text-center text-slate-400">
                      <div class="max-w-xs mx-auto space-y-2">
                        <svg class="w-12 h-12 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <p class="font-medium text-slate-600">Tidak ada tiket insiden SIMRS</p>
                        <p class="text-[11px] text-slate-400">Seluruh modul SIMRS dan perangkat ruangan Anda saat ini berjalan normal.</p>
                      </div>
                    </td>
                  </tr>
                ` : filtered.map(t => `
                  <tr class="hover:bg-slate-50/80 transition cursor-pointer" onclick="window.openTicketDetail('${t.id}')">
                    <td class="px-5 py-3.5 font-mono font-bold text-teal-800 whitespace-nowrap">
                      ${t.ticketNumber}
                    </td>
                    <td class="px-5 py-3.5">
                      <div class="font-semibold text-slate-800">${t.appName}</div>
                      <div class="text-[10px] text-slate-400 truncate max-w-[180px]">${t.featureName}</div>
                    </td>
                    <td class="px-5 py-3.5 max-w-sm">
                      <div class="flex items-center gap-2 mb-1">
                        ${Utils.getFeedbackTypeBadge(t.feedbackType)}
                        ${t.reopenedCount > 0 ? '<span class="text-[10px] text-rose-600 font-bold">↻ Reopen Insiden</span>' : ''}
                      </div>
                      <div class="font-medium text-slate-800 truncate">${Utils.escapeHTML(t.title)}</div>
                    </td>
                    <td class="px-5 py-3.5 whitespace-nowrap">
                      ${Utils.getStatusBadge(t.status)}
                    </td>
                    <td class="px-5 py-3.5 whitespace-nowrap">
                      ${Utils.getPriorityBadge(t.priority)}
                    </td>
                    <td class="px-5 py-3.5 text-slate-400 whitespace-nowrap text-[11px]">
                      ${Utils.timeAgo(t.updatedAt || t.createdAt)}
                    </td>
                    <td class="px-5 py-3.5 text-right whitespace-nowrap">
                      <button onclick="event.stopPropagation(); window.openTicketDetail('${t.id}')"
                        class="px-3 py-1 bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 rounded-lg text-xs font-medium transition shadow-sm">
                        Buka &rarr;
                      </button>
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
