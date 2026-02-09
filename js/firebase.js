// js/firebase.js

// Import Firebase core modules
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
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

// Services exported for use in other modules
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // Google Sign-In
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Optional offline persistence
// import { enableIndexedDbPersistence } from "firebase/firestore";
// enableIndexedDbPersistence(db).catch(err => console.error(err));
