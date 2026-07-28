(async function () {
  let currentUrl = "";

  function resolveBackend(url) {
    if (!url) return "";
    if (window.resolveUrl) return window.resolveUrl(url);
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = (window.KAYRA_API_BASE || "").replace("/api", "");
    return base + (url.startsWith("/") ? url : "/" + url);
  }

  function showPreview(url) {
    const wrap = document.getElementById("pdf-preview-wrap");
    const slot = document.getElementById("pdf-frame-slot");
    if (!slot || !wrap) return;
    if (url) {
      const abs = resolveBackend(url);
      wrap.style.display = "block";
      if (window.CatalogPdf) {
        window.CatalogPdf.init(abs, slot);
      }
    } else {
      slot.innerHTML = "";
      wrap.style.display = "none";
    }
  }

  async function load() {
    try {
      const s = await AdminAPI.settings.get();
      currentUrl = s.catalog_pdf_url || "";
      const cur = document.getElementById("current-status");

      if (currentUrl) {
        const abs = resolveBackend(currentUrl);
        cur.innerHTML = `<div class="status-card status-ok">
          <div class="status-icon">✅</div>
          <div class="status-body">
            <div class="status-title">Katalog PDF mevcut</div>
            <div class="status-url">${UI.escapeHtml(currentUrl)}</div>
            <div class="status-actions">
              <a href="${abs}" target="_blank" class="btn btn-soft btn-sm">🔗 Görüntüle</a>
              <a href="${abs}" download class="btn btn-soft btn-sm">📥 İndir</a>
              <button class="btn btn-danger btn-sm" id="remove-pdf">🗑 Kaldır</button>
            </div>
          </div>
        </div>`;
        showPreview(currentUrl);
      } else {
        cur.innerHTML = `<div class="status-card status-empty">
          <div class="status-icon">📁</div>
          <div class="status-body">
            <div class="status-title">Henüz katalog PDF yüklenmemiş</div>
            <div class="text-xs text-muted">Aşağıdan bir PDF dosyası yükleyerek başlayın.</div>
          </div>
        </div>`;
        showPreview("");
      }

      document.getElementById("upload-slot").innerHTML = UI.uploadField("c-pdf", "doc", currentUrl);
      UI.bindUpload("c-pdf", "doc", function (url) {
        showPreview(url);
      });

      const rm = document.getElementById("remove-pdf");
      if (rm) rm.addEventListener("click", async () => {
        if (!UI.confirmDialog("Katalog kaldırılsın mı?")) return;
        try { await AdminAPI.settings.update({ catalog_pdf_url: "" }); Toast.show("Kaldırıldı", "ok"); load(); }
        catch (e) { Toast.show("Hata: " + e.message, "err"); }
      });
    } catch (e) { Toast.show("Hata: " + e.message, "err"); }
  }

  document.getElementById("catalog-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = (document.getElementById("c-pdf") || {}).value || "";
    try {
      await AdminAPI.settings.update({ catalog_pdf_url: url });
      Toast.show("Kaydedildi", "ok");
      load();
    } catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
  });

  document.addEventListener("app-ready", load);
})();
