/* =========================================================
   TRIBERIUM — PROFILE MODULE V3
   Fully production-ready, backend connected
   Features: Posts, Retribes, Stories, Media, Comments, Wallet, Messaging
========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, deleteDoc,
  collection, query, where, orderBy, onSnapshot, serverTimestamp, increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyAjX9SLUbKPjldZELBvtQg0K0A-UEDLRIs",
  authDomain: "triberium-mvp.firebaseapp.com",
  projectId: "triberium-mvp",
  storageBucket: "triberium-mvp.firebasestorage.app",
  messagingSenderId: "519861052514",
  appId: "1:519861052514:web:56348e80320066cd311d3b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* ================= DOM ELEMENTS ================= */
const walletAmount = document.getElementById("walletAmount");
const profileAvatar = document.getElementById("profileAvatar");
const profileUsername = document.getElementById("profileUsername");
const profileBio = document.getElementById("profileBio");
const postCount = document.getElementById("postCount");
const followerCount = document.getElementById("followerCount");
const followingCount = document.getElementById("followingCount");

const postText = document.getElementById("postText");
const mediaInput = document.getElementById("mediaInput");
const mediaPreview = document.getElementById("mediaPreview");
const publishPostBtn = document.getElementById("publishPostBtn");
const profilePosts = document.getElementById("profilePosts");

const storyInput = document.getElementById("storyInput");
const storyPreview = document.getElementById("storyPreview");
const uploadStoryBtn = document.getElementById("uploadStoryBtn");
const storiesContainer = document.getElementById("stories");

const editProfileBtn = document.getElementById("editProfileBtn");
const editProfileModal = document.getElementById("editProfileModal");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const closeEditProfile = document.getElementById("closeEditProfile");

const editUsername = document.getElementById("editUsername");
const editBio = document.getElementById("editBio");
const editAvatar = document.getElementById("editAvatar");

const messagingBtn = document.getElementById("messagingBtn");

/* ================= AUTH GUARD ================= */
let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  currentUser = user;

  loadWallet(user.uid);
  loadProfile(user.uid);
  loadPosts(user.uid);
  loadRetribes(user.uid);
  loadStories(user.uid);
});

/* ================= WALLET ================= */
function loadWallet(uid) {
  const walletDoc = doc(db, "wallets", uid);
  onSnapshot(walletDoc, (snap) => {
    if (snap.exists()) walletAmount.textContent = Number(snap.data().balance).toFixed(2);
  });
}

/* ================= PROFILE ================= */
async function loadProfile(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", uid), {
      username: currentUser.email.split("@")[0],
      bio: "",
      avatar: "",
      followers: 0,
      following: 0,
      createdAt: serverTimestamp()
    });
  }

  onSnapshot(doc(db, "users", uid), (snap) => {
    const data = snap.data();
    profileUsername.textContent = "@" + data.username;
    profileBio.textContent = data.bio || "";
    profileAvatar.src = data.avatar || "./img/default-avatar.png";
    followerCount.textContent = data.followers || 0;
    followingCount.textContent = data.following || 0;

    editUsername.value = data.username;
    editBio.value = data.bio;
    editAvatar.value = data.avatar;
  });
}

/* ================= EDIT PROFILE ================= */
editProfileBtn.onclick = () => editProfileModal.classList.remove("hidden");
closeEditProfile.onclick = () => editProfileModal.classList.add("hidden");

saveProfileBtn.onclick = async () => {
  await updateDoc(doc(db, "users", currentUser.uid), {
    username: editUsername.value.trim(),
    bio: editBio.value.trim(),
    avatar: editAvatar.value.trim()
  });
  editProfileModal.classList.add("hidden");
};

/* ================= MEDIA PREVIEW ================= */
mediaInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  mediaPreview.innerHTML = file.type.startsWith("video")
    ? `<video src="${url}" controls class="preview-media"></video>`
    : `<img src="${url}" class="preview-media">`;
};

storyInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  storyPreview.innerHTML = file.type.startsWith("video")
    ? `<video src="${url}" controls class="preview-media"></video>`
    : `<img src="${url}" class="preview-media">`;
};

/* ================= CREATE POST ================= */
publishPostBtn.onclick = async () => {
  if (!postText.value.trim() && !mediaInput.files[0]) return;

  let mediaURL = "";
  let mediaType = "";

  if (mediaInput.files[0]) {
    const file = mediaInput.files[0];
    mediaType = file.type.startsWith("video") ? "video" : "image";

    const storageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    mediaURL = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "posts"), {
    uid: currentUser.uid,
    content: postText.value.trim(),
    mediaURL,
    mediaType,
    likes: 0,
    saves: 0,
    retribes: 0,
    createdAt: serverTimestamp()
  });

  postText.value = "";
  mediaInput.value = "";
  mediaPreview.innerHTML = "";
};

