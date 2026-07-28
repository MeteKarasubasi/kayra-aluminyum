(function () {
  async function render() {
    const slug = window.PROJECT_SLUG;
    const lang = I18N.getLang();
    const api = await API.project(slug);
    const p = api || DATA.projects.find(x => x.slug === slug);
    const el = document.getElementById("detail");
    if (!p) { el.innerHTML = `<p class="text-muted-foreground p-8">${I18N.t("project.notfound")}</p>`; return; }
    document.title = p.title + " | KAYRAB Aluminyum";

    const allProjects = (await API.projects()) || DATA.projects;
    const otherProjects = allProjects.filter(x => x.slug !== slug).slice(0, 3);
    const relatedProducts = (p.products || []).map(s => DATA.products.find(x => x.slug === s)).filter(Boolean);

    const catLabel = I18N.t("projects.filter." + (p.category || "all"));
    const heroImg = resolveUrl(p.image);
    const infoItems = [
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>', label: I18N.t("project.location"), value: p.location },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>', label: I18N.t("project.area"), value: p.area },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', label: I18N.t("project.year"), value: p.year },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg>', label: I18N.t("project.category"), value: catLabel },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>', label: I18N.t("project.client"), value: p.client },
    ].filter(it => it.value);

    const galleryHtml = (p.gallery && p.gallery.length)
      ? `<div class="pd-gallery reveal">
          <h2 class="font-display text-2xl font-bold tracking-tight" data-i18n="project.gallery">Proje Galerisi</h2>
          <div class="pd-gallery-grid mt-6">
            ${p.gallery.map((g, i) => `<div class="pd-gallery-item reveal" style="transition-delay:${i*0.1}s"><img src="${resolveUrl(g)}" alt="${p.title} - ${i+1}" loading="lazy" draggable="false"/></div>`).join("")}
          </div>
        </div>` : "";

    const productsHtml = relatedProducts.length
      ? `<div class="pd-products reveal">
          <h2 class="font-display text-2xl font-bold tracking-tight" data-i18n="project.products">Kullanılan Sistemler</h2>
          <div class="pd-products-grid mt-6">
            ${relatedProducts.map(prod => {
              const pTitle = lang === "en" ? (prod.titleEn || prod.titleTr) : (prod.titleTr || prod.titleEn);
              const pDesc = lang === "en" ? (prod.descEn || prod.descTr) : (prod.descTr || prod.descEn);
              return `<a class="pd-product-card" href="/urunler.html#${prod.slug}">
                <div class="img"><img src="${resolveUrl(prod.image)}" alt="${pTitle}" draggable="false"/></div>
                <div><h3>${pTitle}</h3><p>${pDesc}</p></div>
              </a>`;
            }).join("")}
          </div>
        </div>` : "";

    const othersHtml = otherProjects.map(o => `
      <a class="reveal" href="/projeler/${o.slug}.html">
        <div class="group">
          <article class="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
            <img src="${resolveUrl(o.image)}" alt="${o.title}" class="h-full w-full object-cover transition-transform duration-700 ease-out will-transform group-hover:scale-110" loading="lazy" draggable="false"/>
            <div class="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent"></div>
            <span class="absolute left-4 top-4 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold tracking-wide text-primary backdrop-blur">${I18N.t("projects.filter." + (o.category || "all"))}</span>
            <div class="absolute inset-x-0 bottom-0 p-5"><h3 class="font-display text-xl font-bold tracking-tight text-foreground">${o.title}</h3><p class="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5 text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${o.location}</p></div>
          </article>
        </div>
      </a>`).join("");

    el.innerHTML = `
      <section class="project-hero">
        <img src="${heroImg}" alt="${p.title}" draggable="false"/>
        <div class="pg-overlay"></div>
        <div class="pg-content">
          <a class="pg-back" href="/projeler.html">← <span data-i18n="project.back">Projelere Dön</span></a>
          <h1>${p.title}</h1>
          <p class="pg-loc">${p.location}</p>
        </div>
      </section>
      <div class="project-detail-wrap">
        <div class="project-detail-grid">
          <div>
            ${p.description ? `<div class="pd-section reveal"><h2 data-i18n="project.description">Proje Detayı</h2><p>${p.description}</p></div>` : ""}
            ${galleryHtml}
            ${productsHtml}
          </div>
          <div>
            <div class="pd-sidebar reveal">
              <div class="pd-info-card">
                <h2 data-i18n="project.info">Proje Bilgileri</h2>
                <div class="pd-info-list">
                  ${infoItems.map(it => `
                    <div class="pd-info-item">
                      <span class="icon">${it.icon}</span>
                      <div><p class="label">${it.label}</p><p class="value">${it.value}</p></div>
                    </div>`).join("")}
                </div>
                <a class="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95" href="/iletisim.html" data-i18n="cta.quote">Teklif Al</a>
              </div>
            </div>
          </div>
        </div>
        <div class="pd-others reveal">
          <h2 data-i18n="project.others">Diğer Projeler</h2>
          <div class="pd-others-grid">${othersHtml}</div>
        </div>
      </div>`;
    I18N.apply();
    App.initReveal();
  }
  document.addEventListener("app-ready", render);
  document.addEventListener("langchange", render);
})();
