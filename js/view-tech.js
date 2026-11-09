/**
 * Tampilan Tim Teknis (Technical Support / Developer)
 * Berdasarkan Dokumen Seksi 3, 7, 9
 */

import { firestoreService } from './firestore-service.js';
import { authService } from './auth.js';
import { Utils } from './utils.js';

export const TechView = {
  activeTab: 'my-tasks', // 'my-tasks' | 'all-tasks'

  async render(targetElement) {
    const currentUser = authService.getCurrentUser();
    const allTickets = await firestoreService.getAllTickets();

    const myTickets = allTickets.filter(t => t.assignedTechId === currentUser.id);
    const assignedTickets = allTickets.filter(t => !!t.assignedTechId);

    const activeList = this.activeTab === 'my-tasks' ? myTickets : assignedTickets;

    const countMyActive = myTickets.filter(t => ['Diproses', 'Diverifikasi', 'Menunggu Pengguna'].includes(t.status)).length;
    const countMyResolved = myTickets.filter(t => ['Terselesaikan', 'Ditutup'].includes(t.status)).length;
    const countReopened = myTickets.filter(t => t.reopenedCount > 0 && t.status === 'Diproses').length;

    targetElement.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Ruang Kerja Tim Teknis
              <span class="text-xs font-semibold px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-full">Developer & Support</span>
            </h1>
            <p class="text-xs text-slate-500">Penanganan bug, investigasi teknis, pencatatan hasil perbaikan sistem, dan log pengujian.</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.refreshView()" class="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Segarkan Data
            </button>
          </div>
        </div>

        <!-- Metric Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
              ${countMyActive}
            </div>
            <div>
              <div class="text-xs text-slate-500 font-medium">Tugas Sedang Aktif</div>
              <div class="text-lg font-black text-slate-800">${countMyActive} Tiket</div>
              <div class="text-[10px] text-teal-600">Perlu penanganan & pengujian</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
              ${countMyResolved}
            </div>
            <div>
              <div class="text-xs text-slate-500 font-medium">Berhasil Diperbaiki</div>
              <div class="text-lg font-black text-slate-800">${countMyResolved} Tiket</div>
              <div class="text-[10px] text-emerald-600">Solusi telah dikirim</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">
              ${countReopened}
            </div>
            <div>
              <div class="text-xs text-slate-500 font-medium">Tiket Dibuka Kembali</div>
              <div class="text-lg font-black text-rose-700">${countReopened} Tiket</div>
              <div class="text-[10px] text-rose-600">Perlu investigasi ulang</div>
            </div>
          </div>
        </div>

        <!-- Tab Selector -->
        <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs font-semibold">
            <button onclick="window.setTechTab('my-tasks')" class="px-4 py-2 rounded-lg transition ${this.activeTab === 'my-tasks' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-100'}">
              Tugas Ditugaskan ke Saya (${myTickets.length})
            </button>
            <button onclick="window.setTechTab('all-tasks')" class="px-4 py-2 rounded-lg transition ${this.activeTab === 'all-tasks' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-100'}">
              Semua Penugasan Teknis (${assignedTickets.length})
            </button>
          </div>
        </div>

        <!-- Task List Cards -->
        <div class="space-y-4">
          ${activeList.length === 0 ? `
            <div class="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
              <svg class="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <h3 class="font-bold text-slate-700">Tidak ada tiket penugasan saat ini</h3>
              <p class="text-xs text-slate-400 mt-1">Petugas helpdesk belum menetapkan tiket penugasan untuk Anda.</p>
            </div>
          ` : activeList.map(t => `
            <div class="bg-white rounded-xl border border-slate-200 hover:border-teal-400 shadow-sm p-5 transition space-y-4">
              <!-- Top line -->
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    ${t.ticketNumber}
                  </span>
                  ${Utils.getStatusBadge(t.status)}
                  ${Utils.getPriorityBadge(t.priority)}
                  ${Utils.getFeedbackTypeBadge(t.feedbackType)}
                  ${t.reopenedCount > 0 ? `<span class="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">↻ Dibuka Kembali (${t.reopenedCount}x)</span>` : ''}
                </div>
                <div class="text-xs text-slate-400">
                  Pembaruan: ${Utils.timeAgo(t.updatedAt || t.createdAt)}
                </div>
              </div>

              <!-- Main problem info -->
              <div>
                <div class="text-xs font-bold text-teal-700 mb-0.5">
                  ${t.appName} &bull; <span class="font-medium text-slate-500">${t.featureName}</span>
                </div>
                <h3 class="text-base font-bold text-slate-800">${Utils.escapeHTML(t.title)}</h3>
                <p class="text-xs text-slate-600 mt-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line">
                  ${Utils.escapeHTML(t.description)}
                </p>
              </div>

              <!-- Steps to reproduce & device -->
              ${t.stepsToReproduce && t.stepsToReproduce !== '-' ? `
                <div class="bg-amber-50/50 p-3 rounded-lg border border-amber-200/50 text-xs">
                  <span class="font-bold text-amber-900 block mb-1">Langkah Kejadian (Steps):</span>
                  <div class="text-slate-700 font-mono whitespace-pre-line">${Utils.escapeHTML(t.stepsToReproduce)}</div>
                </div>
              ` : ''}

              <!-- Bottom Action Bar -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <span>Pelapor: <strong>${t.userName}</strong></span>
                  <span>&bull;</span>
                  <span>Perangkat: <span class="font-mono text-[11px]">${t.deviceBrowser || 'N/A'}</span></span>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick="window.promptSolveModal('${t.id}')"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
                    ✓ Catat Solusi & Selesaikan
                  </button>
                  <button onclick="window.openTicketDetail('${t.id}')"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition">
                    Buka Percakapan & Detail &rarr;
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};
