// js/posts.js

import { db, storage, auth } from "./firebase.js";
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ===== CREATE POST =====
export async function createPost({ text = "", file = null, fileType = "" }) {
  if (!auth.currentUser) return;

  let fileURL = "";
  if (file) {
    const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    fileURL = await getDownloadURL(storageRef);
  }

  const post = {
    authorId: auth.currentUser.uid,
    text,
    mediaURL: fileURL,
    mediaType: fileType, // "image" or "video" or ""
    likes: [],
    comments: [],
    createdAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, "posts"), post);
    console.log("Post created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating post:", error.message);
    throw error;
  }
}

// ===== LIKE POST =====
export async function likePost(postId) {
  if (!auth.currentUser) return;
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayUnion(auth.currentUser.uid)
  });
}

// ===== UNLIKE POST =====
export async function unlikePost(postId) {
  if (!auth.currentUser) return;
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayRemove(auth.currentUser.uid)
  });
}

// ===== ADD COMMENT =====
export async function addComment(postId, commentText) {
  if (!auth.currentUser || !commentText.trim()) return;

  const comment = {
    userId: auth.currentUser.uid,
    text: commentText,
    createdAt: serverTimestamp()
  };

  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    comments: arrayUnion(comment)
  });
                                                                     }
