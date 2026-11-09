/**
 * UR-APP: Controller Utama dan Router Aplikasi
 * Mengatur Navigasi Peran, Event Global, dan Sinkronisasi UI
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
    // 1. Inisialisasi Firebase Manager (Live or Fallback)
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
    if (this.currentView === 'helpcenter') return; // Keep help center open if chosen

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
        <!-- Logo & Title -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">
            UR
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-black text-slate-800 text-base tracking-tight">UR-APP</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">SIAKAD Feedback</span>
              ${firebaseManager.isLive ? `
                <span class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Firebase Live
                </span>
              ` : `
                <span class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200" title="Klik menu Admin untuk menghubungkan Firestore live">
                  Local Mode
                </span>
              `}
            </div>
            <p class="text-[10px] text-slate-400 hidden sm:block">Sistem Pengelolaan Umpan Balik & Pelaporan Kesalahan Pengguna</p>
          </div>
        </div>

        <!-- Role Quick Switcher Bar (For Demo & Evaluation) -->
        <div class="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span class="text-[10px] font-bold text-slate-400 uppercase px-2">Beralih Peran:</span>
          <button onclick="window.switchRoleDemo('pengguna')" class="px-2.5 py-1 rounded-lg font-semibold transition ${currentUser.role === 'pengguna' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Pengguna
          </button>
          <button onclick="window.switchRoleDemo('petugas')" class="px-2.5 py-1 rounded-lg font-semibold transition ${currentUser.role === 'petugas' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Petugas
          </button>
          <button onclick="window.switchRoleDemo('teknis')" class="px-2.5 py-1 rounded-lg font-semibold transition ${currentUser.role === 'teknis' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Tim Teknis
          </button>
          <button onclick="window.switchRoleDemo('pimpinan')" class="px-2.5 py-1 rounded-lg font-semibold transition ${currentUser.role === 'pimpinan' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Pimpinan
          </button>
          <button onclick="window.switchRoleDemo('admin')" class="px-2.5 py-1 rounded-lg font-semibold transition ${currentUser.role === 'admin' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Admin
          </button>
        </div>

        <!-- User Profile & Action Menu -->
        <div class="flex items-center gap-3">
          <button onclick="window.navigateTo('helpcenter')" class="text-xs text-slate-600 hover:text-sky-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition hidden sm:flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Pusat Bantuan
          </button>

          <!-- Active User Badge -->
          <div class="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-300 shrink-0">
              <img src="${currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=0D8ABC&color=fff`}" alt="${currentUser.name}" class="w-full h-full object-cover">
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
  Utils.showToast('Data berhasil diperbarui', 'info');
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
    <div class="px-2.5 py-1.5 bg-sky-50 border border-sky-200 rounded-lg text-xs flex items-center gap-2">
      <span class="truncate max-w-[150px] font-medium text-sky-900">${Utils.escapeHTML(att.name)}</span>
      <span class="text-[10px] text-sky-600">(${att.size})</span>
      <button type="button" onclick="window.removeAttachment(${i})" class="text-rose-500 hover:text-rose-700 font-bold ml-1">&times;</button>
    </div>
  `).join('');
}

window.removeAttachment = (index) => {
  CreateTicketModal.selectedAttachments.splice(index, 1);
  renderAttachmentPreview();
};

// Submit Buat Tiket
window.handleCreateTicketSubmit = async (e) => {
  e.preventDefault();
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return;

  const appSelect = document.getElementById('form-app-id');
  const appId = appSelect.value;
  const appName = appSelect.options[appSelect.selectedIndex]?.getAttribute('data-appname') || 'Aplikasi';
  const feedbackType = document.querySelector('input[name="feedbackType"]:checked')?.value || 'Keluhan';
  const featureName = document.getElementById('form-feature-name')?.value.trim();
  const title = document.getElementById('form-title')?.value.trim();
  const description = document.getElementById('form-description')?.value.trim();
  const stepsToReproduce = document.getElementById('form-steps')?.value.trim();
  const incidentTime = document.getElementById('form-incident-time')?.value;
  const deviceBrowser = document.getElementById('form-device-browser')?.value.trim();

  // Tentukan default prioritas berdasarkan kategori / jenis (Seksi 6)
  let priority = 'Sedang';
  if (title.toLowerCase().includes('database') || title.toLowerCase().includes('krs') || title.toLowerCase().includes('error 500')) {
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

    Utils.showToast(`Laporan berhasil dikirim dengan Nomor Tiket: ${newTicket.ticketNumber}`, 'success', 'Tiket Dibuat');
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
    Utils.showToast(`Status tiket diubah menjadi "${newStatus}"`, 'success');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast('Gagal mengubah status: ' + err.message, 'error');
  }
};

// Verifikasi Cepat oleh Petugas
window.handleQuickVerify = async (ticketId) => {
  const currentUser = authService.getCurrentUser();
  await firestoreService.updateTicketStatus(ticketId, 'Diverifikasi', currentUser, 'Laporan telah diverifikasi oleh petugas.');
  Utils.showToast('Tiket telah diverifikasi!', 'success');
  appController.renderCurrentView();
};

// Ubah Prioritas Tiket
window.handlePriorityChange = async (ticketId, newPriority) => {
  const currentUser = authService.getCurrentUser();
  try {
    await firestoreService.updateTicket(ticketId, { priority: newPriority }, currentUser, 'PRIORITAS_DIUBAH', `Prioritas diubah menjadi "${newPriority}".`);
    Utils.showToast(`Tingkat prioritas diubah ke ${newPriority}`, 'success');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast(err.message, 'error');
  }
};

// Tugaskan Tim Teknis
window.handleAssignTech = async (ticketId, techId) => {
  const currentUser = authService.getCurrentUser();
  if (!techId) return;

  const users = await firestoreService.getAllUsers();
  const techUser = users.find(u => u.id === techId);
  if (!techUser) return;

  try {
    await firestoreService.assignTicket(ticketId, currentUser, techUser, currentUser);
    Utils.showToast(`Tiket ditugaskan kepada: ${techUser.name}`, 'success');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast(err.message, 'error');
  }
};

// Konfirmasi Penyelesaian & Tutup Tiket
window.handleConfirmClose = async (ticketId) => {
  const currentUser = authService.getCurrentUser();
  try {
    await firestoreService.updateTicketStatus(ticketId, 'Ditutup', currentUser, 'Pengguna mengonfirmasi bahwa kendala telah selesai ditangani.');
    Utils.showToast('Tiket telah ditutup. Terima kasih atas konfirmasi Anda!', 'success');
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
        Buka Kembali Tiket Pengaduan
      </div>
      <p class="text-xs text-slate-600">
        Jika masalah yang dilaporkan masih terjadi atau solusi belum memuaskan, jelaskan kendala yang masih Anda alami di bawah ini. Status tiket akan kembali menjadi <strong>Diproses</strong>.
      </p>
      <form onsubmit="window.handleReopenSubmit(event, '${ticketId}')" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Alasan Pembukaan Kembali <span class="text-rose-500">*</span></label>
          <textarea id="reopen-reason-input" rows="3" required placeholder="Contoh: Saya sudah coba kembali namun tombol simpan masih memunculkan pesan error yang sama..."
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
    Utils.showToast('Tiket berhasil dibuka kembali untuk penanganan ulang.', 'info');
    await TicketDetail.render();
  } catch (err) {
    Utils.showToast(err.message, 'error');
  }
};

// Modal Tim Teknis: Catat Solusi & Selesaikan
window.promptSolveModal = (ticketId) => {
  const modal = document.getElementById('action-dialog-modal');
  const content = document.getElementById('action-dialog-content');
  if (!modal || !content) return;

  modal.classList.remove('hidden');
  content.innerHTML = `
    <div class="p-6 space-y-4">
      <div class="flex items-center gap-2 text-emerald-600 font-bold text-base">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Pencatatan Solusi & Hasil Perbaikan (Tim Teknis)
      </div>
      <p class="text-xs text-slate-600">
        Catat tindakan perbaikan, perubahan konfigurasi/basis data, dan langkah pengujian yang telah Anda lakukan. Laporan akan ditandai dengan status <strong>Terselesaikan</strong> agar pelapor dapat mengonfirmasi.
      </p>
      <form onsubmit="window.handleSolveSubmit(event, '${ticketId}')" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Penjelasan Solusi / Tindakan Perbaikan <span class="text-rose-500">*</span></label>
          <textarea id="solve-notes-input" rows="3" required placeholder="Contoh: Kami telah mengoptimasi indexing database krs_detail dan me-reset session lock. Pengujian simpan KRS telah berhasil dilakukan."
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
    await firestoreService.addMessage(ticketId, currentUser, `[Hasil Perbaikan Tim Teknis]: ${notes}`, [], false);
    // 2. Ubah status tiket ke Terselesaikan
    await firestoreService.updateTicketStatus(ticketId, 'Terselesaikan', currentUser, notes);

    document.getElementById('action-dialog-modal')?.classList.add('hidden');
    Utils.showToast('Hasil perbaikan berhasil dicatat dan status telah diperbarui ke Terselesaikan!', 'success');
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
    Utils.showToast('Terima kasih atas penilaian kepuasan Anda!', 'success');
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
  if (confirm('Apakah Anda yakin ingin menghapus konfigurasi Firebase dan kembali ke mode Local Firestore?')) {
    firebaseManager.resetConfig();
  }
};

window.handleSyncSeedToFirebase = async () => {
  if (confirm('Unggah semua data contoh kampus ke Cloud Firestore Live Anda?')) {
    try {
      await firestoreService.syncSeedToLiveFirestore();
      Utils.showToast('Semua data contoh berhasil diunggah ke Firebase Cloud Firestore!', 'success');
    } catch (err) {
      Utils.showToast('Gagal mengunggah data: ' + err.message, 'error');
    }
  }
};

window.exportBackupJSON = () => firestoreService.exportDataJSON();

window.confirmResetDatabase = () => {
  if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data sistem ke contoh awal skenario kampus (KRS, UKT, dsb)?')) {
    firestoreService.resetToSeedData();
    Utils.showToast('Basis data berhasil di-reset ke data awal skenario kampus.', 'success');
    window.location.reload();
  }
};

// Boot App on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  appController.init();
});
