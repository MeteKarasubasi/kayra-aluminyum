(function () {
  function phoneField(currentValue, lang) {
    const initial = parseValue(currentValue);
    const c = initial.country;
    return `<div class="phone-field" id="phone-wrap">
      <div class="phone-country">
        <button type="button" class="phone-country-btn" id="phone-country-btn">
          <span class="flag">${c.flag}</span><span class="dial">+${c.dial}</span>
          <span style="font-size:.7rem;color:var(--muted)">▼</span>
        </button>
        <div class="phone-dropdown hidden" id="phone-dropdown">
          <div class="phone-search">
            <span style="font-size:.85rem;color:var(--muted)">🔍</span>
            <input type="text" id="phone-search" placeholder="${I18N.t("contact.phone.search")}"/>
          </div>
          <ul class="phone-list" id="phone-list"></ul>
        </div>
      </div>
      <input type="tel" class="phone-national" id="phone-national" autocomplete="tel-national"
        value="${initial.national ? Countries.formatNational(initial.national, c) : ""}"
        placeholder="${I18N.t("contact.phone.placeholder")}"/>
      <input type="hidden" id="phone-output" value="${currentValue || ""}"/>
    </div>`;
  }

  function parseValue(value) {
    const trimmed = (value || "").trim();
    if (!trimmed) return { country: Countries.DEFAULT_COUNTRY, national: "" };
    const m = trimmed.match(/^\+?(\d+)\s*(.*)$/);
    if (!m) return { country: Countries.DEFAULT_COUNTRY, national: "" };
    const dial = m[1], rest = m[2];
    const exact = Countries.COUNTRIES.find(c => c.dial === dial);
    if (exact) return { country: exact, national: rest.replace(/\D/g, "") };
    const prefix = Countries.COUNTRIES.filter(c => dial.startsWith(c.dial)).sort((a, b) => b.dial.length - a.dial.length)[0];
    if (prefix) return { country: prefix, national: (dial.slice(prefix.dial.length) + rest.replace(/\D/g, "")) };
    return { country: Countries.DEFAULT_COUNTRY, national: dial + rest.replace(/\D/g, "") };
  }

  function bind(container) {
    const wrap = container.querySelector("#phone-wrap");
    if (!wrap) return;
    const btn = wrap.querySelector("#phone-country-btn");
    const dropdown = wrap.querySelector("#phone-dropdown");
    const searchInput = wrap.querySelector("#phone-search");
    const list = wrap.querySelector("#phone-list");
    const national = wrap.querySelector("#phone-national");
    const output = wrap.querySelector("#phone-output");
    const lang = (window.I18N && I18N.getLang()) || "tr";

    let country = parseValue(output.value).country;

    function renderList(filter) {
      const q = (filter || "").trim().toLowerCase();
      const items = !q ? Countries.COUNTRIES : Countries.COUNTRIES.filter(c =>
        c.name.tr.toLowerCase().includes(q) || c.name.en.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q));
      list.innerHTML = items.length === 0
        ? `<li style="padding:1rem;text-align:center;color:var(--muted)">${I18N.t("contact.phone.empty")}</li>`
        : items.map(c => `<li><button type="button" data-code="${c.code}" class="${c.code === country.code ? "active" : ""}">
            <span class="flag">${c.flag}</span><span class="name">${c.name[lang]}</span><span class="dial">+${c.dial}</span>
          </button></li>`).join("");
      list.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
        country = Countries.findCountryByCode(b.dataset.code);
        btn.querySelector(".flag").textContent = country.flag;
        btn.querySelector(".dial").textContent = "+" + country.dial;
        dropdown.classList.add("hidden");
        updateOutput();
      }));
    }

    btn.addEventListener("click", () => { dropdown.classList.toggle("hidden"); if (!dropdown.classList.contains("hidden")) { searchInput.value = ""; renderList(""); searchInput.focus(); } });
    searchInput.addEventListener("input", () => renderList(searchInput.value));
    document.addEventListener("mousedown", (e) => { if (!wrap.contains(e.target)) dropdown.classList.add("hidden"); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") dropdown.classList.add("hidden"); });

    national.addEventListener("input", () => {
      const digits = national.value.replace(/\D/g, "").slice(0, 15);
      national.value = digits ? Countries.formatNational(digits, country) : "";
      updateOutput();
    });

    function updateOutput() {
      const digits = national.value.replace(/\D/g, "");
      output.value = digits ? "+" + country.dial + " " + Countries.formatNational(digits, country) : "";
    }
  }

  window.PhoneInput = { field: phoneField, bind };
})();