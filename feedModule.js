/**
 * ==========================================
 * TRIBERIUM — Feed Module
 * ------------------------------------------
 * Handles dynamic feed rendering, post actions,
 * and integration with Firebase for real-time updates.
 * ==========================================
 */

import { db, auth, monitorAuthState, setDocument, listenCollection } from "./firebaseModule.js";

/**
 * =========================
 * DOM References
 * =========================
 */
const feedContainer = document.getElementById("feedContainer");

/**
 * =========================
 * Helper Functions
 * =========================
 */

/**
 * Creates a single post DOM element
 * @param {Object} postData - post object from Firestore
 * @returns {HTMLElement}
 */
const createPostElement = (postData) => {
  // Create main post container
  const postEl = document.createElement("div");
  postEl.classList.add("post");
  postEl.id = postData.id;

  // Post Header
  const headerEl = document.createElement("div");
  headerEl.classList.add("post-header");

  // User Info with profile pic
  const userInfoEl = document.createElement("div");
  userInfoEl.classList.add("user-info");

  // Profile Pic
  const profileImg = document.createElement("img");
  profileImg.src = postData.profilePic || ""; // blank if empty
  profileImg.alt = postData.username;

  // Username and handle
  const nameContainer = document.createElement("div");
  nameContainer.style.display = "flex";
  nameContainer.style.flexDirection = "column";

  const usernameEl = document.createElement("div");
  usernameEl.classList.add("username");
  usernameEl.textContent = postData.username;

  const handleEl = document.createElement("div");
  handleEl.classList.add("handle");
  handleEl.textContent = `@${postData.handle}`;

  nameContainer.appendChild(usernameEl);
  nameContainer.appendChild(handleEl);

  userInfoEl.appendChild(profileImg);
  userInfoEl.appendChild(nameContainer);

  // Follow Button
  const followBtn = document.createElement("button");
  followBtn.textContent = "Follow";
  followBtn.onclick = () => followUser(postData.handle);

  headerEl.appendChild(userInfoEl);
  headerEl.appendChild(followBtn);

  // Post Content
  const contentEl = document.createElement("div");
  contentEl.classList.add("post-content");
  contentEl.textContent = postData.content;

  // Post Actions
  const actionsEl = document.createElement("div");
  actionsEl.classList.add("post-actions");

  const likeBtn = document.createElement("span");
  likeBtn.textContent = "like";
  likeBtn.onclick = () => likePost(postData.id);

  const retribeBtn = document.createElement("span");
  retribeBtn.textContent = "retribe";
  retribeBtn.onclick = () => retribePost(postData.id);

  const saveBtn = document.createElement("span");
  saveBtn.textContent = "save";
  saveBtn.onclick = () => savePost(postData.id);

  const shareBtn = document.createElement("span");
  shareBtn.textContent = "share";
  shareBtn.onclick = () => sharePost(postData.id);

  actionsEl.appendChild(likeBtn);
  actionsEl.appendChild(retribeBtn);
  actionsEl.appendChild(saveBtn);
  actionsEl.appendChild(shareBtn);

  // Append all parts to post container
  postEl.appendChild(headerEl);
  postEl.appendChild(contentEl);
  postEl.appendChild(actionsEl);

  return postEl;
};

/**
 * =========================
 * Feed Actions
 * =========================
 */
const likePost = (postId) => {
  console.log(`Liked post: ${postId}`);
  // TODO: Update Firestore likes field
};

const retribePost = (postId) => {
  console.log(`Retribed post: ${postId}`);
  // TODO: Update Firestore retribes field
};

const savePost = (postId) => {
  console.log(`Saved post: ${postId}`);
  // TODO: Save post to user's collection
};

const sharePost = (postId) => {
  console.log(`Shared post: ${postId}`);
  // TODO: Share post outside TRIBERIUM app
};

const followUser = (handle) => {
  console.log(`Followed user: ${handle}`);
  // TODO: Update user's following list in Firestore
};

/**
 * =========================
 * Load Feed
 * =========================
 */
export const loadFeed = () => {
  listenCollection("posts", (posts) => {
    feedContainer.innerHTML = ""; // Clear existing posts
    posts.forEach(post => {
      const postEl = createPostElement(post);
      feedContainer.appendChild(postEl);
    });
  });
};

/**
 * =========================
 * Initialize Feed
 * =========================
 */
monitorAuthState(user => {
  if (user) {
    console.log("User logged in:", user.email);
    loadFeed();
  } else {
    console.log("No user logged in, redirecting to index.html");
    window.location.href = "index.html";
  }
});
