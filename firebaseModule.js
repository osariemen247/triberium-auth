// firebaseModule.js
// Initialize Firebase for TRIBERIUM MVP

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config (replace with your own if needed)
const firebaseConfig = {
  apiKey: "AIzaSyAjX9SLUbKPjldZELBvtQg0K0A-UEDLRIs",
  authDomain: "triberium-mvp.firebaseapp.com",
  projectId: "triberium-mvp",
  storageBucket: "triberium-mvp.firebasestorage.app",
  messagingSenderId: "519861052514",
  appId: "1:519861052514:web:56348e80320066cd311d3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for other modules
export const auth = getAuth(app);       // Authentication
export const db = getFirestore(app);    // Firestore Database
export const storage = getStorage(app); // Images and Videos
