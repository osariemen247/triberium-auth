// ============================
// TRIBERIUM MVP — Metrics & Analytics
// ============================

import { getFirestore, collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

/**
 * Record a user action for metrics tracking
 * @param {string} type - Action type: 'login', 'post', 'like', 'comment', 'dm', 'tbm'
 * @param {object} details - Additional info: postId, recipientUid, tbmAmount, etc.
 */
export async function recordMetric(type, details = {}) {
  if (!auth.currentUser) return;

  try {
    const metricsRef = collection(db, "metrics");
    await addDoc(metricsRef, {
      userId: auth.currentUser.uid,
      type,
      details,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Error recording metric:", err);
  }
}

/**
 * Increment post view count
 * @param {string} postId
 */
export async function incrementPostView(postId) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      views: (serverTimestamp(), increment(1)) // Firestore increment
    });
  } catch (err) {
    console.error("Error incrementing post view:", err);
  }
}

/**
 * Track TBM reward
 * @param {number} amount
 */
export async function trackTBM(amount) {
  if (!auth.currentUser) return;

  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      tbm_balance: increment(amount),
      lastTBMUpdate: serverTimestamp()
    });
    await recordMetric("tbm", { amount });
  } catch (err) {
    console.error("Error tracking TBM:", err);
  }
}

/**
 * Track DM sent
 * @param {string} recipientUid
 */
export async function trackDM(recipientUid) {
  await recordMetric("dm", { recipientUid });
}

/**
 * Track like on post
 * @param {string} postId
 */
export async function trackLike(postId) {
  await recordMetric("like", { postId });
}

/**
 * Track comment on post
 * @param {string} postId, text
 */
export async function trackComment(postId, text) {
  await recordMetric("comment", { postId, text });
}