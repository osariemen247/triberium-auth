// walletModule.js
// TBM Wallet system (SocialFi MVP)

import { db, auth } from "./firebaseModule.js";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

export async function getBalance() {
  const ref = doc(db, "wallets", auth.currentUser.uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().balance : 0;
}

export async function creditTBM(amount) {
  const ref = doc(db, "wallets", auth.currentUser.uid);
  await setDoc(ref, { balance: increment(amount) }, { merge: true });
}

export async function sendTBM(toUid, amount) {
  const fromRef = doc(db, "wallets", auth.currentUser.uid);
  const toRef = doc(db, "wallets", toUid);

  await updateDoc(fromRef, { balance: increment(-amount) });
  await setDoc(toRef, { balance: increment(amount) }, { merge: true });
}
