document.addEventListener("DOMContentLoaded", () => {
  renderMetrics();
});

/* =========================
   RENDER METRICS
========================= */
function renderMetrics() {
  const container = document.getElementById("metric-container");
  if (!container || !APP_STATE.user) return;

  const totalPosts = APP_STATE.posts.length;
  const totalLikes = APP_STATE.posts.reduce((sum, p) => sum + p.likes, 0);
  const totalRetribes = APP_STATE.posts.reduce((sum, p) => sum + p.retribes, 0);

  container.innerHTML = `
    <div class="metric-card">
      <strong>posts</strong>
      <p>${totalPosts}</p>
    </div>

    <div class="metric-card">
      <strong>likes</strong>
      <p>${totalLikes}</p>
    </div>

    <div class="metric-card">
      <strong>retribes</strong>
      <p>${totalRetribes}</p>
    </div>

    <div class="metric-card">
      <strong>TBM balance</strong>
      <p>${APP_STATE.user.tbm_balance}</p>
    </div>
  `;
}
