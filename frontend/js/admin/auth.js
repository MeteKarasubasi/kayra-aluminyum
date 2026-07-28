(function () {
  function requireAuth() {
    const token = AdminAPI.getToken();
    if (!token) { location.href = "/admin/login.html"; return false; }
    return true;
  }

  async function bootstrap() {
    if (!requireAuth()) return;
    try {
      const me = await AdminAPI.me();
      const user = AdminAPI.getUser() || me;
      renderUser(user || me);
    } catch (ex) {
      if (ex && ex.status === 401) { AdminAPI.clearToken(); location.href = "/admin/login.html"; return; }
      Toast.show("Oturum doğrulanamadı: " + (ex.message || "hata"), "err");
      return;
    }
    renderSidebar();
    bindBurger();
    bindLogout();
    pollUnread();
  }

  async function pollUnread() {
    const update = async () => {
      try {
        const stats = await AdminAPI.stats();
        const badge = document.getElementById("unread-badge");
        if (!badge) return;
        const n = stats.unreadMessages || 0;
        badge.textContent = n;
        badge.classList.toggle("hidden", n === 0);
      } catch {}
    };
    update();
    setInterval(update, 30000);
  }

  function renderUser(user) {
    const initial = (user.name || user.email || "?").charAt(0).toUpperCase();
    document.querySelectorAll("[data-user-name]").forEach(el => el.textContent = user.name || user.email);
    document.querySelectorAll("[data-user-initial]").forEach(el => el.textContent = initial);
    document.querySelectorAll("[data-user-email]").forEach(el => el.textContent = user.email);
  }

  function renderSidebar() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-item").forEach(a => {
      const href = a.getAttribute("href") || "";
      const target = href.split("/").pop();
      a.classList.toggle("active", target === path);
    });
  }

  function bindBurger() {
    const burger = document.querySelector(".burger");
    const sidebar = document.querySelector(".sidebar");
    if (burger && sidebar) burger.addEventListener("click", () => sidebar.classList.toggle("open"));
  }

  function bindLogout() {
    document.querySelectorAll("[data-logout]").forEach(b => b.addEventListener("click", (e) => {
      e.preventDefault(); AdminAPI.logout();
    }));
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
  window.Auth = { bootstrap, requireAuth };
})();