(function () {
  const BASE = (window.KAYRA_API_BASE) ? window.KAYRA_API_BASE : "/api";
  const tokenKey = "kayrab-admin-token";

  async function req(path, opts = {}) {
    const url = BASE + path;
    const headers = Object.assign({}, opts.headers || {});
    if (opts.body && !(opts.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(opts.body);
    }
    const token = getAdminToken();
    if (token) headers["Authorization"] = "Bearer " + token;
    const res = await fetch(url, { method: opts.method || "GET", headers, body: opts.body, credentials: "include" });
    if (res.status === 204) return null;
    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await res.json() : await res.text();
    if (!res.ok) {
      const err = new Error((data && data.error) || ("HTTP " + res.status));
      err.status = res.status; err.data = data;
      throw err;
    }
    return data;
  }

  function getAdminToken() { try { return localStorage.getItem(tokenKey); } catch { return null; } }
  function setAdminToken(t) { try { if (t) localStorage.setItem(tokenKey, t); else localStorage.removeItem(tokenKey); } catch {} }
  function clearAdminToken() { setAdminToken(null); }

  const api = {
    products: () => req("/products").catch(() => null),
    product: (slug) => req("/products/" + encodeURIComponent(slug)).catch(() => null),
    projects: (cat) => req("/projects" + (cat ? "?category=" + encodeURIComponent(cat) : "")).catch(() => null),
    project: (slug) => req("/projects/" + encodeURIComponent(slug)).catch(() => null),
    references: () => req("/references").catch(() => null),
    settings: () => req("/settings").catch(() => null),
    contact: (payload) => req("/contact", { method: "POST", body: payload }),
    visit: (payload) => req("/visits", { method: "POST", body: payload }),
    admin: {
      login: (email, password) => req("/admin/login", { method: "POST", body: { email, password } }),
      me: () => req("/admin/me"),
    },
    _token: { get: getAdminToken, set: setAdminToken, clear: clearAdminToken },
  };
  window.API = api;
})();