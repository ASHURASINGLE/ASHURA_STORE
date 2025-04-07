// index.js

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
const database = firebase.database();

// Tab switching
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const statusMessage = document.getElementById('statusMessage');

loginTab.onclick = () => {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
};

registerTab.onclick = () => {
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
};

// Login logic
document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      statusMessage.innerText = "Login successful!";
      window.location.href = "home.html";
    })
    .catch(error => {
      statusMessage.innerText = "Login failed: " + error.message;
    });
});

// Register logic
document.getElementById('registerBtn').addEventListener('click', () => {
  const email = document.getElementById('registerEmail').value;
  const phone = document.getElementById('registerPhone').value;
  const password = document.getElementById('registerPassword').value;

  if (!email || !phone || !password) {
    statusMessage.innerText = "Please fill in all fields.";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      return database.ref('users/' + user.uid).set({
        email: email,
        phone: phone,
        uid: user.uid
      });
    })
    .then(() => {
      statusMessage.innerText = "Registration successful!";
      window.location.href = "home.html";
    })
    .catch(error => {
      statusMessage.innerText = "Registration failed: " + error.message;
    });
});
