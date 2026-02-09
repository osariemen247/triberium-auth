// postsModule.js
// Handles text, image, and video posts for TRIBERIUM MVP

import { auth, db, storage } from "./firebaseSetup.js";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// -------------------------------
// Create a post (text, image, or video)
// -------------------------------
export async function createPost(content = "", mediaFile = null) {
  if (!auth.currentUser) return;

  let mediaUrl = "";

  // Upload media if exists
  if (mediaFile) {
    const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}_${mediaFile.name}`);
    const snapshot = await uploadBytes(storageRef, mediaFile);
    mediaUrl = await getDownloadURL(snapshot.ref);
  }

  try {
    const postRef = await addDoc(collection(db, "posts"), {
      uid: auth.currentUser.uid,
      username: auth.currentUser.displayName || "Anonymous",
      content: content,
      mediaUrl: mediaUrl,
      createdAt: serverTimestamp(),
      likes: 0,
      comments: 0
    });

    console.log("Post created:", postRef.id);
    return postRef;

  } catch (error) {
    console.error("Create post error:", error.message);
  }
}

// -------------------------------
// Fetch posts (ordered by newest)
// -------------------------------
export async function fetchPosts(limitCount = 50) {
  try {
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(postsQuery);
    const posts = [];
    snapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts.slice(0, limitCount);
  } catch (error) {
    console.error("Fetch posts error:", error.message);
    return [];
  }
}

// -------------------------------
// Update likes count
// -------------------------------
export async function updateLikes(postId, increment = 1) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: increment
    });
  } catch (error) {
    console.error("Update likes error:", error.message);
  }
}

// -------------------------------
// Update comments count
// -------------------------------
export async function updateComments(postId, increment = 1) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: increment
    });
  } catch (error) {
    console.error("Update comments error:", error.message);
  }
      }
