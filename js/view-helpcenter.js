/**
 * Tampilan Pusat Bantuan & SOP Penanganan Gangguan IT RS (Knowledge Base)
 * Berdasarkan Dokumen Seksi 4, 10
 */

import { firestoreService } from './firestore-service.js';
import { Utils } from './utils.js';

export const HelpCenterView = {
  searchQuery: '',

  async render(targetElement) {
    const faqs = await firestoreService.getAllFaqs();

    let filtered = faqs;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.title.toLowerCase().includes(q) ||
        f.snippet.toLowerCase().includes(q) ||
        f.content.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      );
    }

    targetElement.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Hero Search Section (Hospital Theme) -->
        <div class="text-center space-y-4 py-6">
          <span class="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold uppercase tracking-wider">
            SOP & Dukungan IT Rumah Sakit
          </span>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">Pusat Bantuan & SOP Insiden SIMRS</h1>
          <p class="text-slate-500 text-sm max-w-xl mx-auto">
            Panduan mandiri penanganan cepat kendala modul SIMRS (BPJS, E-Resep, RME, Billing) dan hardware ruangan medis sebelum mengajukan tiket ke Tim IT RS.
          </p>

          <div class="max-w-xl mx-auto relative pt-2">
            <input type="text" value="${Utils.escapeHTML(this.searchQuery)}" placeholder="Ketik kata kunci (contoh: VClaim, Resep, Barcode Gelang, Error 504, IGD)..."
              oninput="window.setHelpSearch(this.value)"
              class="w-full text-sm pl-11 pr-4 py-3 border border-slate-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <svg class="w-5 h-5 text-slate-400 absolute left-4 top-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z"></path></svg>
          </div>
        </div>

        <!-- FAQ Accordion List -->
        <div class="space-y-4">
          ${filtered.length === 0 ? `
            <div class="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
              Tidak ditemukan artikel panduan SIMRS yang cocok dengan pencarian Anda.
            </div>
          ` : filtered.map((faq) => `
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition">
              <button onclick="window.toggleFaq('faq-body-${faq.id}')"
                class="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-teal-700 uppercase tracking-wider">${faq.category}</span>
                  <h3 class="text-sm font-bold text-slate-800">${faq.title}</h3>
                  <p class="text-xs text-slate-500">${faq.snippet}</p>
                </div>
                <svg id="faq-icon-${faq.id}" class="w-5 h-5 text-slate-400 shrink-0 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div id="faq-body-${faq.id}" class="hidden px-5 pb-5 pt-2 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/50 leading-relaxed">
                ${faq.content}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Emergency IT RS Banner -->
        <div class="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
          <div class="space-y-1">
            <h3 class="text-base font-bold">Kendala klinis masih menghentikan alur pelayanan pasien?</h3>
            <p class="text-xs text-teal-100">Kirimkan tiket insiden resmi agar Helpdesk dan Tim IT RS (Programmer & Jaringan) segera menindaklanjuti ke ruangan Anda.</p>
          </div>
          <button onclick="window.openCreateTicketModal()" class="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-bold shadow transition">
            + Laporkan Gangguan SIMRS Baru
          </button>
        </div>
      </div>
    `;
  }
};
