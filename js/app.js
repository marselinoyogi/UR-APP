/**
 * UR-APP: Controller Utama dan Router Aplikasi SIMRS Hospital Support
 * Instalasi SIMRS & Dukungan Teknologi Informasi Rumah Sakit
 */

import { firebaseManager } from './firebase-config.js';
import { firestoreService } from './firestore-service.js';
import { authService } from './auth.js';
import { Utils } from './utils.js';

import { UserView } from './view-user.js';
import { OfficerView } from './view-officer.js';
import { TechView } from './view-tech.js';
import { ExecutiveView } from './view-executive.js';
import { AdminView } from './view-admin.js';
import { HelpCenterView } from './view-helpcenter.js';

import { TicketDetail } from './ticket-detail.js';
import { CreateTicketModal } from './create-ticket-modal.js';

class AppController {
  constructor() {
    this.currentView = 'user'; // 'user' | 'officer' | 'tech' | 'executive' | 'admin' | 'helpcenter'
  }

  async init() {
    // 1. Inisialisasi Firebase Manager (Live or Fallback Local)
    await firebaseManager.initialize();

    // 2. Inisialisasi Auth Session
    await authService.initSession();

    // 3. Set default view based on user role
    this.syncViewToRole();

    // 4. Render UI Shell & Content
    this.renderHeader();
    await this.renderCurrentView();

    // 5. Setup Reactive DB Listener
    firestoreService.subscribe(() => {
      this.renderCurrentView();
      if (TicketDetail.currentTicketId) {
        TicketDetail.render();
      }
    });

    // 6. Setup Auth Listener
    authService.onAuthStateChanged((user) => {
      this.syncViewToRole();
      this.renderHeader();
      this.renderCurrentView();
    });
  }

  syncViewToRole() {
    const user = authService.getCurrentUser();
    if (!user) {
      this.currentView = 'user';
      return;
    }
    if (this.currentView === 'helpcenter') return; // Pertahankan help center jika sedang dibuka

    const role = user.role;
    if (role === 'petugas') this.currentView = 'officer';
    else if (role === 'teknis') this.currentView = 'tech';
    else if (role === 'pimpinan') this.currentView = 'executive';
    else if (role === 'admin') this.currentView = 'admin';
    else this.currentView = 'user';
  }

