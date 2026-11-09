/**
 * Layanan Database Firestore (Firebase Firestore Service)
 * Mendukung Live Firebase Firestore & Local Storage Engine
 * Sesuai Dokumen Seksi 12: users, applications, categories, tickets, ticket_messages, attachments, ticket_history, ratings
 */

import { firebaseManager } from './firebase-config.js';
import { InitialSeedData } from './seed-data.js';
import { Utils } from './utils.js';

class FirestoreService {
  constructor() {
    this.storageKey = 'ur_app_firestore_db';
    this.listeners = new Set();
    this.ensureInitialized();
  }

  ensureInitialized() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      this.resetToSeedData();
    }
  }

  resetToSeedData() {
    localStorage.setItem(this.storageKey, JSON.stringify(InitialSeedData));
    this.notifySubscribers();
  }

  getLocalDB() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(InitialSeedData));
    } catch (e) {
      console.error('Error parsing local DB:', e);
      return JSON.parse(JSON.stringify(InitialSeedData));
    }
  }

  saveLocalDB(db) {
    localStorage.setItem(this.storageKey, JSON.stringify(db));
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifySubscribers() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
  }

  // ==========================================
  // 1. TIKET (TICKETS)
  // ==========================================

  async getAllTickets() {
    if (firebaseManager.isLive) {
      try {
        const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const q = query(collection(firebaseManager.db, 'tickets'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        return list;
      } catch (err) {
        console.warn('Gagal membaca Firestore Live, beralih ke local storage:', err);
      }
    }
    const db = this.getLocalDB();
    return (db.tickets || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getTicketById(id) {
    if (firebaseManager.isLive) {
      try {
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const snap = await getDoc(doc(firebaseManager.db, 'tickets', id));
        if (snap.exists()) return { id: snap.id, ...snap.data() };
      } catch (err) {
        console.warn('Gagal mengambil tiket dari Firestore Live:', err);
      }
    }
    const db = this.getLocalDB();
    return (db.tickets || []).find(t => t.id === id) || null;
  }

  async createTicket(ticketData, actor) {
    const db = this.getLocalDB();
    const existingCount = (db.tickets || []).length;
    const ticketNumber = Utils.generateTicketNumber(existingCount);
    const now = new Date().toISOString();

    const newTicket = {
      id: 'ticket-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ticketNumber,
      userId: actor.id,
      userName: actor.name,
      userEmail: actor.email,
      appId: ticketData.appId,
      appName: ticketData.appName,
      featureName: ticketData.featureName || 'Umum',
      feedbackType: ticketData.feedbackType || 'Keluhan',
      title: ticketData.title,
      description: ticketData.description,
      stepsToReproduce: ticketData.stepsToReproduce || '-',
      incidentTime: ticketData.incidentTime || now,
      deviceBrowser: ticketData.deviceBrowser || Utils.detectDeviceBrowser(),
      priority: ticketData.priority || 'Sedang',
      status: 'Baru',
      assignedOfficerId: null,
      assignedOfficerName: null,
      assignedTechId: null,
      assignedTechName: null,
      attachments: ticketData.attachments || [],
      createdAt: now,
      updatedAt: now,
      firstResponseTime: null,
      resolvedAt: null,
      closedAt: null,
      reopenedCount: 0,
      reopenReason: null
    };

    // Live Firebase
    if (firebaseManager.isLive) {
      try {
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const ref = await addDoc(collection(firebaseManager.db, 'tickets'), newTicket);
        newTicket.id = ref.id;
      } catch (err) {
        console.warn('Gagal simpan ke Firestore Live:', err);
      }
    }

    // Simpan local
    db.tickets = db.tickets || [];
    db.tickets.unshift(newTicket);
    this.saveLocalDB(db);

    // Catat riwayat pembuatan
    await this.addHistory(newTicket.id, actor, 'TIKET_DIBUAT', `Tiket ${ticketNumber} berhasil dibuat dengan status Baru.`);

    return newTicket;
  }

  async updateTicket(id, updates, actor, historyAction = 'STATUS_DIUBAH', historyDetails = '') {
    updates.updatedAt = new Date().toISOString();

    if (firebaseManager.isLive) {
      try {
        const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        await updateDoc(doc(firebaseManager.db, 'tickets', id), updates);
      } catch (err) {
        console.warn('Gagal update di Firestore Live:', err);
      }
    }

    const db = this.getLocalDB();
    const idx = (db.tickets || []).findIndex(t => t.id === id);
    if (idx !== -1) {
      db.tickets[idx] = { ...db.tickets[idx], ...updates };
      this.saveLocalDB(db);
    }

    if (actor && historyDetails) {
      await this.addHistory(id, actor, historyAction, historyDetails);
    }

    return db.tickets[idx];
  }

  /**
   * Pembaruan Status Tiket (Seksi 7 & 8)
   */
  async updateTicketStatus(id, newStatus, actor, notes = '') {
    const ticket = await this.getTicketById(id);
    if (!ticket) throw new Error('Tiket tidak ditemukan');

    const oldStatus = ticket.status;
    const now = new Date().toISOString();
    const updates = { status: newStatus };

    // Catat waktu penyelesaian jika terselesaikan
    if (newStatus === 'Terselesaikan' && !ticket.resolvedAt) {
      updates.resolvedAt = now;
    }

    // Catat waktu tutup jika ditutup
    if (newStatus === 'Ditutup' && !ticket.closedAt) {
      updates.closedAt = now;
    }

    // Jika dibuka kembali (Reopen)
    if (newStatus === 'Diproses' && (oldStatus === 'Terselesaikan' || oldStatus === 'Ditutup')) {
      updates.reopenedCount = (ticket.reopenedCount || 0) + 1;
      updates.reopenReason = notes;
      updates.resolvedAt = null;
    }

    let detailMsg = `Status tiket diubah dari "${oldStatus}" menjadi "${newStatus}".`;
    if (notes) {
      detailMsg += ` Catatan: ${notes}`;
    }

    return await this.updateTicket(id, updates, actor, 'STATUS_DIUBAH', detailMsg);
  }

  /**
   * Penugasan Petugas / Tim Teknis (Seksi 3 & 4)
   */
  async assignTicket(id, officer, tech, actor) {
    const updates = {};
    const details = [];

    if (officer) {
      updates.assignedOfficerId = officer.id;
      updates.assignedOfficerName = officer.name;
      details.push(`Petugas layanan ditetapkan: ${officer.name}`);
    }

    if (tech) {
      updates.assignedTechId = tech.id;
      updates.assignedTechName = tech.name;
      details.push(`Tim teknis ditugaskan: ${tech.name}`);
      // Otomatis ubah status ke Diproses jika masih Diverifikasi/Baru
      updates.status = 'Diproses';
    }

    return await this.updateTicket(id, updates, actor, 'PENUGASAN', details.join(', '));
  }

  // ==========================================
  // 2. PESAN PERCAKAPAN (TICKET MESSAGES)
  // ==========================================

  async getMessagesByTicketId(ticketId) {
    if (firebaseManager.isLive) {
      try {
        const { collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const q = query(collection(firebaseManager.db, 'ticket_messages'), where('ticketId', '==', ticketId));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } catch (err) {
        console.warn('Gagal membaca pesan dari Firestore Live:', err);
      }
    }
    const db = this.getLocalDB();
    return (db.ticket_messages || [])
      .filter(m => m.ticketId === ticketId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async addMessage(ticketId, actor, messageText, attachments = [], isInternal = false) {
    const now = new Date().toISOString();
    const newMsg = {
      id: 'msg-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ticketId,
      senderId: actor.id,
      senderName: actor.name,
      senderRole: actor.role,
      message: messageText,
      attachments,
      isInternal,
      createdAt: now
    };

    if (firebaseManager.isLive) {
      try {
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const ref = await addDoc(collection(firebaseManager.db, 'ticket_messages'), newMsg);
        newMsg.id = ref.id;
      } catch (err) {
        console.warn('Gagal simpan pesan ke Firestore Live:', err);
      }
    }

    const db = this.getLocalDB();
    db.ticket_messages = db.ticket_messages || [];
    db.ticket_messages.push(newMsg);
    this.saveLocalDB(db);

    // Cek First Response Time (jika pengirim adalah petugas/teknis dan tiket belum punya firstResponseTime)
    const ticket = await this.getTicketById(ticketId);
    if (ticket && !ticket.firstResponseTime && (actor.role === 'petugas' || actor.role === 'teknis')) {
      await this.updateTicket(ticketId, { firstResponseTime: now }, null);
    }

    // Simpan riwayat pengiriman pesan
    const roleTitle = Utils.getRoleBadge(actor.role);
    const actionLabel = isInternal ? 'CATATAN_INTERNAL' : 'PESAN_DIKIRIM';
    const detailMsg = isInternal
      ? `Catatan teknis internal ditambahkan oleh ${actor.name}.`
      : `Tanggapan dikirim oleh ${actor.name} (${actor.role}).`;
    await this.addHistory(ticketId, actor, actionLabel, detailMsg);

    return newMsg;
  }

  // ==========================================
  // 3. RIWAYAT TIKET (TICKET HISTORY / AUDIT)
  // ==========================================

  async getHistoryByTicketId(ticketId) {
    if (firebaseManager.isLive) {
      try {
        const { collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const q = query(collection(firebaseManager.db, 'ticket_history'), where('ticketId', '==', ticketId));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      } catch (err) {
        console.warn('Gagal membaca history dari Firestore Live:', err);
      }
    }
    const db = this.getLocalDB();
    return (db.ticket_history || [])
      .filter(h => h.ticketId === ticketId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async addHistory(ticketId, actor, action, details) {
    const item = {
      id: 'hist-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ticketId,
      actorId: actor ? actor.id : 'system',
      actorName: actor ? actor.name : 'Sistem',
      actorRole: actor ? actor.role : 'system',
      action,
      details,
      timestamp: new Date().toISOString()
    };

    if (firebaseManager.isLive) {
      try {
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        await addDoc(collection(firebaseManager.db, 'ticket_history'), item);
      } catch (err) {
        console.warn('Gagal simpan history ke Firestore Live:', err);
      }
    }

    const db = this.getLocalDB();
    db.ticket_history = db.ticket_history || [];
    db.ticket_history.unshift(item);
    this.saveLocalDB(db);
  }

  // ==========================================
  // 4. PENILAIAN LAYANAN (RATINGS)
  // ==========================================

  async getRatingByTicketId(ticketId) {
    const db = this.getLocalDB();
    return (db.ratings || []).find(r => r.ticketId === ticketId) || null;
  }

  async getAllRatings() {
    const db = this.getLocalDB();
    return db.ratings || [];
  }

  async addRating(ticketId, actor, score, comment) {
    const existing = await this.getRatingByTicketId(ticketId);
    if (existing) {
      throw new Error('Tiket ini sudah pernah dinilai.');
    }

    const now = new Date().toISOString();
    const newRating = {
      id: 'rate-' + Date.now().toString(36),
      ticketId,
      userId: actor.id,
      userName: actor.name,
      score: Number(score),
      comment: comment || '',
      createdAt: now
    };

    if (firebaseManager.isLive) {
      try {
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        await addDoc(collection(firebaseManager.db, 'ratings'), newRating);
      } catch (err) {
        console.warn('Gagal simpan rating ke Firestore Live:', err);
      }
    }

    const db = this.getLocalDB();
    db.ratings = db.ratings || [];
    db.ratings.push(newRating);
    this.saveLocalDB(db);

    await this.addHistory(ticketId, actor, 'PENILAIAN_DIBERIKAN', `Pengguna memberikan skor kepuasan ${score} bintang.`);

    return newRating;
  }

  // ==========================================
  // 5. MASTER USERS, APLIKASI, KATEGORI, FAQ
  // ==========================================

  async getAllUsers() {
    const db = this.getLocalDB();
    return db.users || [];
  }

  async createUser(userData) {
    const db = this.getLocalDB();
    const newUser = {
      id: 'user-' + Date.now().toString(36),
      email: userData.email,
      name: userData.name,
      role: userData.role || 'pengguna',
      department: userData.department || 'Akademik',
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0D8ABC&color=fff`,
      createdAt: new Date().toISOString()
    };
    db.users = db.users || [];
    db.users.push(newUser);
    this.saveLocalDB(db);
    return newUser;
  }

  async updateUser(id, updates) {
    const db = this.getLocalDB();
    const idx = (db.users || []).findIndex(u => u.id === id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updates };
      this.saveLocalDB(db);
      return db.users[idx];
    }
    return null;
  }

  async getAllApplications() {
    const db = this.getLocalDB();
    return db.applications || [];
  }

  async createApplication(appData) {
    const db = this.getLocalDB();
    const newApp = {
      id: 'app-' + Date.now().toString(36),
      name: appData.name,
      description: appData.description || '',
      active: true
    };
    db.applications = db.applications || [];
    db.applications.push(newApp);
    this.saveLocalDB(db);
    return newApp;
  }

  async updateApplication(id, updates) {
    const db = this.getLocalDB();
    const idx = (db.applications || []).findIndex(a => a.id === id);
    if (idx !== -1) {
      db.applications[idx] = { ...db.applications[idx], ...updates };
      this.saveLocalDB(db);
      return db.applications[idx];
    }
    return null;
  }

  async getAllCategories() {
    const db = this.getLocalDB();
    return db.categories || [];
  }

  async createCategory(catData) {
    const db = this.getLocalDB();
    const newCat = {
      id: 'cat-' + Date.now().toString(36),
      name: catData.name,
      description: catData.description || '',
      defaultPriority: catData.defaultPriority || 'Sedang'
    };
    db.categories = db.categories || [];
    db.categories.push(newCat);
    this.saveLocalDB(db);
    return newCat;
  }

  async updateCategory(id, updates) {
    const db = this.getLocalDB();
    const idx = (db.categories || []).findIndex(c => c.id === id);
    if (idx !== -1) {
      db.categories[idx] = { ...db.categories[idx], ...updates };
      this.saveLocalDB(db);
      return db.categories[idx];
    }
    return null;
  }

  async getAllFaqs() {
    const db = this.getLocalDB();
    return db.faqs || [];
  }

  // ==========================================
  // 6. SYNC DATA KE FIRESTORE LIVE
  // ==========================================

  async syncSeedToLiveFirestore() {
    if (!firebaseManager.isLive) {
      throw new Error('Firebase Live belum terhubung. Silakan isi konfigurasi Firebase terlebih dahulu.');
    }
    try {
      const { collection, setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      const db = this.getLocalDB();

      // Sync users
      for (const u of db.users) {
        await setDoc(doc(firebaseManager.db, 'users', u.id), u);
      }
      // Sync applications
      for (const a of db.applications) {
        await setDoc(doc(firebaseManager.db, 'applications', a.id), a);
      }
      // Sync categories
      for (const c of db.categories) {
        await setDoc(doc(firebaseManager.db, 'categories', c.id), c);
      }
      // Sync tickets
      for (const t of db.tickets) {
        await setDoc(doc(firebaseManager.db, 'tickets', t.id), t);
      }
      // Sync messages
      for (const m of db.ticket_messages) {
        await setDoc(doc(firebaseManager.db, 'ticket_messages', m.id), m);
      }
      // Sync history
      for (const h of db.ticket_history) {
        await setDoc(doc(firebaseManager.db, 'ticket_history', h.id), h);
      }
      // Sync ratings
      for (const r of (db.ratings || [])) {
        await setDoc(doc(firebaseManager.db, 'ratings', r.id), r);
      }

      console.log('Semua data seed berhasil diunggah ke Firebase Cloud Firestore!');
      return true;
    } catch (err) {
      console.error('Gagal sinkronisasi data ke Firebase Live:', err);
      throw err;
    }
  }

  exportDataJSON() {
    const db = this.getLocalDB();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `UR-APP-backup-${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
  }
}

export const firestoreService = new FirestoreService();

