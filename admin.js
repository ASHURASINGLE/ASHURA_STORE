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

// Allow only admin access
auth.onAuthStateChanged(user => {
  if (!user || user.email !== "ASHURA@gmail.com") {
    alert("Access Denied. Admins only.");
    window.location.href = "index.html";
  }
});

// Toggle drawer
document.getElementById('toggleDrawer').addEventListener('click', () => {
  document.getElementById('drawer').classList.toggle('open');
});

// Section switching
document.querySelectorAll('.drawer li').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = item.getAttribute('data-target');
    if (target) document.getElementById(target).classList.add('active');
  });
});

// Update store info
document.getElementById('updateStoreBtn').addEventListener('click', () => {
  const name = document.getElementById('storeName').value.trim();
  const desc = document.getElementById('storeDesc').value.trim();

  if (name && desc) {
    database.ref('store').set({ name, description: desc })
      .then(() => alert('Store info updated.'))
      .catch(err => alert(err.message));
  } else {
    alert('Please enter both name and description.');
  }
});

// Upload QR code
document.getElementById('uploadQR').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const base64 = reader.result;
    database.ref("qr").set({ image: base64 });
    document.getElementById('qrImage').src = base64;
  };
  reader.readAsDataURL(file);
});

// Upload Product
document.getElementById('addProductBtn').addEventListener('click', () => {
  const name = document.getElementById('productName').value.trim();
  const desc = document.getElementById('productDesc').value.trim();
  const file = document.getElementById('productImage').files[0];

  if (!name || !desc || !file) return alert("Fill all fields and select image.");

  const reader = new FileReader();
  reader.onload = function () {
    const image = reader.result;
    const id = Date.now();
    database.ref("products/" + id).set({ id, name, description: desc, image });
    alert("Product added!");
    document.getElementById('productName').value = '';
    document.getElementById('productDesc').value = '';
    document.getElementById('productImage').value = '';
  };
  reader.readAsDataURL(file);
});

// Send Notices
document.getElementById('updateNoticeBtn').addEventListener('click', () => {
  const notice = document.getElementById('noticeText').value.trim();
  if (!notice) return alert("Enter notice");
  database.ref("notice").set({ text: notice });
  alert("Floating notice updated");
});

document.getElementById('maintenanceBtn').addEventListener('click', () => {
  const text = document.getElementById('maintenanceText').value.trim();
  if (!text) return alert("Enter maintenance message");
  database.ref("maintenance").set({ text });
  alert("Maintenance notice updated");
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
});
