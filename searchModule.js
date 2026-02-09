// searchModule.js
// Handles search functionality for users and posts

import { db } from "./firebaseSetup.js";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

// -------------------------------
// Search users by username
// -------------------------------
export async function searchUsers(searchTerm, limitCount = 20) {
  if (!searchTerm.trim()) return [];

  try {
    const usersQuery = query(
      collection(db, "users"),
      where("username", ">=", searchTerm),
      where("username", "<=", searchTerm + "\uf8ff"),
      orderBy("username"),
      limit(limitCount)
    );

    const snapshot = await getDocs(usersQuery);
    const users = [];
    snapshot.forEach(doc => users.push({ uid: doc.id, ...doc.data() }));
    return users;

  } catch (error) {
    console.error("User search error:", error.message);
    return [];
  }
}

// -------------------------------
// Search posts by content
// -------------------------------
export async function searchPosts(searchTerm, limitCount = 20) {
  if (!searchTerm.trim()) return [];

  try {
    const postsQuery = query(
      collection(db, "posts"),
      where("content", ">=", searchTerm),
      where("content", "<=", searchTerm + "\uf8ff"),
      orderBy("content"),
      limit(limitCount)
    );

    const snapshot = await getDocs(postsQuery);
    const posts = [];
    snapshot.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));
    return posts;

  } catch (error) {
    console.error("Post search error:", error.message);
    return [];
  }
                 }
