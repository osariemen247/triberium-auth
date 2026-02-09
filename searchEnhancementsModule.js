// searchEnhancementsModule.js
// Enhanced search UX for TRIBERIUM

import { db } from "./firebaseModule.js";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function autoCompleteSearch(term, type = "users") {
  if (!term) return [];

  const ref = collection(db, type);
  const q = query(ref, where("keywords", "array-contains", term.toLowerCase()));
  const snap = await getDocs(q);

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
