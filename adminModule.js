// adminModule.js
// Handles admin moderation tasks for TRIBERIUM MVP

import { db } from "./firebaseSetup.js";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// -------------------------------
// Fetch all posts for moderation
// -------------------------------
export async function fetchAllPosts(limitCount = 100) {
  try {
    const postsQuery = query(collection(db, "posts"));
    const snapshot = await getDocs(postsQuery);
    const posts = [];
    snapshot.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));
    return posts.slice(0, limitCount); // latest posts
  } catch (error) {
    console.error("Fetch all posts error:", error.message);
    return [];
  }
}

// -------------------------------
// Delete a post
// -------------------------------
export async function deletePost(postId) {
  try {
    await deleteDoc(doc(db, "posts", postId));
    console.log(`Post ${postId} deleted successfully`);
  } catch (error) {
    console.error("Delete post error:", error.message);
  }
}

// -------------------------------
// Flag a post for review
// -------------------------------
export async function flagPost(postId, reason) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      flagged: true,
      flagReason: reason
    });
    console.log(`Post ${postId} flagged for reason: ${reason}`);
  } catch (error) {
    console.error("Flag post error:", error.message);
  }
}

// -------------------------------
// Fetch all users
// -------------------------------
export async function fetchAllUsers(limitCount = 100) {
  try {
    const usersQuery = query(collection(db, "users"));
    const snapshot = await getDocs(usersQuery);
    const users = [];
    snapshot.forEach(doc => users.push({ uid: doc.id, ...doc.data() }));
    return users.slice(0, limitCount);
  } catch (error) {
    console.error("Fetch all users error:", error.message);
    return [];
  }
}

// -------------------------------
// Disable a user account
// -------------------------------
export async function disableUser(uid) {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { disabled: true });
    console.log(`User ${uid} disabled`);
  } catch (error) {
    console.error("Disable user error:", error.message);
  }
}

// -------------------------------
// Enable a user account
// -------------------------------
export async function enableUser(uid) {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { disabled: false });
    console.log(`User ${uid} enabled`);
  } catch (error) {
    console.error("Enable user error:", error.message);
  }
    }
