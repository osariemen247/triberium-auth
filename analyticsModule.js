// analyticsModule.js
// Tracks user activity, posts, likes, comments, DMs, and app metrics

import { auth, db } from "./firebaseSetup.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// -------------------------------
// Log a user activity
// Example: "login", "post_created", "dm_sent"
// -------------------------------
export async function logActivity(activityType, details = {}) {
  if (!auth.currentUser) return;

  try {
    await addDoc(collection(db, "analytics"), {
      uid: auth.currentUser.uid,
      username: auth.currentUser.displayName || "Anonymous",
      activityType: activityType,
      details: details,
      createdAt: serverTimestamp()
    });
    console.log(`Logged activity: ${activityType}`);
  } catch (error) {
    console.error("Log activity error:", error.message);
  }
}

// -------------------------------
// Track post creation
// -------------------------------
export async function trackPost(postId) {
  await logActivity("post_created", { postId });
}

// -------------------------------
// Track likes
// -------------------------------
export async function trackLike(postId) {
  await logActivity("post_liked", { postId });
}

// -------------------------------
// Track comments
// -------------------------------
export async function trackComment(postId, commentId) {
  await logActivity("comment_added", { postId, commentId });
}

// -------------------------------
// Track DMs
// -------------------------------
export async function trackDM(toUid, messageId) {
  await logActivity("dm_sent", { toUid, messageId });
                            }
