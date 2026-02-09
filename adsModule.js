// adsModule.js
// Handles in-app ads for TRIBERIUM MVP

import { db } from "./firebaseSetup.js";
import { collection, getDocs } from "firebase/firestore";

// -------------------------------
// Fetch ads from Firebase
// -------------------------------
export async function fetchAds(limitCount = 5) {
  try {
    const adsSnapshot = await getDocs(collection(db, "ads"));
    const ads = [];
    adsSnapshot.forEach(doc => ads.push({ id: doc.id, ...doc.data() }));
    return ads.slice(0, limitCount); // limit number of ads shown
  } catch (error) {
    console.error("Fetch ads error:", error.message);
    return [];
  }
}

// -------------------------------
// Render ads in a container
// containerSelector example: "#ads-container"
// -------------------------------
export async function displayAds(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const ads = await fetchAds();
  container.innerHTML = ""; // clear existing

  ads.forEach(ad => {
    const adElement = document.createElement("div");
    adElement.classList.add("ad-card");

    adElement.innerHTML = `
      <a href="${ad.link}" target="_blank">
        <img src="${ad.imageUrl}" alt="${ad.title}" class="ad-image"/>
        <h4 class="ad-title">${ad.title}</h4>
        <p class="ad-description">${ad.description}</p>
      </a>
    `;

    container.appendChild(adElement);
  });
}
