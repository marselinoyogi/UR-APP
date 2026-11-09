/**
 * Utilitas dan Format Tampilan UR-APP
 * Sistem Pengelolaan Umpan Balik Pengguna
 */

export const Utils = {
  /**
   * Format tanggal ke standar Indonesia
   */
  formatDate(dateString) {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  },

  /**
   * Waktu relatif ("5 menit yang lalu", "2 jam yang lalu")
   */
  timeAgo(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    if (diffHour < 24) return `${diffHour} jam yang lalu`;
    if (diffDay < 7) return `${diffDay} hari yang lalu`;
    return this.formatDate(dateString);
  },

  /**
   * Hitung selisih jam & menit antara dua tanggal
   */
  formatDuration(startStr, endStr) {
    if (!startStr || !endStr) return '-';
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffMs = Math.max(0, end - start);
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} menit`;
    if (hours < 24) return `${hours}j ${minutes}m`;
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}h ${remHours}j`;
  },

  /**
   * Badge HTML untuk Status Tiket
   * Status: Baru, Diverifikasi, Diproses, Menunggu Pengguna, Terselesaikan, Ditutup
   */
  getStatusBadge(status) {
    const config = {
      'Baru': { bg: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
      'Diverifikasi': { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500' },
      'Diproses': { bg: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
      'Menunggu Pengguna': { bg: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
      'Terselesaikan': { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
      'Ditutup': { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' }
    };

    const style = config[status] || { bg: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400' };
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg}">
      <span class="w-1.5 h-1.5 rounded-full ${style.dot}"></span>
      ${status || 'Tidak Diketahui'}
    </span>`;
  },

  /**
   * Badge HTML untuk Prioritas
   * Prioritas: Tinggi, Sedang, Rendah
   */
  getPriorityBadge(priority) {
    const config = {
      'Tinggi': { bg: 'bg-rose-100 text-rose-800 border-rose-200', icon: 'fa-arrow-up' },
      'Sedang': { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: 'fa-minus' },
      'Rendah': { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: 'fa-arrow-down' }
    };

    const style = config[priority] || { bg: 'bg-gray-100 text-gray-700 border-gray-200', icon: 'fa-question' };
    return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg}">
      ${priority || 'Sedang'}
    </span>`;
  },

  /**
   * Badge HTML untuk Jenis Umpan Balik
   * Jenis: Keluhan, Kesalahan, Pertanyaan, Saran
   */
  getFeedbackTypeBadge(type) {
    const config = {
      'Keluhan': 'bg-red-50 text-red-700 border-red-200',
      'Kesalahan': 'bg-orange-50 text-orange-700 border-orange-200',
      'Pertanyaan': 'bg-sky-50 text-sky-700 border-sky-200',
      'Saran': 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
    const style = config[type] || 'bg-gray-50 text-gray-700 border-gray-200';
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${style}">${type || 'Laporan'}</span>`;
  },

  /**
   * Role badge
   */
  getRoleBadge(role) {
    const config = {
      'pengguna': { label: 'Pengguna', class: 'bg-slate-100 text-slate-700 border-slate-200' },
      'petugas': { label: 'Petugas Layanan', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'teknis': { label: 'Tim Teknis', class: 'bg-teal-100 text-teal-800 border-teal-200' },
      'admin': { label: 'Administrator', class: 'bg-violet-100 text-violet-800 border-violet-200' },
      'pimpinan': { label: 'Pimpinan', class: 'bg-amber-100 text-amber-800 border-amber-200' }
    };
    const roleInfo = config[role] || { label: role, class: 'bg-gray-100 text-gray-700 border-gray-200' };
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${roleInfo.class}">${roleInfo.label}</span>`;
  },

  /**
   * Generate nomor tiket unik berformat TKT-YYYYMMDD-XXXX
   */
  generateTicketNumber(existingCount = 0) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const seq = String(existingCount + 1).padStart(4, '0');
    return `TKT-${year}${month}${day}-${seq}`;
  },

  /**
   * Auto deteksi perangkat dan peramban
   */
  detectDeviceBrowser() {
    const ua = navigator.userAgent;
    let browser = 'Browser Lain';
    if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
    else if (ua.includes('Edg')) browser = 'Microsoft Edge';
    else if (ua.includes('Chrome')) browser = 'Google Chrome';
    else if (ua.includes('Safari')) browser = 'Apple Safari';

    let os = 'OS Lain';
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return `${os} / ${browser}`;
  },

  /**
   * Notifikasi Toast interaktif
   */
  showToast(message, type = 'info', title = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastId = 'toast-' + Math.random().toString(36).substr(2, 9);
    const toast = document.createElement('div');
    toast.id = toastId;

    const colors = {
      success: { bg: 'bg-emerald-50 border-emerald-300 text-emerald-800', icon: '✓', iconBg: 'bg-emerald-500 text-white' },
      error: { bg: 'bg-rose-50 border-rose-300 text-rose-800', icon: '✕', iconBg: 'bg-rose-500 text-white' },
      warning: { bg: 'bg-amber-50 border-amber-300 text-amber-800', icon: '!', iconBg: 'bg-amber-500 text-white' },
      info: { bg: 'bg-blue-50 border-blue-300 text-blue-800', icon: 'ℹ', iconBg: 'bg-blue-500 text-white' }
    };

    const cfg = colors[type] || colors.info;

    toast.className = `flex items-start gap-3 p-4 rounded-xl border shadow-lg transform transition-all duration-300 ease-out translate-y-2 opacity-0 ${cfg.bg}`;
    toast.innerHTML = `
      <div class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${cfg.iconBg}">
        ${cfg.icon}
      </div>
      <div class="flex-1 pr-2">
        ${title ? `<h4 class="text-sm font-semibold mb-0.5 leading-tight">${title}</h4>` : ''}
        <p class="text-xs leading-relaxed">${message}</p>
      </div>
      <button onclick="document.getElementById('${toastId}')?.remove()" class="text-slate-400 hover:text-slate-700 text-sm font-bold ml-auto">&times;</button>
    `;

    container.appendChild(toast);

    // Animasi masuk
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    // Otomatis hilang 4 detik
    setTimeout(() => {
      if (document.getElementById(toastId)) {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  },

  /**
   * Escape HTML string
   */
  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
