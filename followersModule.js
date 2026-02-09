// followersModule.js
// Handles follow/unfollow, follower checks, and listing for TRIBERIUM MVP

import { auth, db } from "./firebaseSetup.js";
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

// -------------------------------
// Follow a user
// -------------------------------
export async function followUser(targetUid) {
  if (!auth.currentUser) return;
  const followRef = doc(db, "followers", `${auth.currentUser.uid}_${targetUid}`);

  try {
    await setDoc(followRef, {
      follower: auth.currentUser.uid,
      following: targetUid,
      createdAt: new Date()
    });
    console.log(`You are now following user: ${targetUid}`);
  } catch (error) {
    console.error("Follow error:", error.message);
  }
}

// -------------------------------
// Unfollow a user
// -------------------------------
export async function unfollowUser(targetUid) {
  if (!auth.currentUser) return;
  const followRef = doc(db, "followers", `${auth.currentUser.uid}_${targetUid}`);

  try {
    await deleteDoc(followRef);
    console.log(`You unfollowed user: ${targetUid}`);
  } catch (error) {
    console.error("Unfollow error:", error.message);
  }
}

// -------------------------------
// Check if following
// -------------------------------
export async function isFollowing(targetUid) {
  if (!auth.currentUser) return false;
  const followRef = doc(db, "followers", `${auth.currentUser.uid}_${targetUid}`);

  try {
    const docSnap = await getDoc(followRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Check following error:", error.message);
    return false;
  }
}

// -------------------------------
// Get followers list
// -------------------------------
export async function getFollowers(userUid) {
  try {
    const q = query(collection(db, "followers"), where("following", "==", userUid));
    const querySnap = await getDocs(q);
    const followers = [];
    querySnap.forEach(doc => followers.push(doc.data().follower));
    return followers;
  } catch (error) {
    console.error("Get followers error:", error.message);
    return [];
  }
}

// -------------------------------
// Get following list
// -------------------------------
export async function getFollowing(userUid) {
  try {
    const q = query(collection(db, "followers"), where("follower", "==", userUid));
    const querySnap = await getDocs(q);
    const following = [];
    querySnap.forEach(doc => following.push(doc.data().following));
    return following;
  } catch (error) {
    console.error("Get following error:", error.message);
    return [];
  }
}
