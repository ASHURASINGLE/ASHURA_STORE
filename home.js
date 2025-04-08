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
const database = firebase.database();
const auth = firebase.auth();

// Auth check
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadProfile(user);
    loadProducts();
    loadOrders(user.uid);
    loadNotices();
  }
});

// Load products
function loadProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  database.ref("products").once("value", snap => {
    snap.forEach(child => {
      const p = child.val();
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img src="${p.imageUrl}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p class="price">₹${p.price || "0"}</p>
        <button onclick="buyProduct('${child.key}', '${p.name}', '${p.description}', '${p.imageUrl}', '${p.price || "0"}')">Buy</button>
      `;
      productList.appendChild(div);
    });
  });
}

// Buy redirect
function buyProduct(key, name, desc, image, price) {
  localStorage.setItem("buyProduct", JSON.stringify({ key, name, desc, image, price }));
  window.location.href = "buy.html";
}

// Load profile
function loadProfile(user) {
  document.getElementById("profileInfo").innerHTML = `
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>UID:</strong> ${user.uid}</p>
    <p><strong>Last Login:</strong> ${new Date(user.metadata.lastSignInTime).toLocaleString()}</p>
  `;

  database.ref("users/" + user.uid).once("value", snap => {
    const userData = snap.val();
    if (userData && userData.phone) {
      const phoneP = document.createElement("p");
      phoneP.innerHTML = `<strong>Phone:</strong> ${userData.phone}`;
      document.getElementById("profileInfo").appendChild(phoneP);
    }
  });
}

// Load orders
function loadOrders(uid) {
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = "";

  database.ref("orders").orderByChild("uid").equalTo(uid).once("value", snap => {
    snap.forEach(child => {
      const order = child.val();
      const div = document.createElement("div");
      div.className = "notice";
      div.innerHTML = `
        <p><strong>Product:</strong> ${order.product}</p>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>UTR:</strong> ${order.utr}</p>
        <p><strong>Status:</strong> ${order.status || "Pending"}</p>
      `;
      orderList.appendChild(div);
    });
  });
}

// Load notices
function loadNotices() {
  database.ref("store/notices/normal").once("value", snap => {
    const val = snap.val();
    if (val) {
      const notice = document.createElement("div");
      notice.className = "notice";
      notice.innerText = val;
      document.querySelector("main").prepend(notice);
    }
  });

  database.ref("store/notices/floating").once("value", snap => {
    const val = snap.val();
    if (val) {
      const float = document.createElement("div");
      float.className = "floating-notice";
      float.innerText = val;
      document.body.appendChild(float);
    }
  });
}

// Navigation
function showTab(tabId) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

// Logout
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}
