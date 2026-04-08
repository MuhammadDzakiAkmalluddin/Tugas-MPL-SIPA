// ─── USER APP SKELETON ────────────────────────────────────
function loadUserApp() {
  const u = APP.currentUser;
  document.getElementById('app-root').innerHTML = `
    <div class="app-layout user-page">
      <!-- Sidebar -->
      <aside class="sidebar user-sidebar-bg" id="sidebar">
        <div class="sidebar-logo">
          <div class="logo-row">
            <div class="logo-box">
             <img src="assets/Logo.png" alt="Logo" style="width:40px; height:40px; border-radius:8px;"></div>
            <div class="logo-text">
              <h2>PA Banjarmasin</h2>
              <span>Portal Masyarakat</span>
            </div>
          </div>
        </div>
        <div class="sidebar-user-info">
          <div class="info-row">
            <div class="user-avatar">${u.avatar}</div>
            <div>
              <div class="user-name">${u.nama}</div>
              <div class="user-role">Masyarakat / Pemohon</div>
            </div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section-label">Layanan</div>
          ${userNavItems().map(item => `
            <a class="nav-item ${item.id === 'dashboard' ? 'active' : ''}" data-module="${item.id}" onclick="navigate('${item.id}')">
              <span class="nav-icon">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `).join('')}
          <div class="nav-section-label" style="margin-top:0.5rem;">Akun</div>
          <a class="nav-item" data-module="profil" onclick="navigate('profil')">
            <span class="nav-icon">👤</span>
            <span>Profil Saya</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <a class="nav-item" onclick="doLogout()" style="color:rgba(255,150,150,0.7);">
            <span class="nav-icon">🚪</span>
            <span>Keluar</span>
          </a>
        </div>
      </aside>
      <!-- Main -->
      <div class="main-content">
        <header class="topbar">
          <div class="topbar-left">
            <div>
              <div class="topbar-title">Dashboard</div>
              <div class="topbar-subtitle">Selamat datang, ${u.nama}!</div>
            </div>
          </div>
          <div class="topbar-right">
            <button class="topbar-btn" onclick="toast('Tidak ada notifikasi baru','info')" title="Notifikasi">🔔</button>
            <div style="width:36px;height:36px;background:var(--user-light);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:var(--user-secondary);cursor:pointer;" onclick="navigate('profil')">
              ${u.avatar}
            </div>
          </div>
        </header>
        <div class="page-body" id="page-content"></div>
      </div>
    </div>
  `;
  navigate('dashboard');
}

function userNavItems() {
  return [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard Saya' },
    { id: 'perkara', icon: '📋', label: 'Perkara Saya' },
    { id: 'jadwal', icon: '📅', label: 'Jadwal Sidang' },
    { id: 'surat', icon: '✉️', label: 'Surat Menyurat' },
    { id: 'arsip', icon: '🗂️', label: 'Arsip Dokumen' },
    { id: 'pengaduan', icon: '📢', label: 'Pengaduan' },
  ];
}

function loadUserModule(module) {
  const content = document.getElementById('page-content');
  if (!content) return;
  switch(module) {
    case 'dashboard': content.innerHTML = userDashboard(); break;
    case 'perkara':   content.innerHTML = userPerkara(); break;
    case 'jadwal':    content.innerHTML = userJadwal(); break;
    case 'surat':     content.innerHTML = userSurat(); break;
    case 'arsip':     content.innerHTML = userArsip(); break;
    case 'pengaduan': content.innerHTML = userPengaduan(); break;
    case 'profil':    content.innerHTML = userProfil(); break;
    default:          content.innerHTML = '<p>Halaman tidak ditemukan.</p>';
  }
}

