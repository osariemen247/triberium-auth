// likes.js
import { db, auth, analytics } from "./firebase.js";
import { doc, setDoc, deleteDoc, getDoc, increment, updateDoc } from "firebase/firestore";
import { rewardTBM } from "./posts.js"; // Import TBM reward logic

/**
 * Like a post
 * @param {string} postId
 */
export async function likePost(postId) {
  if (!auth.currentUser) return;

  const likeRef = doc(db, "likes", `${auth.currentUser.uid}_${postId}`);
  const postRef = doc(db, "posts", postId);

  try {
    const docSnap = await getDoc(likeRef);
    if (docSnap.exists()) {
      console.log("Already liked");
      return;
    }

    // Add like
    await setDoc(likeRef, {
      uid: auth.currentUser.uid,
      postId,
      createdAt: new Date()
    });

    // Increment likes count on post
    await updateDoc(postRef, {
      likes: increment(1)
    });

    // Reward TBM for liking
    await rewardTBM(auth.currentUser.uid, 0.1); // 0.1 TBM per like

    // Analytics
    analytics.logEvent("like_post", {
      uid: auth.currentUser.uid,
      postId
    });

    console.log("Post liked:", postId);
  } catch (error) {
    console.error("Failed to like post:", error);
  }
}

/**
 * Unlike a post
 * @param {string} postId
 */
export async function unlikePost(postId) {
  if (!auth.currentUser) return;

  const likeRef = doc(db, "likes", `${auth.currentUser.uid}_${postId}`);
  const postRef = doc(db, "posts", postId);

  try {
    const docSnap = await getDoc(likeRef);
    if (!docSnap.exists()) return;

    // Remove like
    await deleteDoc(likeRef);

    // Decrement likes count
    await updateDoc(postRef, {
      likes: increment(-1)
    });

    // Optionally reduce TBM for unlike
    // await rewardTBM(auth.currentUser.uid, -0.1);

    // Analytics
    analytics.logEvent("unlike_post", {
      uid: auth.currentUser.uid,
      postId
    });

    console.log("Post unliked:", postId);
  } catch (error) {
    console.error("Failed to unlike post:", error);
  }
}

/**
 * Check if the current user liked a post
 * @param {string} postId
 * @returns {boolean}
 */
export async function isLiked(postId) {
  if (!auth.currentUser) return false;
  const likeRef = doc(db, "likes", `${auth.currentUser.uid}_${postId}`);
  const docSnap = await getDoc(likeRef);
  return docSnap.exists();
}