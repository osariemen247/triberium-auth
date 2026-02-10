document.addEventListener("DOMContentLoaded", () => {
  loadEngagementData();
});

/* =========================
   LOAD ENGAGEMENT
========================= */
function loadEngagementData() {
  const container = document.getElementById("engagement-container");
  if (!container || !APP_STATE.posts) return;

  container.innerHTML = "";

  APP_STATE.posts.forEach(post => {
    const item = document.createElement("div");
    item.className = "engagement-user";

    item.innerHTML = `
      <img src="assets/default-avatar.png" alt="user">
      <div>
        <strong>${post.author}</strong>
        <p>${post.likes} likes · ${post.retribes} retribes</p>
      </div>
    `;

    container.appendChild(item);
  });
}

/* =========================
   FILTERS (READY)
========================= */
function showLikes() {
  console.log("filter: likes");
}

function showRetribes() {
  console.log("filter: retribes");
}

function showSaves() {
  console.log("filter: saves");
}
