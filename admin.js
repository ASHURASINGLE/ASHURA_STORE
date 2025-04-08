// Firebase initialization
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
const database = firebase.database();
const storage = firebase.storage();

// Tab switching
const menuButtons = document.querySelectorAll('.menu button');
const sections = document.querySelectorAll('.section');

menuButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    menuButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.getAttribute('data-target');
    sections.forEach(sec => {
      sec.classList.remove('active');
      if (sec.id === target) sec.classList.add('active');
    });
  });
});

// Dashboard stats
function updateDashboardStats() {
  database.ref('users').once('value', snapshot => {
    const users = snapshot.val() || {};
    const totalUsers = Object.keys(users).length;
    document.getElementById('totalUsers').textContent = totalUsers;

    let registeredUsers = 0;
    Object.values(users).forEach(u => {
      if (u.email && u.phone) registeredUsers++;
    });

    document.getElementById('registeredUsers').textContent = registeredUsers;
  });

  database.ref('orders').once('value', snapshot => {
    const orders = snapshot.val() || {};
    const totalOrders = Object.keys(orders).length;
    document.getElementById('totalOrders').textContent = totalOrders;
  });
}
updateDashboardStats();

// Load all users
function loadAllUsers() {
  const usersList = document.getElementById('usersList');
  usersList.innerHTML = '';

  database.ref('users').once('value', snapshot => {
    const users = snapshot.val();
    if (!users) return;

    Object.entries(users).forEach(([uid, user]) => {
      const card = document.createElement('div');
      card.classList.add('user-card');
      card.innerHTML = `
        <p><strong>UID:</strong> ${uid}</p>
        <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
        <button onclick="deleteUser('${uid}')">Delete</button>
        <button onclick="blockUser('${uid}')">Block</button>
      `;
      usersList.appendChild(card);
    });
  });
}

// Delete user
function deleteUser(uid) {
  if (confirm("Are you sure you want to delete this user?")) {
    database.ref(`users/${uid}`).remove().then(() => {
      alert("User deleted.");
      loadAllUsers();
    });
  }
}

// Block user
function blockUser(uid) {
  database.ref(`users/${uid}/blocked`).set(true).then(() => {
    alert("User blocked.");
    loadAllUsers();
  });
}

// Load orders
function loadOrders() {
  const orderList = document.getElementById('orderList');
  orderList.innerHTML = '';

  database.ref('orders').once('value', snapshot => {
    const orders = snapshot.val();
    if (!orders) return;

    Object.entries(orders).forEach(([key, order]) => {
      const card = document.createElement('div');
      card.classList.add('order-card');
      card.innerHTML = `
        <p><strong>Order ID:</strong> ${key}</p>
        <p><strong>User Name:</strong> ${order.name}</p>
        <p><strong>UTR:</strong> ${order.utr}</p>
        <p><strong>Status:</strong> ${order.status || 'Pending'}</p>
        <button onclick="updateOrderStatus('${key}', 'Confirmed')">Mark Confirmed</button>
        <button onclick="updateOrderStatus('${key}', 'Rejected')">Mark Rejected</button>
      `;
      orderList.appendChild(card);
    });
  });
}

function updateOrderStatus(orderId, status) {
  database.ref(`orders/${orderId}/status`).set(status).then(() => {
    alert(`Order status updated to ${status}.`);
    loadOrders();
  });
}

// Upload QR code
document.getElementById('qrUpload').addEventListener('change', function () {
  const file = this.files[0];
  const storageRef = storage.ref(`paymentQR/qr.png`);
  storageRef.put(file).then(() => {
    alert("QR code uploaded successfully.");
  });
});

// Initialize
loadAllUsers();
loadOrders();
