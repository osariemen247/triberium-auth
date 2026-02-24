/* ===================== STORIES JS ===================== */
document.addEventListener("DOMContentLoaded", () => {
  const storyModal = document.getElementById("storyModal");
  const storyImage = document.getElementById("storyImage");
  const storyUsername = document.getElementById("storyUsername");
  const closeStoryModal = document.getElementById("closeStoryModal");

  const stories = document.querySelectorAll(".story");

  stories.forEach(story => {
    story.addEventListener("click", () => {
      const img = story.querySelector("img").src;
      const username = story.querySelector("span").textContent;
      storyImage.src = img;
      storyUsername.textContent = username;
      storyModal.style.display = "flex";
    });
  });

  closeStoryModal.addEventListener("click", () => {
    storyModal.style.display = "none";
  });

  // Close modal when clicking outside
  storyModal.addEventListener("click", e => {
    if (e.target.id === "storyModal") storyModal.style.display = "none";
  });
});
