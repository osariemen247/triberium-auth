// =========================
// TRIBERIUM — Admin Module
// Handles: Users, Posts, Wallet, Logout
// =========================

import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Initialization
import { app } from "./firebaseModule.js"; // Ensure firebaseModule.js exports the initialized app
const auth = getAuth(app);
const db = getFirestore(app);

// =========================
// DOM References
// =========================
const usersTable = document.getElementById("usersTable");
const postsTable = document.getElementById("postsTable");
const walletTable = document.getElementById("walletTable");
const logoutBtn = document.getElementById("logoutBtn");

// =========================
// ADMIN FUNCTIONS
// =========================

// Load all users
export async function loadUsers() {
  usersTable.innerHTML = ""; // Clear table
  const usersSnapshot = await getDocs(collection(db, "users"));
  usersSnapshot.forEach(docSnap => {
    const user = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${user.profilePic || 'pwa/users/default.png'}" alt="${user.username}"></td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="banUser('${docSnap.id}')">Ban</button>
        <button onclick="verifyUser('${docSnap.id}')">Verify</button>
      </td>
    `;
    usersTable.appendChild(row);
  });
}

// Ban user
window.banUser = async function(userId) {
  if (!confirm("Are you sure you want to ban this user?")) return;
  await updateDoc(doc(db, "users", userId), { banned: true });
  alert("User banned!");
  loadUsers();
}

// Verify user
window.verifyUser = async function(userId) {
  await updateDoc(doc(db, "users", userId), { verified: true });
  alert("User verified!");
  loadUsers();
}

// Load all posts
export async function loadPosts() {
  postsTable.innerHTML = "";
  const postsSnapshot = await getDocs(collection(db, "posts"));
  postsSnapshot.forEach(docSnap => {
    const post = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${post.username}</td>
      <td>${post.content}</td>
      <td>
        <button onclick="deletePost('${docSnap.id}')">Delete</button>
      </td>
    `;
    postsTable.appendChild(row);
  });
}

// Delete post
window.deletePost = async function(postId) {
  if (!confirm("Are you sure you want to delete this post?")) return;
  await deleteDoc(doc(db, "posts", postId));
  alert("Post deleted!");
  loadPosts();
}

// Load wallet balances
export async function loadWallets() {
  walletTable.innerHTML = "";
  const usersSnapshot = await getDocs(collection(db, "users"));
  usersSnapshot.forEach(docSnap => {
    const user = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.tbmBalance || 0}</td>
      <td>
        <button onclick="addTBM('${docSnap.id}')">Add TBM</button>
        <button onclick="subtractTBM('${docSnap.id}')">Subtract TBM</button>
      </td>
    `;
    walletTable.appendChild(row);
  });
}

// Add TBM
window.addTBM = async function(userId) {
  const amount = parseFloat(prompt("Enter amount to add:"));
  if (isNaN(amount)) return alert("Invalid number");
  const userRef = doc(db, "users", userId);
  const userSnap = await getDocs(userRef);
  await updateDoc(userRef, { tbmBalance: (userSnap.data().tbmBalance || 0) + amount });
  alert(`Added ${amount} TBM`);
  loadWallets();
}

// Subtract TBM
window.subtractTBM = async function(userId) {
  const amount = parseFloat(prompt("Enter amount to subtract:"));
  if (isNaN(amount)) return alert("Invalid number");
  const userRef = doc(db, "users", userId);
  const userSnap = await getDocs(userRef);
  await updateDoc(userRef, { tbmBalance: Math.max(0, (userSnap.data().tbmBalance || 0) - amount) });
  alert(`Subtracted ${amount} TBM`);
  loadWallets();
}

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  location.href = "index.html";
  alert("Logged out successfully!");
});

// =========================
// INITIAL LOAD
// =========================
loadUsers();
loadPosts();
loadWallets();
