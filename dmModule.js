// dmModule.js
// Handles private messaging (DMs) between TRIBERIUM users

import { auth, db } from "./firebaseSetup.js";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";

// -------------------------------
// Send a DM
// -------------------------------
export async function sendMessage(toUid, messageContent) {
  if (!auth.currentUser || !messageContent.trim()) return;

  try {
    await addDoc(collection(db, "messages"), {
      fromUid: auth.currentUser.uid,
      toUid: toUid,
      message: messageContent,
      createdAt: serverTimestamp()
    });
    console.log(`Message sent to user: ${toUid}`);
  } catch (error) {
    console.error("Send DM error:", error.message);
  }
}

// -------------------------------
// Fetch messages between two users
// -------------------------------
export async function fetchMessages(withUid, limitCount = 50) {
  if (!auth.currentUser) return [];

  try {
    const messagesQuery = query(
      collection(db, "messages"),
      where("fromUid", "in", [auth.currentUser.uid, withUid]),
      where("toUid", "in", [auth.currentUser.uid, withUid]),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(messagesQuery);
    const messages = [];
    snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
    return messages.slice(-limitCount); // return latest messages
  } catch (error) {
    console.error("Fetch DM error:", error.message);
    return [];
  }
      }
