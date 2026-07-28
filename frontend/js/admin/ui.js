(function () {
  function toast(msg, kind) {
    const el = document.createElement("div");
    el.className = "toast " + (kind || "ok");
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  function confirmDialog(message) {
    return window.confirm(message);
  }

  function openModal(title, bodyHtml) {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = `<div class="modal">
      <div class="modal-head"><h3>${title}</h3><button class="modal-close" aria-label="Kapat">✕</button></div>
      <div class="modal-body">${bodyHtml}</div></div>`;
    document.body.appendChild(backdrop);
    const close = () => backdrop.remove();
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
    backdrop.querySelector(".modal-close").addEventListener("click", close);
    return { el: backdrop, close };
  }

  function resolveBackend(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
    return (window.KAYRA_API_BASE || "/api").replace("/api", "") + (url.startsWith("/") ? url : "/" + url);
  }

  function uploadField(prefix, type, currentUrl) {
    const id = prefix + "-upload";
    const resolved = resolveBackend(currentUrl);
    const isImage = type !== "doc";
    const previewContent = currentUrl
      ? (isImage
        ? `<div class="upload-preview-box"><img src="${resolved}" alt="Önizleme"/><button type="button" class="upload-remove-btn" data-remove="${prefix}" title="Kaldır">✕</button></div>`
        : `<div class="upload-file-info"><span class="upload-file-icon">📄</span><a href="${resolved}" target="_blank" class="upload-file-link">${escapeHtml(currentUrl)}</a><button type="button" class="upload-remove-btn" data-remove="${prefix}" title="Kaldır">✕</button></div>`)
      : "";
    return `<div class="field full">
      <label>Dosya (${type === "doc" ? "PDF" : "Görsel"})</label>
      <div class="upload-zone" id="${id}-zone">
        <input type="file" id="${id}" accept="${type === "doc" ? ".pdf" : ".jpg,.jpeg,.png,.webp,.svg,.gif"}" style="display:none"/>
        <div class="upload-zone-content">
          <span class="upload-zone-icon">${isImage ? "🖼️" : "📁"}</span>
          <span class="upload-zone-text">Tıkla ya da sürükle</span>
          <span class="upload-zone-hint">${type === "doc" ? "PDF · maks 50MB" : "JPG/PNG/WEBP/SVG · maks 10MB"}</span>
        </div>
      </div>
      <div class="upload-preview" id="${id}-prev">${previewContent}</div>
      <input type="hidden" id="${prefix}" value="${currentUrl || ""}"/>
    </div>`;
  }

  function bindUpload(prefix, type, onDone) {
    const zone = document.getElementById(prefix + "-upload-zone");
    const input = document.getElementById(prefix + "-upload");
    const hidden = document.getElementById(prefix);
    const prev = document.getElementById(prefix + "-upload-prev");
    if (!zone) return;

    // Click to select
    zone.addEventListener("click", () => input.click());

    // Drag and drop
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("drag-over");
    });
    zone.addEventListener("drop", async (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      const f = e.dataTransfer.files[0];
      if (f) await doUpload(f);
    });

    // File selection
    input.addEventListener("change", async () => {
      const f = input.files[0]; if (!f) return;
      await doUpload(f);
    });

    async function doUpload(f) {
      zone.classList.add("uploading");
      try {
        const r = await AdminAPI.upload(f, type);
        hidden.value = r.url;
        const resolved = resolveBackend(r.url);
        if (type === "doc") {
          prev.innerHTML = `<div class="upload-file-info"><span class="upload-file-icon">📄</span><a href="${resolved}" target="_blank" class="upload-file-link">${escapeHtml(r.filename || r.url)}</a><button type="button" class="upload-remove-btn" data-remove="${prefix}" title="Kaldır">✕</button></div>`;
        } else {
          prev.innerHTML = `<div class="upload-preview-box"><img src="${resolved}" alt="Önizleme"/><button type="button" class="upload-remove-btn" data-remove="${prefix}" title="Kaldır">✕</button></div>`;
        }
        bindRemoveBtn(prefix, prev, hidden);
        if (onDone) onDone(r.url);
        Toast.show("Yüklendi", "ok");
      } catch (e) { Toast.show("Yükleme başarısız: " + e.message, "err"); }
      finally { zone.classList.remove("uploading"); }
    }

    // Bind existing remove button if present
    bindRemoveBtn(prefix, prev, hidden);
  }

  function bindRemoveBtn(prefix, prev, hidden) {
    const btn = prev.querySelector(`[data-remove="${prefix}"]`);
    if (btn) {
      btn.addEventListener("click", () => {
        hidden.value = "";
        prev.innerHTML = "";
      });
    }
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  }

  function fmtDate(s) {
    if (!s) return "—";
    const d = new Date(s);
    return d.toLocaleDateString("tr-TR") + " " + d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }

  // Gallery upload for projects — grid with up to 10 images
  function galleryField(prefix, urls) {
    const list = Array.isArray(urls) ? urls : [];
    const gridHtml = list.map((url, i) => {
      const resolved = resolveBackend(url);
      return `<div class="gallery-thumb" data-gallery-idx="${i}">
        <img src="${resolved}" alt="Galeri ${i+1}"/>
        <button type="button" class="gallery-remove" data-gallery-remove="${i}" title="Kaldır">✕</button>
      </div>`;
    }).join("");

    return `<div class="field full">
      <label>Galeri (maks 10 fotoğraf)</label>
      <div class="gallery-grid" id="${prefix}-gallery-grid">${gridHtml}</div>
      <div class="gallery-add-wrap">
        <input type="file" id="${prefix}-gallery-input" accept=".jpg,.jpeg,.png,.webp,.svg,.gif" multiple style="display:none"/>
        <button type="button" class="btn btn-soft btn-sm" id="${prefix}-gallery-add" ${list.length >= 10 ? "disabled" : ""}>
          🖼️ Görsel Ekle ${list.length > 0 ? `(${list.length}/10)` : ""}
        </button>
      </div>
      <textarea id="${prefix}" style="display:none">${list.join("\n")}</textarea>
    </div>`;
  }

  function bindGallery(prefix) {
    const textarea = document.getElementById(prefix);
    const grid = document.getElementById(prefix + "-gallery-grid");
    const addBtn = document.getElementById(prefix + "-gallery-add");
    const fileInput = document.getElementById(prefix + "-gallery-input");
    if (!textarea || !grid || !addBtn || !fileInput) return;

    function getUrls() {
      return textarea.value.split("\n").map(s => s.trim()).filter(Boolean);
    }

    function setUrls(urls) {
      textarea.value = urls.join("\n");
      refreshGrid(urls);
    }

    function refreshGrid(urls) {
      grid.innerHTML = urls.map((url, i) => {
        const resolved = resolveBackend(url);
        return `<div class="gallery-thumb" data-gallery-idx="${i}">
          <img src="${resolved}" alt="Galeri ${i+1}"/>
          <button type="button" class="gallery-remove" data-gallery-remove="${i}" title="Kaldır">✕</button>
        </div>`;
      }).join("");

      addBtn.textContent = `🖼️ Görsel Ekle (${urls.length}/10)`;
      addBtn.disabled = urls.length >= 10;

      // Bind remove buttons
      grid.querySelectorAll(".gallery-remove").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.galleryRemove);
          const cur = getUrls();
          cur.splice(idx, 1);
          setUrls(cur);
        });
      });
    }

    addBtn.addEventListener("click", () => {
      if (getUrls().length >= 10) { Toast.show("Maksimum 10 fotoğraf eklenebilir", "err"); return; }
      fileInput.click();
    });

    fileInput.addEventListener("change", async () => {
      const files = Array.from(fileInput.files);
      if (!files.length) return;
      const cur = getUrls();
      const remaining = 10 - cur.length;
      const toUpload = files.slice(0, remaining);

      for (const f of toUpload) {
        try {
          const r = await AdminAPI.upload(f, "image");
          cur.push(r.url);
          Toast.show(`${f.name} yüklendi`, "ok");
        } catch (e) {
          Toast.show(`${f.name} yüklenemedi: ${e.message}`, "err");
        }
      }
      setUrls(cur);
      fileInput.value = "";
    });

    // Bind initial remove buttons
    refreshGrid(getUrls());
  }

  window.Toast = { show: toast };
  window.UI = { confirmDialog, openModal, uploadField, bindUpload, escapeHtml, fmtDate, galleryField, bindGallery, resolveBackend };
})();