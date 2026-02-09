// ============================
// TRIBERIUM MVP — TBM Logic
// ============================

import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

/**
 * Initialize TBM account for a new user
 * @param {string} uid - Firebase UID
 */
export async function initTBM(uid) {
  if (!uid) return;

  const ref = doc(db, "tbm", uid);
  const docSnap = await getDoc(ref);

  if (!docSnap.exists()) {
    await setDoc(ref, {
      balance: 0,
      reputation: 0,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp()
    });
    console.log(`TBM account initialized for ${uid}`);
  }
}

/**
 * Update TBM balance and reputation
 * @param {number} deltaBalance - Amount to add/subtract
 * @param {number} deltaRep - Reputation change
 */
export async function updateTBM(deltaBalance = 0, deltaRep = 0) {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  const ref = doc(db, "tbm", uid);

  try {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      const data = docSnap.data();
      await updateDoc(ref, {
        balance: (data.balance || 0) + deltaBalance,
        reputation: (data.reputation || 0) + deltaRep,
        lastActivity: serverTimestamp()
      });
    } else {
      // If TBM account doesn't exist, initialize and update
      await setDoc(ref, {
        balance: deltaBalance,
        reputation: deltaRep,
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp()
      });
    }
  } catch (err) {
    console.error("Error updating TBM:", err);
  }
}

/**
 * Fetch TBM data for the current user
 * @returns {Promise<{balance: number, reputation: number}>}
 */
export async function getTBM() {
  if (!auth.currentUser) return { balance: 0, reputation: 0 };
  const uid = auth.currentUser.uid;
  const ref = doc(db, "tbm", uid);

  try {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        balance: data.balance || 0,
        reputation: data.reputation || 0
      };
    } else {
      return { balance: 0, reputation: 0 };
    }
  } catch (err) {
    console.error("Error fetching TBM:", err);
    return { balance: 0, reputation: 0 };
  }
}

/**
 * Award TBM for user actions
 * Example: posting, commenting, liking
 * @param {string} action - Action type
 */
export async function rewardAction(action) {
  switch (action) {
    case "post":
      await updateTBM(10, 2);
      break;
    case "like":
      await updateTBM(1, 0.5);
      break;
    case "comment":
      await updateTBM(2, 1);
      break;
    case "dm":
      await updateTBM(1, 0.5);
      break;
    default:
      break;
  }
}