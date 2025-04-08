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

// Drawer Navigation
const links = document.querySelectorAll(".drawer a");
const sections = document.querySelectorAll(".section");

links.forEach((link, index) => {
  link.addEventListener("click", () => {
    links.forEach(l => l.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));
    link.classList.add("active");
    sections[index].classList.add("active");

    if (link.id === "dashboard-link") loadDashboard();
    if (link.id === "users-link") loadUsers();
    if (link.id === "orders-link") loadOrders();
    if (link.id === "qr-link") loadQRCode();
    if (link.id === "store-link") loadStoreDetails();
  });
});

// Auth Check
auth.onAuthStateChanged(user => {
  if (user) {
    loadDashboard();
    document.getElementById("dashboard").classList.add("active");
    document.getElementById("dashboard-link").classList.add("active");
  } else {
    window.location.href = "index.html";
  }
});

// Dashboard
function loadDashboard() {
  db.ref("users").once("value", usersSnap => {
    db.ref("orders").once("value", ordersSnap => {
      document.getElementById("total-users").innerText = usersSnap.numChildren();
      document.getElementById("total-orders").innerText = ordersSnap.numChildren();
    });
  });
}

// Load Users
function loadUsers() {
  const container = document.getElementById("users-container");
  container.innerHTML = "";
  db.ref("users").once("value", snap => {
    snap.forEach(child => {
      const user = child.val();
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Phone:</b> ${user.phone || "Not Provided"}</p>
        <p><b>Status:</b> ${user.blocked ? "Blocked" : "Active"}</p>
        <button onclick="toggleBlock('${child.key}', ${!!user.blocked})">${user.blocked ? "Unblock" : "Block"}</button>
        <button onclick="deleteUser('${child.key}')">Delete</button>
      `;
      container.appendChild(div);
    });
  });
}

function toggleBlock(uid, status) {
  db.ref("users/" + uid).update({ blocked: !status });
  loadUsers();
}

function deleteUser(uid) {
  db.ref("users/" + uid).remove();
  loadUsers();
}

// Load Orders
function loadOrders() {
  const container = document.getElementById("orders-container");
  container.innerHTML = "";
  db.ref("orders").once("value", snap => {
    snap.forEach(child => {
      const order = child.val();
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <p><b>Product:</b> ${order.productName}</p>
        <p><b>Name:</b> ${order.name}</p>
        <p><b>UTR:</b> ${order.utr}</p>
        <p><b>Status:</b> ${order.status}</p>
        <button onclick="updateOrderStatus('${child.key}', 'Completed')">Mark Completed</button>
      `;
      container.appendChild(div);
    });
  });
}

function updateOrderStatus(orderId, status) {
  db.ref("orders/" + orderId).update({ status });
  loadOrders();
}

// Load QR Code
function loadQRCode() {
  const container = document.getElementById("qr-container");
  container.innerHTML = "";
  db.ref("qr").once("value", snap => {
    const qr = snap.val();
    const img = document.createElement("img");
    img.src = qr?.url || "";
    img.style.maxWidth = "200px";
    container.appendChild(img);
  });
}

document.getElementById("qr-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const url = document.getElementById("qr-url").value;
  db.ref("qr").set({ url });
  loadQRCode();
});

// Load Store Info
function loadStoreDetails() {
  db.ref("store").once("value", snap => {
    const store = snap.val() || {};
    document.getElementById("store-name").value = store.name || "";
    document.getElementById("store-desc").value = store.description || "";
  });
}

document.getElementById("store-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("store-name").value;
  const description = document.getElementById("store-desc").value;
  db.ref("store").set({ name, description });
  alert("Store info updated.");
});
