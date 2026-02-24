/* ===================== FEED ACTIONS JS ===================== */
document.addEventListener("DOMContentLoaded", () => {
  const commentModal = document.getElementById("commentModal");
  const submitComment = document.getElementById("submitComment");

  document.querySelectorAll(".post .action").forEach(btn => {
    btn.addEventListener("click", async () => {
      const postId = btn.closest(".post").dataset.postId;
      const uid = "CURRENT_USER_UID"; // Replace with actual user ID

      if (btn.classList.contains("like")) {
        btn.classList.toggle("active");
        // Firestore update for likes
      }
      if (btn.classList.contains("save")) {
        btn.classList.toggle("active");
        // Firestore update for saves
      }
      if (btn.classList.contains("retribe")) {
        btn.classList.toggle("active");
        // Add post to user's profile
      }
      if (btn.classList.contains("comment")) {
        commentModal.style.display = "flex";
        submitComment.onclick = async () => {
          const text = document.getElementById("commentText").value;
          if (text.length > 0) {
            // Firestore add comment
            document.getElementById("commentText").value = "";
            commentModal.style.display = "none";
          }
        };
      }
      if (btn.classList.contains("share")) {
        alert("Post shared successfully!");
      }
    });
  });

  // Close comment modal when clicking outside
  commentModal.addEventListener("click", e => {
    if (e.target.id === "commentModal") commentModal.style.display = "none";
  });
});
