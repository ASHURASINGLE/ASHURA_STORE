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

function showLogin() {
  document.getElementById('loginBox').classList.remove('hidden');
  document.getElementById('registerBox').classList.add('hidden');
}

function showRegister() {
  document.getElementById('registerBox').classList.remove('hidden');
  document.getElementById('loginBox').classList.add('hidden');
}

function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorMsg = document.getElementById('loginError');

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(() => {
      errorMsg.classList.remove('hidden');
    });
}

function registerUser() {
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const phone = document.getElementById('regPhone').value;
  const errorMsg = document.getElementById('registerError');

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      db.ref('users/' + userId).set({
        email: email,
        phone: phone
      });
      showLogin();
    })
    .catch(() => {
      errorMsg.classList.remove('hidden');
    });
}

// Redirection protection for pages
auth.onAuthStateChanged((user) => {
  const currentPage = window.location.pathname;
  const isProtectedPage = currentPage.includes('home.html') || currentPage.includes('admin.html');

  if (isProtectedPage && !user) {
    window.location.href = "index.html";
  }
});
