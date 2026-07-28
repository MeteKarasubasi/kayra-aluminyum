(async function () {
  let items = [];
  const tbody = document.querySelector("#table tbody");
  const search = document.getElementById("search");

  async function load() { try { items = await AdminAPI.references.list(); render(); } catch (e) { Toast.show("Hata: " + e.message, "err"); } }

  function render() {
    const q = (search.value || "").toLowerCase();
    const list = items.filter(r => !q || (r.name || "").toLowerCase().includes(q));
    tbody.innerHTML = list.map(r => `<tr>
      <td><img src="${UI.resolveBackend(r.logo)}" class="thumb" alt=""/></td>
      <td><strong>${UI.escapeHtml(r.name)}</strong></td>
      <td class="text-sm text-muted">${r.website ? `<a href="${UI.escapeHtml(r.website)}" target="_blank">${UI.escapeHtml(r.website)}</a>` : "—"}</td>
      <td>${r.order}</td>
      <td>${r.isActive ? '<span class="pill ok">aktif</span>' : '<span class="pill muted">pasif</span>'}</td>
      <td><div class="row-actions">
        <button class="btn btn-soft btn-sm" data-edit="${r.id}">Düzenle</button>
        <button class="btn btn-danger btn-sm" data-del="${r.id}">Sil</button>
      </div></td></tr>`).join("") || `<tr><td colspan="6" class="empty">Kayıt yok</td></tr>`;
  }

  function formHtml(r) {
    r = r || {};
    return `<form id="r-form" class="form-grid">
      <input type="hidden" id="r-id" value="${r.id || ""}"/>
      <div class="field"><label>İsim *</label><input id="r-name" value="${UI.escapeHtml(r.name || "")}" required/></div>
      <div class="field"><label>Website</label><input id="r-website" value="${UI.escapeHtml(r.website || "")}"/></div>
      <div class="field"><label>Sıra</label><input id="r-order" type="number" value="${r.order ?? 0}"/></div>
      <div class="field full checkbox"><input id="r-active" type="checkbox" ${r.isActive !== false ? "checked":""}/><label for="r-active">Aktif</label></div>
      ${UI.uploadField("r-logo", "image", r.logo)}
      <div class="field full flex gap-2"><button type="submit" class="btn btn-primary">Kaydet</button><button type="button" class="btn btn-soft" id="r-cancel">İptal</button></div>
    </form>`;
  }
  function openForm(r) {
    const m = UI.openModal(r && r.id ? "Referans Düzenle" : "Yeni Referans", formHtml(r));
    UI.bindUpload("r-logo", "image");
    document.getElementById("r-cancel").addEventListener("click", m.close);
    document.getElementById("r-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const body = {
        name: v("r-name"), website: v("r-website") || null,
        order: parseInt(v("r-order") || "0"), logo: v("r-logo"),
        isActive: document.getElementById("r-active").checked
      };
      try {
        const id = v("r-id");
        if (id) await AdminAPI.references.update(id, body); else await AdminAPI.references.create(body);
        m.close(); Toast.show("Kaydedildi", "ok"); load();
      } catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
    });
  }
  const v = (id) => document.getElementById(id).value.trim();

  tbody.addEventListener("click", async (e) => {
    const ed = e.target.closest("[data-edit]"); const dl = e.target.closest("[data-del]");
    if (ed) { const r = items.find(x => x.id === ed.dataset.edit); openForm(r); }
    if (dl && UI.confirmDialog("Silinsin mi?")) {
      try { await AdminAPI.references.remove(dl.dataset.del); Toast.show("Silindi", "ok"); load(); }
      catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
    }
  });
  document.getElementById("new-btn").addEventListener("click", () => openForm(null));
  search.addEventListener("input", render);
  document.addEventListener("app-ready", load);
})();