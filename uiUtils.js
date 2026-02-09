// uiUtils.js
// UI helpers for TRIBERIUM MVP

// -------------------------------
// Toast notifications
// -------------------------------
export function showToast(message, duration = 3000) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => document.body.removeChild(toast), 300);
  }, duration);
}

// -------------------------------
// Loader show/hide
// -------------------------------
export function showLoader(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const loader = document.createElement("div");
  loader.className = "loader";
  container.appendChild(loader);
}

export function hideLoader(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const loader = container.querySelector(".loader");
  if (loader) container.removeChild(loader);
}

// -------------------------------
// Modal popup
// -------------------------------
export function showModal(contentHTML) {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.innerHTML = `
    <div class="modal-content">
      ${contentHTML}
      <button class="close-modal">Close</button>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  modalOverlay.querySelector(".close-modal").addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });
               }
