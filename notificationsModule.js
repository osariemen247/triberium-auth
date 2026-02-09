// notificationsModule.js
// TRIBERIUM notifications

import { db, auth } from "./firebaseSetup.js";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";

// -------------------------------
// Add notification
// -------------------------------
export async function addNotification(toUid, type, details = {}) {
  if (!auth.currentUser) return;

  try {
    await addDoc(collection(db, "notifications"), {
      fromUid: auth.currentUser.uid,
      toUid,
      type, // "like", "comment", "follow", "dm"
      details,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Add notification error:", error.message);
  }
}

// -------------------------------
// Fetch notifications for current user
// -------------------------------
export async function fetchNotifications() {
  if (!auth.currentUser) return [];

  try {
    const notifQuery = query(
      collection(db, "notifications"),
      where("toUid", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(notifQuery);
    const notifications = [];
    snapshot.forEach(doc => notifications.push({ id: doc.id, ...doc.data() }));
    return notifications;
  } catch (error) {
    console.error("Fetch notifications error:", error.message);
    return [];
  }
}
