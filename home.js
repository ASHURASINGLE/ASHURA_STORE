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
const database = firebase.database();
const auth = firebase.auth();

// Auth protection
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadUserData(user);
    loadProducts();
    loadOrders(user.uid);
    loadNotices();
  }
});

// Tab switching
const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".section");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

// Load products
function loadProducts() {
  database.ref("products").once("value", snap => {
    const container = document.getElementById("products");
    container.innerHTML = "";
    snap.forEach(child => {
      const data = child.val();
      const key = child.key;
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${data.imageUrl}" alt="Product">
        <h3>${data.name}</h3>
        <p>${data.description}</p>
        <p class="price">₹${data.price || "N/A"}</p>
        <button onclick="buyProduct('${key}')">Buy</button>
      `;
      container.appendChild(card);
    });
  });
}

// Buy button click
function buyProduct(productId) {
  window.location.href = `buy.html?id=${productId}`;
}

// Load user orders
function loadOrders(uid) {
  database.ref("orders").orderByChild("userId").equalTo(uid).once("value", snap => {
    const container = document.getElementById("orders");
    container.innerHTML = "";
    if (!snap.exists()) {
      container.innerHTML = "<p>No orders found.</p>";
      return;
    }
    snap.forEach(child => {
      const data = child.val();
      const div = document.createElement("div");
      div.className = "order-card";
      div.innerHTML = `
        <h4>${data.productName}</h4>
        <p>UTR: ${data.utr}</p>
        <p>Status: ${data.status || "Pending"}</p>
      `;
      container.appendChild(div);
    });
  });
}

// Load profile
function loadUserData(user) {
  document.getElementById("userEmail").innerText = user.email;
  document.getElementById("userUID").innerText = user.uid;
  document.getElementById("userPhone").innerText = user.phoneNumber || "N/A";
  document.getElementById("lastLogin").innerText = new Date(user.metadata.lastSignInTime).toLocaleString();
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
});

// Load store notice and floating notice
function loadNotices() {
  database.ref("store/info").once("value", snap => {
    const data = snap.val();
    if (data) {
      document.getElementById("storeTitle").innerText = data.name || "ASHURA STORE";
      document.getElementById("notice").innerText = data.description || "";
    }
  });

  database.ref("store/floatingNotice").once("value", snap => {
    const data = snap.val();
    if (data) {
      const floatNotice = document.getElementById("floatingNotice");
      floatNotice.innerText = data;
      floatNotice.style.display = "block";
    }
  });
}
