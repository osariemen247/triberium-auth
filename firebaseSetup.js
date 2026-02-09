// firebaseSetup.js
// Firebase configuration and initialization for TRIBERIUM MVP
// Ready for GitHub deployment, supporting posts, DMs, metrics, TBM, ads

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config — safe for GitHub deployment
const firebaseConfig = {
  apiKey: "AIzaSyAjX9SLUbKPjldZELBvtQg0K0A-UEDLRIs",
  authDomain: "triberium-mvp.firebaseapp.com",
  projectId: "triberium-mvp",
  storageBucket: "triberium-mvp.firebasestorage.app",
  messagingSenderId: "519861052514",
  appId: "1:519861052514:web:56348e80320066cd311d3b"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Services exported for all modules
export const auth = getAuth(app);       // For Email + Google login
export const db = getFirestore(app);    // Firestore DB for posts, comments, likes, DMs, metrics
export const storage = getStorage(app); // Storage for images & videos
