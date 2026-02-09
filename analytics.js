// js/analytics.js
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

/**
 * Load platform-wide metrics and populate the placeholders.
 */
export async function loadMetrics() {
  try {
    // Total Posts
    const postsSnap = await getDocs(collection(db, "posts"));
    document.getElementById("metricPosts").textContent = postsSnap.size;

    // Total Comments
    const commentsSnap = await getDocs(collection(db, "comments"));
    document.getElementById("metricComments").textContent = commentsSnap.size;

    // Total Likes
    const likesSnap = await getDocs(collection(db, "likes"));
    document.getElementById("metricLikes").textContent = likesSnap.size;

    // Total Users
    const usersSnap = await getDocs(collection(db, "users"));
    document.getElementById("metricUsers").textContent = usersSnap.size;

  } catch (error) {
    console.error("Error loading metrics:", error);
  }
}

/**
 * Optional: Real-time updates
 * You can use onSnapshot for live metrics if needed.
 */
// Example:
// import { onSnapshot } from "firebase/firestore";
// onSnapshot(collection(db, "posts"), snapshot => {
//   document.getElementById("metricPosts").textContent = snapshot.size;
// });