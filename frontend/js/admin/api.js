(function () {
  window.KAYRA_API_BASE = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "http://localhost:5281/api" : "/api";

  const tokenKey = "kayrab-admin-token";
  const userKey = "kayrab-admin-user";

  function getToken() { try { return localStorage.getItem(tokenKey); } catch { return null; } }
  function setToken(t, user) {
    try { if (t) { localStorage.setItem(tokenKey, t); if (user) localStorage.setItem(userKey, JSON.stringify(user)); } }
    catch {}
  }
  function clearToken() { try { localStorage.removeItem(tokenKey); localStorage.removeItem(userKey); } catch {} }
  function getUser() { try { return JSON.parse(localStorage.getItem(userKey) || "null"); } catch { return null; } }

  async function req(path, opts = {}) {
    const headers = Object.assign({}, opts.headers || {});
    if (opts.body && !(opts.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(opts.body);
    }
    const token = getToken();
    if (token) headers["Authorization"] = "Bearer " + token;
    let res;
    try {
      res = await fetch(window.KAYRA_API_BASE + path, {
        method: opts.method || "GET", headers, body: opts.body, credentials: "include"
      });
    } catch (netErr) {
      const e = new Error("Sunucuya bağlanılamadı — backend çalışıyor mu?");
      e.cause = netErr;
      e.network = true;
      throw e;
    }
    if (res.status === 401) { clearToken(); if (!opts._noRedirect) location.href = "/admin/login.html"; throw new Error("Unauthorized"); }
    if (res.status === 403) { if (!opts._noRedirect) location.href = "/admin/login.html"; throw new Error("Forbidden"); }
    if (res.status === 204) return null;
    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await res.json() : await res.text();
    if (!res.ok) { const err = new Error((data && data.error) || ("HTTP " + res.status)); err.status = res.status; err.data = data; throw err; }
    return data;
  }

  function upload(file, type) {
    const fd = new FormData(); fd.append("file", file);
    return req("/admin/upload?type=" + (type || "image"), { method: "POST", body: fd });
  }

  window.AdminAPI = {
    getToken, setToken, clearToken, getUser, req, upload,
    login: (email, password) => req("/admin/login", { method: "POST", body: { email, password }, _noRedirect: true }),
    me: () => req("/admin/me"),
    logout() { clearToken(); location.href = "/admin/login.html"; },
    projects: { list: () => req("/admin/projects"), get: (id) => req("/admin/projects/" + id),
      create: (b) => req("/admin/projects", { method: "POST", body: b }),
      update: (id, b) => req("/admin/projects/" + id, { method: "PUT", body: b }),
      remove: (id) => req("/admin/projects/" + id, { method: "DELETE" }) },
    products: { list: () => req("/admin/products"), get: (id) => req("/admin/products/" + id),
      create: (b) => req("/admin/products", { method: "POST", body: b }),
      update: (id, b) => req("/admin/products/" + id, { method: "PUT", body: b }),
      remove: (id) => req("/admin/products/" + id, { method: "DELETE" }) },
    references: { list: () => req("/admin/references"),
      create: (b) => req("/admin/references", { method: "POST", body: b }),
      update: (id, b) => req("/admin/references/" + id, { method: "PUT", body: b }),
      remove: (id) => req("/admin/references/" + id, { method: "DELETE" }) },
    messages: { list: (unread) => req("/admin/messages" + (unread ? "?unread=true" : "")),
      patch: (id, b) => req("/admin/messages/" + id, { method: "PATCH", body: b }),
      remove: (id) => req("/admin/messages/" + id, { method: "DELETE" }) },
    users: { list: () => req("/admin/users"),
      create: (b) => req("/admin/users", { method: "POST", body: b }),
      update: (id, b) => req("/admin/users/" + id, { method: "PUT", body: b }),
      remove: (id) => req("/admin/users/" + id, { method: "DELETE" }) },
    settings: { get: () => req("/admin/settings"), update: (b) => req("/admin/settings", { method: "PUT", body: b }) },
    stats: () => req("/admin/stats"),
    visits: { list: (days, limit, offset) => req("/admin/visits?days=" + (days || 30) + "&limit=" + (limit || 25) + "&offset=" + (offset || 0)),
      stats: (days) => req("/admin/visits/stats?days=" + (days || 30)) },
    cache: { clear: () => req("/admin/cache/clear", { method: "POST" }) },
  };
})();