// js/navigationModule.js
window.navigateTo = function(page) {
  const routes = {
    home: "home.html",
    profile: "profile.html",
    admin: "admin.html",
    wallet: "wallet.html"
  };
  if (routes[page]) window.location.href = routes[page];
};
