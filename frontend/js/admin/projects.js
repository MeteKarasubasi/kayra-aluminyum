(async function () {
  let items = [];
  const tbody = document.querySelector("#table tbody");
  const search = document.getElementById("search");

  async function load() {
    try { items = await AdminAPI.projects.list(); render(); }
    catch (e) { Toast.show("Yüklenemedi: " + e.message, "err"); }
  }

  function render() {
    const q = (search.value || "").toLowerCase();
    const list = items.filter(p =>
      !q || (p.title + " " + p.location + " " + p.category + " " + p.slug).toLowerCase().includes(q));
    tbody.innerHTML = list.map(p => `<tr>
      <td><img src="${UI.resolveBackend(p.image)}" class="thumb" alt=""/></td>
      <td><strong>${UI.escapeHtml(p.title)}</strong><div class="text-xs text-muted">/${UI.escapeHtml(p.slug)}</div></td>
      <td><span class="pill muted">${UI.escapeHtml(p.category)}</span></td>
      <td>${UI.escapeHtml(p.location)}</td>
      <td>${p.order}</td>
      <td>${p.isActive ? '<span class="pill ok">aktif</span>' : '<span class="pill muted">pasif</span>'}</td>
      <td><div class="row-actions">
        <button class="btn btn-soft btn-sm" data-edit="${p.id}">Düzenle</button>
        <button class="btn btn-danger btn-sm" data-del="${p.id}">Sil</button>
      </div></td></tr>`).join("") || `<tr><td colspan="7" class="empty">Kayıt yok</td></tr>`;
  }

  function formHtml(p) {
    p = p || {};
    const prods = (p.products || []).join("\n");
    return `<form id="p-form" class="form-grid">
      <input type="hidden" id="p-id" value="${p.id || ""}"/>
      <div class="field"><label>Başlık *</label><input id="p-title" value="${UI.escapeHtml(p.title || "")}" required/></div>
      <div class="field"><label>Slug *</label><input id="p-slug" value="${UI.escapeHtml(p.slug || "")}" required/></div>
      <div class="field"><label>Konum</label><input id="p-location" value="${UI.escapeHtml(p.location || "")}"/></div>
      <div class="field"><label>Kategori</label>
        <select id="p-category">
          ${["residential","commercial","corporate"].map(c => `<option value="${c}" ${p.category === c ? "selected":""}>${c}</option>`).join("")}
        </select>
      </div>
      <div class="field"><label>Yıl</label><input id="p-year" value="${UI.escapeHtml(p.year || "")}"/></div>
      <div class="field"><label>Alan</label><input id="p-area" value="${UI.escapeHtml(p.area || "")}"/></div>
      <div class="field"><label>Müşteri</label><input id="p-client" value="${UI.escapeHtml(p.client || "")}"/></div>
      <div class="field"><label>Sıra</label><input id="p-order" type="number" value="${p.order ?? 0}"/></div>
      <div class="field full"><label>Açıklama</label><textarea id="p-desc">${UI.escapeHtml(p.description || "")}</textarea></div>
      ${UI.uploadField("p-image", "image", p.image)}
      ${UI.galleryField("p-gallery", p.gallery || [])}
      <div class="field full"><label>Kullanılan ürün slug'ları (her satır biri)</label><textarea id="p-products" placeholder="kis-bahcesi">${UI.escapeHtml(prods)}</textarea></div>
      <div class="field full checkbox"><input id="p-active" type="checkbox" ${p.isActive !== false ? "checked":""}/><label for="p-active">Aktif</label></div>
      <div class="field full flex gap-2"><button type="submit" class="btn btn-primary">Kaydet</button><button type="button" class="btn btn-soft" id="p-cancel">İptal</button></div>
    </form>`;
  }

  function openForm(p) {
    const m = UI.openModal(p && p.id ? "Proje Düzenle" : "Yeni Proje", formHtml(p));
    UI.bindUpload("p-image", "image");
    UI.bindGallery("p-gallery");
    document.getElementById("p-cancel").addEventListener("click", m.close);
    document.getElementById("p-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const lines = (id) => document.getElementById(id).value.split("\n").map(s => s.trim()).filter(Boolean);
      const body = {
        title: v("p-title"), slug: v("p-slug"), location: v("p-location"),
        category: v("p-category"), year: v("p-year") || null, area: v("p-area") || null,
        client: v("p-client") || null, order: parseInt(v("p-order") || "0"),
        description: v("p-desc") || null, image: v("p-image"),
        gallery: lines("p-gallery"), products: lines("p-products"),
        isActive: document.getElementById("p-active").checked
      };
      try {
        const id = v("p-id");
        if (id) await AdminAPI.projects.update(id, body); else await AdminAPI.projects.create(body);
        m.close(); Toast.show("Kaydedildi", "ok"); load();
      } catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
    });
  }
  const v = (id) => document.getElementById(id).value.trim();

  tbody.addEventListener("click", async (e) => {
    const ed = e.target.closest("[data-edit]"); const dl = e.target.closest("[data-del]");
    if (ed) { const p = items.find(x => x.id === ed.dataset.edit); openForm(p); }
    if (dl && UI.confirmDialog("Silinsin mi?")) {
      try { await AdminAPI.projects.remove(dl.dataset.del); Toast.show("Silindi", "ok"); load(); }
      catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
    }
  });
  document.getElementById("new-btn").addEventListener("click", () => openForm(null));
  search.addEventListener("input", render);
  document.addEventListener("app-ready", load);
})();