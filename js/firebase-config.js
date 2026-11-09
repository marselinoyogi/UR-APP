/**
 * Konfigurasi dan Inisialisasi Firebase SDK
 * UR-APP: Sistem Pengelolaan Umpan Balik Pengguna
 */

// Konfigurasi default (Dapat diubah melalui UI Pengaturan atau file ini)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

class FirebaseManager {
  constructor() {
    this.app = null;
    this.db = null;
    this.auth = null;
    this.isLive = false;
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem('ur_app_firebase_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Gagal membaca config dari localStorage:', e);
    }
    return DEFAULT_FIREBASE_CONFIG;
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('ur_app_firebase_config', JSON.stringify(this.config));
    window.location.reload();
  }

  resetConfig() {
    localStorage.removeItem('ur_app_firebase_config');
    window.location.reload();
  }

  isConfigured() {
    return !!(this.config && this.config.apiKey && this.config.projectId);
  }

  async initialize() {
    if (!this.isConfigured()) {
      console.log('UR-APP: Menjalankan mode Local Firestore (Demo/Offline) karena Firebase credentials belum diset.');
      this.isLive = false;
      return false;
    }

    try {
      // Dynamic import official Firebase v10 CDN
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
      const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');

      this.app = initializeApp(this.config);
      this.db = getFirestore(this.app);
      this.auth = getAuth(this.app);
      this.isLive = true;
      console.log('UR-APP: Terhubung ke Live Firebase Firestore! Project ID:', this.config.projectId);
      return true;
    } catch (err) {
      console.error('UR-APP: Gagal menghubungkan ke Firebase Live:', err);
      this.isLive = false;
      return false;
    }
  }
}

export const firebaseManager = new FirebaseManager();

