// ─── APP STATE ───────────────────────────────────────────
const APP = {
  currentUser: null,
  currentRole: null, // 'admin' | 'user'
  activeModule: 'dashboard',

  // Sample Data
  data: {
    perkara: [
      { id: 'PRK-001', pemohon: 'Ahmad Fauzi', jenis: 'Cerai Gugat', tgl: '2025-01-15', status: 'proses', nik: '6371012345678901', alamat: 'Jl. Ahmad Yani No. 12' },
      { id: 'PRK-002', pemohon: 'Siti', jenis: 'Cerai Talak', tgl: '2025-01-18', status: 'selesai', nik: '6371019876543210', alamat: 'Jl. Lambung Mangkurat No. 5' },
      { id: 'PRK-003', pemohon: 'Budi Santoso', jenis: 'Gugatan Harta', tgl: '2025-01-20', status: 'menunggu', nik: '6371011122334455', alamat: 'Jl. Veteran No. 8' },
      { id: 'PRK-004', pemohon: 'Nur Hayati', jenis: 'Wali Adhol', tgl: '2025-01-22', status: 'ditolak', nik: '6371015566778899', alamat: 'Jl. Gatot Subroto No. 3' },
      { id: 'PRK-005', pemohon: 'Hendra Putra', jenis: 'Dispensasi Nikah', tgl: '2025-01-25', status: 'proses', nik: '6371019900112233', alamat: 'Jl. Sudirman No. 21' },
      { id: 'PRK-006', pemohon: 'Fatimah Zahro', jenis: 'Cerai Gugat', tgl: '2025-01-28', status: 'menunggu', nik: '6371014433221100', alamat: 'Jl. DI Panjaitan No. 7' },
    ],
    jadwal: [
      { id: 'JDL-001', perkara: 'PRK-001', pemohon: 'Ahmad Fauzi', hakim: 'H. Zulkifli, S.H.', ruang: 'Ruang I', tgl: '2025-02-10', jam: '09:00', status: 'terkonfirmasi' },
      { id: 'JDL-002', perkara: 'PRK-005', pemohon: 'Hendra Putra', hakim: 'Hj. Marlina, S.H., M.H.', ruang: 'Ruang II', tgl: '2025-02-12', jam: '10:00', status: 'menunggu' },
      { id: 'JDL-003', perkara: 'PRK-003', pemohon: 'Budi Santoso', hakim: 'H. Rahman, S.H.', ruang: 'Ruang III', tgl: '2025-02-15', jam: '08:30', status: 'terkonfirmasi' },
      { id: 'JDL-004', perkara: 'PRK-006', pemohon: 'Fatimah Zahro', hakim: 'H. Zulkifli, S.H.', ruang: 'Ruang I', tgl: '2025-02-18', jam: '11:00', status: 'menunggu' },
    ],
    surat: [
      { id: 'SRT-001', pemohon: 'Ahmad Fauzi', jenis: 'Surat Keterangan Perkara', tgl: '2025-01-16', status: 'selesai', keterangan: 'Surat sudah diterbitkan' },
      { id: 'SRT-002', pemohon: 'Rina Kusuma', jenis: 'Surat Kuasa', tgl: '2025-01-19', status: 'proses', keterangan: 'Sedang diproses' },
      { id: 'SRT-003', pemohon: 'Budi Santoso', jenis: 'Surat Panggilan', tgl: '2025-01-22', status: 'menunggu', keterangan: 'Menunggu verifikasi' },
      { id: 'SRT-004', pemohon: 'Hendra Putra', jenis: 'Surat Keterangan Perkara', tgl: '2025-01-26', status: 'menunggu', keterangan: '-' },
    ],
    arsip: [
      { id: 'ARS-001', perkara: 'PRK-001', pemohon: 'Ahmad Fauzi', dokumen: 'KTP + Kartu Keluarga', tgl: '2025-01-15', status: 'terverifikasi', ukuran: '2.4 MB', file: 'assets/dokumen1.pdf' },
      { id: 'ARS-002', perkara: 'PRK-002', pemohon: 'Siti Rahayu', dokumen: 'Akta Nikah', tgl: '2025-01-18', status: 'terverifikasi', ukuran: '1.8 MB' },
      { id: 'ARS-003', perkara: 'PRK-003', pemohon: 'Budi Santoso', dokumen: 'KTP + Sertifikat Tanah', tgl: '2025-01-20', status: 'menunggu', ukuran: '5.1 MB' },
      { id: 'ARS-004', perkara: 'PRK-006', pemohon: 'Fatimah Zahro', dokumen: 'KTP', tgl: '2025-01-28', status: 'ditolak', ukuran: '0.9 MB' },
    ],
    pengaduan: [
      { id: 'PDU-001', pelapor: 'Dewi Sartika', kategori: 'Pelayanan', isi: 'Antrian terlalu panjang dan tidak ada nomor antrian digital.', tgl: '2025-01-17', status: 'selesai', prioritas: 'rendah' },
      { id: 'PDU-002', pelapor: 'Agus Hermawan', kategori: 'Prosedur', isi: 'Kurang informasi tentang syarat pengajuan perkara cerai.', tgl: '2025-01-21', status: 'proses', prioritas: 'sedang' },
      { id: 'PDU-003', pelapor: 'Lina Marlina', kategori: 'Fasilitas', isi: 'Ruang tunggu kurang memadai dan panas.', tgl: '2025-01-24', status: 'menunggu', prioritas: 'rendah' },
      { id: 'PDU-004', pelapor: 'Rizki Pratama', kategori: 'Petugas', isi: 'Petugas kurang ramah saat melayani.', tgl: '2025-01-27', status: 'menunggu', prioritas: 'tinggi' },
    ],
    users: [
      { id: 'USR-001', nama: 'Ahmad Fauzi', email: 'ahmad@email.com', nik: '6371012345678901', tglDaftar: '2025-01-10', status: 'aktif', perkara: 1 },
      { id: 'USR-002', nama: 'Siti Rahayu', email: 'siti@email.com', nik: '6371019876543210', tglDaftar: '2025-01-14', status: 'aktif', perkara: 1 },
      { id: 'USR-003', nama: 'Budi Santoso', email: 'budi@email.com', nik: '6371011122334455', tglDaftar: '2025-01-16', status: 'aktif', perkara: 1 },
      { id: 'USR-004', nama: 'Nur Hayati', email: 'nur@email.com', nik: '6371015566778899', tglDaftar: '2025-01-18', status: 'nonaktif', perkara: 1 },
      { id: 'USR-005', nama: 'Hendra Putra', email: 'hendra@email.com', nik: '6371019900112233', tglDaftar: '2025-01-20', status: 'aktif', perkara: 1 },
      { id: 'USR-006', nama: 'Fatimah Zahro', email: 'fatimah@email.com', nik: '6371014433221100', tglDaftar: '2025-01-24', status: 'aktif', perkara: 1 },
    ],

    // User-specific (for logged-in user simulation)
    myPerkara: [
      { id: 'PRK-001', jenis: 'Cerai Gugat', tglAjuan: '2025-01-15', status: 'proses', catatan: 'Berkas sedang diverifikasi oleh staf' },
    ],
    myJadwal: [
      { id: 'JDL-001', tanggal: '10 Feb 2025', jam: '09:00', ruang: 'Ruang I', hakim: 'H. Zulkifli, S.H.', status: 'terkonfirmasi' },
    ],
    mySurat: [
      { id: 'SRT-001', jenis: 'Surat Keterangan Perkara', tglAjuan: '2025-01-16', status: 'selesai' },
    ],
    myArsip: [
      { id: 'ARS-001', dokumen: 'KTP + Buku Nikah', tglUpload: '2025-01-15', status: 'terverifikasi' },
    ],
    myPengaduan: [
      { id: 'PDU-001', kategori: 'Pelayanan', isi: 'Antrian terlalu panjang.', tgl: '2025-01-17', status: 'selesai' },
    ],
  },

  accounts: {
    admin: [
      { username: 'admin', password: 'admin123', nama: 'Budi Prasetyo, S.H.', jabatan: 'Panitera Muda', avatar: 'BP' }
    ],
    user: [
      { username: 'user', password: 'user123', nama: 'Ahmad Fauzi', email: 'ahmad@email.com', nik: '6371012345678901', avatar: 'AF' }
    ]
  }
};

