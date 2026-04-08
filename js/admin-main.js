// ─── ADMIN APP SKELETON ───────────────────────────────────
function loadAdminApp() {
  const u = APP.currentUser;
  document.getElementById('app-root').innerHTML = `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar admin-sidebar-bg" id="sidebar">
        <div class="sidebar-logo">
          <div class="logo-row">
            <div class="logo-box">
            <img src="assets/Logo.png" alt="Logo" style="width:40px; height:40px; border-radius:8px;"></div>
            <div class="logo-text">
              <h2>Pengadilan Agama</h2>
              <span>Kelas IA Banjarmasin</span>
            </div>
          </div>
        </div>
        <div class="sidebar-user-info">
          <div class="info-row">
            <div class="user-avatar">${u.avatar}</div>
            <div>
              <div class="user-name">${u.nama}</div>
              <div class="user-role">${u.jabatan}</div>
            </div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section-label">Menu Utama</div>
          ${adminNavItems().map(item => `
            <a class="nav-item ${item.id === 'dashboard' ? 'active' : ''}" data-module="${item.id}" onclick="navigate('${item.id}')">
              <span class="nav-icon">${item.icon}</span>
              <span>${item.label}</span>
              ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </a>
          `).join('')}
          <div class="nav-section-label" style="margin-top:0.5rem;">Lainnya</div>
          ${adminNavSecondary().map(item => `
            <a class="nav-item" data-module="${item.id}" onclick="navigate('${item.id}')">
              <span class="nav-icon">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <a class="nav-item" onclick="doLogout()" style="color:rgba(255,100,100,0.7);">
            <span class="nav-icon">🚪</span>
            <span>Keluar</span>
          </a>
        </div>
      </aside>
      <!-- Main -->
      <div class="main-content">
        <header class="topbar">
          <div class="topbar-left">
            <button class="topbar-btn" onclick="toggleSidebar()" style="display:none" id="menu-btn">☰</button>
            <div>
              <div class="topbar-title">Dashboard</div>
              <div class="topbar-subtitle">Selamat datang kembali!</div>
            </div>
          </div>
          <div class="topbar-right">
            <button class="topbar-btn" onclick="toast('Tidak ada notifikasi baru','info')" title="Notifikasi">
              🔔 <span class="badge-dot"></span>
            </button>
            <button class="topbar-btn" onclick="navigate('users')" title="Pengaturan">⚙️</button>
            <div style="width:36px;height:36px;background:var(--admin-light);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:var(--admin-secondary);cursor:pointer;" onclick="toast('Profil staf: ${u.nama}','info')">
              ${u.avatar}
            </div>
          </div>
        </header>
        <div class="page-body" id="page-content">
          <!-- content loads here -->
        </div>
      </div>
    </div>
  `;
  navigate('dashboard');
}

function adminNavItems() {
  return [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'perkara', icon: '📋', label: 'Perkara', badge: APP.data.perkara.filter(p=>p.status==='menunggu').length || null },
    { id: 'jadwal', icon: '📅', label: 'Jadwal Sidang', badge: APP.data.jadwal.filter(j=>j.status==='menunggu').length || null },
    { id: 'surat', icon: '✉️', label: 'Surat Menyurat', badge: APP.data.surat.filter(s=>s.status==='menunggu').length || null },
    { id: 'arsip', icon: '🗂️', label: 'Arsip Dokumen', badge: APP.data.arsip.filter(a=>a.status==='menunggu').length || null },
    { id: 'pengaduan', icon: '📢', label: 'Pengaduan', badge: APP.data.pengaduan.filter(p=>p.status==='menunggu').length || null },
  ];
}
function adminNavSecondary() {
  return [
    { id: 'users', icon: '👥', label: 'Data Pengguna' },
    { id: 'laporan', icon: '📊', label: 'Laporan' },
  ];
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
}

// ─── ADMIN: LOAD MODULE ───────────────────────────────────
function loadAdminModule(module) {
  const content = document.getElementById('page-content');
  if (!content) return;
  switch(module) {
    case 'dashboard': content.innerHTML = adminDashboard(); break;
    case 'perkara':   content.innerHTML = adminPerkara(); break;
    case 'jadwal':    content.innerHTML = adminJadwal(); break;
    case 'surat':     content.innerHTML = adminSurat(); break;
    case 'arsip':     content.innerHTML = adminArsip(); break;
    case 'pengaduan': content.innerHTML = adminPengaduan(); break;
    case 'users':     content.innerHTML = adminUsers(); break;
    case 'laporan':   content.innerHTML = adminLaporan(); break;
    default:          content.innerHTML = '<p>Halaman tidak ditemukan.</p>';
  }
}

// ─── ADMIN: DASHBOARD ─────────────────────────────────────
function adminDashboard() {
  const d = APP.data;
  const stats = [
    { icon:'📋', label:'Total Perkara', value: d.perkara.length, color:'#dbeafe', change:'↑ 3 minggu ini' },
    { icon:'📅', label:'Jadwal Sidang', value: d.jadwal.length, color:'#d1fae5', change:'↑ 2 minggu ini' },
    { icon:'✉️', label:'Surat Masuk', value: d.surat.length, color:'#fef3c7', change:'= sama dengan kemarin' },
    { icon:'📢', label:'Pengaduan Baru', value: d.pengaduan.filter(x=>x.status==='menunggu').length, color:'#fee2e2', change: d.pengaduan.filter(x=>x.status==='menunggu').length > 0 ? '⚠️ perlu ditindak' : '✓ semua tertangani' },
  ];

  const months = ['Ags','Sep','Okt','Nov','Des','Jan'];
  const vals = [8, 12, 7, 15, 10, d.perkara.length];
  const maxVal = Math.max(...vals);

  return `
    <div class="page-header">
      <div class="page-header-left">
        <h2>Dashboard Admin</h2>
        <p>Ringkasan aktivitas — ${new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>
      <div class="page-header-right">
        <button class="btn btn-outline btn-sm" onclick="navigate('laporan')">📊 Lihat Laporan</button>
        <button class="btn btn-admin btn-sm" onclick="navigate('perkara')">+ Perkara Baru</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      ${stats.map(s => `
        <div class="stat-card animate-in">
          <div class="stat-icon" style="background:${s.color};">${s.icon}</div>
          <div class="stat-info">
            <div class="stat-label">${s.label}</div>
            <div class="stat-value">${s.value}</div>
            <div class="stat-change ${s.change.includes('⚠️')?'down':''}">${s.change}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Charts & Activity -->
    <div class="content-grid col-3">
      <!-- Chart -->
      <div class="card animate-in">
        <div class="card-header">
          <h3>📈 Tren Perkara Masuk</h3>
          <span class="text-xs text-gray">6 bulan terakhir</span>
        </div>
        <div class="card-body">
          <div class="chart-bars">
            ${vals.map((v,i) => `
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                <div class="chart-bar" style="height:${Math.round((v/maxVal)*110)+10}px;background:linear-gradient(to top,var(--admin-secondary),var(--admin-accent));width:100%;border-radius:6px 6px 0 0;" title="${v} perkara"></div>
                <span class="chart-bar-label">${months[i]}</span>
              </div>
            `).join('')}
          </div>
          <!-- Legend -->
          <div style="display:flex;gap:1rem;margin-top:1rem;flex-wrap:wrap;">
            ${[['Cerai Gugat',40],['Cerai Talak',30],['Lain-lain',30]].map(([l,p]) => `
              <div style="flex:1;min-width:100px;">
                <div style="font-size:0.75rem;color:var(--gray-500);margin-bottom:0.3rem;">${l} (${p}%)</div>
                <div class="progress-bar"><div class="progress-fill" style="width:${p}%;background:var(--admin-accent);"></div></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Activity -->
      <div class="card animate-in">
        <div class="card-header">
          <h3>🕐 Aktivitas Terbaru</h3>
          <span class="badge badge-blue">Live</span>
        </div>
        <div class="card-body no-pad" style="padding:0 1.5rem;">
          <div class="activity-list">
            ${[
              ['blue','Perkara PRK-006 masuk dari Fatimah Zahro','3 menit lalu'],
              ['yellow','Jadwal sidang PRK-005 menunggu konfirmasi','15 menit lalu'],
              ['green','Perkara PRK-002 selesai diproses','1 jam lalu'],
              ['red','Pengaduan PDU-004 prioritas tinggi masuk','2 jam lalu'],
              ['green','Dokumen ARS-001 berhasil diverifikasi','3 jam lalu'],
              ['blue','Surat SRT-002 sedang diproses','5 jam lalu'],
            ].map(([dot,text,time]) => `
              <div class="activity-item">
                <div class="activity-dot ${dot}"></div>
                <div>
                  <div class="activity-text">${text}</div>
                  <div class="activity-time">${time}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions & pending -->
    <div class="content-grid" style="margin-top:1.5rem;">
      <!-- Menunggu Tindak -->
      <div class="card animate-in">
        <div class="card-header">
          <h3>⏳ Perlu Ditindaklanjuti</h3>
          <span class="badge badge-red">${d.perkara.filter(p=>p.status==='menunggu').length + d.pengaduan.filter(p=>p.status==='menunggu').length} item</span>
        </div>
        <div class="card-body no-pad">
          <div class="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Jenis</th><th>Pemohon</th><th>Status</th></tr></thead>
              <tbody>
                ${d.perkara.filter(p=>p.status==='menunggu').map(p => `
                  <tr>
                    <td><span class="font-bold text-sm">${p.id}</span></td>
                    <td>${p.jenis}</td>
                    <td>${p.pemohon}</td>
                    <td>${statusBadge('menunggu')}</td>
                  </tr>
                `).join('')}
                ${d.pengaduan.filter(p=>p.status==='menunggu').map(p => `
                  <tr>
                    <td><span class="font-bold text-sm">${p.id}</span></td>
                    <td>Pengaduan</td>
                    <td>${p.pelapor}</td>
                    <td>${statusBadge('menunggu')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Status Summary -->
      <div class="card animate-in">
        <div class="card-header"><h3>📊 Distribusi Status Perkara</h3></div>
        <div class="card-body">
          <div style="display:flex;justify-content:center;margin-bottom:1.5rem;">
            <div class="donut-chart" style="background:conic-gradient(#2563eb 0% 33%,#10b981 33% 50%,#f59e0b 50% 67%,#ef4444 67% 100%);"></div>
          </div>
          ${[
            ['Diproses', d.perkara.filter(p=>p.status==='proses').length, '#2563eb'],
            ['Selesai', d.perkara.filter(p=>p.status==='selesai').length, '#10b981'],
            ['Menunggu', d.perkara.filter(p=>p.status==='menunggu').length, '#f59e0b'],
            ['Ditolak', d.perkara.filter(p=>p.status==='ditolak').length, '#ef4444'],
          ].map(([l,v,c]) => `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">
              <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.84rem;">
                <span style="width:10px;height:10px;border-radius:50%;background:${c};flex-shrink:0;"></span>
                ${l}
              </div>
              <strong>${v}</strong>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ─── ADMIN: PERKARA ───────────────────────────────────────
function adminPerkara() {
  const data = APP.data.perkara;
  return `
    <div class="page-header">
      <div class="page-header-left">
        <h2>Manajemen Perkara</h2>
        <p>Total ${data.length} perkara tercatat dalam sistem</p>
      </div>
      <div class="page-header-right">
        <button class="btn btn-outline btn-sm">📥 Ekspor</button>
        <button class="btn btn-admin btn-sm" onclick="adminModalTambahPerkara()">+ Tambah Perkara</button>
      </div>
    </div>
    <div class="card animate-in">
      <div class="card-body">
        <div class="filter-bar">
          <div class="search-box">
            <span class="icon">🔍</span>
            <input class="form-control" placeholder="Cari pemohon, ID perkara..." oninput="filterPerkaraTable(this.value)">
          </div>
          <select class="form-control" style="min-width:150px;" onchange="filterPerkaraTable('')">
            <option value="">Semua Status</option>
            <option>menunggu</option><option>proses</option><option>selesai</option><option>ditolak</option>
          </select>
          <select class="form-control" style="min-width:160px;">
            <option>Semua Jenis</option>
            <option>Cerai Gugat</option><option>Cerai Talak</option><option>Gugatan Harta</option>
          </select>
        </div>
        <div class="table-wrap">
          <table id="perkara-table">
            <thead>
              <tr><th>#</th><th>ID Perkara</th><th>Pemohon</th><th>Jenis Perkara</th><th>Tgl Pengajuan</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              ${data.map((p,i) => `
                <tr>
                  <td class="text-gray text-sm">${i+1}</td>
                  <td><span class="font-bold">${p.id}</span></td>
                  <td>
                    <div class="font-bold text-sm">${p.pemohon}</div>
                    <div class="text-xs text-gray">${p.nik}</div>
                  </td>
                  <td>${p.jenis}</td>
                  <td class="text-sm text-gray">${formatDate(p.tgl)}</td>
                  <td>${statusBadge(p.status)}</td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-outline btn-xs" onclick="adminViewPerkara('${p.id}')">👁 Detail</button>
                      ${p.status==='menunggu' ? `<button class="btn btn-admin btn-xs" onclick="adminSetujuiPerkara('${p.id}')">✓ Setujui</button>` : ''}
                      ${p.status==='menunggu' ? `<button class="btn btn-danger btn-xs" onclick="adminTolakPerkara('${p.id}')">✕ Tolak</button>` : ''}
                      ${p.status==='proses' ? `<button class="btn btn-success btn-xs" onclick="adminSelesaikanPerkara('${p.id}')">✓ Selesai</button>` : ''}
                      <button class="btn btn-outline btn-xs" onclick="adminEditPerkara('${p.id}')">✏️</button>
                      <button class="btn btn-danger btn-xs" onclick="adminHapusPerkara('${p.id}')">🗑</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.2rem;flex-wrap:wrap;gap:0.5rem;">
          <span class="text-sm text-gray">Menampilkan ${data.length} dari ${data.length} perkara</span>
          <div class="pagination">
            <button class="page-btn">‹</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">›</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function filterPerkaraTable(query) {
  const rows = document.querySelectorAll('#perkara-table tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
  });
}

function adminViewPerkara(id) {
  const p = APP.data.perkara.find(x=>x.id===id);
  if (!p) return;
  openModal(`
    <div class="modal-header">
      <h3>📋 Detail Perkara — ${p.id}</h3>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        ${[['ID Perkara',p.id],['Jenis',p.jenis],['Pemohon',p.pemohon],['NIK',p.nik],['Tgl Pengajuan',formatDate(p.tgl)],['Alamat',p.alamat]].map(([k,v])=>`
          <div style="background:var(--gray-50);border-radius:var(--radius);padding:0.9rem;">
            <div class="text-xs text-gray" style="margin-bottom:0.25rem;">${k}</div>
            <div class="font-bold text-sm">${v}</div>
          </div>
        `).join('')}
      </div>
      <div style="text-align:center;">Status: ${statusBadge(p.status)}</div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Tutup</button>
      ${p.status==='menunggu'?`<button class="btn btn-admin" onclick="closeModal();adminSetujuiPerkara('${p.id}')">Setujui Perkara</button>`:''}
    </div>
  `);
}

function adminSetujuiPerkara(id) {
  const p = APP.data.perkara.find(x=>x.id===id);
  if (p) { p.status = 'proses'; navigate('perkara'); toast(`Perkara ${id} disetujui dan diproses`,'success'); }
}
function adminTolakPerkara(id) {
  confirm_dialog(`Tolak perkara <strong>${id}</strong>?`, () => {
    const p = APP.data.perkara.find(x=>x.id===id);
    if (p) { p.status = 'ditolak'; navigate('perkara'); toast(`Perkara ${id} ditolak`,'error'); }
  });
}
function adminSelesaikanPerkara(id) {
  const p = APP.data.perkara.find(x=>x.id===id);
  if (p) { p.status = 'selesai'; navigate('perkara'); toast(`Perkara ${id} diselesaikan`,'success'); }
}
function adminHapusPerkara(id) {
  confirm_dialog(`Hapus perkara <strong>${id}</strong> secara permanen?`, () => {
    APP.data.perkara = APP.data.perkara.filter(x=>x.id!==id);
    navigate('perkara'); toast(`Perkara ${id} dihapus`,'warning');
  });
}
function adminEditPerkara(id) {
  const p = APP.data.perkara.find(x=>x.id===id);
  if (!p) return;
  openModal(`
    <div class="modal-header"><h3>✏️ Edit Perkara — ${p.id}</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Pemohon</label><input class="form-control" value="${p.pemohon}" id="edit-pemohon"></div>
      <div class="form-group"><label>Jenis Perkara</label>
        <select class="form-control" id="edit-jenis">
          ${['Cerai Gugat','Cerai Talak','Gugatan Harta','Wali Adhol','Dispensasi Nikah'].map(j=>`<option ${j===p.jenis?'selected':''}>${j}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="edit-status">
          ${['menunggu','proses','selesai','ditolak'].map(s=>`<option value="${s}" ${s===p.status?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Alamat</label><input class="form-control" value="${p.alamat}" id="edit-alamat"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        const p=APP.data.perkara.find(x=>x.id==='${id}');
        p.pemohon=document.getElementById('edit-pemohon').value;
        p.jenis=document.getElementById('edit-jenis').value;
        p.status=document.getElementById('edit-status').value;
        p.alamat=document.getElementById('edit-alamat').value;
        closeModal(); navigate('perkara'); toast('Perkara berhasil diperbarui','success');
      ">Simpan Perubahan</button>
    </div>
  `);
}
function adminModalTambahPerkara() {
  openModal(`
    <div class="modal-header"><h3>+ Tambah Perkara Baru</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label>Nama Pemohon</label><input class="form-control" id="new-pemohon" placeholder="Nama lengkap"></div>
        <div class="form-group"><label>NIK</label><input class="form-control" id="new-nik" placeholder="16 digit NIK"></div>
      </div>
      <div class="form-group"><label>Jenis Perkara</label>
        <select class="form-control" id="new-jenis">
          <option>Cerai Gugat</option><option>Cerai Talak</option><option>Gugatan Harta</option><option>Wali Adhol</option><option>Dispensasi Nikah</option>
        </select>
      </div>
      <div class="form-group"><label>Alamat</label><input class="form-control" id="new-alamat" placeholder="Alamat lengkap"></div>
      <div class="form-group"><label>Keterangan Tambahan</label><textarea class="form-control" id="new-ket" rows="2" placeholder="Opsional..."></textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        const id='PRK-00'+(APP.data.perkara.length+1);
        APP.data.perkara.unshift({id,pemohon:document.getElementById('new-pemohon').value||'Pemohon Baru',jenis:document.getElementById('new-jenis').value,tgl:new Date().toISOString().split('T')[0],status:'menunggu',nik:document.getElementById('new-nik').value||'-',alamat:document.getElementById('new-alamat').value||'-'});
        closeModal(); navigate('perkara'); toast('Perkara baru berhasil ditambahkan','success');
      ">Simpan Perkara</button>
    </div>
  `);
}
