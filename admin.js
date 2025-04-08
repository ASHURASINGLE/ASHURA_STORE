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
const db = firebase.database();

// Admin email
const adminEmail = "ASHURA@gmail.com";

// Auth check
auth.onAuthStateChanged(user => {
  if (!user || user.email !== adminEmail) {
    alert("Access Denied. Only admin can access.");
    window.location.href = "index.html";
  }
});

// Drawer toggle
const drawerToggle = document.getElementById("drawerToggle");
const drawer = document.getElementById("drawer");
drawerToggle.addEventListener("click", () => {
  drawer.classList.toggle("open");
});

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
