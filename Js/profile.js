import { getFirestore, collection, doc, onSnapshot, setDoc, addDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();
const db = getFirestore();

// ===================== AUTH =====================
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "index.html";
  else {
    loadProfile(user.uid);
    loadProfilePosts(user.uid);
  }
});

// ===================== PROFILE INFO =====================
function loadProfile(uid){
  onSnapshot(doc(db, "users", uid), snap => {
    if(snap.exists()){
      const data = snap.data();
      document.querySelector(".profile-avatar").src = data.avatar || "default-avatar.png";
      document.querySelector(".username").textContent = `@${data.username}`;
      document.querySelector(".btn-follow").textContent = data.following?.includes(uid) ? "Following" : "Follow";
    }
  });
}

// ===================== FOLLOW BUTTON =====================
document.querySelector(".btn-follow").onclick = async function(){
  const uid = auth.currentUser.uid;
  const followingRef = doc(db, "users", uid, "following", uid);
  await setDoc(followingRef, {uid});
  this.classList.toggle("following");
  this.textContent = this.classList.contains("following") ? "Following" : "Follow";
};

// ===================== PROFILE POSTS =====================
function loadProfilePosts(uid){
  const postsQuery = query(collection(db,"posts"), orderBy("createdAt","desc"));
  onSnapshot(postsQuery, snap => {
    const container = document.querySelector(".profile-posts");
    container.innerHTML = "";
    snap.forEach(docSnap => {
      const post = docSnap.data();
      const postId = docSnap.id;

      const card = document.createElement("div");
      card.className = "profile-post";

      card.innerHTML = `
        <div class="post-header">
          <img src="${post.authorAvatar}" class="avatar">
          <div>@${post.authorUsername}</div>
        </div>
        <div class="post-content">${post.content}</div>
        <div class="post-actions">
          <div class="action like">${post.likes?.includes(uid) ? "❤️" : "Like"}</div>
          <div class="action save">${post.savedBy?.includes(uid) ? "💾" : "Save"}</div>
          <div class="action retribe">Retribe</div>
          <div class="action comment">Comment</div>
        </div>
      `;

      // ================= LIKE =================
      card.querySelector(".like").onclick = async () => {
        await setDoc(doc(db,"posts",postId,"likes",uid),{uid});
      };

      // ================= SAVE =================
      card.querySelector(".save").onclick = async () => {
        await setDoc(doc(db,"users",uid,"saved",postId),{postId});
      };

      // ================= RETRIBE =================
      card.querySelector(".retribe").onclick = async () => {
        const postCopy = {
          authorAvatar: post.authorAvatar,
          authorUsername: post.authorUsername,
          content: post.content,
          createdAt: new Date(),
          retribedBy: uid
        };
        await addDoc(collection(db,"posts"), postCopy);
        alert("Post retribed to your profile!");
      };

      // ================= COMMENT =================
      const commentBtn = card.querySelector(".comment");
      commentBtn.onclick = () => {
        const modal = document.getElementById("commentModal");
        modal.style.display = "flex";
        document.getElementById("submitComment").onclick = async () => {
          const text = document.getElementById("commentText").value;
          if(text.length>0){
            await addDoc(collection(db,"posts",postId,"comments"),{uid,text,createdAt:new Date()});
            document.getElementById("commentText").value = "";
            modal.style.display = "none";
          }
        };
      };

      container.appendChild(card);
    });
  });
}

// ===================== COMMENT MODAL CLOSE =====================
document.getElementById("commentModal").onclick = e => {
  if(e.target.id==="commentModal") e.target.style.display = "none";
};