/* ================= LOAD POSTS ================= */
function loadPosts(uid) {
  const q = query(collection(db, "posts"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    profilePosts.innerHTML = "";
    postCount.textContent = snap.size;
    snap.forEach(docSnap => renderPost(docSnap));
  });
}

/* ================= LOAD RETRIBES ================= */
function loadRetribes(uid) {
  const q = query(collection(db, "posts"), where("retribedBy", "array-contains", uid), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    snap.forEach(docSnap => renderPost(docSnap, true)); // true = retribed
  });
}

/* ================= RENDER POST ================= */
function renderPost(docSnap, isRetribe=false) {
  const post = docSnap.data();
  const postId = docSnap.id;

  const postEl = document.createElement("div");
  postEl.className = "profile-post";

  postEl.innerHTML = `
    <div class="post-header">
      <div class="post-user">
        <img src="${profileAvatar.src}" class="avatar">
        <span>${profileUsername.textContent}${isRetribe ? ' (Retribe)' : ''}</span>
      </div>
      ${!isRetribe ? `<button class="delete-btn">Delete</button>` : ''}
    </div>
    <div class="post-content">${post.content}</div>
    ${post.mediaURL
      ? post.mediaType === "image"
        ? `<img src="${post.mediaURL}" class="post-media">`
        : `<video src="${post.mediaURL}" controls class="post-media"></video>`
      : ""}
    <div class="post-actions">
      <div class="action like">Like (${post.likes || 0})</div>
      <div class="action save">Save (${post.saves || 0})</div>
      <div class="action retribe">Retribe (${post.retribes || 0})</div>
      <div class="action comment">Comment</div>
    </div>
    <div class="comments"></div>
  `;

  profilePosts.appendChild(postEl);

  const likeBtn = postEl.querySelector(".like");
  const saveBtn = postEl.querySelector(".save");
  const retribeBtn = postEl.querySelector(".retribe");
  const deleteBtn = postEl.querySelector(".delete-btn");
  const commentBtn = postEl.querySelector(".comment");

  if (likeBtn) likeBtn.onclick = () => updateDoc(doc(db, "posts", postId), { likes: increment(1) });
  if (saveBtn) saveBtn.onclick = () => updateDoc(doc(db, "posts", postId), { saves: increment(1) });
  if (retribeBtn) retribeBtn.onclick = async () => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { retribes: increment(1), retribedBy: arrayUnion(currentUser.uid) });
  };
  if (deleteBtn) deleteBtn.onclick = async () => {
    if (post.mediaURL) {
      const storageRef = ref(storage, `posts/${currentUser.uid}/${postId}`);
      await deleteObject(storageRef).catch(()=>{});
    }
    await deleteDoc(doc(db, "posts", postId));
  };
  if (commentBtn) commentBtn.onclick = () => openCommentModal(postId, postEl.querySelector(".comments"));

  loadComments(postId, postEl.querySelector(".comments"));
}

/* ================= COMMENTS ================= */
function loadComments(postId, container) {
  const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
  onSnapshot(q, (snap) => {
    container.innerHTML = "";
    snap.forEach(docSnap => {
      const c = docSnap.data();
      const div = document.createElement("div");
      div.className = "comment";
      div.textContent = c.text;
      container.appendChild(div);
    });
  });
}

function openCommentModal(postId, container) {
  const text = prompt("Write your comment:");
  if (!text) return;
  addDoc(collection(db, "posts", postId, "comments"), { uid: currentUser.uid, text, createdAt: serverTimestamp() });
}

/* ================= STORIES ================= */
uploadStoryBtn.onclick = async () => {
  if (!storyInput.files[0]) return;
  const file = storyInput.files[0];
  const storageRef = ref(storage, `stories/${currentUser.uid}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const mediaURL = await getDownloadURL(storageRef);

  await addDoc(collection(db, "stories"), {
    uid: currentUser.uid,
    mediaURL,
    mediaType: file.type.startsWith("video") ? "video" : "image",
    createdAt: serverTimestamp()
  });

  storyInput.value = "";
  storyPreview.innerHTML = "";
};

function loadStories(uid) {
  const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    storiesContainer.innerHTML = "";
    snap.forEach(docSnap => {
      const story = docSnap.data();
      const div = document.createElement("div");
      div.className = "story";
      div.innerHTML = story.mediaType === "image"
        ? `<img src="${story.mediaURL}" class="story-media">`
        : `<video src="${story.mediaURL}" class="story-media" controls></video>`;
      storiesContainer.appendChild(div);
    });
  });
}

/* ================= MESSAGING ================= */
messagingBtn.onclick = () => {
  window.location.href = "chat.html";
};
