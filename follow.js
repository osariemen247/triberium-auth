// ============================
// TRIBERIUM MVP — Follow System
// ============================

import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

/**
 * Follow a user
 * @param {string} targetUid - UID of the user to follow
 */
export async function followUser(targetUid) {
  if (!auth.currentUser) return;

  try {
    const ref = doc(db, "followers", `${auth.currentUser.uid}_${targetUid}`);
    await setDoc(ref, {
      follower: auth.currentUser.uid,
      following: targetUid,
      createdAt: new Date()
    });
    console.log(`Now following ${targetUid}`);
  } catch (err) {
    console.error("Error following user:", err);
  }
}

/**
 * Unfollow a user
 * @param {string} targetUid - UID of the user to unfollow
 */
export async function unfollowUser(targetUid) {
  if (!auth.currentUser) return;

  try {
    const ref = doc(db, "followers", `${auth.currentUser.uid}_${targetUid}`);
    await deleteDoc(ref);
    console.log(`Unfollowed ${targetUid}`);
  } catch (err) {
    console.error("Error unfollowing user:", err);
  }
}

/**
 * Check if the current user is following a target user
 * @param {string} targetUid
 * @returns {Promise<boolean>}
 */
export async function isFollowing(targetUid) {
  if (!auth.currentUser) return false;

  try {
    const ref = doc(db, "followers", `${auth.currentUser.uid}_${targetUid}`);
    const docSnap = await getDoc(ref);
    return docSnap.exists();
  } catch (err) {
    console.error("Error checking follow status:", err);
    return false;
  }
}

/**
 * Get followers of a user
 * @param {string} uid
 * @returns {Promise<Array<string>>} - array of follower UIDs
 */
export async function getFollowers(uid) {
  try {
    const q = query(collection(db, "followers"), where("following", "==", uid));
    const snapshot = await getDocs(q);
    const followers = snapshot.docs.map(doc => doc.data().follower);
    return followers;
  } catch (err) {
    console.error("Error fetching followers:", err);
    return [];
  }
}

/**
 * Get users that a user is following
 * @param {string} uid
 * @returns {Promise<Array<string>>} - array of following UIDs
 */
export async function getFollowing(uid) {
  try {
    const q = query(collection(db, "followers"), where("follower", "==", uid));
    const snapshot = await getDocs(q);
    const following = snapshot.docs.map(doc => doc.data().following);
    return following;
  } catch (err) {
    console.error("Error fetching following:", err);
    return [];
  }
}