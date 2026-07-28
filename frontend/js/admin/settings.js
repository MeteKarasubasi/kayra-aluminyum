(async function () {
  function toAbsolute(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = window.KAYRA_API_BASE.replace("/api", "");
    return base + (url.startsWith("/") ? url : "/" + url);
  }
  function updatePreview(url) {
    const wrap = document.getElementById("catalog-pdf-preview");
    if (!wrap) return;
    const abs = toAbsolute(url);
    if (abs) {
      wrap.innerHTML = `<iframe src="${abs}" title="Katalog Önizleme" style="width:100%;height:14rem;border:1px solid var(--border);border-radius:.75rem;margin-top:.75rem;background:var(--bg-soft)"></iframe>`;
    } else {
      wrap.innerHTML = "";
    }
  }

  async function load() {
    try {
      const s = await AdminAPI.settings.get();
      document.querySelectorAll("[data-k]").forEach(el => {
        const k = el.getAttribute("data-k");
        if (s[k] != null) el.value = s[k];
      });
      const wrap = document.getElementById("catalog-upload-field");
      if (wrap) {
        wrap.innerHTML = UI.uploadField("catalog_pdf", "doc", s.catalog_pdf_url || "");
        UI.bindUpload("catalog_pdf", "doc", (url) => {
          const abs = toAbsolute(url);
          const inp = document.querySelector('input[data-k="catalog_pdf_url"]');
          if (inp) inp.value = abs;
          updatePreview(abs);
          Toast.show("PDF yüklendi", "ok");
        });
        updatePreview(s.catalog_pdf_url || "");
      }
    } catch (e) { Toast.show("Hata: " + e.message, "err"); }
  }
  document.getElementById("settings-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {};
    document.querySelectorAll("[data-k]").forEach(el => { payload[el.getAttribute("data-k")] = el.value; });
    try { await AdminAPI.settings.update(payload); Toast.show("Ayarlar kaydedildi", "ok"); }
    catch (ex) { Toast.show("Hata: " + ex.message, "err"); }
  });
  document.addEventListener("app-ready", load);
})();
