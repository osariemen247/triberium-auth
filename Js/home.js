/* =====================================================
   TRIBERIUM — HOME MODULE
   Production Ready Navigation Controller
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     DOM REFERENCES
  ===================================================== */
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const themeToggle = document.getElementById("themeToggle");
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const confirmLogout = document.getElementById("confirmLogout");
  const cancelLogout = document.getElementById("cancelLogout");

  const sidebarButtons = sidebar.querySelectorAll("button[data-route]");
  const bottomNavButtons = document.querySelectorAll(".nav button[data-route]");

  /* =====================================================
     ROUTE CONFIGURATION
     Centralized Route Mapping (Scalable)
  ===================================================== */
  const BASE_PATH = "/triberium-auth/";

  const routes = {
    home: "home.html",
    profile: "profile.html",
    metrics: "metrics.html",
    news: "news.html",
    zytherion: "zytherion.html",
    livestream: "livestream.html",
    saved: "saved.html",
    wallet: "wallet.html",
    settings: "settings.html",
    tribe: "tribe.html",
    chat: "chat.html",
    notifications: "notifications.html"
  };

  /* =====================================================
     NAVIGATION HANDLER
  ===================================================== */
  function navigate(routeKey) {
    if (!routes[routeKey]) {
      console.warn(`Route not found: ${routeKey}`);
      return;
    }

    window.location.href = BASE_PATH + routes[routeKey];
  }

  /* =====================================================
     SIDEBAR TOGGLE
  ===================================================== */
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  /* =====================================================
     SIDEBAR ROUTES
  ===================================================== */
  sidebarButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const route = btn.dataset.route;
      sidebar.classList.remove("active");
      navigate(route);
    });
  });

  /* =====================================================
     BOTTOM NAV ROUTES
  ===================================================== */
  bottomNavButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const route = btn.dataset.route;

      bottomNavButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      navigate(route);
    });
  });

  /* =====================================================
     THEME TOGGLE
  ===================================================== */
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const body = document.body;
      const newTheme = body.dataset.theme === "light" ? "dark" : "light";
      body.dataset.theme = newTheme;
      themeToggle.textContent = newTheme === "light" ? "🌙" : "☀️";
      localStorage.setItem("triberium-theme", newTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem("triberium-theme");
    if (savedTheme) {
      document.body.dataset.theme = savedTheme;
      themeToggle.textContent = savedTheme === "light" ? "🌙" : "☀️";
    }
  }

  /* =====================================================
     LOGOUT MODAL
  ===================================================== */
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logoutModal.style.display = "flex";
    });
  }

  if (cancelLogout) {
    cancelLogout.addEventListener("click", () => {
      logoutModal.style.display = "none";
    });
  }

  // Logout confirmation is still handled by Firebase inline module
  // We only manage UI state here

});
