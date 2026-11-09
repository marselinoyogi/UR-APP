/**
 * Tampilan Administrator SIMRS & Pengaturan Sistem Rumah Sakit
 * Berdasarkan Dokumen Seksi 3, 10, 12, 13
 */

import { firestoreService } from './firestore-service.js';
import { firebaseManager } from './firebase-config.js';
import { Utils } from './utils.js';

export const AdminView = {
  activeTab: 'firebase', // 'firebase' | 'apps' | 'categories' | 'users'

  async render(targetElement) {
    const apps = await firestoreService.getAllApplications();
    const categories = await firestoreService.getAllCategories();
    const users = await firestoreService.getAllUsers();
    const fbConfig = firebaseManager.config || {};

    targetElement.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Pengaturan Sistem SIMRS & Master Data Rumah Sakit
              <span class="text-xs font-semibold px-2.5 py-0.5 bg-violet-100 text-violet-800 rounded-full">Admin SIMRS</span>
            </h1>
            <p class="text-xs text-slate-500">Konfigurasi basis data Firebase, manajemen modul SIMRS, kategori gangguan klinis, dan hak akses nakes.</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.exportBackupJSON()" class="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Unduh Cadangan (Backup JSON)
            </button>
            <button onclick="document.getElementById('restore-json-input').click()" class="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"></path></svg>
              Pulihkan (Restore JSON)
            </button>
            <input type="file" id="restore-json-input" accept=".json" class="hidden" onchange="window.handleRestoreJSON(event)">
            <button onclick="window.confirmResetDatabase()" class="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
              ↻ Reset Data Awal RS
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-2 text-xs font-semibold">
          <button onclick="window.setAdminTab('firebase')" class="px-4 py-2 rounded-lg transition ${this.activeTab === 'firebase' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-50'}">
            🔥 Pengaturan Firebase (Database)
          </button>
          <button onclick="window.setAdminTab('apps')" class="px-4 py-2 rounded-lg transition ${this.activeTab === 'apps' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-50'}">
            🏥 Master Modul SIMRS (${apps.length})
          </button>
          <button onclick="window.setAdminTab('categories')" class="px-4 py-2 rounded-lg transition ${this.activeTab === 'categories' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-50'}">
            🏷️ Kategori Gangguan Medis (${categories.length})
          </button>
          <button onclick="window.setAdminTab('users')" class="px-4 py-2 rounded-lg transition ${this.activeTab === 'users' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-50'}">
            👥 Pengguna Nakes & IT (${users.length})
          </button>
        </div>

        <!-- Tab 1: Firebase Configuration -->
        ${this.activeTab === 'firebase' ? `
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 class="font-bold text-sm text-slate-800">Koneksi Basis Data Firebase Cloud Firestore</h3>
                <p class="text-xs text-slate-500">Hubungkan sistem SIMRS Care ke database Google Cloud Firebase rumah sakit Anda.</p>
              </div>
              <div>
                ${firebaseManager.isLive ? `
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Terhubung ke Live Firestore
                  </span>
                ` : `
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                    Mode Local Storage RS (Demo)
                  </span>
                `}
              </div>
            </div>

            <!-- Firebase Info Banner -->
            <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-2">
              <div class="font-bold flex items-center gap-2">
                <span>ℹ️ Petunjuk Integrasi Database Firebase RS:</span>
              </div>
              <p>
                Sistem SIMRS Care mendukung integrasi live Cloud Firestore. Untuk mengaktifkan sinkronisasi real-time antar gedung rumah sakit:
              </p>
              <ol class="list-decimal list-inside space-y-1 text-teal-800">
                <li>Buka <a href="https://console.firebase.google.com" target="_blank" class="underline font-bold text-teal-700">Firebase Console</a> dan buat project baru RS.</li>
                <li>Aktifkan <strong>Cloud Firestore</strong> pada mode Production atau Test.</li>
                <li>Salin konfigurasi <code>firebaseConfig</code> ke kolom di bawah.</li>
                <li>Klik tombol <strong>"Simpan & Terapkan Konfigurasi"</strong> lalu klik <strong>"↑ Unggah Data Contoh ke Firestore"</strong>.</li>
              </ol>
            </div>

            <!-- Firebase Config Form -->
            <form onsubmit="window.handleSaveFirebaseConfig(event)" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">API Key (apiKey)</label>
                  <input type="text" id="fb-api-key" value="${Utils.escapeHTML(fbConfig.apiKey || '')}" placeholder="AIzaSy..."
                    class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 font-mono">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Auth Domain (authDomain)</label>
                  <input type="text" id="fb-auth-domain" value="${Utils.escapeHTML(fbConfig.authDomain || '')}" placeholder="simrs-rsud.firebaseapp.com"
                    class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 font-mono">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Project ID (projectId)</label>
                  <input type="text" id="fb-project-id" value="${Utils.escapeHTML(fbConfig.projectId || '')}" placeholder="simrs-rsud-prod"
                    class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 font-mono">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Storage Bucket (storageBucket)</label>
                  <input type="text" id="fb-storage-bucket" value="${Utils.escapeHTML(fbConfig.storageBucket || '')}" placeholder="simrs-rsud.appspot.com"
                    class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 font-mono">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Messaging Sender ID</label>
                  <input type="text" id="fb-messaging-sender-id" value="${Utils.escapeHTML(fbConfig.messagingSenderId || '')}" placeholder="1234567890"
                    class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 font-mono">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">App ID (appId)</label>
                  <input type="text" id="fb-app-id" value="${Utils.escapeHTML(fbConfig.appId || '')}" placeholder="1:123456:web:abcd123"
                    class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 font-mono">
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button type="button" onclick="window.handleClearFirebaseConfig()" class="text-xs text-rose-600 hover:text-rose-800 font-semibold">
                  Hapus Konfigurasi & Beralih ke Mode Lokal
                </button>
                <div class="flex items-center gap-2">
                  ${firebaseManager.isLive ? `
                    <button type="button" onclick="window.handleSyncSeedToFirebase()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition">
                      ↑ Unggah Data Contoh ke Firestore
                    </button>
                  ` : ''}
                  <button type="submit" class="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold shadow-md transition">
                    Simpan & Terapkan Konfigurasi
                  </button>
                </div>
              </div>
            </form>
          </div>
        ` : ''}

        <!-- Tab 2: Master Modul SIMRS -->
        ${this.activeTab === 'apps' ? `
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 class="font-bold text-sm text-slate-800">Daftar Modul SIMRS Rumah Sakit</h3>
                <p class="text-xs text-slate-500">Modul SIMRS yang diawasi oleh tim IT RS.</p>
              </div>
              <button onclick="window.promptAddApplication()" class="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold shadow-sm transition">
                + Tambah Modul SIMRS
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${apps.map(a => `
                <div class="p-4 border border-slate-200 rounded-xl hover:border-violet-300 transition bg-slate-50/50 space-y-2">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-bold text-xs text-slate-800">${a.name}</h4>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${a.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
                      ${a.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <p class="text-xs text-slate-600">${a.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Tab 3: Master Kategori Gangguan Medis -->
        ${this.activeTab === 'categories' ? `
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 class="font-bold text-sm text-slate-800">Kategori Insiden & Prioritas Triage</h3>
                <p class="text-xs text-slate-500">Pengelompokan jenis gangguan klinis beserta default priority (Seksi 6).</p>
              </div>
              <button onclick="window.promptAddCategory()" class="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold shadow-sm transition">
                + Tambah Kategori Baru
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              ${categories.map(c => `
                <div class="p-4 border border-slate-200 rounded-xl hover:border-violet-300 transition bg-slate-50/50 space-y-2">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-bold text-xs text-slate-800">${c.name}</h4>
                    ${Utils.getPriorityBadge(c.defaultPriority)}
                  </div>
                  <p class="text-xs text-slate-600">${c.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Tab 4: User Accounts RS -->
        ${this.activeTab === 'users' ? `
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 class="font-bold text-sm text-slate-800">Daftar Akun Nakes, Helpdesk & Tim IT RS</h3>
                <p class="text-xs text-slate-500">Pengelolaan hak akses: Nakes/Ruangan, Helpdesk IT, Tim Teknis, Direksi, dan Admin (Seksi 3).</p>
              </div>
              <button onclick="window.promptAddUser()" class="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold shadow-sm transition">
                + Tambah Akun Nakes / IT
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th class="px-4 py-3">Nama & Gelar</th>
                    <th class="px-4 py-3">Email Resmi</th>
                    <th class="px-4 py-3">Peran Akses</th>
                    <th class="px-4 py-3">Ruangan / Instalasi RS</th>
                    <th class="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${users.map(u => `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="px-4 py-3.5 font-semibold text-slate-800">
                        ${u.name}
                      </td>
                      <td class="px-4 py-3.5 text-slate-600">
                        ${u.email}
                      </td>
                      <td class="px-4 py-3.5">
                        ${Utils.getRoleBadge(u.role)}
                      </td>
                      <td class="px-4 py-3.5 text-slate-600">
                        ${u.department || '-'}
                      </td>
                      <td class="px-4 py-3.5 text-right">
                        <button onclick="window.switchRoleDemo('${u.id}')"
                          class="px-2.5 py-1 bg-slate-100 hover:bg-violet-600 hover:text-white text-slate-700 rounded text-xs font-medium transition">
                          Masuk Sebagai Akun Ini
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
};