  renderHeader() {
    const currentUser = authService.getCurrentUser();
    const headerEl = document.getElementById('app-header');
    if (!headerEl || !currentUser) return;

    headerEl.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <!-- Logo & Title Hospital SIMRS -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md">
            ✚
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-black text-slate-800 text-base tracking-tight">SIMRS Care</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">IT Support RS</span>
              ${firebaseManager.isLive ? `
                <span class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Firebase Live
                </span>
              ` : `
                <span class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200" title="Klik menu Admin untuk menghubungkan Firestore live">
                  Local Mode RS
                </span>
              `}
            </div>
            <p class="text-[10px] text-slate-400 hidden sm:block">Instalasi TI & Layanan Dukungan SIMRS Rumah Sakit</p>
          </div>
        </div>

        <!-- Role Quick Switcher Bar (Demo Skala RS) -->
        <div class="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span class="text-[10px] font-bold text-slate-400 uppercase px-2">Beralih Peran RS:</span>
          <button onclick="window.switchRoleDemo('pengguna')" class="px-2.5 py-1 rounded-lg font-semibold transition ${currentUser.role === 'pengguna' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Nakes / Ruangan
          </button>
          <button onclick="window.switchRoleDemo('petugas')" class="px-2.5 py-1 rounded-lg font-semibold transition ${currentUser.role === 'petugas' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Helpdesk IT
          </button>
          <button onclick="window.switchRoleDemo('teknis')" class="px-2.5 py-1 rounded-lg font-semibold transition ${currentUser.role === 'teknis' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Tim IT RS
          </button>
          <button onclick="window.switchRoleDemo('pimpinan')" class="px-2.5 py-1 rounded-lg font-semibold transition ${currentUser.role === 'pimpinan' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Direksi RS
          </button>
          <button onclick="window.switchRoleDemo('admin')" class="px-2.5 py-1 rounded-lg font-semibold transition ${currentUser.role === 'admin' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Admin SIMRS
          </button>
        </div>

        <!-- User Profile & Action Menu -->
        <div class="flex items-center gap-3">
          <button onclick="window.navigateTo('helpcenter')" class="text-xs text-slate-600 hover:text-teal-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition hidden sm:flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            SOP & Bantuan IT RS
          </button>

          <!-- Active User Badge -->
          <div class="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-300 shrink-0">
              <img src="${currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=0D9488&color=fff`}" alt="${currentUser.name}" class="w-full h-full object-cover">
            </div>
            <div class="hidden sm:block text-left text-xs">
              <div class="font-bold text-slate-800 leading-tight">${currentUser.name}</div>
              <div class="text-[10px] text-slate-500 flex items-center gap-1">
                ${Utils.getRoleBadge(currentUser.role)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async renderCurrentView() {
    const container = document.getElementById('app-main-content');
    if (!container) return;

    if (this.currentView === 'user') {
      await UserView.render(container);
    } else if (this.currentView === 'officer') {
      await OfficerView.render(container);
    } else if (this.currentView === 'tech') {
      await TechView.render(container);
    } else if (this.currentView === 'executive') {
      await ExecutiveView.render(container);
    } else if (this.currentView === 'admin') {
      await AdminView.render(container);
    } else if (this.currentView === 'helpcenter') {
      await HelpCenterView.render(container);
    }
  }

  navigateTo(viewName) {
    this.currentView = viewName;
    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export const appController = new AppController();

// ==========================================
// WINDOW GLOBAL HELPERS (Bridging UI Events)
// ==========================================

window.navigateTo = (viewName) => appController.navigateTo(viewName);

window.refreshView = () => {
  appController.renderCurrentView();
  Utils.showToast('Data SIMRS berhasil diperbarui', 'info');
};

// --- Peran & Demo Switcher ---
window.switchRoleDemo = async (roleOrId) => {
  if (['pengguna', 'petugas', 'teknis', 'admin', 'pimpinan'].includes(roleOrId)) {
    await authService.switchRole(roleOrId);
  } else {
    await authService.switchUserById(roleOrId);
  }
};

// --- Modal Tiket Detail ---
window.openTicketDetail = (ticketId) => TicketDetail.open(ticketId);
window.closeTicketDetail = () => TicketDetail.close();

// --- Modal Buat Tiket ---
window.openCreateTicketModal = () => CreateTicketModal.open();
window.closeCreateTicketModal = () => CreateTicketModal.close();

// Handle Attachment Select (convert to Base64 & validate max 5MB)
window.handleAttachmentSelect = (e) => {
  const files = Array.from(e.target.files);
  const maxBytes = 5 * 1024 * 1024; // 5MB

  files.forEach(file => {
    if (file.size > maxBytes) {
      Utils.showToast(`Ukuran berkas "${file.name}" melebihi batas 5 MB!`, 'warning', 'Berkas Terlalu Besar');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const attObj = {
        id: 'att-' + Math.random().toString(36).substr(2, 7),
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(0) + ' KB',
        url: event.target.result
      };
      CreateTicketModal.selectedAttachments.push(attObj);
      renderAttachmentPreview();
    };
    reader.readAsDataURL(file);
  });
};

function renderAttachmentPreview() {
  const list = document.getElementById('attachments-preview-list');
  if (!list) return;
  list.innerHTML = CreateTicketModal.selectedAttachments.map((att, i) => `
    <div class="px-2.5 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-xs flex items-center gap-2">
      <span class="truncate max-w-[150px] font-medium text-teal-900">${Utils.escapeHTML(att.name)}</span>
      <span class="text-[10px] text-teal-600">(${att.size})</span>
      <button type="button" onclick="window.removeAttachment(${i})" class="text-rose-500 hover:text-rose-700 font-bold ml-1">&times;</button>
    </div>
  `).join('');
}

window.removeAttachment = (index) => {
  CreateTicketModal.selectedAttachments.splice(index, 1);
  renderAttachmentPreview();
};

// Submit Buat Tiket Gangguan SIMRS
window.handleCreateTicketSubmit = async (e) => {
  e.preventDefault();
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return;

  const appSelect = document.getElementById('form-app-id');
  const appId = appSelect.value;
  const appName = appSelect.options[appSelect.selectedIndex]?.getAttribute('data-appname') || 'Modul SIMRS';
  const feedbackType = document.querySelector('input[name="feedbackType"]:checked')?.value || 'Kesalahan';
  const featureName = document.getElementById('form-feature-name')?.value.trim();
  const title = document.getElementById('form-title')?.value.trim();
  const description = document.getElementById('form-description')?.value.trim();
  const stepsToReproduce = document.getElementById('form-steps')?.value.trim();
  const incidentTime = document.getElementById('form-incident-time')?.value;
  const deviceBrowser = document.getElementById('form-device-browser')?.value.trim();

  // Tentukan default prioritas berdasarkan unit/kategori kritis (IGD, BPJS, Farmasi = Tinggi)
  let priority = 'Sedang';
  const lowerTitle = (title + ' ' + appName + ' ' + featureName).toLowerCase();
  if (lowerTitle.includes('igd') || lowerTitle.includes('bpjs') || lowerTitle.includes('timeout') || lowerTitle.includes('farmasi') || lowerTitle.includes('resep') || lowerTitle.includes('billing')) {
    priority = 'Tinggi';
  } else if (feedbackType === 'Saran' || feedbackType === 'Pertanyaan') {
    priority = 'Rendah';
  }

  const btn = document.getElementById('btn-submit-ticket');
  if (btn) btn.disabled = true;

  try {
    const newTicket = await firestoreService.createTicket({
      appId,
      appName,
      feedbackType,
      featureName,
      title,
      description,
      stepsToReproduce,
      incidentTime,
      deviceBrowser,
      priority,
      attachments: CreateTicketModal.selectedAttachments
    }, currentUser);

    Utils.showToast(`Laporan insiden SIMRS berhasil dikirim: ${newTicket.ticketNumber}`, 'success', 'Tiket Diterima IT RS');
    CreateTicketModal.close();
    // Buka langsung tiket yang baru dibuat
    TicketDetail.open(newTicket.id);
  } catch (err) {
    console.error(err);
    Utils.showToast('Gagal mengirim laporan: ' + err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
};

// Kirim Tanggapan / Pesan pada Tiket
window.handleSendMessage = async (e, ticketId) => {
  e.preventDefault();
  const textEl = document.getElementById('reply-message-text');
  const isInternalEl = document.getElementById('reply-is-internal');
  const message = textEl?.value.trim();
  const isInternal = !!isInternalEl?.checked;
  const currentUser = authService.getCurrentUser();

  if (!message || !currentUser) return;

  try {
    await firestoreService.addMessage(ticketId, currentUser, message, [], isInternal);
    textEl.value = '';
    Utils.showToast('Tanggapan berhasil dikirim.', 'success');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast('Gagal mengirim pesan: ' + err.message, 'error');
  }
};

// Ubah Status Tiket
window.handleStatusChange = async (ticketId, newStatus, notes = '') => {
  const currentUser = authService.getCurrentUser();
  try {
    await firestoreService.updateTicketStatus(ticketId, newStatus, currentUser, notes);
    Utils.showToast(`Status insiden SIMRS diubah ke "${newStatus}"`, 'success');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast('Gagal mengubah status: ' + err.message, 'error');
  }
};

// Verifikasi Cepat oleh Helpdesk IT RS
window.handleQuickVerify = async (ticketId) => {
  const currentUser = authService.getCurrentUser();
  await firestoreService.updateTicketStatus(ticketId, 'Diverifikasi', currentUser, 'Laporan insiden diverifikasi oleh Helpdesk IT RS.');
  Utils.showToast('Laporan SIMRS telah diverifikasi!', 'success');
  appController.renderCurrentView();
};

// Ubah Prioritas Tiket
window.handlePriorityChange = async (ticketId, newPriority) => {
  const currentUser = authService.getCurrentUser();
  try {
    await firestoreService.updateTicket(ticketId, { priority: newPriority }, currentUser, 'PRIORITAS_DIUBAH', `Tingkat kegentingan diubah menjadi "${newPriority}".`);
    Utils.showToast(`Prioritas diubah ke ${newPriority}`, 'success');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast(err.message, 'error');
  }
};

// Tugaskan Tim IT RS (Programmer / Network)
window.handleAssignTech = async (ticketId, techId) => {
  const currentUser = authService.getCurrentUser();
  if (!techId) return;

  const users = await firestoreService.getAllUsers();
  const techUser = users.find(u => u.id === techId);
  if (!techUser) return;

  try {
    await firestoreService.assignTicket(ticketId, currentUser, techUser, currentUser);
    Utils.showToast(`Tiket ditugaskan ke: ${techUser.name}`, 'success');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast(err.message, 'error');
  }
};

// Konfirmasi Penyelesaian & Tutup Tiket
window.handleConfirmClose = async (ticketId) => {
  const currentUser = authService.getCurrentUser();
  try {
    await firestoreService.updateTicketStatus(ticketId, 'Ditutup', currentUser, 'Petugas ruangan mengonfirmasi alur SIMRS telah normal kembali.');
    Utils.showToast('Tiket insiden SIMRS telah ditutup. Terima kasih atas konfirmasinya!', 'success');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast(err.message, 'error');
  }
};

// Modal Buka Kembali (Reopen)
window.promptReopenModal = (ticketId) => {
  const modal = document.getElementById('action-dialog-modal');
  const content = document.getElementById('action-dialog-content');
  if (!modal || !content) return;

  modal.classList.remove('hidden');
  content.innerHTML = `
    <div class="p-6 space-y-4">
      <div class="flex items-center gap-2 text-rose-600 font-bold text-base">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        Buka Kembali Tiket Insiden SIMRS
      </div>
      <p class="text-xs text-slate-600">
        Jika kendala pada modul SIMRS / perangkat ruangan masih berulang atau solusi IT belum berhasil, mohon jelaskan kendala yang dialami. Status tiket akan kembali menjadi <strong>Diproses</strong> oleh Tim IT RS.
      </p>
      <form onsubmit="window.handleReopenSubmit(event, '${ticketId}')" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Alasan Pembukaan Kembali <span class="text-rose-500">*</span></label>
          <textarea id="reopen-reason-input" rows="3" required placeholder="Contoh: Resep elektronik masih gagal terkirim pada pasien berikutnya di poli..."
            class="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 resize-none"></textarea>
        </div>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" onclick="document.getElementById('action-dialog-modal').classList.add('hidden')" class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
          <button type="submit" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm">Buka Kembali Tiket</button>
        </div>
      </form>
    </div>
  `;
};

window.handleReopenSubmit = async (e, ticketId) => {
  e.preventDefault();
  const reason = document.getElementById('reopen-reason-input')?.value.trim();
  const currentUser = authService.getCurrentUser();
  if (!reason || !currentUser) return;

  try {
    await firestoreService.updateTicketStatus(ticketId, 'Diproses', currentUser, reason);
    document.getElementById('action-dialog-modal')?.classList.add('hidden');
    Utils.showToast('Tiket insiden dibuka kembali untuk penanganan lanjutan IT RS.', 'info');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast(err.message, 'error');
  }
};

// Modal Tim IT RS: Catat Solusi Teknis & Selesaikan
window.promptSolveModal = (ticketId) => {
  const modal = document.getElementById('action-dialog-modal');
  const content = document.getElementById('action-dialog-content');
  if (!modal || !content) return;

  modal.classList.remove('hidden');
  content.innerHTML = `
    <div class="p-6 space-y-4">
      <div class="flex items-center gap-2 text-emerald-600 font-bold text-base">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Pencatatan Tindakan Perbaikan (Tim IT RS)
      </div>
      <p class="text-xs text-slate-600">
        Catat langkah investigasi, perbaikan database SIMRS, restart service/webservice BPJS, atau pergantian hardware ruangan. Status akan diubah menjadi <strong>Terselesaikan</strong>.
      </p>
      <form onsubmit="window.handleSolveSubmit(event, '${ticketId}')" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Hasil Perbaikan / Tindakan Teknis IT RS <span class="text-rose-500">*</span></label>
          <textarea id="solve-notes-input" rows="3" required placeholder="Contoh: Service bridging VClaim BPJS telah di-restart dan sertifikat SSL diperbarui. Uji transaksi penerbitan SEP berhasil."
            class="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"></textarea>
        </div>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" onclick="document.getElementById('action-dialog-modal').classList.add('hidden')" class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
          <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm">Kirim Solusi & Tandai Selesai</button>
        </div>
      </form>
    </div>
  `;
};

window.handleSolveSubmit = async (e, ticketId) => {
  e.preventDefault();
  const notes = document.getElementById('solve-notes-input')?.value.trim();
  const currentUser = authService.getCurrentUser();
  if (!notes || !currentUser) return;

  try {
    // 1. Tambah pesan penjelasan ke thread
    await firestoreService.addMessage(ticketId, currentUser, `[Hasil Perbaikan Tim IT RS]: ${notes}`, [], false);
    // 2. Ubah status tiket ke Terselesaikan
    await firestoreService.updateTicketStatus(ticketId, 'Terselesaikan', currentUser, notes);

    document.getElementById('action-dialog-modal')?.classList.add('hidden');
    Utils.showToast('Hasil perbaikan IT RS berhasil dicatat & status diubah ke Terselesaikan!', 'success');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast(err.message, 'error');
  }
};

// Penilaian Layanan (CSAT)
window.handleRatingSubmit = async (e, ticketId) => {
  e.preventDefault();
  const scoreInput = document.querySelector('input[name="rating-score"]:checked');
  const commentInput = document.getElementById('rating-comment');
  const currentUser = authService.getCurrentUser();

  if (!scoreInput || !currentUser) return;

  try {
    await firestoreService.addRating(ticketId, currentUser, Number(scoreInput.value), commentInput?.value.trim());
    Utils.showToast('Terima kasih atas penilaian pelayanan IT RS!', 'success');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast(err.message, 'error');
  }
};

// Print Cetak Tiket
window.printTicket = (ticketId) => {
  window.print();
};

// Filter Pengguna
window.setUserTab = (tab) => {
  UserView.currentTab = tab;
  UserView.render(document.getElementById('app-main-content'));
};
window.setUserSearch = (q) => {
  UserView.searchQuery = q;
  UserView.render(document.getElementById('app-main-content'));
};

// Filter Petugas
window.filterOfficerStatus = (st) => {
  OfficerView.statusFilter = st;
  OfficerView.render(document.getElementById('app-main-content'));
};
window.filterOfficerPriority = (prio) => {
  OfficerView.priorityFilter = prio;
  OfficerView.render(document.getElementById('app-main-content'));
};
window.filterOfficerApp = (appId) => {
  OfficerView.appFilter = appId;
  OfficerView.render(document.getElementById('app-main-content'));
};
window.setOfficerSearch = (q) => {
  OfficerView.searchQuery = q;
  OfficerView.render(document.getElementById('app-main-content'));
};

// Filter Teknis
window.setTechTab = (tab) => {
  TechView.activeTab = tab;
  TechView.render(document.getElementById('app-main-content'));
};

// Filter Admin
window.setAdminTab = (tab) => {
  AdminView.activeTab = tab;
  AdminView.render(document.getElementById('app-main-content'));
};

// Filter FAQ
window.setHelpSearch = (q) => {
  HelpCenterView.searchQuery = q;
  HelpCenterView.render(document.getElementById('app-main-content'));
};
window.toggleFaq = (id) => {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden');
};

// Firebase Admin Actions
window.handleSaveFirebaseConfig = (e) => {
  e.preventDefault();
  const newCfg = {
    apiKey: document.getElementById('fb-api-key')?.value.trim() || '',
    authDomain: document.getElementById('fb-auth-domain')?.value.trim() || '',
    projectId: document.getElementById('fb-project-id')?.value.trim() || '',
    storageBucket: document.getElementById('fb-storage-bucket')?.value.trim() || '',
    messagingSenderId: document.getElementById('fb-messaging-sender-id')?.value.trim() || '',
    appId: document.getElementById('fb-app-id')?.value.trim() || ''
  };
  firebaseManager.saveConfig(newCfg);
};

window.handleClearFirebaseConfig = () => {
  if (confirm('Hapus konfigurasi Firebase dan beralih ke Local Storage RS?')) {
    firebaseManager.resetConfig();
  }
};

window.handleSyncSeedToFirebase = async () => {
  if (confirm('Unggah semua data master SIMRS & skenario RS ke Cloud Firestore Live Anda?')) {
    try {
      await firestoreService.syncSeedToLiveFirestore();
      Utils.showToast('Semua data modul SIMRS berhasil diunggah ke Firebase Cloud Firestore!', 'success');
    } catch (err) {
      Utils.showToast('Gagal mengunggah data: ' + err.message, 'error');
    }
  }
};

window.exportBackupJSON = () => firestoreService.exportDataJSON();

window.confirmResetDatabase = () => {
  if (confirm('Kembalikan basis data ke data awal contoh insiden SIMRS Rumah Sakit (IGD, Farmasi, BPJS)?')) {
    firestoreService.resetToSeedData();
    Utils.showToast('Basis data SIMRS berhasil di-reset ke data awal rumah sakit.', 'success');
    window.location.reload();
  }
};

// Admin Modals for Add Application, Category, User
window.promptAddApplication = () => {
  const modal = document.getElementById('action-dialog-modal');
  const content = document.getElementById('action-dialog-content');
  if (!modal || !content) return;
  modal.classList.remove('hidden');
  content.innerHTML = `
    <div class="p-6 space-y-4">
      <h3 class="font-bold text-slate-800 text-sm">Tambah Modul SIMRS Baru</h3>
      <form onsubmit="window.saveNewApplication(event)" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Modul SIMRS</label>
          <input type="text" id="new-app-name" required placeholder="Contoh: SIMRS Medika - Modul Hemodialisa & ICU"
            class="w-full text-xs p-2.5 border border-slate-300 rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Ruang Lingkup</label>
          <textarea id="new-app-desc" rows="2" placeholder="Pencatatan tindakan medis dan pemantauan pasien..."
            class="w-full text-xs p-2.5 border border-slate-300 rounded-lg resize-none"></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="document.getElementById('action-dialog-modal').classList.add('hidden')" class="px-3 py-1.5 text-xs text-slate-600">Batal</button>
          <button type="submit" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold">Simpan Modul</button>
        </div>
      </form>
    </div>
  `;
};

window.saveNewApplication = async (e) => {
  e.preventDefault();
  const name = document.getElementById('new-app-name')?.value.trim();
  const description = document.getElementById('new-app-desc')?.value.trim();
  if (!name) return;
  await firestoreService.createApplication({ name, description });
  document.getElementById('action-dialog-modal')?.classList.add('hidden');
  Utils.showToast(`Modul "${name}" berhasil ditambahkan!`, 'success');
  appController.renderCurrentView();
};

window.promptAddCategory = () => {
  const modal = document.getElementById('action-dialog-modal');
  const content = document.getElementById('action-dialog-content');
  if (!modal || !content) return;
  modal.classList.remove('hidden');
  content.innerHTML = `
    <div class="p-6 space-y-4">
      <h3 class="font-bold text-slate-800 text-sm">Tambah Kategori Gangguan SIMRS</h3>
      <form onsubmit="window.saveNewCategory(event)" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Kategori</label>
          <input type="text" id="new-cat-name" required placeholder="Contoh: Integrasi Alat Medis (LIS/PACS)"
            class="w-full text-xs p-2.5 border border-slate-300 rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Prioritas Bawaan (Default)</label>
          <select id="new-cat-prio" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white">
            <option value="Tinggi">Tinggi (Emergency / Alur Pasien Terhenti)</option>
            <option value="Sedang" selected>Sedang (Terganggu, Ada Cara Manual)</option>
            <option value="Rendah">Rendah (Kosmetik UI / Saran Klinis)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Deskripsi</label>
          <textarea id="new-cat-desc" rows="2" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg resize-none"></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="document.getElementById('action-dialog-modal').classList.add('hidden')" class="px-3 py-1.5 text-xs text-slate-600">Batal</button>
          <button type="submit" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold">Simpan Kategori</button>
        </div>
      </form>
    </div>
  `;
};

window.saveNewCategory = async (e) => {
  e.preventDefault();
  const name = document.getElementById('new-cat-name')?.value.trim();
  const defaultPriority = document.getElementById('new-cat-prio')?.value || 'Sedang';
  const description = document.getElementById('new-cat-desc')?.value.trim();
  if (!name) return;
  await firestoreService.createCategory({ name, defaultPriority, description });
  document.getElementById('action-dialog-modal')?.classList.add('hidden');
  Utils.showToast(`Kategori "${name}" berhasil ditambahkan!`, 'success');
  appController.renderCurrentView();
};

window.promptAddUser = () => {
  const modal = document.getElementById('action-dialog-modal');
  const content = document.getElementById('action-dialog-content');
  if (!modal || !content) return;
  modal.classList.remove('hidden');
  content.innerHTML = `
    <div class="p-6 space-y-4">
      <h3 class="font-bold text-slate-800 text-sm">Tambah Akun Nakes / Staf IT RS</h3>
      <form onsubmit="window.saveNewUser(event)" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
          <input type="text" id="new-user-name" required placeholder="Contoh: dr. Anisa, Sp.A"
            class="w-full text-xs p-2.5 border border-slate-300 rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Email Resmi RS</label>
          <input type="email" id="new-user-email" required placeholder="anisa@rsud-sehat.go.id"
            class="w-full text-xs p-2.5 border border-slate-300 rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Peran / Hak Akses</label>
          <select id="new-user-role" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white">
            <option value="pengguna">Pengguna (Dokter / Perawat / Tenaga Medis)</option>
            <option value="petugas">Petugas Layanan (Helpdesk IT RS)</option>
            <option value="teknis">Tim Teknis (Programmer & Jaringan IT RS)</option>
            <option value="pimpinan">Pimpinan (Direksi / Kepala Bidang RS)</option>
            <option value="admin">Administrator SIMRS</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Ruangan / Instalasi Rumah Sakit</label>
          <input type="text" id="new-user-dept" placeholder="Contoh: Poli Anak / Ruang ICU"
            class="w-full text-xs p-2.5 border border-slate-300 rounded-lg">
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="document.getElementById('action-dialog-modal').classList.add('hidden')" class="px-3 py-1.5 text-xs text-slate-600">Batal</button>
          <button type="submit" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold">Simpan Akun</button>
        </div>
      </form>
    </div>
  `;
};

window.saveNewUser = async (e) => {
  e.preventDefault();
  const name = document.getElementById('new-user-name')?.value.trim();
  const email = document.getElementById('new-user-email')?.value.trim();
  const role = document.getElementById('new-user-role')?.value || 'pengguna';
  const department = document.getElementById('new-user-dept')?.value.trim() || 'Pelayanan RS';
  if (!name || !email) return;
  await firestoreService.createUser({ name, email, role, department });
  document.getElementById('action-dialog-modal')?.classList.add('hidden');
  Utils.showToast(`Akun ${name} berhasil dibuat!`, 'success');
  appController.renderCurrentView();
};

// Boot App on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  appController.init();
});
