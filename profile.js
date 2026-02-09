// profile.js
import { db, auth, storage, analytics } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Fetch current user profile
 */
export async function loadProfile() {
  if (!auth.currentUser) return null;
  const userRef = doc(db, "users", auth.currentUser.uid);

  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    // Display on UI
    document.getElementById("username").innerText = data.username || "Unnamed";
    document.getElementById("tbm-balance").innerText = `${data.tbm_balance || 0} TBM`;
    if (data.photoURL) {
      document.getElementById("profile-img").src = data.photoURL;
    }

    // Load followers/following counts
    const followers = await getFollowersCount(auth.currentUser.uid);
    const following = await getFollowingCount(auth.currentUser.uid);
    document.getElementById("followers-count").innerText = followers;
    document.getElementById("following-count").innerText = following;

    return data;
  } catch (error) {
    console.error("Error loading profile:", error);
    return null;
  }
}

/**
 * Update username
 * @param {string} newUsername
 */
export async function updateUsername(newUsername) {
  if (!auth.currentUser || !newUsername.trim()) return;
  const userRef = doc(db, "users", auth.currentUser.uid);

  try {
    await updateDoc(userRef, { username: newUsername });
    document.getElementById("username").innerText = newUsername;

    // Analytics
    analytics.logEvent("update_username", {
      uid: auth.currentUser.uid,
      newUsername
    });

    console.log("Username updated");
  } catch (error) {
    console.error("Failed to update username:", error);
  }
}

/**
 * Update profile image
 * @param {File} file
 */
export async function updateProfileImage(file) {
  if (!auth.currentUser || !file) return;

  try {
    const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { photoURL: url });

    document.getElementById("profile-img").src = url;

    analytics.logEvent("update_profile_image", {
      uid: auth.currentUser.uid
    });

    console.log("Profile image updated");
  } catch (error) {
    console.error("Failed to update profile image:", error);
  }
}

/**
 * Get number of followers
 * @param {string} uid
 */
export async function getFollowersCount(uid) {
  const q = query(collection(db, "followers"), where("following", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

/**
 * Get number of following
 * @param {string} uid
 */
export async function getFollowingCount(uid) {
  const q = query(collection(db, "followers"), where("follower", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.size;
}