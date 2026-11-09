/**
 * Modul Autentikasi dan Manajemen Sesi
 * UR-APP: Sistem Pengelolaan Umpan Balik Pengguna
 */

import { firestoreService } from './firestore-service.js';
import { Utils } from './utils.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.listeners = new Set();
    this.initSession();
  }

  async initSession() {
    const saved = localStorage.getItem('ur_app_current_user');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch (e) {
        console.warn('Gagal membaca sesi:', e);
      }
    }

    if (!this.currentUser) {
      // Default: Mahasiswa Budi Santoso
      const users = await firestoreService.getAllUsers();
      this.currentUser = users.find(u => u.role === 'pengguna') || users[0];
      this.saveSession();
    }
  }

  saveSession() {
    if (this.currentUser) {
      localStorage.setItem('ur_app_current_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('ur_app_current_user');
    }
    this.notify();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  onAuthStateChanged(callback) {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.currentUser); } catch (e) { console.error(e); }
    });
  }

  async switchUserById(userId) {
    const users = await firestoreService.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      this.saveSession();
      Utils.showToast(`Beralih peran sebagai: ${user.name} (${user.role.toUpperCase()})`, 'info');
      return user;
    }
    return null;
  }

  async switchRole(targetRole) {
    const users = await firestoreService.getAllUsers();
    const user = users.find(u => u.role === targetRole);
    if (user) {
      return this.switchUserById(user.id);
    }
    Utils.showToast(`Tidak ditemukan akun dengan peran ${targetRole}`, 'warning');
    return null;
  }

  async login(email, password) {
    // Cari user di database
    const users = await firestoreService.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Email atau akun tidak terdaftar.');
    }
    this.currentUser = user;
    this.saveSession();
    Utils.showToast(`Selamat datang, ${user.name}!`, 'success');
    return user;
  }

  async register(name, email, role = 'pengguna', department = '') {
    const users = await firestoreService.getAllUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email ini sudah terdaftar.');
    }

    const newUser = await firestoreService.createUser({
      name,
      email,
      role,
      department
    });

    this.currentUser = newUser;
    this.saveSession();
    Utils.showToast('Akun berhasil dibuat!', 'success');
    return newUser;
  }

  logout() {
    this.currentUser = null;
    this.saveSession();
    Utils.showToast('Anda telah keluar.', 'info');
  }

  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }
}

export const authService = new AuthService();

