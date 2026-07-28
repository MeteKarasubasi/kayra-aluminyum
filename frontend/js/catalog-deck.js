(function () {
  let index = 0;
  let items = [];
  let deckEl, titleEl, counterEl, dotsEl;

  function render(products, mount) {
    items = products;
    if (!items.length) { mount.innerHTML = ""; return; }
    index = 0;
    mount.innerHTML = `
      <div class="catalog-active-title" id="catalog-title"></div>
      <div class="catalog-deck" id="catalog-deck"></div>
      <div class="catalog-controls">
        <button class="catalog-arrow" id="catalog-prev" aria-label="Önceki">‹</button>
        <div class="catalog-dots" id="catalog-dots"></div>
        <span class="catalog-counter" id="catalog-counter"></span>
        <button class="catalog-arrow" id="catalog-next" aria-label="Sonraki">›</button>
      </div>`;
    deckEl = mount.querySelector("#catalog-deck");
    titleEl = mount.querySelector("#catalog-title");
    counterEl = mount.querySelector("#catalog-counter");
    dotsEl = mount.querySelector("#catalog-dots");

    const lang = (window.I18N && I18N.getLang()) || "tr";

    deckEl.innerHTML = items.map((p, i) => {
      const img = resolveUrl(p.image);
      const title = lang === "en" ? (p.titleEn || p.titleTr) : (p.titleTr || p.titleEn);
      const desc = lang === "en" ? (p.descEn || p.descTr) : (p.descTr || p.descEn);
      return `
      <div class="catalog-card" data-i="${i}">
        <div class="cc-img-wrap">
          <img src="${img}" alt="${title}"/>
          <div class="cc-img-overlay"></div>
        </div>
        <div class="cc-body">
          <div class="cc-code">${p.code}</div>
          <h3 data-card-title="${i}">${title}</h3>
          <p class="cc-desc">${desc || ""}</p>
          <a class="cc-link" href="/urunler.html#${p.slug}" data-card-link="${i}"><span data-i18n="catalog.explore">İncele</span> →</a>
        </div>
      </div>`;
    }).join("");

    dotsEl.innerHTML = items.map((_, i) => `<button class="catalog-dot" data-i="${i}" aria-label="Sayfa ${i+1}"></button>`).join("");

    deckEl.querySelectorAll(".catalog-card").forEach((card, i) => {
      card.addEventListener("click", () => { if (i !== index) goTo(i); });
    });
    dotsEl.querySelectorAll(".catalog-dot").forEach((d, i) => d.addEventListener("click", () => goTo(i)));
    mount.querySelector("#catalog-prev").addEventListener("click", () => go(-1));
    mount.querySelector("#catalog-next").addEventListener("click", () => go(1));

    document.addEventListener("keydown", onKeyDown);
    bindDrag();

    update();
    applyLang();
  }

  function onKeyDown(e) {
    if (!deckEl) return;
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  }

  let dragStartX = null, dragging = false;
  function bindDrag() {
    if (!deckEl) return;
    deckEl.addEventListener("pointerdown", (e) => {
      dragStartX = e.clientX; dragging = true;
      deckEl.setPointerCapture(e.pointerId);
      deckEl.classList.add("dragging");
    });
    deckEl.addEventListener("pointerup", (e) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      dragging = false; deckEl.classList.remove("dragging");
      if (Math.abs(dx) > 90) go(dx < 0 ? 1 : -1);
      dragStartX = null;
    });
    deckEl.addEventListener("pointercancel", () => { dragging = false; deckEl.classList.remove("dragging"); dragStartX = null; });
  }

  function go(dir) { index = (index + dir + items.length) % items.length; update(); }
  function goTo(i) { index = (i + items.length) % items.length; update(); }

  function update() {
    if (!deckEl || !items.length) return;
    const cards = deckEl.querySelectorAll(".catalog-card");
    const deckW = deckEl.clientWidth || window.innerWidth;
    const stepX = Math.min(150, deckW * 0.14);
    cards.forEach((card, i) => {
      const pos = ((i - index) + items.length) % items.length;
      const offset = pos > items.length / 2 ? pos - items.length : pos;
      const abs = Math.abs(offset);
      const isActive = abs === 0;
      const x = offset * stepX;
      const z = -abs * 220;
      const rotY = offset * -18;
      const scale = isActive ? 1 : Math.max(0.62, 0.84 - (abs - 1) * 0.08);
      const opacity = abs > 2 ? 0 : isActive ? 1 : Math.max(0.25, 1 - abs * 0.28);
      const brightness = isActive ? 1 : 0.45;
      card.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = items.length - abs;
      card.style.filter = `brightness(${brightness})`;
      card.style.pointerEvents = abs > 2 ? "none" : "auto";
      card.classList.toggle("active-card", isActive);
    });
    const active = items[index];
    const lang = (window.I18N && I18N.getLang()) || "tr";
    const title = lang === "en" ? (active.titleEn || active.titleTr) : (active.titleTr || active.titleEn);
    titleEl.innerHTML = `<h3>${title}</h3><a href="/urunler.html#${active.slug}"><span data-i18n="catalog.explore">İncele</span> →</a>`;
    counterEl.innerHTML = `<span class="cc-num">${String(index + 1).padStart(2, "0")}</span><span>/</span><span>${String(items.length).padStart(2, "0")}</span>`;
    dotsEl.querySelectorAll(".catalog-dot").forEach((d, i) => d.classList.toggle("active", i === index));
    I18N.apply(titleEl);
  }

  function applyLang() {
    if (!deckEl) return;
    const lang = (window.I18N && I18N.getLang()) || "tr";
    deckEl.querySelectorAll("[data-card-title]").forEach(el => {
      const i = +el.dataset.cardTitle;
      const p = items[i]; if (!p) return;
      el.textContent = lang === "en" ? (p.titleEn || p.titleTr) : (p.titleTr || p.titleEn);
    });
    // Also update descriptions
    deckEl.querySelectorAll(".cc-desc").forEach((el, i) => {
      const p = items[i]; if (!p) return;
      el.textContent = lang === "en" ? (p.descEn || p.descTr) : (p.descTr || p.descEn);
    });
    update();
  }

  document.addEventListener("langchange", applyLang);
  window.CatalogDeck = { render };
})();
