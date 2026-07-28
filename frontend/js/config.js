(function () {
  const isDev = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  window.KAYRA_API_BASE = isDev ? "http://localhost:5281/api" : "/api";
  window.KAYRA_BACKEND_BASE = isDev ? "http://localhost:5281" : "";

  /**
   * Resolve asset URLs that are relative to the backend.
   * Uploaded images come back as "/uploads/xxx.png" or "/docs/xxx.pdf"
   * which only exist on the .NET backend server.
   * This helper prepends the backend origin when needed.
   */
  window.resolveUrl = function (url) {
    if (!url) return "";
    // Already absolute — leave it
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
    // Static frontend assets (start with /images/) — no change needed
    if (url.startsWith("/images/") || url.startsWith("/css/") || url.startsWith("/js/")) return url;
    // Backend-hosted assets
    if (url.startsWith("/uploads/") || url.startsWith("/docs/") || url.startsWith("/api/")) {
      return window.KAYRA_BACKEND_BASE + url;
    }
    // Fallback — prepend backend base for any other absolute path from the API
    if (url.startsWith("/")) return window.KAYRA_BACKEND_BASE + url;
    return url;
  };
})();
