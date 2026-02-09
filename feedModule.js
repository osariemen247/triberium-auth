// feedModule.js
// Core feed logic for TRIBERIUM

import { db, auth } from "./firebaseModule.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  increment
} from "firebase/firestore";

export async function createPost(content, mediaURL = null) {
  await addDoc(collection(db, "posts"), {
    uid: auth.currentUser.uid,
    content,
    mediaURL,
    likes: 0,
    createdAt: Date.now()
  });
}

export function loadFeed(callback) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function likePost(postId) {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, { likes: increment(1) });
  }
