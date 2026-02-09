// firebaseModule.js (GitHub SAFE)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjX9SLUbKPjldZELBvtQg0K0A-UEDLRIs",
  authDomain: "triberium-mvp.firebaseapp.com",
  projectId: "triberium-mvp",
  storageBucket: "triberium-mvp.firebasestorage.app",
  messagingSenderId: "519861052514",
  appId: "1:519861052514:web:56348e80320066cd311d3b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
