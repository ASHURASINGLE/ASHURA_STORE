// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAugPdSj7R0AAjBLYu6jt2W1CarzTNISPY",
  authDomain: "ashura-6cb98.firebaseapp.com",
  databaseURL: "https://ashura-6cb98-default-rtdb.firebaseio.com",
  projectId: "ashura-6cb98",
  storageBucket: "ashura-6cb98.appspot.com",
  messagingSenderId: "990827476073",
  appId: "1:990827476073:android:833691f1a9f1d4b7a51ef8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Show login/register boxes
function showLogin() {
  document.getElementById("loginBox").classList.remove("hidden");
  document.getElementById("registerBox").classList.add("hidden");
}
function showRegister() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("registerBox").classList.remove("hidden");
}

// Register User
function registerUser() {
  const email = document.getElementById("regEmail").value;
  const phone = document.getElementById("regPhone").value;
  const password = document.getElementById("regPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      db.ref("users/" + uid).set({
        email: email,
        phone: phone
      });
      window.location.href = "home.html";
    })
    .catch((error) => {
      alert("Register error: " + error.message);
    });
}

// Login User
function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(() => {
      const errMsg = document.getElementById("errorMessage");
      errMsg.classList.remove("hidden");
      errMsg.classList.add("show");
      setTimeout(() => {
        errMsg.classList.remove("show");
        errMsg.classList.add("hidden");
      }, 4000);
    });
}
