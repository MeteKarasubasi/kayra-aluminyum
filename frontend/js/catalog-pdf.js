(function () {
  let pdfDoc = null;
  let pageNum = 1;
  let numPages = 0;
  let pageCache = new Map();
  let rendering = false;

  async function initPdfViewer(pdfUrl, mountEl) {
    if (!mountEl || !pdfUrl) return;

    mountEl.innerHTML = `
      <div class="catalog-pdf-viewer">
        <div class="pdf-viewer-header">
          <div class="pdf-viewer-title flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span class="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">Kayıtlı Ürün Kataloğu</span>
          </div>
          <div class="pdf-viewer-actions flex items-center gap-2">
            <button type="button" id="pdf-fullscreen-btn" class="pdf-action-btn" title="Tam Ekran">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            </button>
            <a id="pdf-open-btn" href="${pdfUrl}" target="_blank" rel="noopener noreferrer" class="pdf-action-btn" title="Yeni Sekmede Aç">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <a id="pdf-download-btn" href="${pdfUrl}" download class="pdf-action-btn pdf-btn-primary" title="İndir">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>İndir</span>
            </a>
          </div>
        </div>

        <div class="pdf-viewer-stage" id="pdf-stage">
          <div class="pdf-loading-spinner" id="pdf-loading">
            <div class="spinner-circle"></div>
            <span>Katalog sayfaları hazırlanıyor...</span>
          </div>

          <div class="pdf-page-display" id="pdf-page-display" style="display:none">
            <button type="button" class="pdf-nav-btn pdf-nav-prev" id="pdf-prev" aria-label="Önceki Sayfa">‹</button>
            <div class="pdf-paper-card" id="pdf-paper-card">
              <img id="pdf-page-img" src="" alt="Katalog Sayfası" draggable="false"/>
            </div>
            <button type="button" class="pdf-nav-btn pdf-nav-next" id="pdf-next" aria-label="Sonraki Sayfa">›</button>
          </div>
        </div>

        <div class="pdf-viewer-footer" id="pdf-footer" style="display:none">
          <div class="pdf-counter-badge">
            <span id="pdf-curr-num">1</span> <span class="text-muted-foreground/40">/</span> <span id="pdf-total-num">1</span> Sayfa
          </div>
          <div class="pdf-thumbs-strip no-scrollbar" id="pdf-thumbs"></div>
        </div>
      </div>
    `;

    const stageEl = mountEl.querySelector("#pdf-stage");
    const loadingEl = mountEl.querySelector("#pdf-loading");
    const displayEl = mountEl.querySelector("#pdf-page-display");
    const footerEl = mountEl.querySelector("#pdf-footer");
    const pageImg = mountEl.querySelector("#pdf-page-img");
    const paperCard = mountEl.querySelector("#pdf-paper-card");
    const prevBtn = mountEl.querySelector("#pdf-prev");
    const nextBtn = mountEl.querySelector("#pdf-next");
    const currNumEl = mountEl.querySelector("#pdf-curr-num");
    const totalNumEl = mountEl.querySelector("#pdf-total-num");
    const thumbsEl = mountEl.querySelector("#pdf-thumbs");
    const fullscreenBtn = mountEl.querySelector("#pdf-fullscreen-btn");

    try {
      if (typeof window.pdfjsLib === "undefined") {
        throw new Error("PDF kütüphanesi yüklenemedi");
      }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      pdfDoc = await loadingTask.promise;
      numPages = pdfDoc.numPages;
      totalNumEl.textContent = String(numPages);

      loadingEl.style.display = "none";
      displayEl.style.display = "flex";
      footerEl.style.display = "flex";

      renderThumbnails(thumbsEl);
      await renderPage(1);

      prevBtn.addEventListener("click", () => changePage(-1));
      nextBtn.addEventListener("click", () => changePage(1));

      fullscreenBtn.addEventListener("click", () => {
        const viewer = mountEl.querySelector(".catalog-pdf-viewer");
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (viewer.requestFullscreen) {
          viewer.requestFullscreen();
        }
      });

      // Keyboard & touch swipe
      document.addEventListener("keydown", (e) => {
        if (!mountEl.offsetParent) return;
        if (e.key === "ArrowLeft") changePage(-1);
        if (e.key === "ArrowRight") changePage(1);
      });

      let touchStartX = 0;
      paperCard.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      paperCard.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) changePage(dx < 0 ? 1 : -1);
      }, { passive: true });

    } catch (err) {
      console.warn("PDF.js render fallback:", err);
      loadingEl.style.display = "none";
      // Fallback: If PDF.js fails to parse, show clean download preview link instead of raw broken embed
      stageEl.innerHTML = `
        <div class="flex flex-col items-center justify-center p-12 text-center">
          <div class="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 class="font-display text-xl font-bold mb-2">Katalog PDF Dokümanı</h3>
          <p class="text-sm text-muted-foreground max-w-md mb-6">Detaylı ürün kataloğunu cihazınıza indirebilir veya yeni sekmede inceleyebilirsiniz.</p>
          <div class="flex gap-3">
            <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-soft">Sekmede Görüntüle</a>
            <a href="${pdfUrl}" download class="btn btn-primary">PDF İndir</a>
          </div>
        </div>
      `;
    }

    async function renderPage(n) {
      if (n < 1 || n > numPages || rendering) return;
      rendering = true;
      pageNum = n;
      currNumEl.textContent = String(n);

      prevBtn.disabled = n <= 1;
      nextBtn.disabled = n >= numPages;

      // Update thumbs active state
      thumbsEl.querySelectorAll(".pdf-thumb-btn").forEach((t, idx) => {
        t.classList.toggle("active", idx + 1 === n);
        if (idx + 1 === n) t.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });

      if (pageCache.has(n)) {
        pageImg.src = pageCache.get(n);
        rendering = false;
        return;
      }

      try {
        const page = await pdfDoc.getPage(n);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        pageCache.set(n, dataUrl);
        pageImg.src = dataUrl;
      } catch (e) {
        console.error("Page render error:", e);
      } finally {
        rendering = false;
      }
    }

    function changePage(delta) {
      const next = pageNum + delta;
      if (next >= 1 && next <= numPages) {
        renderPage(next);
      }
    }

    function renderThumbnails(container) {
      container.innerHTML = "";
      for (let i = 1; i <= numPages; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `pdf-thumb-btn ${i === 1 ? "active" : ""}`;
        btn.innerHTML = `<span>${i}</span>`;
        btn.addEventListener("click", () => renderPage(i));
        container.appendChild(btn);

        // Render thumb preview in background
        pdfDoc.getPage(i).then(page => {
          const viewport = page.getViewport({ scale: 0.25 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise.then(() => {
            btn.innerHTML = `<img src="${canvas.toDataURL("image/jpeg", 0.6)}" alt="Sayfa ${i}"/>`;
          });
        }).catch(() => {});
      }
    }
  }

  window.CatalogPdf = { init: initPdfViewer };
})();
