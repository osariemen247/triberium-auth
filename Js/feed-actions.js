import { getFirestore, collection, doc, onSnapshot, query, orderBy, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();
const db = getFirestore();

// ===================== AUTH =====================
onAuthStateChanged(auth,user=>{
  if(!user) window.location.href="index.html";
  else loadFeed(user.uid);
});

// ===================== LOAD FEED =====================
function loadFeed(uid){
  const feedQuery = query(collection(db,"posts"), orderBy("createdAt","desc"));
  onSnapshot(feedQuery,snap=>{
    const feed = document.getElementById("feed");
    feed.innerHTML="";
    snap.forEach(docSnap=>{
      const post = docSnap.data();
      const postId = docSnap.id;

      const card = document.createElement("div");
      card.className="card";
      card.innerHTML=`
        <div class="post-header">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${post.authorAvatar}" class="avatar">
            <div>@${post.authorUsername}</div>
          </div>
          <button class="follow-btn">${post.followedBy?.includes(uid)?"Following":"Follow"}</button>
        </div>
        <div>${post.content}</div>
        <div class="post-actions">
          <div class="action like">${post.likes?.includes(uid)?"❤️":"Like"}</div>
          <div class="action save">${post.savedBy?.includes(uid)?"💾":"Save"}</div>
          <div class="action retribe">Retribe</div>
          <div class="action comment">Comment</div>
          <div class="action share">Share</div>
        </div>
      `;

      // LIKE
      card.querySelector(".like").onclick=()=>setDoc(doc(db,"posts",postId,"likes",uid),{uid});

      // SAVE
      card.querySelector(".save").onclick=()=>setDoc(doc(db,"users",uid,"saved",postId),{postId});

      // FOLLOW
      const followBtn=card.querySelector(".follow-btn");
      followBtn.onclick=()=>setDoc(doc(db,"posts",postId,"followers",uid),{uid});

      // RETRIBE
      card.querySelector(".retribe").onclick=async()=>{
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

      // COMMENT
      card.querySelector(".comment").onclick=()=>{
        const modal = document.getElementById("commentModal");
        modal.style.display="flex";
        document.getElementById("submitComment").onclick=async()=>{
          const text=document.getElementById("commentText").value;
          if(text.length>0){
            await addDoc(collection(db,"posts",postId,"comments"),{uid,text,createdAt:new Date()});
            document.getElementById("commentText").value="";
            modal.style.display="none";
          }
        };
      };

      feed.appendChild(card);
    });
  });
}

// COMMENT MODAL CLOSE
document.getElementById("commentModal").onclick = e => {
  if(e.target.id==="commentModal") e.target.style.display="none";
};
