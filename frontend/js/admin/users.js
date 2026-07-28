(async function () {
  let items = [];
  const tbody = document.querySelector("#table tbody");

  async function load() { try { items = await AdminAPI.users.list(); render(); } catch (e) { Toast.show("Hata: " + e.message, "err"); } }

  function render() {
    tbody.innerHTML = items.map(u => `<tr>
      <td><strong>${UI.escapeHtml(u.name || "—")}</strong></td>
      <td>${UI.escapeHtml(u.email)}</td>
      <td><span class="pill primary">${UI.escapeHtml(u.role)}</span></td>
      <td class="text-xs text-muted">${UI.fmtDate(u.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn btn-soft btn-sm" data-edit="${u.id}">Düzenle</button>
        <button class="btn btn-danger btn-sm" data-del="${u.id}">Sil</button>
      </div></td></tr>`).join("") || `<tr><td colspan="5" class="empty">Kullanıcı yok</td></tr>`;
  }

  function formHtml(u) {
    u = u || {};
    return `<form id="u-form" class="form-grid">
      <input type="hidden" id="u-id" value="${u.id || ""}"/>
      <div class="field"><label>Ad</label><input id="u-name" value="${UI.escapeHtml(u.name || "")}"/></div>
      <div class="field"><label>E-posta *</label><input id="u-email" type="email" value="${UI.escapeHtml(u.email || "")}" required/></div>
      <div class="field"><label>Rol</label><select id="u-role"><option value="admin" ${u.role === "admin" ? "selected":""}>admin</option><option value="editor" ${u.role === "editor" ? "selected":""}>editor</option></select></div>
      <div class="field"><label>Şifre ${u.id ? "(boş = değişmez)" : "*"}</label><input id="u-password" type="password" ${u.id ? "" : "required"}/></div>
      <div class="field full flex gap-2"><button type="submit" class="btn btn-primary">Kaydet</button><button type="button" class="btn btn-soft" id="u-cancel">İptal</button></div>
    </form>`;
  }
  function openForm(u) {
    const m = UI.openModal(u && u.id ? "Kullanıcı Düzenle" : "Yeni Kullanıcı", formHtml(u));
    document.getElementById("u-cancel").addEventListener("click", m.close);
    document.getElementById("u-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const body = {
        name: v("u-name") || null, email: v("u-email"), role: v("u-role"),
        password: v("u-password") || null
      };
      try {
        const id = v("u-id");
        if (id) await AdminAPI.users.update(id, body); else await AdminAPI.users.create(body);
        m.close(); Toast.show("Kaydedildi", "ok"); load();
      } catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
    });
  }
  const v = (id) => document.getElementById(id).value.trim();

  tbody.addEventListener("click", async (e) => {
    const ed = e.target.closest("[data-edit]"); const dl = e.target.closest("[data-del]");
    if (ed) { const u = items.find(x => x.id === ed.dataset.edit); openForm(u); }
    if (dl && UI.confirmDialog("Kullanıcı silinsin mi?")) {
      try { await AdminAPI.users.remove(dl.dataset.del); Toast.show("Silindi", "ok"); load(); }
      catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
    }
  });
  document.getElementById("new-btn").addEventListener("click", () => openForm(null));
  document.addEventListener("app-ready", load);
})();