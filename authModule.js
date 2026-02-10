// authModule.js
// Handles TRIBERIUM authentication: Email/Password + Google login
import { auth } from "./firebaseModule.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

// DOM Elements
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const authMessage = document.getElementById("authMessage");

// --- Email / Password Sign Up ---
signupBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    authMessage.textContent = "Please enter email and password.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    authMessage.style.color = "#00ff88";
    authMessage.textContent = `Signed up as ${userCredential.user.email}`;
    // Redirect to home after signup
    window.location.href = "home.html";
  } catch (error) {
    authMessage.style.color = "#ff5555";
    authMessage.textContent = error.message;
  }
});

// --- Email / Password Login ---
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    authMessage.textContent = "Please enter email and password.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    authMessage.style.color = "#00ff88";
    authMessage.textContent = `Logged in successfully!`;
    window.location.href = "home.html";
  } catch (error) {
    authMessage.style.color = "#ff5555";
    authMessage.textContent = error.message;
  }
});

// --- Google Login ---
googleLoginBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    authMessage.style.color = "#00ff88";
    authMessage.textContent = `Logged in as ${user.displayName}`;
    window.location.href = "home.html";
  } catch (error) {
    authMessage.style.color = "#ff5555";
    authMessage.textContent = error.message;
  }
});

// --- Monitor Auth State ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
    // Optional: Redirect to home if already logged in
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
      window.location.href = "home.html";
    }
  } else {
    console.log("No user logged in");
  }
});
