// metricsModule.js
// Metrics & analytics for TRIBERIUM MVP

import { db } from "./firebaseModule.js";
import { doc, setDoc, increment } from "firebase/firestore";

export async function trackMetric(type) {
  const ref = doc(db, "metrics", "global");
  await setDoc(
    ref,
    { [type]: increment(1) },
    { merge: true }
  );
}

export async function trackUserAction(uid, action) {
  const ref = doc(db, "userMetrics", uid);
  await setDoc(
    ref,
    { [action]: increment(1) },
    { merge: true }
  );
    }
