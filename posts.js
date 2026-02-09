// posts.js
import { db, auth, storage, analytics } from "./firebase.js";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Create a new post (text, image, or video)
 * @param {string} text - Post text
 * @param {File} mediaFile - Image or video file (optional)
 * @param {string} type - "text" | "image" | "video"
 */
export async function createPost(text, mediaFile = null, type = "text") {
  if (!auth.currentUser) return;

  try {
    let mediaUrl = "";

    // Upload image/video if present
    if (mediaFile) {
      const fileRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}_${mediaFile.name}`);
      await uploadBytes(fileRef, mediaFile);
      mediaUrl = await getDownloadURL(fileRef);
    }

    // Save post to Firestore
    const postRef = await addDoc(collection(db, "posts"), {
      authorId: auth.currentUser.uid,
      text: text || "",
      mediaUrl,
      type,
      likes: 0,
      createdAt: serverTimestamp(),
      tbmReward: 0 // Initial reward, will update later
    });

    // Grant TBM reward for posting
    await rewardTBM(auth.currentUser.uid, 1); // 1 TBM for posting

    // Analytics event
    analytics.logEvent("create_post", {
      uid: auth.currentUser.uid,
      postId: postRef.id,
      type,
    });

    console.log("Post created:", postRef.id);
    return postRef.id;
  } catch (error) {
    console.error("Failed to create post:", error);
  }
}

/**
 * Fetch posts ordered by latest
 */
export async function fetchPosts(limit = 20) {
  try {
    const postsCol = collection(db, "posts");
    const postsQuery = query(postsCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(postsQuery);

    const posts = [];
    snapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return posts;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

/**
 * Placeholder Ad logic
 * For MVP, we just return a static ad object every X posts
 */
export function getAdForFeed(index) {
  if ((index + 1) % 5 === 0) { // every 5 posts
    return {
      id: "ad_" + index,
      image: "https://via.placeholder.com/300x150?text=TRIBERIUM+Ad",
      link: "#"
    };
  }
  return null;
}

/**
 * TBM reward logic for posts, likes, comments, etc.
 * @param {string} uid
 * @param {number} amount
 */
import { doc, updateDoc, increment } from "firebase/firestore";
async function rewardTBM(uid, amount) {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      tbm_balance: increment(amount)
    });
  } catch (error) {
    console.error("Failed to reward TBM:", error);
  }
}