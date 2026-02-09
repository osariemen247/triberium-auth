// js/auth.js

import { auth, provider, db } from "./firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// ===== EMAIL SIGNUP =====
export async function emailSignup(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save username and basic profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: user.email,
      createdAt: new Date(),
      profilePic: "", // default blank
      followers: [],
      following: []
    });

    console.log("User signed up:", user.uid);
    return user;
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
}

// ===== EMAIL LOGIN =====
export async function emailLogin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in:", user.uid);
    return user;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
}

// ===== GOOGLE LOGIN/SIGNUP =====
export async function googleLogin() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // First-time Google login → create user profile
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName || "TRIBERIUM User",
        email: user.email,
        createdAt: new Date(),
        profilePic: user.photoURL || "",
        followers: [],
        following: []
      });
    }

    console.log("Google login successful:", user.uid);
    return user;
  } catch (error) {
    console.error("Google login error:", error.message);
    throw error;
  }
}

// ===== LOGOUT =====
export async function logoutUser() {
  try {
    await auth.signOut();
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error.message);
  }
}

// ===== AUTH STATE CHANGE =====
export function onAuthStateChanged(callback) {
  auth.onAuthStateChanged(callback);
}
