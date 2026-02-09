// tbmWallet.js
// SocialFi TBM wallet integration

import { auth, db } from "./firebaseSetup.js";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// -------------------------------
// Get current user's TBM balance
// -------------------------------
export async function getTBMBalance() {
  if (!auth.currentUser) return 0;

  const walletRef = doc(db, "wallets", auth.currentUser.uid);
  const snap = await getDoc(walletRef);
  return snap.exists() ? snap.data().balance : 0;
}

// -------------------------------
// Update TBM balance (reward / spend)
// -------------------------------
export async function updateTBMBalance(amount, reason = "unknown") {
  if (!auth.currentUser) return;

  const walletRef = doc(db, "wallets", auth.currentUser.uid);
  const snap = await getDoc(walletRef);
  const currentBalance = snap.exists() ? snap.data().balance : 0;

  try {
    await setDoc(walletRef, {
      balance: currentBalance + amount,
      lastUpdated: serverTimestamp(),
      lastReason: reason
    }, { merge: true });

    console.log(`TBM balance updated by ${amount} for ${reason}`);
  } catch (error) {
    console.error("Update TBM error:", error.message);
  }
}

// -------------------------------
// Transfer TBM to another user
// -------------------------------
export async function transferTBM(toUid, amount) {
  if (!auth.currentUser || amount <= 0) return;

  const fromWalletRef = doc(db, "wallets", auth.currentUser.uid);
  const toWalletRef = doc(db, "wallets", toUid);

  const fromSnap = await getDoc(fromWalletRef);
  const toSnap = await getDoc(toWalletRef);

  const fromBalance = fromSnap.exists() ? fromSnap.data().balance : 0;
  const toBalance = toSnap.exists() ? toSnap.data().balance : 0;

  if (fromBalance < amount) {
    console.error("Insufficient TBM balance");
    return;
  }

  try {
    await updateDoc(fromWalletRef, { balance: fromBalance - amount, lastUpdated: serverTimestamp(), lastReason: "transfer" });
    await setDoc(toWalletRef, { balance: toBalance + amount, lastUpdated: serverTimestamp(), lastReason: "received_transfer" }, { merge: true });
    console.log(`Transferred ${amount} TBM to ${toUid}`);
  } catch (error) {
    console.error("Transfer TBM error:", error.message);
  }
}
