// ─── ADMIN: JADWAL SIDANG ─────────────────────────────────
function adminJadwal() {
  const data = APP.data.jadwal;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Jadwal Sidang</h2><p>${data.length} sidang terjadwal</p></div>
      <div class="page-header-right">
        <button class="btn btn-admin btn-sm" onclick="adminModalTambahJadwal()">+ Tambah Jadwal</button>
      </div>
    </div>
    <div class="alert alert-info"><span>📌</span><span>${data.filter(j=>j.status==='menunggu').length} permintaan jadwal dari masyarakat menunggu konfirmasi Anda.</span></div>
    <div class="card animate-in">
      <div class="card-body no-pad">
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>No. Perkara</th><th>Pemohon</th><th>Hakim</th><th>Ruang</th><th>Tgl & Jam</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              ${data.map(j => `
                <tr>
                  <td class="font-bold text-sm">${j.id}</td>
                  <td>${j.perkara}</td>
                  <td>${j.pemohon}</td>
                  <td class="text-sm">${j.hakim}</td>
                  <td><span class="badge badge-blue">${j.ruang}</span></td>
                  <td>
                    <div class="font-bold text-sm">${formatDate(j.tgl)}</div>
                    <div class="text-xs text-gray">${j.jam} WIB</div>
                  </td>
                  <td>${statusBadge(j.status)}</td>
                  <td>
                    <div class="table-actions">
                      ${j.status==='menunggu'?`<button class="btn btn-admin btn-xs" onclick="konfirmasiJadwal('${j.id}')">✓ Konfirmasi</button>`:''}
                      <button class="btn btn-outline btn-xs" onclick="adminEditJadwal('${j.id}')">✏️ Edit</button>
                      <button class="btn btn-danger btn-xs" onclick="adminHapusJadwal('${j.id}')">🗑</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function konfirmasiJadwal(id) {
  const j = APP.data.jadwal.find(x=>x.id===id);
  if (j) { j.status = 'terkonfirmasi'; navigate('jadwal'); toast(`Jadwal ${id} dikonfirmasi dan dikirim ke pemohon`,'success'); }
}
function adminHapusJadwal(id) {
  confirm_dialog(`Hapus jadwal <strong>${id}</strong>?`, () => {
    APP.data.jadwal = APP.data.jadwal.filter(x=>x.id!==id);
    navigate('jadwal'); toast('Jadwal dihapus','warning');
  });
}
function adminEditJadwal(id) {
  const j = APP.data.jadwal.find(x=>x.id===id);
  if (!j) return;
  openModal(`
    <div class="modal-header"><h3>✏️ Edit Jadwal — ${j.id}</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label>Hakim</label><input class="form-control" value="${j.hakim}" id="ej-hakim"></div>
        <div class="form-group"><label>Ruang</label>
          <select class="form-control" id="ej-ruang">
            ${['Ruang I','Ruang II','Ruang III','Ruang IV'].map(r=>`<option ${r===j.ruang?'selected':''}>${r}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Tanggal</label><input type="date" class="form-control" value="${j.tgl}" id="ej-tgl"></div>
        <div class="form-group"><label>Jam</label><input type="time" class="form-control" value="${j.jam}" id="ej-jam"></div>
      </div>
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="ej-status">
          ${['menunggu','terkonfirmasi'].map(s=>`<option ${s===j.status?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        const j=APP.data.jadwal.find(x=>x.id==='${id}');
        j.hakim=document.getElementById('ej-hakim').value;
        j.ruang=document.getElementById('ej-ruang').value;
        j.tgl=document.getElementById('ej-tgl').value;
        j.jam=document.getElementById('ej-jam').value;
        j.status=document.getElementById('ej-status').value;
        closeModal(); navigate('jadwal'); toast('Jadwal diperbarui','success');
      ">Simpan</button>
    </div>
  `);
}
function adminModalTambahJadwal() {
  openModal(`
    <div class="modal-header"><h3>+ Tambah Jadwal Sidang</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label>No. Perkara</label>
          <select class="form-control" id="nj-perkara">
            ${APP.data.perkara.map(p=>`<option value="${p.id}">${p.id} - ${p.pemohon}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Hakim</label>
          <select class="form-control" id="nj-hakim">
            ${['H. Zulkifli, S.H.','Hj. Marlina, S.H., M.H.','H. Rahman, S.H.'].map(h=>`<option>${h}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Ruang</label>
          <select class="form-control" id="nj-ruang">${['Ruang I','Ruang II','Ruang III','Ruang IV'].map(r=>`<option>${r}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Tanggal</label><input type="date" class="form-control" id="nj-tgl"></div>
      </div>
      <div class="form-group"><label>Jam</label><input type="time" class="form-control" id="nj-jam" value="09:00"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        const pId=document.getElementById('nj-perkara').value;
        const perkara=APP.data.perkara.find(x=>x.id===pId);
        APP.data.jadwal.push({id:'JDL-00'+(APP.data.jadwal.length+1),perkara:pId,pemohon:perkara?perkara.pemohon:'',hakim:document.getElementById('nj-hakim').value,ruang:document.getElementById('nj-ruang').value,tgl:document.getElementById('nj-tgl').value,jam:document.getElementById('nj-jam').value,status:'terkonfirmasi'});
        closeModal(); navigate('jadwal'); toast('Jadwal berhasil ditambahkan','success');
      ">Simpan Jadwal</button>
    </div>
  `);
}

// ─── ADMIN: SURAT MENYURAT ────────────────────────────────
function adminSurat() {
  const data = APP.data.surat;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Surat Menyurat</h2><p>Proses permohonan surat dari masyarakat</p></div>
      <div class="page-header-right">
        <button class="btn btn-admin btn-sm" onclick="adminModalTambahSurat()">+ Tambah Surat</button>
      </div>
    </div>
    <div class="card animate-in">
      <div class="card-body no-pad">
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID Surat</th><th>Pemohon</th><th>Jenis Surat</th><th>Tgl Permohonan</th><th>Status</th><th>Keterangan</th><th>Aksi</th></tr></thead>
            <tbody>
              ${data.map(s => `
                <tr>
                  <td class="font-bold text-sm">${s.id}</td>
                  <td>${s.pemohon}</td>
                  <td>${s.jenis}</td>
                  <td class="text-sm text-gray">${formatDate(s.tgl)}</td>
                  <td>${statusBadge(s.status)}</td>
                  <td class="text-sm text-gray">${s.keterangan}</td>
                  <td>
                    <div class="table-actions">
                      ${s.status==='menunggu'?`<button class="btn btn-admin btn-xs" onclick="prosesSurat('${s.id}')">▶ Proses</button>`:''}
                      ${s.status==='proses'?`<button class="btn btn-success btn-xs" onclick="selesaikanSurat('${s.id}')">✓ Selesai</button>`:''}
                      <button class="btn btn-outline btn-xs" onclick="adminEditSurat('${s.id}')">✏️</button>
                      <button class="btn btn-danger btn-xs" onclick="hapusSurat('${s.id}')">🗑</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
function prosesSurat(id) {
  const s = APP.data.surat.find(x=>x.id===id);
  if (s) { s.status='proses'; s.keterangan='Sedang diproses oleh staf'; navigate('surat'); toast(`Surat ${id} sedang diproses`,'info'); }
}
function selesaikanSurat(id) {
  const s = APP.data.surat.find(x=>x.id===id);
  if (s) { s.status='selesai'; s.keterangan='Surat sudah diterbitkan'; navigate('surat'); toast(`Surat ${id} selesai diterbitkan`,'success'); }
}
function hapusSurat(id) {
  confirm_dialog(`Hapus surat <strong>${id}</strong>?`, () => {
    APP.data.surat = APP.data.surat.filter(x=>x.id!==id);
    navigate('surat'); toast('Surat dihapus','warning');
  });
}
function adminEditSurat(id) {
  const s = APP.data.surat.find(x=>x.id===id);
  if (!s) return;
  openModal(`
    <div class="modal-header"><h3>✏️ Edit Surat — ${s.id}</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Jenis Surat</label>
        <select class="form-control" id="es-jenis">
          ${['Surat Keterangan Perkara','Surat Kuasa','Surat Panggilan','Surat Penetapan'].map(j=>`<option ${j===s.jenis?'selected':''}>${j}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="es-status">
          ${['menunggu','proses','selesai'].map(st=>`<option ${st===s.status?'selected':''}>${st}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Keterangan</label><input class="form-control" value="${s.keterangan}" id="es-ket"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        const s=APP.data.surat.find(x=>x.id==='${id}');
        s.jenis=document.getElementById('es-jenis').value;
        s.status=document.getElementById('es-status').value;
        s.keterangan=document.getElementById('es-ket').value;
        closeModal(); navigate('surat'); toast('Surat diperbarui','success');
      ">Simpan</button>
    </div>
  `);
}
function adminModalTambahSurat() {
  openModal(`
    <div class="modal-header"><h3>+ Tambah Surat Baru</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Nama Pemohon</label><input class="form-control" id="ns-pemohon" placeholder="Nama lengkap"></div>
      <div class="form-group"><label>Jenis Surat</label>
        <select class="form-control" id="ns-jenis">
          <option>Surat Keterangan Perkara</option><option>Surat Kuasa</option><option>Surat Panggilan</option><option>Surat Penetapan</option>
        </select>
      </div>
      <div class="form-group"><label>Keterangan</label><textarea class="form-control" id="ns-ket" rows="2"></textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        APP.data.surat.push({id:'SRT-00'+(APP.data.surat.length+1),pemohon:document.getElementById('ns-pemohon').value||'Pemohon',jenis:document.getElementById('ns-jenis').value,tgl:new Date().toISOString().split('T')[0],status:'proses',keterangan:document.getElementById('ns-ket').value||'Sedang diproses'});
        closeModal(); navigate('surat'); toast('Surat berhasil ditambahkan','success');
      ">Simpan</button>
    </div>
  `);
}

// ─── ADMIN: ARSIP DOKUMEN ─────────────────────────────────
function adminArsip() {
  const data = APP.data.arsip;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Arsip Dokumen</h2><p>Verifikasi dokumen dari masyarakat</p></div>
      <div class="page-header-right">
        <button class="btn btn-admin btn-sm" onclick="adminUploadArsip()">📤 Upload Dokumen</button>
      </div>
    </div>
    <div class="alert alert-warning"><span>⚠️</span><span>${data.filter(a=>a.status==='menunggu').length} dokumen menunggu verifikasi.</span></div>
    <div class="card animate-in">
      <div class="card-body no-pad">
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>No. Perkara</th><th>Pemohon</th><th>Dokumen</th><th>Ukuran</th><th>Tgl Upload</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              ${data.map(a => `
                <tr>
                  <td class="font-bold text-sm">${a.id}</td>
                  <td>${a.perkara}</td>
                  <td>${a.pemohon}</td>
                  <td class="text-sm">📄 ${a.dokumen}</td>
                  <td class="text-xs text-gray">${a.ukuran}</td>
                  <td class="text-sm text-gray">${formatDate(a.tgl)}</td>
                  <td>${statusBadge(a.status)}</td>
                  <td>
                    <div class="table-actions">
                      ${a.status==='menunggu'?`<button class="btn btn-success btn-xs" onclick="verifikasiArsip('${a.id}')">✓ Verifikasi</button>`:''}
                      ${a.status==='menunggu'?`<button class="btn btn-danger btn-xs" onclick="tolakArsip('${a.id}')">✕ Tolak</button>`:''}
                      <button class="btn btn-outline btn-xs" onclick="adminEditArsip('${a.id}')">✏️ Edit</button>
                      <button class="btn btn-danger btn-xs" onclick="hapusArsip('${a.id}')">🗑</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
function adminEditArsip(id) {
  const a = APP.data.arsip.find(x=>x.id===id);
  if (!a) return;

  openModal(`
    <div class="modal-header"><h3>✏️ Edit Arsip — ${a.id}</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Dokumen</label>
        <input class="form-control" id="ea-dokumen" value="${a.dokumen}">
      </div>
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="ea-status">
          ${['menunggu','terverifikasi','ditolak'].map(st=>`<option ${st===a.status?'selected':''}>${st}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Ukuran</label>
        <input class="form-control" id="ea-ukuran" value="${a.ukuran}">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        const a = APP.data.arsip.find(x=>x.id==='${id}');
        a.dokumen = document.getElementById('ea-dokumen').value;
        a.status = document.getElementById('ea-status').value;
        a.ukuran = document.getElementById('ea-ukuran').value;
        closeModal(); navigate('arsip'); toast('Arsip diperbarui','success');
      ">Simpan</button>
    </div>
  `);
}
function verifikasiArsip(id) {
  const a = APP.data.arsip.find(x=>x.id===id);
  if (a) { a.status='terverifikasi'; navigate('arsip'); toast(`Dokumen ${id} terverifikasi`,'success'); }
}
function tolakArsip(id) {
  confirm_dialog(`Tolak dokumen <strong>${id}</strong>?`, () => {
    const a = APP.data.arsip.find(x=>x.id===id);
    if (a) { a.status='ditolak'; navigate('arsip'); toast(`Dokumen ${id} ditolak`,'error'); }
  });
}
function hapusArsip(id) {
  confirm_dialog(`Hapus arsip <strong>${id}</strong>?`, () => {
    APP.data.arsip = APP.data.arsip.filter(x=>x.id!==id);
    navigate('arsip'); toast('Arsip dihapus','warning');
  });
}
function adminUploadArsip() {
  openModal(`
    <div class="modal-header"><h3>📤 Upload Dokumen Arsip</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Terkait Perkara</label>
        <select class="form-control" id="ua-perkara">
          ${APP.data.perkara.map(p=>`<option value="${p.id}">${p.id} - ${p.pemohon}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Jenis Dokumen</label><input class="form-control" id="ua-dok" placeholder="Nama/jenis dokumen"></div>
      <div class="form-group"><label>Upload File</label>
        <div style="border:2px dashed var(--gray-200);border-radius:var(--radius);padding:2rem;text-align:center;color:var(--gray-400);">
          <div style="font-size:2rem;">📁</div>
          <div style="font-size:0.84rem;margin-top:0.5rem;">Klik untuk pilih file atau drag & drop</div>
          <div style="font-size:0.74rem;margin-top:0.25rem;">PDF, JPG, PNG (maks. 10MB)</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        const pId=document.getElementById('ua-perkara').value;
        const perkara=APP.data.perkara.find(x=>x.id===pId);
        APP.data.arsip.push({id:'ARS-00'+(APP.data.arsip.length+1),perkara:pId,pemohon:perkara?perkara.pemohon:'',dokumen:document.getElementById('ua-dok').value||'Dokumen Baru',tgl:new Date().toISOString().split('T')[0],status:'terverifikasi',ukuran:'1.0 MB'});
        closeModal(); navigate('arsip'); toast('Dokumen berhasil diupload','success');
      ">Upload</button>
    </div>
  `);
}

// ─── ADMIN: PENGADUAN ─────────────────────────────────────
function adminPengaduan() {
  const data = APP.data.pengaduan;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Kelola Pengaduan</h2><p>Tindak lanjuti laporan dari masyarakat</p></div>
    </div>
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:1.5rem;">
      ${[['📥','Masuk',data.length],['⏳','Menunggu',data.filter(p=>p.status==='menunggu').length],['🔄','Diproses',data.filter(p=>p.status==='proses').length],['✅','Selesai',data.filter(p=>p.status==='selesai').length]].map(([i,l,v])=>`
        <div class="stat-card"><div class="stat-icon" style="background:var(--gray-100);">${i}</div><div class="stat-info"><div class="stat-label">${l}</div><div class="stat-value">${v}</div></div></div>
      `).join('')}
    </div>
    <div class="card animate-in">
      <div class="card-body no-pad">
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Pelapor</th><th>Kategori</th><th>Isi Pengaduan</th><th>Prioritas</th><th>Tgl</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              ${data.map(p => `
                <tr>
                  <td class="font-bold text-sm">${p.id}</td>
                  <td>${p.pelapor}</td>
                  <td><span class="badge badge-blue">${p.kategori}</span></td>
                  <td class="text-sm" style="max-width:220px;">${p.isi.substring(0,60)}${p.isi.length>60?'...':''}</td>
                  <td>${statusBadge(p.prioritas)}</td>
                  <td class="text-sm text-gray">${formatDate(p.tgl)}</td>
                  <td>${statusBadge(p.status)}</td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-outline btn-xs" onclick="lihatPengaduan('${p.id}')">👁 Detail</button>
                      ${p.status==='menunggu'?`<button class="btn btn-admin btn-xs" onclick="tindakPengaduan('${p.id}')">▶ Tindak</button>`:''}
                      ${p.status==='proses'?`<button class="btn btn-success btn-xs" onclick="selesaikanPengaduan('${p.id}')">✓ Selesai</button>`:''}
                      <button class="btn btn-outline btn-xs" onclick="adminEditPengaduan('${p.id}')">✏️</button>
                      <button class="btn btn-danger btn-xs" onclick="hapusPengaduan('${p.id}')">🗑</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
function lihatPengaduan(id) {
  const p = APP.data.pengaduan.find(x=>x.id===id);
  if (!p) return;
  openModal(`
    <div class="modal-header"><h3>📢 Detail Pengaduan — ${p.id}</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        ${[['Pelapor',p.pelapor],['Kategori',p.kategori],['Tanggal',formatDate(p.tgl)],['Prioritas',p.prioritas]].map(([k,v])=>`
          <div style="background:var(--gray-50);border-radius:var(--radius);padding:0.75rem;">
            <div class="text-xs text-gray">${k}</div><div class="font-bold text-sm">${v}</div>
          </div>
        `).join('')}
      </div>
      <div style="background:var(--gray-50);border-radius:var(--radius);padding:1rem;">
        <div class="text-xs text-gray mb-2">Isi Pengaduan:</div>
        <p style="font-size:0.875rem;color:var(--gray-700);line-height:1.6;">${p.isi}</p>
      </div>
      <div style="margin-top:1rem;">
        <div class="text-xs text-gray mb-2">Tanggapan Staf:</div>
        <textarea class="form-control" rows="3" placeholder="Tulis tanggapan..."></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Tutup</button>
      <button class="btn btn-admin" onclick="tindakPengaduan('${p.id}');closeModal();">Proses Pengaduan</button>
    </div>
  `);
}
function tindakPengaduan(id) {
  const p = APP.data.pengaduan.find(x=>x.id===id);
  if (p) { p.status='proses'; navigate('pengaduan'); toast(`Pengaduan ${id} sedang ditindaklanjuti`,'info'); }
}
function selesaikanPengaduan(id) {
  const p = APP.data.pengaduan.find(x=>x.id===id);
  if (p) { p.status='selesai'; navigate('pengaduan'); toast(`Pengaduan ${id} selesai ditangani`,'success'); }
}
function hapusPengaduan(id) {
  confirm_dialog(`Hapus pengaduan <strong>${id}</strong>?`, () => {
    APP.data.pengaduan = APP.data.pengaduan.filter(x=>x.id!==id);
    navigate('pengaduan'); toast('Pengaduan dihapus','warning');
  });
}
function adminEditPengaduan(id) {
  const p = APP.data.pengaduan.find(x=>x.id===id);
  if (!p) return;
  openModal(`
    <div class="modal-header"><h3>✏️ Edit Pengaduan — ${p.id}</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="ep-status">
          ${['menunggu','proses','selesai'].map(s=>`<option ${s===p.status?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Prioritas</label>
        <select class="form-control" id="ep-prio">
          ${['rendah','sedang','tinggi'].map(s=>`<option ${s===p.prioritas?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        const p=APP.data.pengaduan.find(x=>x.id==='${id}');
        p.status=document.getElementById('ep-status').value;
        p.prioritas=document.getElementById('ep-prio').value;
        closeModal(); navigate('pengaduan'); toast('Pengaduan diperbarui','success');
      ">Simpan</button>
    </div>
  `);
}

// ─── ADMIN: USERS ─────────────────────────────────────────
function adminUsers() {
  const data = APP.data.users;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Data Pengguna</h2><p>${data.length} akun masyarakat terdaftar</p></div>
      <div class="page-header-right">
        <button class="btn btn-admin btn-sm" onclick="adminTambahUser()">+ Tambah Akun</button>
      </div>
    </div>
    <div class="card animate-in">
      <div class="card-body">
        <div class="filter-bar">
          <div class="search-box">
            <span class="icon">🔍</span>
            <input class="form-control" placeholder="Cari nama, email, NIK...">
          </div>
          <select class="form-control" style="min-width:130px;">
            <option>Semua Status</option><option>aktif</option><option>nonaktif</option>
          </select>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Nama</th><th>Email</th><th>NIK</th><th>Tgl Daftar</th><th>Perkara</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              ${data.map((u,i) => `
                <tr>
                  <td class="text-gray text-sm">${i+1}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:0.6rem;">
                      <div style="width:32px;height:32px;border-radius:50%;background:var(--admin-light);color:var(--admin-secondary);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;flex-shrink:0;">
                        ${u.nama.split(' ').map(n=>n[0]).slice(0,2).join('')}
                      </div>
                      <span class="font-bold text-sm">${u.nama}</span>
                    </div>
                  </td>
                  <td class="text-sm text-gray">${u.email}</td>
                  <td class="text-sm text-gray">${u.nik}</td>
                  <td class="text-sm text-gray">${formatDate(u.tglDaftar)}</td>
                  <td><span class="badge badge-blue">${u.perkara} perkara</span></td>
                  <td>${statusBadge(u.status)}</td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-outline btn-xs" onclick="adminEditUser('${u.id}')">✏️ Edit</button>
                      <button class="btn ${u.status==='aktif'?'btn-warning':'btn-success'} btn-xs" onclick="toggleUserStatus('${u.id}')">
                        ${u.status==='aktif'?'🔒 Nonaktif':'🔓 Aktifkan'}
                      </button>
                      <button class="btn btn-danger btn-xs" onclick="hapusUser('${u.id}')">🗑</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
function toggleUserStatus(id) {
  const u = APP.data.users.find(x=>x.id===id);
  if (u) {
    u.status = u.status==='aktif' ? 'nonaktif' : 'aktif';
    navigate('users');
    toast(`Akun ${u.nama} ${u.status==='aktif'?'diaktifkan':'dinonaktifkan'}`,'info');
  }
}
function hapusUser(id) {
  confirm_dialog('Hapus akun pengguna ini?', () => {
    APP.data.users = APP.data.users.filter(x=>x.id!==id);
    navigate('users'); toast('Akun dihapus','warning');
  });
}
function adminEditUser(id) {
  const u = APP.data.users.find(x=>x.id===id);
  if (!u) return;
  openModal(`
    <div class="modal-header"><h3>✏️ Edit Pengguna</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label>Nama</label><input class="form-control" value="${u.nama}" id="eu-nama"></div>
        <div class="form-group"><label>Email</label><input class="form-control" value="${u.email}" id="eu-email"></div>
      </div>
      <div class="form-group"><label>NIK</label><input class="form-control" value="${u.nik}" id="eu-nik"></div>
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="eu-status">
          <option ${u.status==='aktif'?'selected':''}>aktif</option>
          <option ${u.status==='nonaktif'?'selected':''}>nonaktif</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        const u=APP.data.users.find(x=>x.id==='${id}');
        u.nama=document.getElementById('eu-nama').value;
        u.email=document.getElementById('eu-email').value;
        u.nik=document.getElementById('eu-nik').value;
        u.status=document.getElementById('eu-status').value;
        closeModal(); navigate('users'); toast('Data pengguna diperbarui','success');
      ">Simpan</button>
    </div>
  `);
}
function adminTambahUser() {
  openModal(`
    <div class="modal-header"><h3>+ Tambah Akun Pengguna</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label>Nama Lengkap</label><input class="form-control" id="nu-nama" placeholder="Nama sesuai KTP"></div>
        <div class="form-group"><label>Email</label><input class="form-control" id="nu-email" placeholder="email@..."></div>
      </div>
      <div class="form-group"><label>NIK</label><input class="form-control" id="nu-nik" placeholder="16 digit NIK"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-admin" onclick="
        APP.data.users.push({id:'USR-00'+(APP.data.users.length+1),nama:document.getElementById('nu-nama').value||'Pengguna Baru',email:document.getElementById('nu-email').value||'-',nik:document.getElementById('nu-nik').value||'-',tglDaftar:new Date().toISOString().split('T')[0],status:'aktif',perkara:0});
        closeModal(); navigate('users'); toast('Akun berhasil ditambahkan','success');
      ">Simpan</button>
    </div>
  `);
}

// ─── ADMIN: LAPORAN ───────────────────────────────────────
function adminLaporan() {
  const d = APP.data;
  return `
    <div class="page-header">
      <div class="page-header-left"><h2>Laporan & Statistik</h2><p>Ekspor PDF dan ekspor laporan sistem</p></div>
      <div class="page-header-right">
        <button class="btn btn-outline btn-sm" onclick="eksporPDF()">📄 Ekspor PDF</button>
      </div>
    </div>

    <!-- Period selector -->
    <div class="card animate-in" style="margin-bottom:1.5rem;">
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
          <div class="form-group" style="margin:0;flex:1;min-width:150px;">
            <label class="text-xs text-gray">Dari Tanggal</label>
            <input type="date" class="form-control" id="lap-dari" value="2025-01-01">
          </div>
          <div class="form-group" style="margin:0;flex:1;min-width:150px;">
            <label class="text-xs text-gray">Sampai Tanggal</label>
            <input type="date" class="form-control" id="lap-sampai" value="2025-01-31">
          </div>
          <div class="form-group" style="margin:0;flex:1;min-width:150px;">
            <label class="text-xs text-gray">Jenis Laporan</label>
            <select class="form-control" id="lap-jenis">
              <option value="semua">Semua Data</option>
              <option value="perkara">Perkara</option>
              <option value="jadwal">Jadwal Sidang</option>
              <option value="surat">Surat</option>
              <option value="pengaduan">Pengaduan</option>
            </select>
          </div>
          <button class="btn btn-admin" style="margin-top:1.2rem;" onclick="generateLaporan()">🔍 Ekspor PDF</button>
        </div>
      </div>
    </div>

    <!-- Ringkasan stats row -->
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin-bottom:1.5rem;">
      ${[
        ['📋', 'Total Perkara', d.perkara.length, '#dbeafe'],
        ['✅', 'Perkara Selesai', d.perkara.filter(p=>p.status==='selesai').length, '#d1fae5'],
        ['📅', 'Jadwal Sidang', d.jadwal.length, '#fef3c7'],
        ['📢', 'Pengaduan', d.pengaduan.length, '#fee2e2'],
        ['✉️', 'Surat Diterbitkan', d.surat.filter(s=>s.status==='selesai').length, '#ede9fe'],
        ['👥', 'Pengguna Aktif', d.users.filter(u=>u.status==='aktif').length, '#ecfeff'],
      ].map(([ico,lbl,val,bg]) => `
        <div class="stat-card animate-in">
          <div class="stat-icon" style="background:${bg};">${ico}</div>
          <div class="stat-info">
            <div class="stat-label">${lbl}</div>
            <div class="stat-value">${val}</div>
          </div>
        </div>
      `).join('')}
      </div>
    </div>
  `;
}

// ─── EKSPOR FUNCTIONS ─────────────────────────────────────
function generateLaporan() {
  const jenis = document.getElementById('lap-jenis')?.value || 'semua';
  const dari = document.getElementById('lap-dari')?.value || '';
  const sampai = document.getElementById('lap-sampai')?.value || '';
  toast(`Laporan ${jenis} periode ${dari} s/d ${sampai} berhasil di-generate`, 'success');
}
function eksporPDF() {
  const d = APP.data;
  const jenis = document.getElementById('lap-jenis')?.value || 'semua';
  const dari = document.getElementById('lap-dari')?.value;
  const sampai = document.getElementById('lap-sampai')?.value;
  const dariDate = dari ? new Date(dari) : null;
  const sampaiDate = sampai ? new Date(sampai) : null;
  const now = new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // Fungsi filter berdasarkan tanggal
  const filterByTanggal = (arr, key='tgl') => {
    return arr.filter(item => {
      const t = new Date(item[key]);
      if(dariDate && t < dariDate) return false;
      if(sampaiDate && t > sampaiDate) return false;
      return true;
    });
  };

  // Filter data sesuai periode
  const perkaraFiltered = filterByTanggal(d.perkara);
  const jadwalFiltered = filterByTanggal(d.jadwal);
  const suratFiltered = filterByTanggal(d.surat);
  const pengaduanFiltered = filterByTanggal(d.pengaduan);

  // Fungsi badge
  const badgeClass = (status) => {
    switch(status) {
      case 'selesai': return 'green';
      case 'proses':
      case 'terkonfirmasi': return 'blue';
      case 'menunggu': return 'yellow';
      case 'ditolak': return 'red';
      default: return 'yellow';
    }
  };

  // Bangun HTML PDF
  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Pengadilan Agama</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size:12px; color:#1f2937; padding:30px; }
  .header { display:flex; align-items:center; border-bottom:3px double #1e3a5f; padding-bottom:16px; margin-bottom:20px; }
  .header img { width:60px; height:60px; object-fit:contain; margin-right:12px; }
  .header-text { text-align:left; }
  .header-text h1 { font-size:16px; font-weight:bold; color:#1e3a5f; margin-bottom:4px; }
  .header-text h2 { font-size:13px; color:#374151; margin-bottom:2px; }
  .header-text p { font-size:11px; color:#6b7280; }
  .section { margin-bottom:20px; page-break-inside:avoid; }
  .section-title { background:#1e3a5f; color:white; padding:6px 12px; font-weight:bold; font-size:12px; border-radius:4px; margin-bottom:8px; }
  table { width:100%; border-collapse:collapse; font-size:11px; }
  th { background:#dbeafe; color:#1d4ed8; padding:6px 8px; text-align:left; border:1px solid #bfdbfe; font-weight:bold; }
  td { padding:5px 8px; border:1px solid #e5e7eb; }
  tr:nth-child(even) td { background:#f9fafb; }
  .badge { display:inline-block; padding:2px 8px; border-radius:99px; font-size:10px; font-weight:bold; }
  .badge-green { background:#d1fae5; color:#065f46; }
  .badge-blue { background:#dbeafe; color:#1d4ed8; }
  .badge-yellow { background:#fef3c7; color:#92400e; }
  .badge-red { background:#fee2e2; color:#991b1b; }
</style>
</head>
<body>
  <div class="header">
    <img src="assets/Logo.png" alt="Logo">
    <div class="header-text">
      <h1>LAPORAN SISTEM INFORMASI MANAJEMEN PERKARA</h1>
      <h2>PENGADILAN AGAMA KELAS IA BANJARMASIN</h2>
      <p>Dicetak pada: ${now}</p>
    </div>
  </div>

  ${jenis==='perkara'||jenis==='semua' ? `
  <div class="section">
    <div class="section-title">⚖️ DATA PERKARA</div>
    <table>
      <thead><tr><th>ID</th><th>Pemohon</th><th>Jenis Perkara</th><th>Tgl Pengajuan</th><th>Status</th></tr></thead>
      <tbody>
        ${perkaraFiltered.map(p=>`<tr><td>${p.id}</td><td>${p.pemohon}</td><td>${p.jenis}</td><td>${p.tgl}</td><td><span class="badge badge-${badgeClass(p.status)}">${p.status}</span></td></tr>`).join('')}
      </tbody>
    </table>
  </div>
  `: ''}

  ${jenis==='jadwal'||jenis==='semua' ? `
  <div class="section">
    <div class="section-title">📅 DATA JADWAL SIDANG</div>
    <table>
      <thead><tr><th>ID</th><th>No. Perkara</th><th>Pemohon</th><th>Hakim</th><th>Ruang</th><th>Tanggal</th><th>Jam</th><th>Status</th></tr></thead>
      <tbody>
        ${jadwalFiltered.map(j=>`<tr><td>${j.id}</td><td>${j.perkara}</td><td>${j.pemohon}</td><td>${j.hakim}</td><td>${j.ruang}</td><td>${j.tgl}</td><td>${j.jam}</td><td><span class="badge badge-${badgeClass(j.status)}">${j.status}</span></td></tr>`).join('')}
      </tbody>
    </table>
  </div>
  `: ''}

  ${jenis==='surat'||jenis==='semua' ? `
  <div class="section">
    <div class="section-title">✉️ DATA SURAT MENYURAT</div>
    <table>
      <thead><tr><th>ID</th><th>Pemohon</th><th>Jenis Surat</th><th>Tgl Permohonan</th><th>Status</th><th>Keterangan</th></tr></thead>
      <tbody>
        ${suratFiltered.map(s=>`<tr><td>${s.id}</td><td>${s.pemohon}</td><td>${s.jenis}</td><td>${s.tgl}</td><td><span class="badge badge-${badgeClass(s.status)}">${s.status}</span></td><td>${s.keterangan}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>
  `: ''}

  ${jenis==='pengaduan'||jenis==='semua' ? `
  <div class="section">
    <div class="section-title">📢 DATA PENGADUAN</div>
    <table>
      <thead><tr><th>ID</th><th>Pelapor</th><th>Kategori</th><th>Prioritas</th><th>Tanggal</th><th>Status</th></tr></thead>
      <tbody>
        ${pengaduanFiltered.map(p=>`<tr><td>${p.id}</td><td>${p.pelapor}</td><td>${p.kategori}</td><td>${p.prioritas}</td><td>${p.tgl}</td><td><span class="badge badge-${badgeClass(p.status)}">${p.status}</span></td></tr>`).join('')}
      </tbody>
    </table>
  </div>
  `: ''}

</body>
</html>`;

  const w = window.open('');
  w.document.write(htmlContent);
  w.document.close();
  w.print();
}

  // Buka di tab baru — user bisa Ctrl+P / Save as PDF dari browser
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.addEventListener('load', () => {
      setTimeout(() => { win.print(); }, 500);
    });
    toast('Dokumen PDF dibuka di tab baru. Gunakan Ctrl+P untuk cetak/simpan PDF.', 'success');
  } else {
    // Fallback: langsung download html
    downloadFile('laporan-pengadilan-agama.html', htmlContent, 'text/html;charset=utf-8');
    toast('File laporan berhasil diunduh (buka di browser, lalu cetak sebagai PDF)', 'info');
  }



function eksporTabelPerkara() {
  const d = APP.data;
  const rows = [['ID','Pemohon','NIK','Jenis','Tgl Pengajuan','Status'], ...d.perkara.map(p=>[p.id,p.pemohon,p.nik,p.jenis,p.tgl,p.status])];
  downloadFile('perkara.csv', rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n'), 'text/csv');
  toast('Data perkara diunduh sebagai CSV', 'success');
}

function eksporStatistik() {
  const d = APP.data;
  const rows = [
    ['Kategori','Keterangan','Jumlah'],
    ['Perkara','Total Perkara Masuk', d.perkara.length],
    ['Perkara','Perkara Selesai', d.perkara.filter(p=>p.status==='selesai').length],
    ['Jadwal','Total Jadwal', d.jadwal.length],
    ['Jadwal','Jadwal Terkonfirmasi', d.jadwal.filter(j=>j.status==='terkonfirmasi').length],
    ['Surat','Total Permohonan', d.surat.length],
    ['Surat','Surat Diterbitkan', d.surat.filter(s=>s.status==='selesai').length],
    ['Pengaduan','Total Pengaduan', d.pengaduan.length],
    ['Pengaduan','Pengaduan Tertangani', d.pengaduan.filter(p=>p.status==='selesai').length],
  ];
  downloadFile('statistik.csv', rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n'), 'text/csv');
  toast('Statistik diunduh sebagai CSV', 'success');
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
