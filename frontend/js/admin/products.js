(async function () {
  let items = [];
  const tbody = document.querySelector("#table tbody");
  const search = document.getElementById("search");

  async function load() { try { items = await AdminAPI.products.list(); render(); } catch (e) { Toast.show("Hata: " + e.message, "err"); } }

  function render() {
    const q = (search.value || "").toLowerCase();
    const list = items.filter(p => !q || (p.titleTr + " " + p.titleEn + " " + p.code + " " + p.slug).toLowerCase().includes(q));
    tbody.innerHTML = list.map(p => `<tr>
      <td><img src="${p.image}" class="thumb" alt=""/></td>
      <td><strong>${UI.escapeHtml(p.titleTr)}</strong><div class="text-xs text-muted">${UI.escapeHtml(p.titleEn)}</div></td>
      <td>${UI.escapeHtml(p.code)}</td>
      <td class="text-xs text-muted">/${UI.escapeHtml(p.slug)}</td>
      <td>${p.order}</td>
      <td>${p.isActive ? '<span class="pill ok">aktif</span>' : '<span class="pill muted">pasif</span>'}</td>
      <td><div class="row-actions">
        <button class="btn btn-soft btn-sm" data-edit="${p.id}">Düzenle</button>
        <button class="btn btn-danger btn-sm" data-del="${p.id}">Sil</button>
      </div></td></tr>`).join("") || `<tr><td colspan="7" class="empty">Kayıt yok</td></tr>`;
  }

  function formHtml(p) {
    p = p || {};
    const feats = (p.features || []).join("\n");
    return `<form id="p-form" class="form-grid">
      <input type="hidden" id="p-id" value="${p.id || ""}"/>
      <div class="field"><label>Başlık (TR) *</label><input id="p-titleTr" value="${UI.escapeHtml(p.titleTr || "")}" required/></div>
      <div class="field"><label>Başlık (EN)</label><input id="p-titleEn" value="${UI.escapeHtml(p.titleEn || "")}"/></div>
      <div class="field"><label>Slug *</label><input id="p-slug" value="${UI.escapeHtml(p.slug || "")}" required/></div>
      <div class="field"><label>Kod</label><input id="p-code" value="${UI.escapeHtml(p.code || "")}"/></div>
      <div class="field"><label>Sıra</label><input id="p-order" type="number" value="${p.order ?? 0}"/></div>
      <div class="field full"><label>Açıklama (TR)</label><textarea id="p-descTr">${UI.escapeHtml(p.descTr || "")}</textarea></div>
      <div class="field full"><label>Açıklama (EN)</label><textarea id="p-descEn">${UI.escapeHtml(p.descEn || "")}</textarea></div>
      ${UI.uploadField("p-image", "image", p.image)}
      <div class="field full"><label>Özellikler (her satır biri)</label><textarea id="p-features">${UI.escapeHtml(feats)}</textarea></div>
      <div class="field full checkbox"><input id="p-active" type="checkbox" ${p.isActive !== false ? "checked":""}/><label for="p-active">Aktif</label></div>
      <div class="field full flex gap-2"><button type="submit" class="btn btn-primary">Kaydet</button><button type="button" class="btn btn-soft" id="p-cancel">İptal</button></div>
    </form>`;
  }
  function openForm(p) {
    const m = UI.openModal(p && p.id ? "Ürün Düzenle" : "Yeni Ürün", formHtml(p));
    UI.bindUpload("p-image", "image");
    document.getElementById("p-cancel").addEventListener("click", m.close);
    document.getElementById("p-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const feats = document.getElementById("p-features").value.split("\n").map(s => s.trim()).filter(Boolean);
      const body = {
        titleTr: v("p-titleTr"), titleEn: v("p-titleEn"), slug: v("p-slug"),
        code: v("p-code"), order: parseInt(v("p-order") || "0"),
        descTr: v("p-descTr") || null, descEn: v("p-descEn") || null,
        image: v("p-image"), features: feats,
        isActive: document.getElementById("p-active").checked
      };
      try {
        const id = v("p-id");
        if (id) await AdminAPI.products.update(id, body); else await AdminAPI.products.create(body);
        m.close(); Toast.show("Kaydedildi", "ok"); load();
      } catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
    });
  }
  const v = (id) => document.getElementById(id).value.trim();

  tbody.addEventListener("click", async (e) => {
    const ed = e.target.closest("[data-edit]"); const dl = e.target.closest("[data-del]");
    if (ed) { const p = items.find(x => x.id === ed.dataset.edit); openForm(p); }
    if (dl && UI.confirmDialog("Silinsin mi?")) {
      try { await AdminAPI.products.remove(dl.dataset.del); Toast.show("Silindi", "ok"); load(); }
      catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
    }
  });
  document.getElementById("new-btn").addEventListener("click", () => openForm(null));
  search.addEventListener("input", render);
  document.addEventListener("app-ready", load);
})();