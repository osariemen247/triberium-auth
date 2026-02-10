document.addEventListener("DOMContentLoaded", () => {
  renderPosts();
});

/* =========================
   RENDER POSTS
========================= */
function renderPosts() {
  const container = document.getElementById("post-container");
  if (!container || !APP_STATE.posts) return;

  container.innerHTML = "";

  APP_STATE.posts.forEach(post => {
    const postEl = document.createElement("div");
    postEl.className = "post-card";

    postEl.innerHTML = `
      <div class="post-header">
        <div class="avatar-wrapper">
          <img src="assets/default-avatar.png" alt="profile">
        </div>

        <div class="post-body">
          <strong>${post.author}</strong>
          <p>${post.content}</p>
        </div>
      </div>

      <div class="post-actions">
        <button onclick="handleLike(${post.id})">like</button>
        <button onclick="handleRetribe(${post.id})">retribe</button>
        <button onclick="handleSave(${post.id})">save</button>
        <button onclick="handleShare(${post.id})">share</button>
      </div>
    `;

    container.appendChild(postEl);
  });
}

/* =========================
   ACTION HANDLERS
========================= */
function handleLike(postId) {
  const post = findPost(postId);
  if (!post) return;

  post.likes += 1;
  console.log(`liked post ${postId}`);
}

function handleRetribe(postId) {
  const post = findPost(postId);
  if (!post) return;

  post.retribes += 1;
  console.log(`retribed post ${postId}`);
}

function handleSave(postId) {
  const post = findPost(postId);
  if (!post) return;

  post.saved = !post.saved;
  console.log(`saved post ${postId}`);
}

function handleShare(postId) {
  console.log(`shared post ${postId} outside TRIBERIUM`);
}

/* =========================
   UTIL
========================= */
function findPost(id) {
  return APP_STATE.posts.find(p => p.id === id);
}
