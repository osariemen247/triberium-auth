// comments.js
import { db, auth, analytics } from "./firebase.js";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";
import { rewardTBM } from "./posts.js";

/**
 * Add a comment to a post
 * @param {string} postId
 * @param {string} text
 */
export async function addComment(postId, text) {
  if (!auth.currentUser || !text.trim()) return;

  try {
    const commentRef = await addDoc(collection(db, "comments"), {
      postId,
      authorId: auth.currentUser.uid,
      text,
      createdAt: serverTimestamp()
    });

    // Reward TBM for commenting
    await rewardTBM(auth.currentUser.uid, 0.2); // 0.2 TBM per comment

    // Analytics event
    analytics.logEvent("add_comment", {
      uid: auth.currentUser.uid,
      postId,
      commentId: commentRef.id
    });

    console.log("Comment added:", commentRef.id);
    return commentRef.id;
  } catch (error) {
    console.error("Failed to add comment:", error);
  }
}

/**
 * Fetch comments for a post
 * @param {string} postId
 * @returns {Array} Array of comment objects
 */
export async function fetchComments(postId) {
  try {
    const commentsCol = collection(db, "comments");
    const q = query(
      commentsCol,
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );
    const snapshot = await getDocs(q);

    const comments = [];
    snapshot.forEach(doc => {
      comments.push({ id: doc.id, ...doc.data() });
    });

    return comments;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}