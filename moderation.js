// moderation.js
import { db, auth, analytics } from "./firebase.js";
import { doc, deleteDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Check if current user is admin
 */
export function isAdmin() {
  if (!auth.currentUser) return false;
  // Simple admin check: based on custom claim or UID list
  const adminUIDs = ["ADMIN_UID_1", "ADMIN_UID_2"]; // Replace with real UIDs
  return adminUIDs.includes(auth.currentUser.uid);
}

/**
 * Delete a post
 * @param {string} postId
 */
export async function deletePost(postId) {
  if (!isAdmin()) return;
  try {
    await deleteDoc(doc(db, "posts", postId));

    analytics.logEvent("delete_post", {
      adminUid: auth.currentUser.uid,
      postId
    });

    console.log(`Post ${postId} deleted by admin`);
  } catch (error) {
    console.error("Failed to delete post:", error);
  }
}

/**
 * Delete a comment
 * @param {string} commentId
 */
export async function deleteComment(commentId) {
  if (!isAdmin()) return;
  try {
    await deleteDoc(doc(db, "comments", commentId));

    analytics.logEvent("delete_comment", {
      adminUid: auth.currentUser.uid,
      commentId
    });

    console.log(`Comment ${commentId} deleted by admin`);
  } catch (error) {
    console.error("Failed to delete comment:", error);
  }
}

/**
 * Flag/report a post
 * @param {string} postId
 * @param {string} reason
 */
export async function reportPost(postId, reason) {
  if (!auth.currentUser) return;
  try {
    await addDoc(collection(db, "reports"), {
      postId,
      reporterUid: auth.currentUser.uid,
      reason,
      createdAt: serverTimestamp()
    });

    analytics.logEvent("report_post", {
      reporterUid: auth.currentUser.uid,
      postId,
      reason
    });

    console.log(`Post ${postId} reported for: ${reason}`);
  } catch (error) {
    console.error("Failed to report post:", error);
  }
}