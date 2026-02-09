// ============================
// TRIBERIUM MVP — Ads System
// ============================

import { getFirestore, collection, getDocs } from "firebase/firestore";
const db = getFirestore();

/**
 * Fetch ads from Firestore collection
 * Ads can include: image, title, description, link
 */
export async function fetchAds() {
  try {
    const adsRef = collection(db, "ads");
    const snapshot = await getDocs(adsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching ads:", err);
    return [];
  }
}

/**
 * Render ads into a container
 * @param {HTMLElement} container
 */
export async function renderAds(container) {
  container.innerHTML = "";
  const ads = await fetchAds();
  if (!ads.length) {
    container.innerHTML = "<p class='center'>No ads available</p>";
    return;
  }

  ads.forEach(ad => {
    const adDiv = document.createElement("div");
    adDiv.className = "ad-item";

    adDiv.innerHTML = `
      <a href="${ad.link || '#'}" target="_blank">
        <img src="${ad.image}" alt="${ad.title}" />
        <h4>${ad.title}</h4>
        <p>${ad.description}</p>
      </a>
    `;

    container.appendChild(adDiv);
  });
}