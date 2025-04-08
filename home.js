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
    console.log("User is logged in:", user.uid);
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
  if (!container) return console.error("No #productList found in HTML");
  container.innerHTML = "Loading products...";

  database.ref("products").once("value").then(snapshot => {
    container.innerHTML = "";
    if (!snapshot.exists()) {
      container.innerHTML = "<p>No products available.</p>";
      return;
    }

    snapshot.forEach(child => {
      const product = child.val();
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <img src="${product.imageUrl || 'https://via.placeholder.com/150'}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Price:</strong> ₹${product.price || "N/A"}</p>
        <button class="red-button" onclick="buyProduct('${child.key}')">Buy</button>
      `;
      container.appendChild(card);
    });
  }).catch(err => {
    console.error("Error loading products:", err);
  });
}

// Buy Button
function buyProduct(productId) {
  window.location.href = `buy.html?id=${productId}`;
}

// Load Orders
function loadOrders(uid) {
  const container = document.getElementById("orderList");
  if (!container) return console.error("No #orderList found in HTML");

  container.innerHTML = "Loading orders...";
  database.ref("orders").orderByChild("userId").equalTo(uid).once("value").then(snapshot => {
    container.innerHTML = "";
    if (!snapshot.exists()) {
      container.innerHTML = "<p>No orders found.</p>";
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
  }).catch(err => {
    console.error("Error loading orders:", err);
  });
}

// Load Profile
function loadProfile(user) {
  const email = document.getElementById("email");
  const uid = document.getElementById("uid");
  const lastLogin = document.getElementById("lastLogin");
  const phone = document.getElementById("phone");

  if (!email || !uid || !lastLogin || !phone) {
    console.error("Profile section IDs not found in HTML");
    return;
  }

  email.innerText = user.email;
  uid.innerText = user.uid;
  lastLogin.innerText = user.metadata.lastSignInTime;

  database.ref("users/" + user.uid).once("value").then(snap => {
    const userData = snap.val();
    phone.innerText = userData?.phone || "Not available";
  }).catch(err => {
    console.error("Error loading profile:", err);
  });
}

// Load Store Info
function loadStoreInfo() {
  const storeTitle = document.getElementById("storeTitle");
  const notice = document.getElementById("notice");
  if (!storeTitle || !notice) return;

  database.ref("store/info").once("value").then(snap => {
    const info = snap.val();
    if (info) {
      storeTitle.innerText = info.name;
      notice.innerText = info.description;
    }
  });
}

// Show Floating Notice
function showFloatingNotice() {
  const box = document.getElementById("floatingNotice");
  if (!box) return;

  database.ref("store/floating").once("value").then(snap => {
    const notice = snap.val();
    if (notice) {
      box.innerText = notice;
      box.style.display = "block";
      setTimeout(() => {
        box.style.display = "none";
      }, 6000);
    }
  });
}

// Logout
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}
