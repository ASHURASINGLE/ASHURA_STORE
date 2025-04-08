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
const db = firebase.database();
const auth = firebase.auth();

let currentUser = null;

// Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loadProducts();
    loadOrders();
    loadProfile();
    loadNotices();
  } else {
    window.location.href = "index.html";
  }
});

// Tab navigation
document.querySelectorAll(".bottom-nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// Load products
function loadProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";
  db.ref("products").once("value", snapshot => {
    snapshot.forEach(child => {
      const data = child.val();
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${data.imageUrl}" alt="Product" />
        <h3>${data.name}</h3>
        <p>${data.description}</p>
        <p><b>Price:</b> ₹${data.price || 'N/A'}</p>
        <button onclick="buyProduct('${child.key}')">Buy</button>
      `;
      container.appendChild(card);
    });
  });
}

// Buy redirect
function buyProduct(productId) {
  window.location.href = `buy.html?id=${productId}`;
}

// Load orders
function loadOrders() {
  const ordersContainer = document.getElementById("orders");
  ordersContainer.innerHTML = "";
  db.ref("orders").orderByChild("uid").equalTo(currentUser.uid).once("value", snapshot => {
    if (!snapshot.exists()) {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
      return;
    }
    snapshot.forEach(order => {
      const data = order.val();
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <h3>${data.productName}</h3>
        <p>UTR: ${data.utr}</p>
        <p>Status: ${data.status || 'Pending'}</p>
      `;
      ordersContainer.appendChild(card);
    });
  });
}

// Load profile
function loadProfile() {
  const profile = document.getElementById("profile");
  const user = auth.currentUser;
  profile.innerHTML = `
    <p>Email: ${user.email}</p>
    <p>Phone: ${user.phoneNumber || 'N/A'}</p>
    <p>UID: ${user.uid}</p>
    <p>Last Login: ${new Date(user.metadata.lastSignInTime).toLocaleString()}</p>
    <button onclick="logout()">Logout</button>
  `;
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

// Notices
function loadNotices() {
  const header = document.querySelector("header");
  db.ref("store/info").once("value", snap => {
    const info = snap.val();
    if (info) {
      if (info.name) document.getElementById("storeTitle").textContent = info.name;
      if (info.description) document.getElementById("storeDesc").textContent = info.description;
    }
  });

  db.ref("store/notice").once("value", snap => {
    const msg = snap.val();
    if (msg) {
      const notice = document.createElement("div");
      notice.className = "notice-box";
      notice.innerText = msg;
      header.appendChild(notice);
    }
  });

  db.ref("store/float").once("value", snap => {
    const float = snap.val();
    if (float) {
      const floatBox = document.createElement("div");
      floatBox.style.position = "fixed";
      floatBox.style.bottom = "60px";
      floatBox.style.right = "10px";
      floatBox.style.background = "#1a1a1a";
      floatBox.style.color = "red";
      floatBox.style.padding = "10px";
      floatBox.style.border = "1px solid red";
      floatBox.style.borderRadius = "10px";
      floatBox.style.boxShadow = "0 0 10px red";
      floatBox.innerText = float;
      document.body.appendChild(floatBox);
    }
  });
}
