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
firebase.initializeApp(firebaseConfig);

// Firebase Auth
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
