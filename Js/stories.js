import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();

// ===================== LOAD STORIES =====================
function loadStories(){
  const storiesQuery = query(collection(db,"stories"),orderBy("createdAt","desc"));
  onSnapshot(storiesQuery,snap=>{
    const container = document.getElementById("stories");
    container.innerHTML = "";
    snap.forEach(docSnap => {
      const story = docSnap.data();
      const div = document.createElement("div");
      div.className = "story";
      div.innerHTML = `<img src="${story.imageURL}"><span>@${story.username}</span>`;
      div.onclick = () => openStoryModal(story);
      container.appendChild(div);
    });
  });
}

// ===================== STORY MODAL =====================
function openStoryModal(story){
  const modal = document.getElementById("storyModal");
  modal.style.display = "flex";
  modal.querySelector("img").src = story.imageURL;
  modal.querySelector("#storyUsername").textContent = `@${story.username}`;
}

// ===================== CLOSE MODAL =====================
document.getElementById("storyModal").onclick = e => {
  if(e.target.id==="storyModal") e.target.style.display="none";
};

loadStories();
