// ─── LANDING PAGE ────────────────────────────────────────
function loadLanding() {
  const root = document.getElementById('app-root');
  root.innerHTML = `
    <div style="min-height:100vh; background:linear-gradient(135deg,#0f2340 0%,#1e3a5f 40%,#064e3b 100%); display:flex; flex-direction:column;">
      <!-- Navbar -->
      <nav style="padding:1.2rem 2rem; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.08);">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="width:42px; height:42px; background:rgba(255,255,255,0.15); border-radius:10px; display:flex; align-items:center; justify-content:center;">
  <img src="assets/Logo.png" alt="Logo" style="width:28px; height:28px; object-fit:cover; border-radius:6px;">
</div>
          <div>
            <div style="font-weight:700;color:white;font-size:1rem;font-family:'Playfair Display',serif;">Pengadilan Agama</div>
            <div style="font-size:0.72rem;color:rgba(255,255,255,0.5);">Kelas IA Banjarmasin</div>
          </div>
        </div>
        <div style="display:flex;gap:0.75rem;">
          <button onclick="loadLoginPage('user')" class="btn" style="background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.2);">🏠 Portal Masyarakat</button>
          <button onclick="loadLoginPage('admin')" class="btn" style="background:rgba(255,255,255,0.9);color:#0f2340;">🔐 Login Staf</button>
        </div>
      </nav>
      <!-- Hero -->
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem 2rem;text-align:center;">
        <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:999px;padding:0.5rem 1.2rem;font-size:0.78rem;color:rgba(255,255,255,0.7);margin-bottom:1.5rem;display:inline-flex;align-items:center;gap:0.5rem;">
          <span style="width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block;"></span>
          Sistem Informasi Pengadilan Agama v2.0
        </div>
        <h1 style="font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3.5rem);color:white;font-weight:700;line-height:1.2;max-width:700px;margin-bottom:1rem;">
          Layanan Pengadilan Agama<br>
          <span style="background:linear-gradient(90deg,#60a5fa,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Lebih Mudah & Transparan</span>
        </h1>
        <p style="color:rgba(255,255,255,0.6);max-width:500px;margin-bottom:2.5rem;line-height:1.7;">
          Ajukan perkara, pantau status sidang, dan kelola dokumen secara digital, kapan saja dan di mana saja.
        </p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">
          <button onclick="loadLoginPage('user')" class="btn btn-lg" style="background:linear-gradient(135deg,#059669,#10b981);color:white;box-shadow:0 8px 24px rgba(16,185,129,0.35);">
            🏛️ Masuk sebagai Masyarakat
          </button>
          <button onclick="loadLoginPage('admin')" class="btn btn-lg btn-outline" style="color:white;border-color:rgba(255,255,255,0.3);">
            👤 Masuk sebagai Staf Pengadilan
          </button>
        </div>
      </div>
      <!-- Features -->
      <div style="padding:1.5rem 2rem 2rem;width:100%;max-width:1000px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:1.2rem;">
          <span style="font-size:0.75rem;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.1em;">Layanan yang Tersedia</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0.85rem;">
          ${[
            ['⚖️','Pengajuan Perkara','Ajukan perkara cerai, gugatan, wali adhol, dan lainnya secara online'],
            ['📅','Jadwal Sidang','Pantau & konfirmasi jadwal persidangan real-time'],
            ['✉️','Surat Menyurat','Ajukan permohonan surat resmi dari pengadilan'],
            ['🗂️','Arsip Dokumen','Upload & pantau verifikasi dokumen perkara Anda'],
            ['📢','Pengaduan','Sampaikan keluhan dan masukan langsung ke pengadilan'],
          ].map(([ico,title,sub]) => `
            <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:1.2rem;text-align:center;transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'">
              <div style="font-size:1.7rem;margin-bottom:0.5rem;">${ico}</div>
              <div style="font-weight:700;color:white;font-size:0.85rem;margin-bottom:0.3rem;">${title}</div>
              <div style="color:rgba(255,255,255,0.45);font-size:0.72rem;line-height:1.4;">${sub}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div style="text-align:center;padding:1.5rem;color:rgba(255,255,255,0.3);font-size:0.75rem;">
        © 2026 Pengadilan Agama Kelas IA Banjarmasin
      </div>
    </div>
  `;
}

// ─── LOGIN PAGES ──────────────────────────────────────────
function loadLoginPage(role) {
  const isAdmin = role === 'admin';
  const root = document.getElementById('app-root');
  root.innerHTML = `
    <div class="auth-wrapper ${isAdmin ? 'admin-auth' : 'user-auth'}">
      <div class="auth-card animate-in">
        <div class="auth-logo">
          <img src="assets/Logo.png" alt="Logo" class="logo-icon" style="width:72px; height:72px; border-radius:16px; margin-bottom:1rem;">
          <h1>Pengadilan Agama<br>Kelas IA Banjarmasin</h1>
          <p>Sistem Informasi Manajemen Perkara</p>
        </div>
        <div style="text-align:center; margin-bottom:1.5rem;">
          <span class="auth-role-badge ${isAdmin ? 'admin-badge' : 'user-badge'}">
            ${isAdmin ? '🔐 Portal Staf Pengadilan' : '👤 Portal Masyarakat'}
          </span>
        </div>
        <div id="login-error" style="display:none; background:var(--danger-light); color:#991b1b; padding:0.7rem 1rem; border-radius:var(--radius); font-size:0.84rem; margin-bottom:1rem; border-left:3px solid var(--danger);">
          ⚠️ Username atau password salah!
        </div>
        <div class="form-group">
          <label>Username</label>
          <div class="input-icon-wrap">
            <span class="icon">👤</span>
            <input type="text" class="form-control" id="username" placeholder="Masukkan username" onkeydown="if(event.key==='Enter')doLogin('${role}')">
          </div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="input-icon-wrap">
            <span class="icon">🔒</span>
            <input type="password" class="form-control" id="password" placeholder="Masukkan password" onkeydown="if(event.key==='Enter')doLogin('${role}')">
          </div>
        </div>
        <button onclick="doLogin('${role}')" class="btn ${isAdmin ? 'btn-admin' : 'btn-user'} btn-block btn-lg" style="margin-top:0.5rem;">
          Masuk ke Sistem
        </button>
        <div class="auth-switch">
          <a href="#" onclick="loadLanding()" style="color:var(--gray-500); text-decoration:none;">← Kembali ke Beranda</a>
          ${!isAdmin ? `&nbsp;|&nbsp; Belum punya akun? <a href="#" onclick="loadRegisterPage()">Daftar</a>` : ''}
        </div>
      </div>
    </div>
  `;
}

function loadRegisterPage() {
  const root = document.getElementById('app-root');
  root.innerHTML = `
    <div class="auth-wrapper user-auth">
      <div class="auth-card animate-in" style="max-width:520px;">
        <div class="auth-logo">
          <div class="logo-icon">📝</div>
          <h1>Daftar Akun Masyarakat</h1>
          <p>Pengadilan Agama Kelas IA Banjarmasin</p>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Nama Lengkap</label>
            <input class="form-control" placeholder="Nama sesuai KTP">
          </div>
          <div class="form-group">
            <label>NIK</label>
            <input class="form-control" placeholder="16 digit NIK">
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-control" placeholder="email@contoh.com">
        </div>
        <div class="form-group">
          <label>No. Telepon</label>
          <input class="form-control" placeholder="08xx-xxxx-xxxx">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Username</label>
            <input class="form-control" placeholder="Buat username">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" placeholder="Min. 8 karakter">
          </div>
        </div>
        <div class="form-group">
          <label>Alamat</label>
          <textarea class="form-control" rows="2" placeholder="Alamat lengkap"></textarea>
        </div>
        <div class="form-check" style="margin-bottom:1rem;">
          <input type="checkbox" id="agree">
          <label for="agree" style="font-size:0.82rem;color:var(--gray-600);">Saya menyetujui syarat & ketentuan penggunaan sistem</label>
        </div>
        <button onclick="toast('Pendaftaran berhasil! Silakan login.','success'); loadLoginPage('user');" class="btn btn-user btn-block btn-lg">
          Daftar Sekarang
        </button>
        <div class="auth-switch">
          Sudah punya akun? <a href="#" onclick="loadLoginPage('user')">Login di sini</a>
        </div>
      </div>
    </div>
  `;
}