// ─── USER: DASHBOARD ─────────────────────────────────────
function userDashboard() {
  const u = APP.currentUser;
  const d = APP.data;
  return `
    <!-- Welcome Banner -->
    <div style="background:linear-gradient(135deg,var(--user-primary),var(--user-secondary));border-radius:var(--radius-xl);padding:2rem;margin-bottom:1.5rem;color:white;position:relative;overflow:hidden;" class="animate-in">
      <div style="position:absolute;right:-20px;top:-20px;font-size:8rem;opacity:0.07;">⚖️</div>
      <div style="font-size:0.78rem;opacity:0.8;margin-bottom:0.5rem;">Selamat datang kembali,</div>
      <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:0.5rem;">${u.nama} 👋</h2>
      <p style="opacity:0.8;font-size:0.875rem;">Pantau status pengajuan dan layanan Anda di sini.</p>
      <div style="display:flex;gap:0.75rem;margin-top:1.2rem;flex-wrap:wrap;">
        <button onclick="navigate('perkara')" class="btn" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3);font-size:0.82rem;">📋 Ajukan Perkara</button>
        <button onclick="navigate('pengaduan')" class="btn" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.2);font-size:0.82rem;">📢 Sampaikan Pengaduan</button>
      </div>
    </div>

    <!-- My Status Cards -->
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));">
      ${[
        ['📋','Perkara Saya', d.myPerkara.length, 'var(--admin-light)', '#Diproses'],
        ['📅','Jadwal Sidang', d.myJadwal.length, 'var(--user-light)', '#Terkonfirmasi'],
        ['✉️','Permohonan Surat', d.mySurat.length, '#fef3c7', '#Selesai'],
        ['🗂️','Dokumen Terupload', d.myArsip.length, '#ede9fe', '#Terverifikasi'],
      ].map(([ico,lbl,val,bg,sub]) => `
        <div class="stat-card animate-in">
          <div class="stat-icon" style="background:${bg};">${ico}</div>
          <div class="stat-info">
            <div class="stat-label">${lbl}</div>
            <div class="stat-value">${val}</div>
            <div class="stat-change">${sub}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Status perkara & panduan -->
    <div class="content-grid col-3" style="margin-top:1.5rem;">
      <!-- Status pengajuan -->
      <div class="card animate-in">
        <div class="card-header"><h3>📋 Status Pengajuan Saya</h3><button class="btn btn-outline btn-xs" onclick="navigate('perkara')">Lihat Semua</button></div>
        <div class="card-body no-pad" style="padding:0 1.5rem;">
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot" style="background:var(--success-light);color:var(--success);">✓</div>
              <div class="timeline-info">
                <div class="tl-title">Perkara PRK-001 Diterima</div>
                <div class="tl-sub">Cerai Gugat — 15 Jan 2025</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot" style="background:var(--info-light);color:var(--info);">▶</div>
              <div class="timeline-info">
                <div class="tl-title">Berkas Sedang Diverifikasi</div>
                <div class="tl-sub">Staf sedang memeriksa dokumen</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot" style="background:var(--gray-100);color:var(--gray-400);">📅</div>
              <div class="timeline-info">
                <div class="tl-title">Jadwal Sidang Ditetapkan</div>
                <div class="tl-sub">10 Feb 2025, 09:00 WIB — Ruang I</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot" style="background:var(--gray-100);color:var(--gray-300);">⏳</div>
              <div class="timeline-info">
                <div class="tl-title">Sidang Perdana</div>
                <div class="tl-sub">Menunggu pelaksanaan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panduan -->
      <div class="card animate-in">
        <div class="card-header"><h3>📖 Panduan Penggunaan</h3></div>
        <div class="card-body no-pad" style="padding:0 1.5rem;">
          ${[
            ['1','Daftar & Login','Buat akun dan masuk ke portal masyarakat','var(--user-light)'],
            ['2','Isi Form Perkara','Lengkapi data dan jenis perkara Anda','var(--admin-light)'],
            ['3','Upload Dokumen','Unggah dokumen pendukung yang diperlukan','#fef3c7'],
            ['4','Tunggu Konfirmasi','Staf akan memverifikasi dan menghubungi','#ede9fe'],
            ['5','Hadiri Sidang','Datang sesuai jadwal yang telah ditetapkan','var(--success-light)'],
          ].map(([no,tit,sub,bg]) => `
            <div class="activity-item">
              <div style="width:28px;height:28px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;flex-shrink:0;">${no}</div>
              <div>
                <div style="font-size:0.84rem;font-weight:600;color:var(--gray-800);">${tit}</div>
                <div class="activity-time">${sub}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Info box -->
    <div class="alert alert-info" style="margin-top:1.5rem;">
      <span>📞</span>
      <span>Butuh bantuan? Hubungi Pengadilan Agama Banjarmasin: <strong>(0511) 3253178</strong> atau datang langsung ke Jl. D.I. Panjaitan No. 2, Banjarmasin</span>
    </div>
  `;
}

// ─── USER: PERKARA ────────────────────────────────────────
function userPerkara() {
  const data = APP.data.myPerkara;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Perkara Saya</h2><p>Ajukan dan pantau status perkara Anda</p></div>
      <div class="page-header-right">
        <button class="btn btn-user btn-sm" onclick="userModalAjukanPerkara()">+ Ajukan Perkara Baru</button>
      </div>
    </div>

    ${data.length === 0 ? `
      <div class="card"><div class="card-body"><div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>Belum ada perkara yang diajukan.<br>Klik tombol "Ajukan Perkara Baru" untuk memulai.</p>
      </div></div></div>
    ` : `
      ${data.map(p => `
        <div class="card animate-in" style="margin-bottom:1rem;">
          <div class="card-body">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;">
              <div>
                <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;">
                  <span class="font-bold">${p.id}</span>
                  ${statusBadge(p.status)}
                </div>
                <div class="text-sm" style="color:var(--gray-700);">Jenis: <strong>${p.jenis}</strong></div>
                <div class="text-xs text-gray" style="margin-top:0.2rem;">Diajukan: ${formatDate(p.tglAjuan)}</div>
              </div>
              <div style="text-align:right;">
                <div class="text-xs text-gray mb-2">Catatan Staf:</div>
                <div class="text-sm" style="background:var(--gray-50);padding:0.5rem 0.75rem;border-radius:var(--radius);max-width:250px;">${p.catatan}</div>
              </div>
            </div>
            <!-- Progress -->
            <div style="margin-top:1.2rem;">
              <div style="display:flex;gap:0;position:relative;">
                ${['Diajukan','Diverifikasi','Dijadwalkan','Sidang','Selesai'].map((step,i) => `
                  <div style="flex:1;text-align:center;position:relative;">
                    <div style="width:24px;height:24px;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;
                      ${i<=1 ? 'background:var(--user-secondary);color:white;' : 'background:var(--gray-200);color:var(--gray-400);'}">
                      ${i<1?'✓':i+1}
                    </div>
                    <div style="font-size:0.66rem;color:${i<=1?'var(--user-secondary)':'var(--gray-400)'};margin-top:0.3rem;">${step}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    `}

    <!-- Ajukan baru CTA -->
    <div class="card animate-in" style="border:2px dashed var(--gray-200);box-shadow:none;cursor:pointer;" onclick="userModalAjukanPerkara()">
      <div class="card-body" style="text-align:center;padding:2rem;">
        <div style="font-size:2rem;margin-bottom:0.5rem;">➕</div>
        <div class="font-bold" style="color:var(--user-secondary);">Ajukan Perkara Baru</div>
        <div class="text-xs text-gray" style="margin-top:0.25rem;">Klik untuk mengisi form pengajuan perkara</div>
      </div>
    </div>
  `;
}

function userModalAjukanPerkara() {
  openModal(`
    <div class="modal-header"><h3>📋 Ajukan Perkara Baru</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="alert alert-info" style="margin-bottom:1rem;"><span>ℹ️</span><span>Pastikan semua data yang Anda isi sesuai dengan dokumen resmi.</span></div>
      <div class="form-group"><label>Jenis Perkara</label>
        <select class="form-control" id="up-jenis">
          <option>-- Pilih Jenis Perkara --</option>
          <option>Cerai Gugat</option><option>Cerai Talak</option><option>Gugatan Harta Bersama</option>
          <option>Wali Adhol</option><option>Dispensasi Nikah</option><option>Isbat Nikah</option><option>Kewarisan</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Nama Lengkap</label><input class="form-control" value="${APP.currentUser.nama}" id="up-nama"></div>
        <div class="form-group"><label>NIK</label><input class="form-control" value="${APP.currentUser.nik}" id="up-nik"></div>
      </div>
      <div class="form-group"><label>Alamat Lengkap</label><textarea class="form-control" rows="2" id="up-alamat" placeholder="Alamat sesuai KTP"></textarea></div>
      <div class="form-group"><label>No. Telepon</label><input class="form-control" id="up-telp" placeholder="08xx-xxxx-xxxx"></div>
      <div class="form-group"><label>Uraian Singkat Perkara</label><textarea class="form-control" rows="3" id="up-urai" placeholder="Jelaskan secara singkat perkara yang Anda ajukan..."></textarea></div>
      <div class="form-check">
        <input type="checkbox" id="up-agree">
        <label for="up-agree" style="font-size:0.82rem;">Saya menyatakan data yang saya isi adalah benar dan dapat dipertanggungjawabkan</label>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-user" onclick="
        const jenis=document.getElementById('up-jenis').value;
        if(jenis==='-- Pilih Jenis Perkara --'){toast('Pilih jenis perkara terlebih dahulu','error');return;}
        const id='PRK-00'+(APP.data.myPerkara.length+10);
        APP.data.myPerkara.push({id,jenis,tglAjuan:new Date().toISOString().split('T')[0],status:'menunggu',catatan:'Pengajuan diterima, menunggu verifikasi staf'});
        closeModal(); navigate('perkara'); toast('Perkara berhasil diajukan! Staf akan segera memproses.','success');
      ">Ajukan Perkara</button>
    </div>
  `);
}

// ─── USER: JADWAL SIDANG ──────────────────────────────────
function userJadwal() {
  const data = APP.data.myJadwal;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Jadwal Sidang Saya</h2><p>Pantau jadwal sidang dan konfirmasi dari staf</p></div>
      <div class="page-header-right">
        <button class="btn btn-user btn-sm" onclick="userModalMintaJadwal()">📅 Minta Jadwal</button>
      </div>
    </div>
    ${data.length > 0 ? `
      ${data.map(j => `
        <div class="card animate-in" style="margin-bottom:1rem;">
          <div class="card-body">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;">
              <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
                <div style="background:var(--user-light);border-radius:var(--radius);padding:1rem;text-align:center;min-width:80px;">
                  <div style="font-size:1.5rem;font-weight:800;color:var(--user-secondary);">10</div>
                  <div style="font-size:0.72rem;color:var(--user-primary);font-weight:600;">FEB 2025</div>
                </div>
                <div>
                  <div class="font-bold">${j.jam} WIB — ${j.ruang}</div>
                  <div class="text-sm text-gray">Hakim: ${j.hakim}</div>
                  <div style="margin-top:0.5rem;">${statusBadge(j.status)}</div>
                </div>
              </div>
              <div>
                ${j.status==='terkonfirmasi' ? `
                  <div class="alert alert-success" style="margin:0;font-size:0.82rem;">
                    <span>✅</span><span>Jadwal telah dikonfirmasi oleh staf pengadilan</span>
                  </div>
                ` : `
                  <div class="alert alert-warning" style="margin:0;font-size:0.82rem;">
                    <span>⏳</span><span>Menunggu konfirmasi dari staf pengadilan</span>
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    ` : `
      <div class="card"><div class="card-body"><div class="empty-state">
        <div class="empty-icon">📅</div>
        <p>Belum ada jadwal sidang.<br>Klik "Minta Jadwal" untuk mengajukan permintaan jadwal sidang.</p>
      </div></div></div>
    `}
    <div class="card animate-in" style="margin-top:1.5rem;">
      <div class="card-header"><h3>ℹ️ Informasi Penting</h3></div>
      <div class="card-body">
        ${['Hadir 30 menit sebelum waktu sidang yang ditentukan','Bawa semua dokumen asli yang relevan dengan perkara','Berpakaian rapi dan sopan sesuai tata tertib pengadilan','Jika berhalangan hadir, hubungi segera staf pengadilan'].map((tip,i) => `
          <div style="display:flex;gap:0.75rem;align-items:flex-start;padding:0.5rem 0;border-bottom:1px solid var(--gray-100);">
            <span style="width:22px;height:22px;background:var(--user-light);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:var(--user-secondary);flex-shrink:0;">${i+1}</span>
            <span class="text-sm">${tip}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function userModalMintaJadwal() {
  openModal(`
    <div class="modal-header"><h3>📅 Minta Jadwal Sidang</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Terkait Perkara</label>
        <select class="form-control">
          ${APP.data.myPerkara.map(p=>`<option>${p.id} — ${p.jenis}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Preferensi Tanggal</label><input type="date" class="form-control"></div>
      <div class="form-group"><label>Catatan / Permintaan Khusus</label><textarea class="form-control" rows="2" placeholder="Opsional..."></textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-user" onclick="
        APP.data.myJadwal.push({id:'JDL-MY-001',tanggal:'Menunggu konfirmasi',jam:'--:--',ruang:'Belum ditentukan',hakim:'Belum ditentukan',status:'menunggu'});
        closeModal(); navigate('jadwal'); toast('Permintaan jadwal dikirim ke staf pengadilan','success');
      ">Kirim Permintaan</button>
    </div>
  `);
}

// ─── USER: SURAT MENYURAT ─────────────────────────────────
function userSurat() {
  const data = APP.data.mySurat;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Surat Menyurat</h2><p>Ajukan permohonan surat resmi</p></div>
      <div class="page-header-right">
        <button class="btn btn-user btn-sm" onclick="userModalAjukanSurat()">✉️ Ajukan Permohonan</button>
      </div>
    </div>
    <div class="card animate-in">
      <div class="card-body no-pad">
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Jenis Surat</th><th>Tgl Permohonan</th><th>Status</th></tr></thead>
            <tbody>
              ${data.map(s => `
                <tr>
                  <td class="font-bold text-sm">${s.id}</td>
                  <td>${s.jenis}</td>
                  <td class="text-sm text-gray">${formatDate(s.tglAjuan)}</td>
                  <td>${statusBadge(s.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Jenis surat tersedia -->
    <div class="card animate-in" style="margin-top:1.5rem;">
      <div class="card-header"><h3>📄 Jenis Surat yang Dapat Dimohon</h3></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;">
          ${[
            ['📋','Surat Keterangan Perkara','Keterangan nomor & status perkara'],
            ['📜','Surat Penetapan','Salinan penetapan pengadilan'],
            ['✉️','Surat Panggilan','Surat panggilan sidang resmi'],
            ['📝','Surat Kuasa','Pemberian kuasa kepada pihak ketiga'],
          ].map(([ico,nama,desc]) => `
            <div style="background:var(--gray-50);border-radius:var(--radius);padding:1rem;border:1px solid var(--gray-100);">
              <div style="font-size:1.5rem;margin-bottom:0.5rem;">${ico}</div>
              <div class="font-bold text-sm">${nama}</div>
              <div class="text-xs text-gray" style="margin-top:0.25rem;">${desc}</div>
              <button class="btn btn-user btn-xs" style="margin-top:0.75rem;" onclick="userModalAjukanSurat()">Ajukan</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function userModalAjukanSurat() {
  openModal(`
    <div class="modal-header"><h3>✉️ Ajukan Permohonan Surat</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Jenis Surat yang Dimohon</label>
        <select class="form-control" id="us-jenis">
          <option>Surat Keterangan Perkara</option><option>Surat Penetapan</option><option>Surat Panggilan</option><option>Surat Kuasa</option>
        </select>
      </div>
      <div class="form-group"><label>Terkait Perkara</label>
        <select class="form-control">
          ${APP.data.myPerkara.map(p=>`<option>${p.id} — ${p.jenis}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Keperluan / Tujuan</label><textarea class="form-control" rows="2" id="us-keperluan" placeholder="Jelaskan keperluan surat..."></textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-user" onclick="
        APP.data.mySurat.push({id:'SRT-MY-'+(APP.data.mySurat.length+1).toString().padStart(3,'0'),jenis:document.getElementById('us-jenis').value,tglAjuan:new Date().toISOString().split('T')[0],status:'menunggu'});
        closeModal(); navigate('surat'); toast('Permohonan surat berhasil dikirim','success');
      ">Kirim Permohonan</button>
    </div>
  `);
}

// ─── USER: ARSIP DOKUMEN ──────────────────────────────────
function userArsip() {
  const data = APP.data.myArsip;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Arsip Dokumen Saya</h2><p>Upload dan pantau verifikasi dokumen perkara</p></div>
      <div class="page-header-right">
        <button class="btn btn-user btn-sm" onclick="userModalUploadDokumen()">📤 Upload Dokumen</button>
      </div>
    </div>
    <div class="alert alert-info"><span>📌</span><span>Pastikan dokumen yang diupload jelas, tidak buram, dan dalam format PDF/JPG/PNG (maks. 10MB per file).</span></div>
    <div class="card animate-in">
      <div class="card-body no-pad">
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Nama Dokumen</th><th>Tgl Upload</th><th>Status Verifikasi</th></tr></thead>
            <tbody>
              ${data.map(a => `
                <tr>
                  <td class="font-bold text-sm">${a.id}</td>
                  <td><div style="display:flex;align-items:center;gap:0.5rem;"><span>📄</span><span>${a.dokumen}</span></div></td>
                  <td class="text-sm text-gray">${formatDate(a.tglUpload)}</td>
                  <td>${statusBadge(a.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Checklist dokumen -->
    <div class="card animate-in" style="margin-top:1.5rem;">
      <div class="card-header"><h3>📋 Checklist Dokumen Wajib</h3></div>
      <div class="card-body">
        ${[
          ['✅','KTP Pemohon','Foto KTP yang jelas dan valid'],
          ['✅','Buku Nikah/Akta Nikah','Asli atau fotokopi yang dilegalisir'],
          ['⬜','Kartu Keluarga','Foto KK yang masih berlaku'],
          ['⬜','Surat Gugatan','Surat gugatan bermaterai'],
        ].map(([status,dok,desc]) => `
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0;border-bottom:1px solid var(--gray-100);">
            <span style="font-size:1.1rem;">${status}</span>
            <div>
              <div class="font-bold text-sm">${dok}</div>
              <div class="text-xs text-gray">${desc}</div>
            </div>
            ${status==='⬜'?`<button class="btn btn-user btn-xs" style="margin-left:auto;" onclick="userModalUploadDokumen()">Upload</button>`:''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function userModalUploadDokumen() {
  openModal(`
    <div class="modal-header"><h3>📤 Upload Dokumen</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Jenis Dokumen</label>
        <select class="form-control" id="ud-jenis">
          <option>KTP Pemohon</option><option>Buku Nikah / Akta Nikah</option><option>Kartu Keluarga</option><option>Surat Gugatan</option><option>Dokumen Lainnya</option>
        </select>
      </div>
      <div class="form-group"><label>File Dokumen</label>
        <div style="border:2px dashed var(--gray-200);border-radius:var(--radius);padding:2rem;text-align:center;cursor:pointer;" onclick="toast('Membuka file manager...','info')">
          <div style="font-size:2.5rem;">📁</div>
          <div style="font-size:0.84rem;color:var(--gray-500);margin-top:0.5rem;">Klik untuk pilih file</div>
          <div style="font-size:0.72rem;color:var(--gray-400);margin-top:0.25rem;">PDF, JPG, PNG — Maks. 10MB</div>
        </div>
      </div>
      <div class="form-group"><label>Catatan (opsional)</label><input class="form-control" placeholder="Catatan untuk petugas..."></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-user" onclick="
        APP.data.myArsip.push({id:'ARS-MY-'+(APP.data.myArsip.length+1).toString().padStart(3,'0'),dokumen:document.getElementById('ud-jenis').value,tglUpload:new Date().toISOString().split('T')[0],status:'menunggu'});
        closeModal(); navigate('arsip'); toast('Dokumen berhasil diupload, menunggu verifikasi staf','success');
      ">Upload Dokumen</button>
    </div>
  `);
}

// ─── USER: PENGADUAN ──────────────────────────────────────
function userPengaduan() {
  const data = APP.data.myPengaduan;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Pengaduan Saya</h2><p>Sampaikan keluhan dan masukan Anda</p></div>
      <div class="page-header-right">
        <button class="btn btn-user btn-sm" onclick="userModalAjukanPengaduan()">📢 Buat Pengaduan</button>
      </div>
    </div>
    <div class="alert alert-success"><span>✅</span><span>Setiap pengaduan akan ditangani oleh staf pengadilan dalam 1-3 hari kerja.</span></div>
    <div class="card animate-in">
      <div class="card-body no-pad">
        ${data.length > 0 ? `
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Kategori</th><th>Isi Pengaduan</th><th>Tgl</th><th>Status</th></tr></thead>
            <tbody>
              ${data.map(p => `
                <tr>
                  <td class="font-bold text-sm">${p.id}</td>
                  <td><span class="badge badge-blue">${p.kategori}</span></td>
                  <td class="text-sm" style="max-width:250px;">${p.isi}</td>
                  <td class="text-sm text-gray">${formatDate(p.tgl)}</td>
                  <td>${statusBadge(p.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : `
        <div class="empty-state">
          <div class="empty-icon">📢</div>
          <p>Belum ada pengaduan. Sampaikan keluhan Anda di sini.</p>
        </div>
        `}
      </div>
    </div>
    <!-- Kategori pengaduan -->
    <div class="card animate-in" style="margin-top:1.5rem;">
      <div class="card-header"><h3>📌 Kategori Pengaduan</h3></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.75rem;">
          ${[['😤','Pelayanan','Keluhan terkait kualitas layanan'],['📋','Prosedur','Kendala prosedur & persyaratan'],['🏢','Fasilitas','Kondisi fasilitas pengadilan'],['👤','Petugas','Sikap dan kinerja petugas']].map(([ico,kat,desc])=>`
            <div style="background:var(--gray-50);border-radius:var(--radius);padding:1rem;text-align:center;cursor:pointer;border:1px solid var(--gray-100);" onclick="userModalAjukanPengaduan()">
              <div style="font-size:1.5rem;">${ico}</div>
              <div class="font-bold text-sm" style="margin-top:0.35rem;">${kat}</div>
              <div class="text-xs text-gray" style="margin-top:0.2rem;">${desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function userModalAjukanPengaduan() {
  openModal(`
    <div class="modal-header"><h3>📢 Buat Pengaduan Baru</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Kategori Pengaduan</label>
        <select class="form-control" id="pg-kat">
          <option>Pelayanan</option><option>Prosedur</option><option>Fasilitas</option><option>Petugas</option><option>Lainnya</option>
        </select>
      </div>
      <div class="form-group"><label>Judul Pengaduan</label><input class="form-control" id="pg-judul" placeholder="Ringkasan singkat pengaduan..."></div>
      <div class="form-group"><label>Isi Pengaduan</label><textarea class="form-control" rows="4" id="pg-isi" placeholder="Jelaskan detail pengaduan Anda secara lengkap..."></textarea></div>
      <div class="alert alert-warning" style="margin-top:0.5rem;">
        <span>⚠️</span><span>Sampaikan pengaduan dengan bahasa yang sopan dan faktual. Pengaduan yang tidak berdasar dapat diabaikan.</span>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-user" onclick="
        const isi=document.getElementById('pg-isi').value;
        if(!isi.trim()){toast('Isi pengaduan tidak boleh kosong','error');return;}
        APP.data.myPengaduan.push({id:'PDU-MY-'+(APP.data.myPengaduan.length+1).toString().padStart(3,'0'),kategori:document.getElementById('pg-kat').value,isi,tgl:new Date().toISOString().split('T')[0],status:'menunggu'});
        closeModal(); navigate('pengaduan'); toast('Pengaduan berhasil dikirim, terima kasih!','success');
      ">Kirim Pengaduan</button>
    </div>
  `);
}

// ─── USER: PROFIL ─────────────────────────────────────────
function userProfil() {
  const u = APP.currentUser;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Profil Saya</h2><p>Kelola data diri dan keamanan akun</p></div>
    </div>
    <div class="profile-header-card animate-in">
      <div class="profile-avatar-lg" style="background:var(--user-light);color:var(--user-secondary);">${u.avatar}</div>
      <div>
        <h3 style="font-size:1.2rem;font-weight:800;">${u.nama}</h3>
        <p class="text-sm text-gray">${u.email}</p>
        <p class="text-sm text-gray">NIK: ${u.nik}</p>
        <div style="margin-top:0.75rem;">
          <span class="badge badge-green">Akun Aktif</span>
        </div>
      </div>
    </div>
    <div class="content-grid">
      <!-- Edit data -->
      <div class="card animate-in">
        <div class="card-header"><h3>✏️ Edit Data Diri</h3></div>
        <div class="card-body">
          <div class="form-group"><label>Nama Lengkap</label><input class="form-control" value="${u.nama}" id="prof-nama"></div>
          <div class="form-group"><label>Email</label><input type="email" class="form-control" value="${u.email}" id="prof-email"></div>
          <div class="form-group"><label>NIK</label><input class="form-control" value="${u.nik}" id="prof-nik" readonly style="background:var(--gray-50)"></div>
          <div class="form-group"><label>No. Telepon</label><input class="form-control" placeholder="08xx-xxxx-xxxx"></div>
          <div class="form-group"><label>Alamat</label><textarea class="form-control" rows="2" placeholder="Alamat lengkap"></textarea></div>
          <button class="btn btn-user" onclick="
            APP.currentUser.nama=document.getElementById('prof-nama').value;
            APP.currentUser.email=document.getElementById('prof-email').value;
            toast('Profil berhasil diperbarui','success');
          ">Simpan Perubahan</button>
        </div>
      </div>
      <!-- Ubah password -->
      <div class="card animate-in">
        <div class="card-header"><h3>🔒 Ubah Password</h3></div>
        <div class="card-body">
          <div class="form-group"><label>Password Saat Ini</label><input type="password" class="form-control" placeholder="Password lama"></div>
          <div class="form-group"><label>Password Baru</label><input type="password" class="form-control" placeholder="Password baru (min. 8 karakter)"></div>
          <div class="form-group"><label>Konfirmasi Password Baru</label><input type="password" class="form-control" placeholder="Ulangi password baru"></div>
          <button class="btn btn-user" onclick="toast('Password berhasil diubah','success')">Ubah Password</button>
        </div>
        <div class="card-header" style="margin-top:0.5rem;border-top:1px solid var(--gray-100);"><h3>🚪 Keluar Akun</h3></div>
        <div class="card-body">
          <p class="text-sm text-gray" style="margin-bottom:1rem;">Keluar dari semua sesi yang aktif pada perangkat ini.</p>
          <button class="btn btn-danger" onclick="doLogout()">Keluar dari Akun</button>
        </div>
      </div>
    </div>
  `;
}
