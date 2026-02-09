// js/likes.js

import { db, auth } from "./firebase.js";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

// ===== LIKE A POST =====
export async function likePost(postId) {
  if (!auth.currentUser) return;
  const postRef = doc(db, "posts", postId);

  try {
    await updateDoc(postRef, {
      likes: arrayUnion(auth.currentUser.uid)
    });
    console.log("Post liked:", postId);
  } catch (error) {
    console.error("Error liking post:", error.message);
  }
}

// ===== UNLIKE A POST =====
export async function unlikePost(postId) {
  if (!auth.currentUser) return;
  const postRef = doc(db, "posts", postId);

  try {
    await updateDoc(postRef, {
      likes: arrayRemove(auth.currentUser.uid)
    });
    console.log("Post unliked:", postId);
  } catch (error) {
    console.error("Error unliking post:", error.message);
  }
}

// ===== CHECK IF CURRENT USER LIKED A POST =====
export async function isLikedByUser(postId) {
  if (!auth.currentUser) return false;
  const postRef = doc(db, "posts", postId);
  const postSnap = await postRef.get();

  if (postSnap.exists) {
    const data = postSnap.data();
    return data.likes?.includes(auth.currentUser.uid);
  }
  return false;
}
