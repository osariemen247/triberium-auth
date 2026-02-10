// js/authModule.js
import { auth } from "./firebaseModule.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const email = document.getElementById("emailInput");
  const password = document.getElementById("passwordInput");
  const signupBtn = document.getElementById("signupBtn");
  const loginBtn = document.getElementById("loginBtn");
  const googleBtn = document.getElementById("googleLoginBtn");
  const message = document.getElementById("authMessage");

  // 🛑 If auth UI does not exist on this page, STOP
  if (!email || !password || !signupBtn || !loginBtn || !googleBtn) {
    return;
  }

  signupBtn.onclick = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      message.textContent = "Account created. Redirecting…";
      message.style.color = "#00ffcc";
    } catch (err) {
      message.textContent = err.message;
      message.style.color = "#ff4d4d";
    }
  };

  loginBtn.onclick = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      message.textContent = "Logged in. Redirecting…";
      message.style.color = "#00ffcc";
    } catch (err) {
      message.textContent = err.message;
      message.style.color = "#ff4d4d";
    }
  };

  googleBtn.onclick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      message.textContent = "Google login successful";
      message.style.color = "#00ffcc";
    } catch (err) {
      message.textContent = err.message;
      message.style.color = "#ff4d4d";
    }
  };

  // 🔐 Auth state = truth
  onAuthStateChanged(auth, user => {
    if (user) {
      window.location.href = "home.html";
    }
  });
});
