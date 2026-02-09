// engagementModule.js
// Handles likes and comments for posts in TRIBERIUM MVP

import { auth, db } from "./firebaseSetup.js";
import { doc, setDoc, deleteDoc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

// -------------------------------
// Like a post
// -------------------------------
export async function likePost(postId) {
  if (!auth.currentUser) return;

  const likeRef = doc(db, "likes", `${auth.currentUser.uid}_${postId}`);
  try {
    await setDoc(likeRef, {
      uid: auth.currentUser.uid,
      postId: postId,
      createdAt: serverTimestamp()
    });
    console.log(`Post ${postId} liked by ${auth.currentUser.uid}`);
  } catch (error) {
    console.error("Like post error:", error.message);
  }
}

// -------------------------------
// Unlike a post
// -------------------------------
export async function unlikePost(postId) {
  if (!auth.currentUser) return;

  const likeRef = doc(db, "likes", `${auth.currentUser.uid}_${postId}`);
  try {
    await deleteDoc(likeRef);
    console.log(`Post ${postId} unliked by ${auth.currentUser.uid}`);
  } catch (error) {
    console.error("Unlike post error:", error.message);
  }
}

// -------------------------------
// Check if user liked a post
// -------------------------------
export async function hasLiked(postId) {
  if (!auth.currentUser) return false;

  const likeRef = doc(db, "likes", `${auth.currentUser.uid}_${postId}`);
  try {
    const docSnap = await getDoc(likeRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Check like error:", error.message);
    return false;
  }
}

// -------------------------------
// Add a comment to a post
// -------------------------------
export async function addComment(postId, commentText) {
  if (!auth.currentUser || !commentText.trim()) return;

  try {
    const commentRef = await addDoc(collection(db, "comments"), {
      postId: postId,
      uid: auth.currentUser.uid,
      username: auth.currentUser.displayName || "Anonymous",
      comment: commentText,
      createdAt: serverTimestamp()
    });
    console.log(`Comment added to post ${postId}`);
    return commentRef;
  } catch (error) {
    console.error("Add comment error:", error.message);
  }
}

// -------------------------------
// Fetch comments for a post
// -------------------------------
export async function fetchComments(postId, limitCount = 50) {
  try {
    const q = query(collection(db, "comments"), where("postId", "==", postId));
    const snapshot = await getDocs(q);
    const comments = [];
    snapshot.forEach(doc => comments.push({ id: doc.id, ...doc.data() }));
    return comments.slice(-limitCount); // latest comments
  } catch (error) {
    console.error("Fetch comments error:", error.message);
    return [];
  }
                  }
