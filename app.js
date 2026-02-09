// --- Get DOM elements ---
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signup');
const loginBtn = document.getElementById('login');
const googleBtn = document.getElementById('googleLogin');

// --- Email/Password Signup ---
signupBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Send verification email
      user.sendEmailVerification()
        .then(() => {
          alert("Verification email sent! Check your inbox.");
        })
        .catch((error) => {
          console.error("Error sending email verification:", error);
        });

      console.log("User signed up:", user.email);
    })
    .catch((error) => {
      console.error(error.code, error.message);
    });
});

// --- Email/Password Login ---
loginBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert("Please verify your email first!");
        firebase.auth().signOut();
        return;
      }

      console.log("User logged in:", user.email);
    })
    .catch((error) => {
      console.error(error.code, error.message);
    });
});

// --- Google Login ---
googleBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log("Google login success:", user.email);
    })
    .catch((error) => {
      console.error(error.code, error.message);
    });
});
