(function () {
  const partialCache = {};

  async function loadPartial(url) {
    if (partialCache[url]) return partialCache[url];
    const res = await fetch(url);
    if (!res.ok) throw new Error("Partial load failed: " + url);
    const html = await res.text();
    partialCache[url] = html;
    return html;
  }

  async function mountPartials() {
    const slots = document.querySelectorAll("[data-include]");
    await Promise.all(Array.from(slots).map(async (slot) => {
      const url = slot.getAttribute("data-include");
      try {
        const html = await loadPartial(url);
        slot.innerHTML = html;
        const tmp = slot;
        tmp.querySelectorAll("script").forEach(old => { const s = document.createElement("script"); s.textContent = old.textContent; old.replaceWith(s); });
      } catch (e) { console.warn(e); }
    }));
    if (window.I18N) I18N.apply();
    initNavbar();
    initLangToggle();
  }

  function initNavbar() {
    const bar = document.getElementById("navbar-bar");
    if (bar) {
      const onScroll = () => {
        const s = window.scrollY > 12;
        bar.style.backgroundColor = s ? "oklch(0.17 0.004 60 / 0.85)" : "oklch(0.17 0.004 60 / 0)";
        bar.style.borderColor = s ? "oklch(1 0 0 / 0.09)" : "transparent";
        bar.style.boxShadow = s ? "0 8px 30px rgba(0,0,0,.2)" : "none";
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    const burger = document.getElementById("nav-burger");
    const menu = document.getElementById("mobile-menu");
    if (burger && menu) {
      burger.addEventListener("click", () => {
        const open = menu.classList.toggle("hidden");
        burger.setAttribute("aria-expanded", String(!open));
      });
      menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.add("hidden")));
    }
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const norm = (h) => h.replace(/\/+$/, "") || "/";
    document.querySelectorAll(".nav-link, .mobile-link").forEach(a => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) return;
      const h = norm(href);
      const active = h === "/" ? path === "/" : path === h || path.startsWith(h + "/");
      a.classList.toggle("active", active);
      if (active && a.classList.contains("nav-link")) {
        a.classList.remove("text-muted-foreground", "hover:text-foreground");
        a.classList.add("text-foreground");
      }
    });
  }

  function initLangToggle() {
    const setPill = () => {
      const lang = (window.I18N && I18N.getLang()) || "tr";
      document.querySelectorAll(".lang-btn").forEach(b => {
        const on = b.dataset.lang === lang;
        b.classList.toggle("text-primary-foreground", on);
        b.classList.toggle("text-muted-foreground", !on);
        b.classList.toggle("hover:text-foreground", !on);
        if (on && !b.querySelector(".lang-pill")) {
          const pill = document.createElement("span");
          pill.className = "lang-pill absolute inset-0 -z-10 rounded-full bg-primary";
          b.insertBefore(pill, b.firstChild);
        } else if (!on) {
          const pill = b.querySelector(".lang-pill");
          if (pill) pill.remove();
        }
      });
    };
    document.querySelectorAll(".lang-btn").forEach(b => {
      b.addEventListener("click", () => I18N.setLang(b.dataset.lang));
    });
    setPill();
    document.addEventListener("langchange", setPill);
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.05, rootMargin: "0px 0px -5% 0px" });
    els.forEach(e => io.observe(e));
    setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach(e => e.classList.add("in")), 2500);
  }

  function initVisitTracker() {
    try {
      if (window.API && API.visit) {
        API.visit({ path: location.pathname + location.search, referrer: document.referrer || null, language: (I18N && I18N.getLang()) || null }).catch(() => {});
      }
    } catch {}
  }

  function mergeProducts(api, fallback) {
    if (api && api.length) return api;
    return fallback;
  }

  function makeImagesUndraggable(root = document) {
    root.querySelectorAll("img").forEach(img => { img.setAttribute("draggable", "false"); img.style.webkitUserDrag = "none"; });
  }
  function observeImages() {
    makeImagesUndraggable();
    if (!("MutationObserver" in window)) return;
    new MutationObserver(mutations => {
      let changed = false;
      mutations.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) changed = true; }));
      if (changed) makeImagesUndraggable();
    }).observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await mountPartials();
    observeImages();
    initReveal();
    initVisitTracker();
    initFooter();
    document.dispatchEvent(new CustomEvent("app-ready"));
  });

  async function initFooter() {
    const socialEl = document.getElementById("footer-social");
    const prodsEl = document.getElementById("footer-products");
    const yearEl = document.getElementById("footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (prodsEl) {
      const prods = (window.DATA ? DATA.products : []);
      prodsEl.innerHTML = prods.map(p => {
        const title = I18N.getLang() === "en" ? (p.titleEn || p.titleTr) : (p.titleTr || p.titleEn);
        return `<li><a href="/urunler.html#${p.slug}" class="transition-colors hover:text-primary">${title}</a></li>`;
      }).join("");
    }
    let settings = null;
    try { settings = await API.settings(); } catch {}
    if (settings) {
      const lang = (window.I18N && I18N.getLang()) || "tr";
      const siteTitle = (settings.site_title || "KAYRAB ALUMINYUM").split("|")[0].trim();
      const stEl = document.getElementById("footer-site-title"); if (stEl) stEl.textContent = siteTitle;
      const st2 = document.getElementById("footer-site-title-2"); if (st2) st2.textContent = siteTitle;
      const addrEl = document.getElementById("footer-address");
      if (addrEl) addrEl.textContent = settings[lang === "tr" ? "address_tr" : "address_en"] || addrEl.textContent;
      const phEl = document.getElementById("footer-phone");
      if (phEl && settings.phone) { phEl.textContent = settings.phone; phEl.href = "tel:" + settings.phone.replace(/\s+/g, ""); }
      const emEl = document.getElementById("footer-email");
      if (emEl && settings.email) { emEl.textContent = settings.email; emEl.href = "mailto:" + settings.email; }
      if (socialEl) {
        const socials = [
          { key: "instagram", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>' },
          { key: "linkedin", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-10h4v1.5"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>' },
          { key: "facebook", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
          { key: "youtube", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>' },
        ];
        socialEl.innerHTML = socials.filter(s => settings[s.key]).map(s => `<a href="${settings[s.key]}" target="_blank" rel="noopener noreferrer" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Sosyal link">${s.svg}</a>`).join("");
      }
    }
  }

  window.App = { loadPartial, initReveal, mergeProducts, initFooter };
})();