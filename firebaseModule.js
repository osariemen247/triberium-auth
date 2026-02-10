/**
 * ==========================================
 * TRIBERIUM — Firebase Core Module
 * ------------------------------------------
 * Centralized Firebase initialization and 
 * helper functions for authentication, 
 * Firestore, storage, and common utilities.
 * ==========================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

/**
 * =========================
 * Firebase Configuration
 * =========================
 */
const firebaseConfig = {
  apiKey: "AIzaSyAjX9SLUbKPjldZELBvtQg0K0A-UEDLRIs",
  authDomain: "triberium-mvp.firebaseapp.com",
  projectId: "triberium-mvp",
  storageBucket: "triberium-mvp.appspot.com",
  messagingSenderId: "519861052514",
  appId: "1:519861052514:web:56348e80320066cd311d3b"
};

/**
 * =========================
 * Initialize Firebase
 * =========================
 */
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
/**
 * ==========================================
 * TRIBERIUM — Firebase Module
 * ------------------------------------------
 * Centralized Firebase configuration, auth,
 * Firestore helper functions, and listeners.
 * ==========================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * =========================
 * Firebase Configuration
 * =========================
 */
const firebaseConfig = {
  apiKey: "AIzaSyAjX9SLUbKPjldZELBvtQg0K0A-UEDLRIs",
  authDomain: "triberium-mvp.firebaseapp.com",
  projectId: "triberium-mvp",
  appId: "1:519861052514:web:56348e80320066cd311d3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/**
 * =========================
 * Authentication Helpers
 * =========================
 */

/**
 * Monitor authentication state
 * @param {Function} callback 
 */
const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};

/**
 * Sign up user with email/password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise}
 */
const signupWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);

/**
 * Sign in user with email/password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise}
 */
const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

/**
 * Sign in with Google
 * @returns {Promise}
 */
const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

/**
 * Logout current user
 * @returns {Promise}
 */
const logoutUser = () => signOut(auth);

/**
 * =========================
 * Firestore Helpers
 * =========================
 */

/**
 * Get a single document from a collection
 * @param {string} collectionName 
 * @param {string} docId 
 * @returns {Promise<Object>}
 */
const getDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

/**
 * Update a document
 * @param {string} collectionName 
 * @param {string} docId 
 * @param {Object} data 
 */
const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
};

/**
 * Create a new document with auto-generated ID
 * @param {string} collectionName 
 * @param {Object} data 
 */
const addDocument = async (collectionName, data) => {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, data);
  return docRef.id;
};

/**
 * Listen to a collection in real-time
 * @param {string} collectionName 
 * @param {Function} callback 
 */
const listenCollection = (collectionName, callback) => {
  const colRef = collection(db, collectionName);
  const q = query(colRef, orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(docs);
  });
};

/**
 * =========================
 * Exports
 * =========================
 */
export {
  app,
  auth,
  db,
  monitorAuthState,
  signupWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  getDocument,
  updateDocument,
  addDocument,
  listenCollection
};
