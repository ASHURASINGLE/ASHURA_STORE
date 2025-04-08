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

// Tabs switch
const tabs = document.querySelectorAll(".tabs button");
const sections = document.querySelectorAll(".section");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    sections[index].classList.add("active");
  });
});

// Check login
auth.onAuthStateChanged(user => {
  if (user) {
    loadProducts();
    loadProfile(user);
    loadOrders(user.uid);
    loadStoreInfo();
  } else {
    window.location.href = "index.html";
  }
});

// Load products
function loadProducts() {
  const container = document.getElementById("product-section");
  db.ref("products").once("value", snapshot => {
    container.innerHTML = "";
    if (!snapshot.exists()) {
      container.innerHTML = "<p>No products available.</p>";
      return;
    }
    snapshot.forEach(child => {
      const product = child.val();
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <h3>${product.name}</h3>
        <p><b>Price:</b> ₹${product.price}</p>
        <p>${product.description}</p>
        <button onclick="buyProduct('${child.key}')">Buy</button>
      `;
      container.appendChild(div);
    });
  });
}

// Redirect to buy page
function buyProduct(productId) {
  window.location.href = `buy.html?id=${productId}`;
}

// Load profile section
function loadProfile(user) {
  const profileSection = document.getElementById("profile-section");
  db.ref("users/" + user.uid).once("value", snapshot => {
    const userData = snapshot.val() || {};
    profileSection.innerHTML = `
      <div class="profile-info">Email: ${user.email}</div>
      <div class="profile-info">Phone: ${userData.phone || 'Not Provided'}</div>
      <div class="profile-info">UID: ${user.uid}</div>
      <div class="profile-info">Last Login: ${new Date(user.metadata.lastSignInTime).toLocaleString()}</div>
      <button class="logout-btn" onclick="logout()">Logout</button>
    `;
  });
}

// Load user orders
function loadOrders(uid) {
  const orderSection = document.getElementById("order-section");
  db.ref("orders").orderByChild("uid").equalTo(uid).once("value", snapshot => {
    orderSection.innerHTML = "";
    if (!snapshot.exists()) {
      orderSection.innerHTML = "<p>No orders found.</p>";
      return;
    }
    snapshot.forEach(orderSnap => {
      const order = orderSnap.val();
      const div = document.createElement("div");
      div.className = "order-item";
      div.innerHTML = `
        <p><b>Product:</b> ${order.productName}</p>
        <p><b>Name:</b> ${order.name}</p>
        <p><b>UTR:</b> ${order.utr}</p>
        <p><b>Status:</b> ${order.status}</p>
      `;
      orderSection.appendChild(div);
    });
  });
}

// Load and display store name and description
function loadStoreInfo() {
  const storeNameEl = document.getElementById("store-name");
  const storeDescEl = document.getElementById("store-desc");

  db.ref("storeInfo").once("value", snapshot => {
    const info = snapshot.val();
    storeNameEl.textContent = info?.name || "ASHURA STORE";
    storeDescEl.textContent = info?.description || "Welcome to our dark store.";
  });
}

// Logout function
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
