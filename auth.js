// auth.js
import { auth, provider } from "./firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js";

// Email + Password Signup
export async function signup(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username: username,
      photoURL: "",
      tbm_balance: 0,
      followers: [],
      following: [],
      createdAt: serverTimestamp()
    });

    console.log("Signup successful:", user.uid);
  } catch (error) {
    console.error("Signup error:", error);
  }
}

// Email + Password Login
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful:", userCredential.user.uid);
  } catch (error) {
    console.error("Login error:", error);
  }
}

// Google Login
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Ensure user exists in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username: user.displayName || "",
      photoURL: user.photoURL || "",
      tbm_balance: 0,
      followers: [],
      following: [],
      createdAt: serverTimestamp()
    }, { merge: true });

    console.log("Google login successful:", user.uid);
  } catch (error) {
    console.error("Google login error:", error);
  }
}

// Logout
export async function logout() {
  try {
    await auth.signOut();
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error);
  }
}