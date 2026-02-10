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
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * =========================
 * Authentication Helpers
 * =========================
 */

/**
 * Logs out the current user and redirects to index.html
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

/**
 * Checks if a user is currently authenticated
 * and runs a callback with the user object
 * @param {Function} callback 
 */
export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, user => {
    callback(user);
  });
};

/**
 * =========================
 * Firestore Helpers
 * =========================
 */

/**
 * Creates or updates a Firestore document
 * @param {String} collectionName 
 * @param {String} docId 
 * @param {Object} data 
 */
export const setDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), data, { merge: true });
    console.log(`Document ${docId} in ${collectionName} updated successfully`);
  } catch (error) {
    console.error(`Error setting document ${docId}:`, error.message);
  }
};

/**
 * Retrieves a Firestore document by collection and ID
 * @param {String} collectionName 
 * @param {String} docId 
 * @returns {Object|null}
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn(`Document ${docId} does not exist in ${collectionName}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching document ${docId}:`, error.message);
    return null;
  }
};

/**
 * Listens to real-time updates on a collection
 * @param {String} collectionName 
 * @param {Function} callback 
 * @param {String} orderField Optional ordering field
 */
export const listenCollection = (collectionName, callback, orderField = "createdAt") => {
  const q = query(collection(db, collectionName), orderBy(orderField, "desc"));
  return onSnapshot(q, snapshot => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

/**
 * =========================
 * Storage Helpers
 * =========================
 */

/**
 * Uploads a file to Firebase Storage and returns its download URL
 * @param {File} file 
 * @param {String} path 
 * @returns {String} URL
 */
export const uploadFile = async (file, path) => {
  try {
    const ref = storageRef(storage, path);
    await uploadBytes(ref, file);
    const url = await getDownloadURL(ref);
    return url;
  } catch (error) {
    console.error(`Error uploading file to ${path}:`, error.message);
    return null;
  }
};
