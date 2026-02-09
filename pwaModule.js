// pwaModule.js
// Handles PWA registration for TRIBERIUM MVP

export function registerPWA() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => {
          console.log("TRIBERIUM PWA registered");
        })
        .catch(err => {
          console.error("PWA registration failed", err);
        });
    });
  }
                            }
