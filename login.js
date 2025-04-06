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

function showLoading(show) {
  document.getElementById('loading').classList.toggle('hidden', !show);
}

function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  showLoading(true);
  auth.signInWithEmailAndPassword(email, password)
    .then(() => location.href = 'home.html')
    .catch(err => alert(err.message))
    .finally(() => showLoading(false));
}

function registerUser() {
  const email = document.getElementById('regEmail').value;
  const phone = document.getElementById('regPhone').value;
  const password = document.getElementById('regPassword').value;
  showLoading(true);
  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.ref('users/' + cred.user.uid).set({ email, phone });
    })
    .then(() => location.href = 'home.html')
    .catch(err => alert(err.message))
    .finally(() => showLoading(false));
}
