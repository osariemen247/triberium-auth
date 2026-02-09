function setStatus(message) {
  document.getElementById("status").innerText = message;
}

// Email Sign Up
function emailSignUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => setStatus("Account created successfully"))
    .catch(error => setStatus(error.message));
}

// Email Login
function emailLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => setStatus("Logged in successfully"))
    .catch(error => setStatus(error.message));
}

// Google Login
function googleLogin() {
  auth.signInWithPopup(googleProvider)
    .then(() => setStatus("Google login successful"))
    .catch(error => setStatus(error.message));
}

// Auth State Listener
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User logged in:", user.email);
  }
});
