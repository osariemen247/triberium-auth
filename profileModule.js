// profileModule.js
// Handles user profile management for TRIBERIUM MVP

import { auth, db, storage } from "./firebaseSetup.js";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { trackActivity } from "./analyticsModule.js";

// -------------------------------
// Get current user profile
// -------------------------------
export async function getUserProfile(uid = null) {
  const userId = uid || (auth.currentUser && auth.currentUser.uid);
  if (!userId) return null;

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { uid: userId, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Get profile error:", error.message);
    return null;
  }
}

// -------------------------------
// Update profile information
// -------------------------------
export async function updateUserProfile({ username, bio, avatarFile }) {
  if (!auth.currentUser) return;

  const userRef = doc(db, "users", auth.currentUser.uid);
  const updateData = { username, bio };

  // Upload avatar if provided
  if (avatarFile) {
    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}_${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, avatarFile);
    const avatarUrl = await getDownloadURL(snapshot.ref);
    updateData.avatarUrl = avatarUrl;
  }

  try {
    await setDoc(userRef, updateData, { merge: true });
    console.log("Profile updated successfully");

    // Track profile update
    await trackActivity("profile_updated", { updatedFields: Object.keys(updateData) });

  } catch (error) {
    console.error("Update profile error:", error.message);
  }
}

// -------------------------------
// Fetch user posts for profile page
// -------------------------------
export async function fetchUserPosts(uid) {
  if (!uid) return [];

  try {
    const postsQuery = query(collection(db, "posts"), where("uid", "==", uid));
    const snapshot = await getDocs(postsQuery);
    const posts = [];
    snapshot.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));
    return posts.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds); // newest first
  } catch (error) {
    console.error("Fetch user posts error:", error.message);
    return [];
  }
}

// -------------------------------
// Fetch follower & following counts
// -------------------------------
export async function fetchFollowStats(uid) {
  try {
    const followersQuery = query(collection(db, "followers"), where("following", "==", uid));
    const followingQuery = query(collection(db, "followers"), where("follower", "==", uid));

    const followersSnap = await getDocs(followersQuery);
    const followingSnap = await getDocs(followingQuery);

    return {
      followers: followersSnap.size,
      following: followingSnap.size
    };
  } catch (error) {
    console.error("Fetch follow stats error:", error.message);
    return { followers: 0, following: 0 };
  }
  }
