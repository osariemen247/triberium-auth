// authModule.js
// Handles Sign Up, Login, and Google Login for TRIBERIUM MVP

import { auth } from "./firebaseModule.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";

// Get elements from DOM
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const authMessage = document.getElementById("authMessage");
const authContainer = document.getElementById("authContainer");

// Email / Password Sign Up
signupBtn.addEventListener("click", async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    authMessage.style.color = "#4a90e2";
    authMessage.textContent = `Signed up as ${userCredential.user.email}`;
  } catch (error) {
    authMessage.style.color = "#ff5555";
    authMessage.textContent = error.message;
  }
});

// Email / Password Login
loginBtn.addEventListener("click", async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    authMessage.style.color = "#4a90e2";
    authMessage.textContent = `Logged in as ${userCredential.user.email}`;
  } catch (error) {
    authMessage.style.color = "#ff5555";
    authMessage.textContent = error.message;
  }
});

// Google Login
googleLoginBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    authMessage.style.color = "#4a90e2";
    authMessage.textContent = `Logged in as ${result.user.displayName}`;
  } catch (error) {
    authMessage.style.color = "#ff5555";
    authMessage.textContent = error.message;
  }
});

// Detect Auth State to show/hide auth container
onAuthStateChanged(auth, user => {
  if (user) {
    authContainer.style.display = "none"; // hide login/signup
  } else {
    authContainer.style.display = "block"; // show login/signup
  }
});
