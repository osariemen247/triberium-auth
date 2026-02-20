// ======================================================
// TRIBERIUM — Firebase Authentication Module
// Handles login, logout, registration, and Follow button
// ======================================================

import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* ======================================================
   LOGIN FUNCTION
====================================================== */
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
}

/* ======================================================
   REGISTER FUNCTION
====================================================== */
export async function register(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      username: username,
      followers: 0,
      following: [],
      joinedAt: new Date()
    });

    console.log("Registered user:", user.uid);
    return user;
  } catch (error) {
    console.error("Registration error:", error.message);
    throw error;
  }
}

/* ======================================================
   LOGOUT FUNCTION
====================================================== */
export async function logout() {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error;
  }
}

/* ======================================================
   AUTH STATE LISTENER
====================================================== */
export function monitorAuthState(onUserChange) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Fetch user document
      const userDoc = await getDoc(doc(db, "users", user.uid));
      onUserChange(user, userDoc.exists() ? userDoc.data() : null);
    } else {
      onUserChange(null, null);
    }
  });
}

/* ======================================================
   FOLLOW BUTTON INTEGRATION
   - Increment follower count in Firestore
   - Update button live
====================================================== */
export async function toggleFollow(targetUserId) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Not logged in");

  const currentUserRef = doc(db, "users", currentUser.uid);
  const targetUserRef = doc(db, "users", targetUserId);

  const targetDoc = await getDoc(targetUserRef);
  if (!targetDoc.exists()) throw new Error("Target user does not exist");

  const isFollowing = (targetDoc.data().followersList || []).includes(currentUser.uid);

  if (isFollowing) {
    // Unfollow: decrement followers, remove from list
    await updateDoc(targetUserRef, {
      followers: increment(-1),
      followersList: targetDoc.data().followersList.filter(uid => uid !== currentUser.uid)
    });
    console.log("Unfollowed", targetUserId);
    return false;
  } else {
    // Follow: increment followers, add to list
    await updateDoc(targetUserRef, {
      followers: increment(1),
      followersList: [...(targetDoc.data().followersList || []), currentUser.uid]
    });
    console.log("Followed", targetUserId);
    return true;
  }
      }
