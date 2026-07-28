(async function () {
  let chart = null;
  const daysSel = document.getElementById("days");

  async function load() {
    const days = parseInt(daysSel.value || "30");
    try {
      const s = await AdminAPI.visits.stats(days);
      const ctx = document.getElementById("chart-day");
      const labels = (s.byDay || []).map(x => x.date.slice(5));
      const data = (s.byDay || []).map(x => x.count);
      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: "line",
        data: { labels, datasets: [{ label: "Ziyaret", data, borderColor: "#d4a849", backgroundColor: "rgba(212,168,73,.15)", tension: .35, fill: true }] },
        options: { responsive: true, maintainAspectRatio: true, aspectRatio: 3, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: "#999", maxTicksLimit: 10 } }, y: { ticks: { color: "#999" }, beginAtZero: true } } }
      });
      document.getElementById("by-path").innerHTML = `<table style="width:100%"><tbody>${(s.byPath||[]).map(p => `<tr><td>${UI.escapeHtml(p.path)}</td><td style="text-align:right">${p.count}</td></tr>`).join("") || `<tr><td class="empty">Veri yok</td></tr>`}</tbody></table>`;
      document.getElementById("by-dev").innerHTML = `<table style="width:100%"><tbody>
        ${(s.byDevice||[]).map(d => `<tr><td>${UI.escapeHtml(d.device)}</td><td style="text-align:right">${d.count}</td></tr>`).join("")}
        <tr><td colspan="2" style="padding-top:1rem;border-top:1px solid var(--border)"></td></tr>
        ${(s.byBrowser||[]).map(b => `<tr><td>${UI.escapeHtml(b.browser)}</td><td style="text-align:right">${b.count}</td></tr>`).join("")}
      </tbody></table>`;
    } catch (e) { Toast.show("Hata: " + e.message, "err"); }
  }
  daysSel.addEventListener("change", load);
  document.addEventListener("app-ready", load);
})();