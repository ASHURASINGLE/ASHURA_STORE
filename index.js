// Firebase config (replace this with your own if needed)
const firebaseConfig = {
  apiKey: "AIzaSyAugPdSj7R0AAjBLYu6jt2W1CarzTNISPY",
  authDomain: "ashura-6cb98.firebaseapp.com",
  databaseURL: "https://ashura-6cb98-default-rtdb.firebaseio.com",
  projectId: "ashura-6cb98",
  storageBucket: "ashura-6cb98.appspot.com",
  messagingSenderId: "990827476073",
  appId: "1:990827476073:web:your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

function showLogin() {
  document.getElementById('loginBox').classList.remove('hidden');
  document.getElementById('registerBox').classList.add('hidden');
}

function showRegister() {
  document.getElementById('registerBox').classList.remove('hidden');
  document.getElementById('loginBox').classList.add('hidden');
}

function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const errorBox = document.getElementById("loginError");
  errorBox.classList.add("hidden");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(() => {
      errorBox.classList.remove("hidden");
    });
}

function registerUser() {
  const email = document.getElementById("regEmail").value;
  const phone = document.getElementById("regPhone").value;
  const password = document.getElementById("regPassword").value;
  const errorBox = document.getElementById("registerError");
  errorBox.classList.add("hidden");

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      db.ref("users/" + user.uid).set({ email, phone });
      window.location.href = "home.html";
    })
    .catch(() => {
      errorBox.classList.remove("hidden");
    });
}

// Optional: Add this to home.html to protect access
// auth.onAuthStateChanged(user => {
//   if (!user) window.location.href = "index.html";
// });
