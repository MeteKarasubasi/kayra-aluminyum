(async function () {
  async function load() {
    try {
      const s = await AdminAPI.stats();
      document.getElementById("stat-grid").innerHTML = `
        <div class="stat-card"><div class="label">Projeler</div><div class="value primary">${s.projects}</div></div>
        <div class="stat-card"><div class="label">Ürünler</div><div class="value primary">${s.products}</div></div>
        <div class="stat-card"><div class="label">Referanslar</div><div class="value primary">${s.references}</div></div>
        <div class="stat-card"><div class="label">Mesajlar</div><div class="value ${s.unreadMessages ? 'danger' : 'ok'}">${s.messages}${s.unreadMessages ? ` <span class="pill danger">${s.unreadMessages} yeni</span>` : ""}</div></div>
        <div class="stat-card"><div class="label">Ziyaret (toplam)</div><div class="value ok">${s.visits}</div></div>
        <div class="stat-card"><div class="label">Ziyaret (30g)</div><div class="value ok">${s.visits30}</div></div>
        <div class="stat-card"><div class="label">Admin</div><div class="value">${s.admins}</div></div>
        <div class="stat-card"><div class="label">Site</div><div class="value text-sm"><a class="btn btn-soft btn-sm" href="/" target="_blank">Görüntüle →</a></div></div>`;
      const list = (s.recentMessages || []).map(m => `
        <table style="width:100%"><tr>
          <td><strong>${UI.escapeHtml(m.name)}</strong><div class="text-xs text-muted">${UI.escapeHtml(m.email)}</div></td>
          <td class="text-xs text-muted">${UI.fmtDate(m.createdAt)}</td>
          <td>${m.isRead ? '<span class="pill muted">okundu</span>' : '<span class="pill primary">yeni</span>'}</td>
        </tr></table>`).join("");
      document.getElementById("recent-messages").innerHTML = list || `<div class="empty">Mesaj yok</div>`;
    } catch (e) { Toast.show("İstatistik yüklenemedi: " + e.message, "err"); }
  }
  document.getElementById("clear-cache").addEventListener("click", async () => {
    try { await AdminAPI.cache.clear(); Toast.show("Önbellek temizlendi", "ok"); }
    catch (e) { Toast.show("Hata: " + e.message, "err"); }
  });
  document.addEventListener("app-ready", load);
})();