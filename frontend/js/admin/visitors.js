(async function () {
  const tbody = document.querySelector("#table tbody");
  const daysSel = document.getElementById("days");
  const PER_PAGE = 25;
  let curPage = 0;
  let total = 0;

  async function load() {
    const days = parseInt(daysSel.value || "30");
    try {
      const stats = await AdminAPI.visits.stats(days);
      document.getElementById("summary").innerHTML = `
        <div class="stat-card"><div class="label">Toplam Ziyaret</div><div class="value primary">${stats.total}</div></div>
        <div class="stat-card"><div class="label">Bot</div><div class="value">${stats.bots}</div></div>
        <div class="stat-card"><div class="label">Cihaz</div><div class="value text-sm">${(stats.byDevice||[]).map(d => `${UI.escapeHtml(d.device)}: ${d.count}`).join(", ")}</div></div>
        <div class="stat-card"><div class="label">Tarayıcı</div><div class="value text-sm">${(stats.byBrowser||[]).map(b => `${UI.escapeHtml(b.browser)}: ${b.count}`).join(", ")}</div></div>`;

      const res = await AdminAPI.visits.list(days, PER_PAGE, curPage * PER_PAGE);
      const visits = (res && res.items) ? res.items : (Array.isArray(res) ? res : []);
      total = (res && res.total) ? res.total : visits.length;
      tbody.innerHTML = visits.map(v => `<tr>
        <td>${UI.escapeHtml(v.path)}</td>
        <td class="text-xs text-muted">${UI.escapeHtml(v.ip || "—")}</td>
        <td>${UI.escapeHtml(v.device || "unknown")}</td>
        <td>${UI.escapeHtml(v.browser || "other")}</td>
        <td>${v.isBot ? '<span class="pill danger">bot</span>' : '<span class="pill muted">hayır</span>'}</td>
        <td class="text-xs text-muted">${UI.fmtDate(v.createdAt)}</td>
      </tr>`).join("") || `<tr><td colspan="6" class="empty">Kayıt yok</td></tr>`;
      renderPager();
    } catch (e) { Toast.show("Hata: " + e.message, "err"); }
  }

  function renderPager() {
    let pager = document.getElementById("visits-pager");
    if (!pager) {
      pager = document.createElement("div");
      pager.id = "visits-pager";
      pager.className = "pager";
      document.querySelector("#table").closest(".card").appendChild(pager);
    }
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (pages <= 1) { pager.innerHTML = `<span class="pager-info">${total} kayıt</span>`; return; }
    const btn = (label, disabled, page) => `<button class="btn btn-soft btn-sm" ${disabled ? "disabled" : ""} data-page="${page}">${label}</button>`;
    pager.innerHTML = `<span class="pager-info">${total} kayıt — Sayfa ${curPage+1}/${pages}</span>
      <div class="flex gap-2">${btn("‹ Önceki", curPage === 0, curPage - 1)}${btn("Sonraki ›", curPage >= pages - 1, curPage + 1)}</div>`;
    pager.querySelectorAll("button[data-page]").forEach(b => b.addEventListener("click", () => {
      curPage = parseInt(b.dataset.page);
      load();
    }));
  }

  daysSel.addEventListener("change", () => { curPage = 0; load(); });
  document.addEventListener("app-ready", load);
})();
