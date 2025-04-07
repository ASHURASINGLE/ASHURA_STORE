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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// UI logic
function showLogin() {
  document.getElementById('loginBox').classList.remove('hidden');
  document.getElementById('registerBox').classList.add('hidden');
}

function showRegister() {
  document.getElementById('registerBox').classList.remove('hidden');
  document.getElementById('loginBox').classList.add('hidden');
}

// Register function
function registerUser() {
  const email = document.getElementById("regEmail").value;
  const phone = document.getElementById("regPhone").value;
  const password = document.getElementById("regPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => {
      const uid = userCred.user.uid;
      return database.ref("users/" + uid).set({ email, phone });
    })
    .then(() => {
      alert("Registered Successfully!");
      window.location.href = "home.html";
    })
    .catch(err => {
      document.getElementById("registerError").classList.remove("hidden");
      console.error(err.message);
    });
}

// Login function
function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => {
      document.getElementById("errorMessage").classList.remove("hidden");
      console.error(err.message);
    });
}

// Redirect protection
auth.onAuthStateChanged(user => {
  const path = window.location.pathname;
  if (!user && path.includes("home.html")) {
    window.location.href = "index.html";
  }
});
