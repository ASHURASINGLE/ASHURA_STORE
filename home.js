// Firebase Config
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

// Redirect to login if not logged in
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadProfile(user);
    loadProducts();
    loadOrders(user.uid);
    loadStoreInfo();
    showFloatingNotice();
  }
});

// Tab Switching
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabName).classList.add('active');
}

// Load Products
function loadProducts() {
  const container = document.getElementById("productList");
  container.innerHTML = "";
  database.ref("products").once("value", snapshot => {
    snapshot.forEach(child => {
      const product = child.val();
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Price:</strong> ₹${product.price || "N/A"}</p>
        <button class="red-button" onclick="buyProduct('${child.key}')">Buy</button>
      `;
      container.appendChild(card);
    });
  });
}

// Buy Function
function buyProduct(productId) {
  window.location.href = `buy.html?id=${productId}`;
}

// Load Orders
function loadOrders(uid) {
  const container = document.getElementById("orderList");
  container.innerHTML = "Loading...";
  database.ref("orders").orderByChild("userId").equalTo(uid).once("value", snapshot => {
    container.innerHTML = "";
    if (!snapshot.exists()) {
      container.innerHTML = "<p>No orders yet.</p>";
      return;
    }
    snapshot.forEach(child => {
      const order = child.val();
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <h3>${order.productName}</h3>
        <p><strong>UTR:</strong> ${order.utr}</p>
        <p><strong>Status:</strong> ${order.status || "Pending"}</p>
      `;
      container.appendChild(div);
    });
  });
}

// Load Profile
function loadProfile(user) {
  document.getElementById("email").innerText = user.email;
  document.getElementById("uid").innerText = user.uid;
  document.getElementById("lastLogin").innerText = user.metadata.lastSignInTime;

  database.ref("users/" + user.uid).once("value", snap => {
    const userData = snap.val();
    document.getElementById("phone").innerText = userData?.phone || "Not available";
  });
}

// Logout
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}

// Load Store Info
function loadStoreInfo() {
  database.ref("store/info").once("value", snap => {
    const info = snap.val();
    if (info) {
      document.getElementById("storeTitle").innerText = info.name;
      document.getElementById("notice").innerText = info.description;
    }
  });
}

// Show floating notice
function showFloatingNotice() {
  database.ref("store/floating").once("value", snap => {
    const notice = snap.val();
    const box = document.getElementById("floatingNotice");
    if (notice) {
      box.innerText = notice;
      box.style.display = "block";
      setTimeout(() => {
        box.style.display = "none";
      }, 6000);
    }
  });
}
