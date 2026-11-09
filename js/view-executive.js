/**
 * Tampilan Direksi & Pimpinan Rumah Sakit (Executive Dashboard)
 * Evaluasi Kinerja Layanan IT RS & Kepatuhan Standar Akreditasi Rumah Sakit (STARKES)
 */

import { firestoreService } from './firestore-service.js';
import { Utils } from './utils.js';

export const ExecutiveView = {
  charts: {},

  async render(targetElement) {
    const tickets = await firestoreService.getAllTickets();
    const ratings = await firestoreService.getAllRatings();
    const apps = await firestoreService.getAllApplications();

    // 1. Waktu respons pertama (First Response Time)
    const ticketsWithFRT = tickets.filter(t => t.firstResponseTime);
    let avgFRTMinutes = 0;
    if (ticketsWithFRT.length > 0) {
      const totalFRTMs = ticketsWithFRT.reduce((acc, t) => acc + (new Date(t.firstResponseTime) - new Date(t.createdAt)), 0);
      avgFRTMinutes = Math.round(totalFRTMs / (ticketsWithFRT.length * 1000 * 60));
    }

    // 2. Waktu penyelesaian (Resolution Time)
    const ticketsResolved = tickets.filter(t => t.resolvedAt);
    let avgResMinutes = 0;
    if (ticketsResolved.length > 0) {
      const totalResMs = ticketsResolved.reduce((acc, t) => acc + (new Date(t.resolvedAt) - new Date(t.createdAt)), 0);
      avgResMinutes = Math.round(totalResMs / (ticketsResolved.length * 1000 * 60));
    }

    // 3. Persentase penyelesaian (Resolution Rate)
    const closedOrResolvedCount = tickets.filter(t => ['Terselesaikan', 'Ditutup'].includes(t.status)).length;
    const resolutionRate = tickets.length > 0 ? Math.round((closedOrResolvedCount / tickets.length) * 100) : 0;

    // 4. Tiket dibuka kembali (Reopen Rate)
    const reopenedTickets = tickets.filter(t => (t.reopenedCount || 0) > 0);
    const reopenRate = tickets.length > 0 ? ((reopenedTickets.length / tickets.length) * 100).toFixed(1) : 0;

    // 5. Kepuasan Pengguna Nakes (CSAT)
    let avgCSAT = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, r) => acc + Number(r.score), 0);
      avgCSAT = (sum / ratings.length).toFixed(1);
    }

    // 6. Pola Masalah Berulang per Modul Klinis
    const featureMap = {};
    tickets.forEach(t => {
      const key = `${t.appName} - ${t.featureName || 'Umum'}`;
      featureMap[key] = (featureMap[key] || 0) + 1;
    });
    const recurringIssues = Object.entries(featureMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    targetElement.innerHTML = `
      <div class="space-y-6">
        <!-- Executive Hospital Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Evaluasi Mutu Pelayanan IT & Kepatuhan SLA SIMRS
              <span class="text-xs font-semibold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">Direksi Rumah Sakit</span>
            </h1>
            <p class="text-xs text-slate-500">
              Laporan indikator mutu teknologi rumah sakit, kepatuhan respon insiden gawat darurat, dan kepuasan tenaga medis (STARKES Kemenkes).
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.print()" class="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Cetak Laporan Mutu IT RS
            </button>
          </div>
        </div>

        <!-- 5 Key Evaluation Indicator Cards (Standar Akreditasi RS) -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Indikator 1: Respons Pertama -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kecepatan Respon IT</div>
            <div class="text-xl font-black text-slate-800 mt-1">
              ${avgFRTMinutes > 0 ? `${avgFRTMinutes} Menit` : 'N/A'}
            </div>
            <div class="text-[10px] text-teal-700 mt-1 font-medium">Target Mutu RS: &le; 15 menit</div>
          </div>

          <!-- Indikator 2: Waktu Penyelesaian -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Durasi Perbaikan</div>
            <div class="text-xl font-black text-teal-700 mt-1">
              ${avgResMinutes > 0 ? (avgResMinutes > 60 ? `${(avgResMinutes / 60).toFixed(1)} Jam` : `${avgResMinutes} Menit`) : 'N/A'}
            </div>
            <div class="text-[10px] text-slate-500 mt-1">Rata-rata sistem normal</div>
          </div>

          <!-- Indikator 3: Persentase Penyelesaian -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Persentase Selesai</div>
            <div class="text-xl font-black text-emerald-600 mt-1">
              ${resolutionRate}%
            </div>
            <div class="text-[10px] text-slate-500 mt-1">${closedOrResolvedCount} dari ${tickets.length} insiden tuntas</div>
          </div>

          <!-- Indikator 4: Tiket Dibuka Kembali -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Insiden Berulang</div>
            <div class="text-xl font-black ${reopenedTickets.length > 0 ? 'text-rose-600' : 'text-slate-700'} mt-1">
              ${reopenRate}%
            </div>
            <div class="text-[10px] text-slate-500 mt-1">${reopenedTickets.length} insiden perlu investigasi ulang</div>
          </div>

          <!-- Indikator 5: Kepuasan Pengguna Nakes (CSAT) -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kepuasan Nakes</div>
            <div class="text-xl font-black text-amber-500 mt-1 flex items-center gap-1">
              ${avgCSAT > 0 ? `${avgCSAT} ★` : 'Belum Ada'}
            </div>
            <div class="text-[10px] text-slate-500 mt-1">${ratings.length} dokter/perawat menilai</div>
          </div>
        </div>

        <!-- Charts Grid (Chart.js) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Chart 1: Volume Insiden per Modul SIMRS -->
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-sm text-slate-800">Distribusi Insiden per Modul SIMRS</h3>
              <span class="text-xs text-slate-400">Pola beban sistem rumah sakit</span>
            </div>
            <div class="h-64 relative">
              <canvas id="chart-app-distribution"></canvas>
            </div>
          </div>

          <!-- Chart 2: Komposisi Jenis Insiden -->
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-sm text-slate-800">Komposisi Jenis Laporan Layanan IT</h3>
              <span class="text-xs text-slate-400">Keluhan vs Error Bug vs Pertanyaan vs Usulan Alur</span>
            </div>
            <div class="h-64 relative">
              <canvas id="chart-feedback-type"></canvas>
            </div>
          </div>
        </div>

        <!-- 2 Columns: Recurring Issues Table & CSAT Reviews -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Pola Masalah Berulang (Seksi 14) -->
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-sm text-slate-800">Pola Gangguan Klinis Berulang Teratas</h3>
                <p class="text-xs text-slate-500">Fitur SIMRS / perangkat medis ruangan yang paling sering mengalami kendala</p>
              </div>
            </div>

            <div class="divide-y divide-slate-100 text-xs">
              ${recurringIssues.length === 0 ? `
                <div class="py-6 text-center text-slate-400">Belum ada data laporan insiden.</div>
              ` : recurringIssues.map((issue, idx) => `
                <div class="py-3 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                      ${idx + 1}
                    </span>
                    <span class="font-semibold text-slate-800 truncate">${issue.name}</span>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                    ${issue.count} Insiden
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Rating & Feedback Feed from Medical Staff -->
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-sm text-slate-800">Ulasan Kepuasan Tenaga Medis (Dokter & Nakes)</h3>
                <p class="text-xs text-slate-500">Penilaian mutu respon IT RS setelah kendala klinis diselesaikan</p>
              </div>
            </div>

            <div class="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
              ${ratings.length === 0 ? `
                <div class="py-8 text-center text-slate-400">Belum ada ulasan yang masuk.</div>
              ` : ratings.map(r => `
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-800">${r.userName}</span>
                    <span class="text-amber-500 font-bold">${'★'.repeat(r.score)}${'☆'.repeat(5 - r.score)}</span>
                  </div>
                  <p class="text-slate-600 italic">"${Utils.escapeHTML(r.comment || 'Tidak ada catatan.')}"</p>
                  <div class="text-[10px] text-slate-400">${Utils.formatDate(r.createdAt)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Render Chart.js
    setTimeout(() => {
      this.initCharts(tickets, apps);
    }, 50);
  },

  initCharts(tickets, apps) {
    if (typeof Chart === 'undefined') return;

    // Destroy existing
    Object.values(this.charts).forEach(c => {
      try { c.destroy(); } catch (e) { }
    });
    this.charts = {};

    // 1. Chart App Distribution
    const appCtx = document.getElementById('chart-app-distribution')?.getContext('2d');
    if (appCtx) {
      const appCounts = {};
      apps.forEach(a => { appCounts[a.name] = 0; });
      tickets.forEach(t => {
        appCounts[t.appName] = (appCounts[t.appName] || 0) + 1;
      });

      this.charts.app = new Chart(appCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(appCounts),
          datasets: [{
            label: 'Jumlah Insiden',
            data: Object.values(appCounts),
            backgroundColor: ['#0d9488', '#0284c7', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6', '#8b5cf6'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 }
            }
          }
        }
      });
    }

    // 2. Chart Feedback Type Distribution
    const fbCtx = document.getElementById('chart-feedback-type')?.getContext('2d');
    if (fbCtx) {
      const fbCounts = { 'Keluhan': 0, 'Kesalahan': 0, 'Pertanyaan': 0, 'Saran': 0 };
      tickets.forEach(t => {
        if (fbCounts[t.feedbackType] !== undefined) {
          fbCounts[t.feedbackType]++;
        } else {
          fbCounts[t.feedbackType] = 1;
        }
      });

      this.charts.fb = new Chart(fbCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(fbCounts),
          datasets: [{
            data: Object.values(fbCounts),
            backgroundColor: ['#ef4444', '#f97316', '#0284c7', '#10b981'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  }
};
