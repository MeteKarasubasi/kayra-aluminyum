(async function () {
  let items = [];
  const tbody = document.querySelector("#table tbody");
  let filter = "";

  async function load() {
    try { items = await AdminAPI.messages.list(filter === "unread"); render(); }
    catch (e) { Toast.show("Hata: " + e.message, "err"); }
  }

  function render() {
    tbody.innerHTML = items.map(m => `<tr>
      <td><strong>${UI.escapeHtml(m.name)}</strong><div class="text-xs text-muted">${UI.escapeHtml(m.email)}</div>${m.phone ? `<div class="text-xs text-muted">${UI.escapeHtml(m.phone)}</div>` : ""}</td>
      <td class="text-sm" style="max-width:28rem;white-space:normal">${UI.escapeHtml(m.message).slice(0,160)}${m.message.length > 160 ? "…" : ""}</td>
      <td class="text-xs text-muted">${UI.fmtDate(m.createdAt)}</td>
      <td>${m.isRead ? '<span class="pill muted">okundu</span>' : '<span class="pill primary">yeni</span>'}${m.isSpam ? ' <span class="pill danger">spam</span>' : ""}</td>
      <td><div class="row-actions">
        <button class="btn btn-soft btn-sm" data-view="${m.id}">Görüntüle</button>
        ${!m.isRead ? `<button class="btn btn-soft btn-sm" data-read="${m.id}">Okundu</button>` : ""}
        <button class="btn btn-danger btn-sm" data-del="${m.id}">Sil</button>
      </div></td></tr>`).join("") || `<tr><td colspan="5" class="empty">Mesaj yok</td></tr>`;
  }

  function viewMessage(m) {
    UI.openModal("Mesaj Detayı", `<div class="form-grid">
      <div class="field full"><label>Ad Soyad</label><div>${UI.escapeHtml(m.name)}</div></div>
      <div class="field"><label>E-posta</label><div><a href="mailto:${UI.escapeHtml(m.email)}">${UI.escapeHtml(m.email)}</a></div></div>
      <div class="field"><label>Telefon</label><div>${m.phone ? UI.escapeHtml(m.phone) : "—"}</div></div>
      <div class="field full"><label>Tarih</label><div>${UI.fmtDate(m.createdAt)}</div></div>
      <div class="field full"><label>Mesaj</label><div style="white-space:pre-wrap;background:var(--bg);padding:1rem;border-radius:var(--radius);border:1px solid var(--border)">${UI.escapeHtml(m.message)}</div></div>
      ${m.ip ? `<div class="field"><label>IP</label><div class="text-xs text-muted">${UI.escapeHtml(m.ip)}</div></div>` : ""}
      ${m.language ? `<div class="field"><label>Dil</label><div class="text-xs text-muted">${UI.escapeHtml(m.language)}</div></div>` : ""}
    </div>`);
  }

  tbody.addEventListener("click", async (e) => {
    const v = e.target.closest("[data-view]"); const r = e.target.closest("[data-read]"); const d = e.target.closest("[data-del]");
    if (v) { const m = items.find(x => x.id === v.dataset.view); viewMessage(m);
      if (!m.isRead) try { await AdminAPI.messages.patch(m.id, { IsRead: true }); load(); } catch {} }
    if (r) { try { await AdminAPI.messages.patch(r.dataset.read, { IsRead: true }); Toast.show("İşaretlendi", "ok"); load(); } catch (ex) { Toast.show("Hata: " + ex.message, "err"); } }
    if (d && UI.confirmDialog("Silinsin mi?")) {
      try { await AdminAPI.messages.remove(d.dataset.del); Toast.show("Silindi", "ok"); load(); }
      catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
    }
  });

  document.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(x => x.classList.remove("active"));
    b.classList.add("active"); filter = b.dataset.filter; load();
  }));

  document.addEventListener("app-ready", load);
})();