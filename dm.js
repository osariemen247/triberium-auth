// ============================
// TRIBERIUM MVP — Private Messaging (DMs)
// ============================

import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

/**
 * Send a direct message to another user
 * @param {string} recipientUid - UID of the recipient
 * @param {string} messageText - The message text
 */
export async function sendMessage(recipientUid, messageText) {
  if (!auth.currentUser || !messageText.trim()) return;

  try {
    await addDoc(collection(db, "dms"), {
      sender: auth.currentUser.uid,
      recipient: recipientUid,
      text: messageText,
      createdAt: serverTimestamp()
    });
    console.log(`Message sent to ${recipientUid}`);
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

/**
 * Fetch DM conversation between current user and another user
 * @param {string} otherUid - UID of the other user
 * @param {function} callback - Function to call on message update
 */
export function fetchConversation(otherUid, callback) {
  if (!auth.currentUser) return;

  const q = query(
    collection(db, "dms"),
    where("sender", "in", [auth.currentUser.uid, otherUid]),
    where("recipient", "in", [auth.currentUser.uid, otherUid]),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  }, (err) => {
    console.error("Error fetching conversation:", err);
  });
}

/**
 * Fetch all conversations for current user (latest message preview)
 * @param {function} callback - Function to call on conversation update
 */
export function fetchAllConversations(callback) {
  if (!auth.currentUser) return;

  const q = query(
    collection(db, "dms"),
    where("sender", "==", auth.currentUser.uid)
  );

  return onSnapshot(q, async (snapshot) => {
    const conv = {};

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const otherUid = data.recipient;
      if (!conv[otherUid] || data.createdAt?.seconds > conv[otherUid].createdAt?.seconds) {
        conv[otherUid] = data;
      }
    }

    callback(Object.values(conv));
  }, (err) => {
    console.error("Error fetching all conversations:", err);
  });
}