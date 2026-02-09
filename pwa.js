// pwa.js

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/pwa/service-worker.js");
      console.log("Service Worker registered:", registration);

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // New update available
              alert("New version available! Refresh to update.");
            }
          }
        };
      };
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}

// Handle PWA install prompt
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show install button or banner in your UI
  const installBtn = document.getElementById("install-btn");
  if (installBtn) {
    installBtn.style.display = "block";
    installBtn.addEventListener("click", async () => {
      installBtn.style.display = "none";
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log("User choice:", choiceResult.outcome);
      deferredPrompt = null;
    });
  }
});

// Optional: Listen for appinstalled event
window.addEventListener("appinstalled", () => {
  console.log("PWA installed successfully!");
});