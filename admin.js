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

// Drawer toggle
document.getElementById("drawerToggle").addEventListener("click", () => {
  const drawer = document.getElementById("drawer");
  drawer.classList.toggle("open");
});

// Auth check
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    checkIfAdmin(user.uid);
  }
});

// Check admin
function checkIfAdmin(uid) {
  db.ref("users/" + uid).once("value").then(snapshot => {
    const data = snapshot.val();
    if (!data || data.role !== "admin") {
      alert("Access denied.");
      auth.signOut();
    }
  });
}
