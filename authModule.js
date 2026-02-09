// authModule.js
// Handles Email + Google signup/login and username storage for TRIBERIUM MVP

import { auth, db } from "./firebaseSetup.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Google provider
const googleProvider = new GoogleAuthProvider();

// -------------------------------
// Email Signup
// -------------------------------
export async function signupWithEmail(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: username });

    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username: username,
      createdAt: new Date()
    });

    console.log("User signed up:", username);
    return user;

  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
}

// -------------------------------
// Email Login
// -------------------------------
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user.displayName);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
}

// -------------------------------
// Google Login/Signup
// -------------------------------
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Ensure user exists in Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      username: user.displayName || "Anonymous",
      createdAt: new Date()
    }, { merge: true });

    console.log("Google login successful:", user.displayName);
    return user;

  } catch (error) {
    console.error("Google login error:", error.message);
    throw error;
  }
}

// -------------------------------
// Logout
// -------------------------------
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error.message);
  }
      }