// ─── HELPERS ─────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    'menunggu': ['badge-yellow', 'Menunggu'],
    'proses': ['badge-blue', 'Diproses'],
    'selesai': ['badge-green', 'Selesai'],
    'ditolak': ['badge-red', 'Ditolak'],
    'terkonfirmasi': ['badge-green', 'Terkonfirmasi'],
    'terverifikasi': ['badge-green', 'Terverifikasi'],
    'aktif': ['badge-green', 'Aktif'],
    'nonaktif': ['badge-gray', 'Nonaktif'],
    'rendah': ['badge-green', 'Rendah'],
    'sedang': ['badge-yellow', 'Sedang'],
    'tinggi': ['badge-red', 'Tinggi'],
  };
  const [cls, label] = map[status] || ['badge-gray', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function formatDate(d) {
  if (!d) return '-';
  const [y, m, day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  return `${day} ${months[parseInt(m)-1]} ${y}`;
}

function toast(msg, type='success') {
  const existing = document.querySelector('.toast-notify');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast-notify';
  const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
  t.style.cssText = `
    position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999;
    background:${colors[type]||colors.success}; color:white;
    padding:0.75rem 1.2rem; border-radius:10px;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:0.875rem; font-weight:600;
    box-shadow:0 8px 24px rgba(0,0,0,0.2);
    animation:fadeUp 0.3s ease;
    display:flex; align-items:center; gap:0.5rem;
  `;
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  t.innerHTML = `<span>${icons[type]||'✓'}</span> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.animation = 'fadeIn 0.3s ease reverse'; setTimeout(() => t.remove(), 300); }, 3000);
}

function confirm_dialog(msg, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width:400px">
      <div class="modal-header">
        <h3>⚠️ Konfirmasi</h3>
      </div>
      <div class="modal-body">
        <p style="color:var(--gray-700)">${msg}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-cancel">Batal</button>
        <button class="btn btn-danger btn-confirm">Ya, Lanjutkan</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('.btn-cancel').onclick = () => overlay.remove();
  overlay.querySelector('.btn-confirm').onclick = () => { overlay.remove(); onConfirm(); };
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function openModal(html, size='') {
  closeModal();
  const overlay = document.createElement('div');
  overlay.id = 'active-modal';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal ${size}">${html}</div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  overlay.querySelector('.modal-close')?.addEventListener('click', closeModal);
  return overlay;
}

function closeModal() {
  document.getElementById('active-modal')?.remove();
}

function navigate(module) {
  APP.activeModule = module;
  // Update nav active
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.module === module);
  });
  // Load page
  if (APP.currentRole === 'admin') {
    loadAdminModule(module);
  } else {
    loadUserModule(module);
  }
  // Update topbar
  const titles = {
    dashboard: ['Dashboard', 'Selamat datang kembali!'],
    perkara: ['Manajemen Perkara', 'Kelola semua pengajuan perkara masyarakat'],
    jadwal: ['Jadwal Sidang', 'Konfirmasi dan kelola jadwal persidangan'],
    surat: ['Surat Menyurat', 'Proses permohonan surat dari masyarakat'],
    arsip: ['Arsip Dokumen', 'Verifikasi dan kelola dokumen perkara'],
    pengaduan: ['Pengaduan', 'Tindak lanjuti laporan masyarakat'],
    users: ['Data Pengguna', 'Kelola akun masyarakat pengguna sistem'],
    laporan: ['Laporan & Statistik', 'Generate dan ekspor laporan'],
    profil: ['Profil Saya', 'Informasi akun dan pengaturan'],
  };
  const [title, sub] = titles[module] || ['Halaman', ''];
  const tt = document.querySelector('.topbar-title');
  const ts = document.querySelector('.topbar-subtitle');
  if (tt) tt.textContent = title;
  if (ts) ts.textContent = sub;
  // Scroll top
  document.querySelector('.page-body')?.scrollTo({ top: 0 });
  window.scrollTo({ top: 0 });
}

// ─── AUTH ─────────────────────────────────────────────────
function doLogin(role) {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const err = document.getElementById('login-error');

  const found = APP.accounts[role]?.find(a => a.username === username && a.password === password);
  if (!found) {
    err.textContent = 'Username atau password salah!';
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';
  APP.currentUser = found;
  APP.currentRole = role;

  if (role === 'admin') {
    loadAdminApp();
  } else {
    loadUserApp();
  }
}

function doLogout() {
  confirm_dialog('Yakin ingin keluar dari aplikasi?', () => {
    APP.currentUser = null;
    APP.currentRole = null;
    APP.activeModule = 'dashboard';
    document.getElementById('app-root').innerHTML = '';
    loadLanding();
  });
}
