/* ===================== PROFILE JS ===================== */
document.addEventListener("DOMContentLoaded", () => {
  const editProfileBtn = document.getElementById("editProfileBtn");
  const editProfileModal = document.getElementById("editProfileModal");
  const closeEditProfile = document.getElementById("closeEditProfile");
  const followBtn = document.getElementById("profileFollowBtn");

  // ================= EDIT PROFILE MODAL =================
  editProfileBtn?.addEventListener("click", () => {
    editProfileModal.style.display = "flex";
  });

  closeEditProfile?.addEventListener("click", () => {
    editProfileModal.style.display = "none";
  });

  // ================= FOLLOW / UNFOLLOW =================
  followBtn?.addEventListener("click", () => {
    if (followBtn.classList.contains("following")) {
      followBtn.textContent = "Follow";
      followBtn.classList.remove("following");
    } else {
      followBtn.textContent = "Following";
      followBtn.classList.add("following");
    }
    // You can link this to Firestore for persistence
  });

  // ================= PROFILE POSTS ACTIONS =================
  document.querySelectorAll(".profile-post .action").forEach(btn => {
    btn.addEventListener("click", async () => {
      const postId = btn.closest(".profile-post").dataset.postId;
      const uid = "CURRENT_USER_UID"; // Replace with actual user id
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
        // Add post to user's profile / re-share logic
      }
      if (btn.classList.contains("comment")) {
        const commentModal = document.getElementById("profileCommentModal");
        commentModal.style.display = "flex";

        document.getElementById("submitProfileComment").onclick = async () => {
          const text = document.getElementById("profileCommentText").value;
          if (text.length > 0) {
            // Firestore add comment logic
            document.getElementById("profileCommentText").value = "";
            commentModal.style.display = "none";
          }
        };
      }
      if (btn.classList.contains("share")) {
        // Share post logic
        alert("Post shared successfully!");
      }
    });
  });

  // ================= MODAL CLOSE HANDLER =================
  document.querySelectorAll(".profile-modal").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target.classList.contains("profile-modal")) modal.style.display = "none";
    });
  });
});
