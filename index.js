// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAugPdSj7R0AAjBLYu6jt2W1CarzTNISPY",
  authDomain: "ashura-6cb98.firebaseapp.com",
  databaseURL: "https://ashura-6cb98-default-rtdb.firebaseio.com",
  projectId: "ashura-6cb98",
  storageBucket: "ashura-6cb98.appspot.com",
  messagingSenderId: "990827476073",
  appId: "1:990827476073:android:833691f1a9f1d4b7a51ef8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Elements
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginError = document.getElementById("loginError");
const regError = document.getElementById("regError");

// Toggle Tabs
loginTab.addEventListener("click", () => {
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginError.classList.add("hidden");
});

registerTab.addEventListener("click", () => {
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  regError.classList.add("hidden");
});

// Login
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(() => {
      loginError.classList.remove("hidden");
    });
});

// Register
document.getElementById("registerBtn").addEventListener("click", () => {
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (email && password && phone) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        const uid = userCred.user.uid;
        return set(ref(db, "users/" + uid), {
          email: email,
          phone: phone
        });
      })
      .then(() => {
        window.location.href = "home.html";
      })
      .catch(() => {
        regError.classList.remove("hidden");
      });
  } else {
    regError.classList.remove("hidden");
  }
});

// Protect Routes
onAuthStateChanged(auth, (user) => {
  const protectedPages = ["home.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (!user && protectedPages.includes(currentPage)) {
    window.location.href = "index.html";
  }
});
