// ============================
// TRIBERIUM MVP — Search Users & Posts
// ============================

import { getFirestore, collection, query, where, orderBy, getDocs, startAt, endAt } from "firebase/firestore";
const db = getFirestore();

/**
 * Search users by username (case-insensitive, partial match)
 * @param {string} usernameQuery
 * @returns {Promise<Array>} - Array of matched users
 */
export async function searchUsers(usernameQuery) {
  if (!usernameQuery.trim()) return [];

  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    orderBy("username"),
    startAt(usernameQuery),
    endAt(usernameQuery + "\uf8ff")
  );

  const snapshot = await getDocs(q);
  const results = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  return results;
}

/**
 * Search posts by text content (case-insensitive, partial match)
 * @param {string} textQuery
 * @returns {Promise<Array>} - Array of matched posts
 */
export async function searchPosts(textQuery) {
  if (!textQuery.trim()) return [];

  const postsRef = collection(db, "posts");
  const q = query(
    postsRef,
    orderBy("text"),
    startAt(textQuery),
    endAt(textQuery + "\uf8ff")
  );

  const snapshot = await getDocs(q);
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return results;
}

/**
 * Helper to display search results
 * @param {Array} results
 * @param {HTMLElement} container
 */
export function renderSearchResults(results, container) {
  container.innerHTML = "";
  if (!results.length) {
    container.innerHTML = "<p class='center'>No results found.</p>";
    return;
  }

  results.forEach(item => {
    const div = document.createElement("div");
    div.className = "search-result-item";
    
    if (item.username) {
      // User
      div.innerHTML = `<strong>${item.username}</strong>`;
    } else if (item.text) {
      // Post
      div.innerHTML = `<p>${item.text}</p>`;
    }

    container.appendChild(div);
  });
}