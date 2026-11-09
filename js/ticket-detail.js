/**
 * Komponen Detail Tiket & Percakapan Terpadu
 * UR-APP: Sistem Pengelolaan Umpan Balik Pengguna
 */

import { firestoreService } from './firestore-service.js';
import { authService } from './auth.js';
import { Utils } from './utils.js';

export const TicketDetail = {
  currentTicketId: null,

  async open(ticketId) {
    this.currentTicketId = ticketId;
    const modal = document.getElementById('ticket-detail-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    await this.render();
  },

  close() {
    const modal = document.getElementById('ticket-detail-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
    this.currentTicketId = null;
  },

  async render() {
    const container = document.getElementById('ticket-detail-content');
    if (!container || !this.currentTicketId) return;

    const ticket = await firestoreService.getTicketById(this.currentTicketId);
    if (!ticket) {
      container.innerHTML = `<div class="p-8 text-center text-slate-500">Tiket tidak ditemukan.</div>`;
      return;
    }

    const currentUser = authService.getCurrentUser() || { role: 'pengguna', id: '' };
    const messages = await firestoreService.getMessagesByTicketId(this.currentTicketId);
    const history = await firestoreService.getHistoryByTicketId(this.currentTicketId);
    const rating = await firestoreService.getRatingByTicketId(this.currentTicketId);
    const allUsers = await firestoreService.getAllUsers();
    const technicalStaff = allUsers.filter(u => u.role === 'teknis');
    const officerStaff = allUsers.filter(u => u.role === 'petugas');

    // Filter pesan internal jika pelapor biasa
    const isStaff = ['petugas', 'teknis', 'admin', 'pimpinan'].includes(currentUser.role);
    const visibleMessages = messages.filter(m => !m.isInternal || isStaff);

    // Hitung SLA
    const responseDuration = ticket.firstResponseTime ? Utils.formatDuration(ticket.createdAt, ticket.firstResponseTime) : null;
    const resolutionDuration = ticket.resolvedAt ? Utils.formatDuration(ticket.createdAt, ticket.resolvedAt) : null;

    container.innerHTML = `
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <span class="text-xs font-mono font-bold px-2.5 py-1 bg-white border border-slate-300 rounded shadow-sm text-slate-700">
            ${ticket.ticketNumber}
          </span>
          ${Utils.getStatusBadge(ticket.status)}
          ${Utils.getPriorityBadge(ticket.priority)}
          ${Utils.getFeedbackTypeBadge(ticket.feedbackType)}
          ${ticket.reopenedCount > 0 ? `<span class="px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Dibuka Kembali (${ticket.reopenedCount}x)</span>` : ''}
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.printTicket('${ticket.id}')" class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Cetak Tiket
          </button>
          <button onclick="window.closeTicketDetail()" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <!-- Modal Body (2 Columns Layout) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[calc(88vh-80px)]">
        <!-- Main Column (2 spans): Details & Chat -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title & Core Description -->
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <div class="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-1 flex items-center gap-2">
                <span>${ticket.appName}</span>
                <span>•</span>
                <span class="text-slate-500 font-normal">${ticket.featureName}</span>
              </div>
              <h2 class="text-lg font-bold text-slate-800 leading-snug">${Utils.escapeHTML(ticket.title)}</h2>
            </div>

            <div class="prose prose-sm max-w-none text-slate-700 text-sm whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-100">
              ${Utils.escapeHTML(ticket.description)}
            </div>

            <!-- Steps to reproduce -->
            ${ticket.stepsToReproduce && ticket.stepsToReproduce !== '-' ? `
              <div class="border-t border-slate-100 pt-3">
                <h4 class="text-xs font-bold uppercase text-slate-500 mb-1">Langkah Kejadian (Steps to Reproduce):</h4>
                <p class="text-xs text-slate-600 bg-amber-50/60 border border-amber-200/60 p-3 rounded-lg font-mono whitespace-pre-line leading-relaxed">
                  ${Utils.escapeHTML(ticket.stepsToReproduce)}
                </p>
              </div>
            ` : ''}

            <!-- Metadata info bar -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-lg border border-slate-200/80">
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Waktu Kejadian</span>
                <span class="font-medium text-slate-700">${Utils.formatDate(ticket.incidentTime)}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Perangkat & Browser</span>
                <span class="font-medium text-slate-700 truncate block" title="${ticket.deviceBrowser}">${ticket.deviceBrowser || '-'}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Dibuat Pada</span>
                <span class="font-medium text-slate-700">${Utils.formatDate(ticket.createdAt)}</span>
              </div>
            </div>

            <!-- Attachments -->
            ${(ticket.attachments && ticket.attachments.length > 0) ? `
              <div class="border-t border-slate-100 pt-3">
                <h4 class="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  Lampiran Bukti (${ticket.attachments.length})
                </h4>
                <div class="flex flex-wrap gap-3">
                  ${ticket.attachments.map(att => `
                    <div class="border border-slate-200 rounded-lg p-2.5 bg-white shadow-sm flex items-center gap-3 max-w-xs hover:border-sky-300 transition group">
                      ${att.url && (att.type?.includes('image') || att.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ? `
                        <a href="${att.url}" target="_blank" class="w-12 h-12 rounded bg-slate-100 overflow-hidden shrink-0 border border-slate-200 block">
                          <img src="${att.url}" alt="${att.name}" class="w-full h-full object-cover group-hover:scale-105 transition">
                        </a>
                      ` : `
                        <div class="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase shrink-0">
                          PDF
                        </div>
                      `}
                      <div class="min-w-0 flex-1">
                        <a href="${att.url || '#'}" target="_blank" class="text-xs font-semibold text-slate-700 hover:text-sky-600 truncate block">
                          ${Utils.escapeHTML(att.name)}
                        </a>
                        <span class="text-[10px] text-slate-400">${att.size || 'Lampiran'}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Reopen Alert Box (if applicable) -->
            ${ticket.reopenReason ? `
              <div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800">
                <div class="font-bold mb-1 flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  Tiket Pernah Dibuka Kembali oleh Pelapor:
                </div>
                <p class="italic">"${Utils.escapeHTML(ticket.reopenReason)}"</p>
              </div>
            ` : ''}
          </div>

          <!-- Percakapan / Discussion Timeline -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="font-bold text-sm text-slate-800 flex items-center gap-2">
                <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                Percakapan & Tanggapan (${visibleMessages.length})
              </h3>
              <span class="text-xs text-slate-400">Saluran komunikasi resmi laporan</span>
            </div>

            <!-- Messages Stream -->
            <div class="space-y-4 max-h-96 overflow-y-auto pr-2" id="chat-messages-container">
              ${visibleMessages.length === 0 ? `
                <div class="py-8 text-center text-slate-400 text-xs">
                  Belum ada pesan atau tanggapan. Silakan mulai percakapan di bawah.
                </div>
              ` : visibleMessages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                const isInternal = msg.isInternal;

                return `
                  <div class="flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}">
                    <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 uppercase shrink-0 border border-slate-300">
                      ${msg.senderName ? msg.senderName.charAt(0) : 'U'}
                    </div>
                    <div class="max-w-[85%] space-y-1">
                      <div class="flex items-center gap-2 text-[11px] ${isMe ? 'justify-end' : ''}">
                        <span class="font-semibold text-slate-700">${msg.senderName}</span>
                        ${Utils.getRoleBadge(msg.senderRole)}
                        ${isInternal ? '<span class="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded border border-amber-200">Catatan Internal Teknis</span>' : ''}
                        <span class="text-slate-400">${Utils.timeAgo(msg.createdAt)}</span>
                      </div>
                      <div class="p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isInternal
                          ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-tl-sm'
                          : isMe
                            ? 'bg-sky-600 text-white rounded-tr-sm shadow-sm'
                            : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-sm'
                      }">
                        <div class="whitespace-pre-line">${Utils.escapeHTML(msg.message)}</div>
                        ${(msg.attachments && msg.attachments.length > 0) ? `
                          <div class="mt-2 pt-2 border-t ${isMe ? 'border-sky-500' : 'border-slate-200'} space-y-1">
                            ${msg.attachments.map(a => `
                              <a href="${a.url}" target="_blank" class="flex items-center gap-1.5 underline text-[11px]">
                                📎 ${Utils.escapeHTML(a.name)}
                              </a>
                            `).join('')}
                          </div>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Send Message Box (if ticket is not permanently closed, or allow staff) -->
            ${ticket.status === 'Ditutup' && !isStaff ? `
              <div class="p-3 rounded-lg bg-slate-50 text-slate-500 text-xs text-center border border-slate-200">
                Tiket ini telah ditutup. Untuk melanjutkan diskusi, silakan buka kembali tiket ini.
              </div>
            ` : `
              <form onsubmit="window.handleSendMessage(event, '${ticket.id}')" class="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <textarea id="reply-message-text" rows="3" required placeholder="Tulis balasan, tanggapan, atau catatan penanganan di sini..."
                    class="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition resize-none"></textarea>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-3">
                    ${isStaff ? `
                      <label class="flex items-center gap-1.5 text-xs text-amber-800 cursor-pointer font-medium bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        <input type="checkbox" id="reply-is-internal" class="rounded text-amber-600 focus:ring-amber-500">
                        Catatan Internal (Hanya Helpdesk & Tim IT RS)
                      </label>
                    ` : ''}
                  </div>
                  <button type="submit" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    Kirim Tanggapan
                  </button>
                </div>
              </form>
            `}
          </div>
        </div>

        <!-- Right Column (1 span): Action Panel, Assignment, SLA, Ratings & Audit Trail -->
        <div class="space-y-5">
          <!-- 1. ACTION PANEL (Role Based) -->
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 class="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Tindakan & Pengendalian IT</span>
              <span class="text-[10px] text-teal-700 font-bold">${currentUser.role.toUpperCase()}</span>
            </h3>

            <!-- Actions for Pengguna / Nakes -->
            ${currentUser.role === 'pengguna' ? `
              <div class="space-y-2">
                ${ticket.status === 'Terselesaikan' ? `
                  <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 mb-2">
                    <div class="font-bold mb-1">Perbaikan IT Selesai!</div>
                    Tim IT RS telah mengirimkan hasil perbaikan. Mohon periksa apakah alur klinis di ruangan Anda sudah normal.
                  </div>
                  <button onclick="window.handleConfirmClose('${ticket.id}')" class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition">
                    ✓ Konfirmasi Normal & Tutup Tiket
                  </button>
                  <button onclick="window.promptReopenModal('${ticket.id}')" class="w-full py-2 px-4 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition">
                    ↻ Kendala Masih Terjadi (Buka Kembali)
                  </button>
                ` : ticket.status === 'Ditutup' ? `
                  <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 text-center">
                    Insiden SIMRS ini telah ditutup. Terima kasih atas kerja samanya.
                  </div>
                  <button onclick="window.promptReopenModal('${ticket.id}')" class="w-full py-1.5 px-3 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg text-xs transition">
                    ↻ Buka Kembali Tiket
                  </button>
                ` : `
                  <div class="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    Tiket laporan ruangan Anda berstatus <strong>${ticket.status}</strong>. Tim IT RS akan segera memperbarui laporan ini.
                  </div>
                `}
              </div>
            ` : ''}

            <!-- Actions for Petugas Layanan & Admin -->
            ${(currentUser.role === 'petugas' || currentUser.role === 'admin') ? `
              <div class="space-y-3">
                <!-- Status changer -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Perbarui Status Insiden:</label>
                  <select id="update-ticket-status-select" onchange="window.handleStatusChange('${ticket.id}', this.value)"
                    class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500">
                    <option value="Baru" ${ticket.status === 'Baru' ? 'selected' : ''}>Baru (Menunggu Triage IT)</option>
                    <option value="Diverifikasi" ${ticket.status === 'Diverifikasi' ? 'selected' : ''}>Diverifikasi (Validasi Urgensi)</option>
                    <option value="Diproses" ${ticket.status === 'Diproses' ? 'selected' : ''}>Diproses (Pengerjaan Tim IT)</option>
                    <option value="Menunggu Pengguna" ${ticket.status === 'Menunggu Pengguna' ? 'selected' : ''}>Menunggu Pengguna (Uji Coba Ruangan)</option>
                    <option value="Terselesaikan" ${ticket.status === 'Terselesaikan' ? 'selected' : ''}>Terselesaikan (Solusi Diberikan)</option>
                    <option value="Ditutup" ${ticket.status === 'Ditutup' ? 'selected' : ''}>Ditutup (Pelayanan Normal)</option>
                  </select>
                </div>

                <!-- Priority changer -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kegentingan (Prioritas RS):</label>
                  <select onchange="window.handlePriorityChange('${ticket.id}', this.value)"
                    class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500">
                    <option value="Tinggi" ${ticket.priority === 'Tinggi' ? 'selected' : ''}>Tinggi (Kritis / IGD / Kamar Bedah / Farmasi)</option>
                    <option value="Sedang" ${ticket.priority === 'Sedang' ? 'selected' : ''}>Sedang (Terganggu, Ada Prosedur Manual)</option>
                    <option value="Rendah" ${ticket.priority === 'Rendah' ? 'selected' : ''}>Rendah (Pertanyaan / Usulan Alur Klinis)</option>
                  </select>
                </div>

                <!-- Assign Tech -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Tugaskan Tim IT RS:</label>
                  <select id="assign-tech-select" onchange="window.handleAssignTech('${ticket.id}', this.value)"
                    class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500">
                    <option value="">-- Pilih Staf Tim IT RS --</option>
                    ${technicalStaff.map(tech => `
                      <option value="${tech.id}" ${ticket.assignedTechId === tech.id ? 'selected' : ''}>
                        ${tech.name} (${tech.department})
                      </option>
                    `).join('')}
                  </select>
                </div>
              </div>
            ` : ''}

            <!-- Actions for Tim Teknis -->
            ${currentUser.role === 'teknis' ? `
              <div class="space-y-2">
                <p class="text-xs text-slate-500">
                  Anda masuk sebagai Tim Teknis. Anda dapat mengubah status pengerjaan atau mencatat solusi perbaikan:
                </p>
                <div class="grid grid-cols-2 gap-2">
                  <button onclick="window.handleStatusChange('${ticket.id}', 'Diproses', 'Tim teknis mulai melakukan investigasi & perbaikan.')"
                    class="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-sm transition">
                    Mulai Kerjakan
                  </button>
                  <button onclick="window.promptSolveModal('${ticket.id}')"
                    class="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition">
                    Selesai Dibereskan
                  </button>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- 2. TICKET ASSIGNMENT & SLA INFO -->
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 class="font-bold text-xs uppercase tracking-wider text-slate-500">Penanggung Jawab & SLA</h3>
            
            <div class="space-y-2.5 text-xs">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <span class="text-slate-500">Pelapor</span>
                <span class="font-semibold text-slate-800 text-right">${ticket.userName}</span>
              </div>
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <span class="text-slate-500">Petugas Layanan</span>
                <span class="font-medium ${ticket.assignedOfficerName ? 'text-slate-800' : 'text-slate-400 italic'} text-right">
                  ${ticket.assignedOfficerName || 'Belum Ditentukan'}
                </span>
              </div>
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <span class="text-slate-500">Tim Teknis Penugasan</span>
                <span class="font-medium ${ticket.assignedTechName ? 'text-teal-700 font-semibold' : 'text-slate-400 italic'} text-right">
                  ${ticket.assignedTechName || 'Belum Ditugaskan'}
                </span>
              </div>
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <span class="text-slate-500">Waktu Respons Pertama</span>
                <span class="font-medium text-slate-800">${responseDuration ? responseDuration : 'Menunggu respons'}</span>
              </div>
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <span class="text-slate-500">Durasi Penyelesaian</span>
                <span class="font-medium ${resolutionDuration ? 'text-emerald-700 font-semibold' : 'text-slate-400'}">
                  ${resolutionDuration ? resolutionDuration : 'Belum selesai'}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Frekuensi Dibuka Kembali</span>
                <span class="font-bold ${ticket.reopenedCount > 0 ? 'text-rose-600' : 'text-slate-700'}">
                  ${ticket.reopenedCount} kali
                </span>
              </div>
            </div>
          </div>

          <!-- 3. PENILAIAN KEPUASAN (CSAT RATING) -->
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 class="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Penilaian Layanan</span>
              ${rating ? '<span class="text-emerald-600 font-bold text-[10px]">✓ Dinilai</span>' : ''}
            </h3>

            ${rating ? `
              <div class="bg-amber-50/60 border border-amber-200 rounded-lg p-3 text-xs space-y-2">
                <div class="flex items-center gap-1 text-amber-500 text-base">
                  ${'★'.repeat(rating.score)}${'☆'.repeat(5 - rating.score)}
                  <span class="text-xs font-bold text-slate-700 ml-1.5">${rating.score} / 5</span>
                </div>
                ${rating.comment ? `<p class="text-slate-700 italic text-xs">"${Utils.escapeHTML(rating.comment)}"</p>` : ''}
                <div class="text-[10px] text-slate-400">Dinilai oleh ${rating.userName} • ${Utils.formatDate(rating.createdAt)}</div>
              </div>
            ` : (ticket.status === 'Terselesaikan' || ticket.status === 'Ditutup') && currentUser.role === 'pengguna' ? `
              <form onsubmit="window.handleRatingSubmit(event, '${ticket.id}')" class="space-y-3">
                <p class="text-xs text-slate-600">Seberapa puas Anda dengan penanganan tiket ini?</p>
                <div class="flex items-center justify-center gap-2 py-2">
                  ${[1, 2, 3, 4, 5].map(star => `
                    <label class="cursor-pointer">
                      <input type="radio" name="rating-score" value="${star}" required class="peer sr-only">
                      <span class="text-2xl text-slate-300 peer-checked:text-amber-400 hover:text-amber-400 transition">★</span>
                    </label>
                  `).join('')}
                </div>
                <textarea id="rating-comment" rows="2" placeholder="Tulis masukan Anda mengenai kinerja petugas..."
                  class="w-full text-xs p-2.5 border border-slate-300 rounded-lg resize-none"></textarea>
                <button type="submit" class="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-sm transition">
                  Kirim Penilaian
                </button>
              </form>
            ` : `
              <div class="text-xs text-slate-400 text-center py-2">
                ${ticket.status === 'Ditutup' || ticket.status === 'Terselesaikan'
                  ? 'Pengguna belum memberikan penilaian kepuasan.'
                  : 'Penilaian dapat diisi setelah tiket terselesaikan atau ditutup.'}
              </div>
            `}
          </div>

          <!-- 4. RIWAYAT PERUBAHAN TIKET (AUDIT TRAIL) -->
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 class="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Riwayat Aktivitas</span>
              <span class="text-[10px] text-slate-400">${history.length} log</span>
            </h3>

            <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
              ${history.map((h, i) => `
                <div class="relative pl-5 pb-3 border-l-2 ${i === 0 ? 'border-sky-500' : 'border-slate-200'} text-xs">
                  <div class="absolute -left-[5px] top-0 w-2 h-2 rounded-full ${i === 0 ? 'bg-sky-500' : 'bg-slate-300'}"></div>
                  <div class="font-semibold text-slate-800">${Utils.escapeHTML(h.details)}</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">
                    Oleh <span class="font-medium text-slate-600">${h.actorName}</span> • ${Utils.timeAgo(h.timestamp)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Auto scroll chat to bottom
    const chatContainer = document.getElementById('chat-messages-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
};

