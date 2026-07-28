(function () {
  const HOTSPOTS = [
    { slug: "kis-bahcesi", x: 33, y: 58 },
    { slug: "aluminyum-dograma", x: 29, y: 32 },
    { slug: "bioklimatik-pergola", x: 54, y: 11 },
    { slug: "cam-balkon", x: 63, y: 36 },
    { slug: "giydirme-cephe", x: 91, y: 42 },
    { slug: "korkuluk", x: 52, y: 80 },
  ];

  let activeSlug = null;
  let container = null;

  function render(products, mount) {
    mount.innerHTML = `
      <div class="hotspots-wrap reveal">
        <div class="hotspots-frame" id="hotspots-frame">
          <img src="/images/system-solutions.jpeg" alt="Sistem Çözümleri" draggable="false"/>
          <div class="hotspots-vignette"></div>
          <div class="hotspots-hint"><span class="dot"></span><span data-i18n="hotspots.hint">Parlayan noktaların üzerine gelerek ürünlerimizi keşfedin</span></div>
          <div class="hotspots-layer" id="hotspots-layer"></div>
        </div>
      </div>`;
    container = mount.querySelector("#hotspots-frame");
    const layer = mount.querySelector("#hotspots-layer");
    layer.innerHTML = HOTSPOTS.map((h, i) => {
      const p = products.find(x => x.slug === h.slug);
      if (!p) return "";
      return `<div class="hotspot" style="left:${h.x}%;top:${h.y}%" data-slug="${h.slug}" data-x="${h.x}" data-y="${h.y}" data-index="${i}">
        <button class="point" type="button" aria-label="${p.titleTr}">
          <span class="halo" style="animation-delay:${i * 0.35}s"></span>
          <span class="ring" style="animation-delay:${i * 0.35}s"></span>
          <span class="core"></span>
        </button>
        <div class="bubble ${h.y < 30 ? 'down' : 'up'} ${h.x < 22 ? 'left' : h.x > 78 ? 'right' : 'center'}" data-bubble>
          <div class="bubble-card">
            <span class="bubble-caret"></span>
            <div class="bubble-media">
              <img src="${p.image}" alt="${p.titleTr}"/>
              <div class="overlay"></div>
              <span class="bubble-code">${p.code}</span>
            </div>
            <div class="bubble-body">
              <h4 data-product-title="${p.slug}">${p.titleTr}</h4>
              <p data-product-desc="${p.slug}">${p.descTr}</p>
              <a class="bubble-cta" href="/urunler.html#${p.slug}"><span data-i18n="products.detail">Detayları Gör</span> →</a>
            </div>
          </div>
        </div>
      </div>`;
    }).join("");

    layer.querySelectorAll(".hotspot").forEach(el => {
      const point = el.querySelector(".point");
      const bubble = el.querySelector("[data-bubble]");
      let closeTimer = null;
      const open = () => { clearTimeout(closeTimer); setActive(el.dataset.slug); };
      const scheduleClose = () => { clearTimeout(closeTimer); closeTimer = setTimeout(() => setActive(null), 140); };
      point.addEventListener("mouseenter", open);
      point.addEventListener("mouseleave", scheduleClose);
      point.addEventListener("click", (e) => { e.stopPropagation(); setActive(el.dataset.slug === activeSlug ? null : el.dataset.slug); });
      bubble.addEventListener("mouseenter", open);
      bubble.addEventListener("mouseleave", scheduleClose);
    });

    document.addEventListener("pointerdown", onOutsideClick);
    applyLang();
  }

  function onOutsideClick(e) {
    if (container && !container.contains(e.target)) setActive(null);
  }

  function setActive(slug) {
    activeSlug = slug;
    if (!container) return;
    container.querySelectorAll(".hotspot").forEach(el => {
      const isActive = el.dataset.slug === slug;
      el.classList.toggle("z-active", isActive);
      el.classList.toggle("active", isActive);
      const bubble = el.querySelector("[data-bubble]");
      if (bubble) bubble.style.display = isActive ? "block" : "none";
    });
  }

  function applyLang() {
    if (!container) return;
    const lang = (window.I18N && I18N.getLang()) || "tr";
    container.querySelectorAll("[data-product-title]").forEach(el => {
      const slug = el.dataset.productTitle;
      const p = (window.DATA ? DATA.products : []).find(x => x.slug === slug);
      if (p) el.textContent = lang === "en" ? (p.titleEn || p.titleTr) : (p.titleTr || p.titleEn);
    });
    container.querySelectorAll("[data-product-desc]").forEach(el => {
      const slug = el.dataset.productDesc;
      const p = (window.DATA ? DATA.products : []).find(x => x.slug === slug);
      if (p) el.textContent = lang === "en" ? (p.descEn || p.descTr) : (p.descTr || p.descEn);
    });
  }

  document.addEventListener("langchange", applyLang);
  window.Hotspots = { render };
})();