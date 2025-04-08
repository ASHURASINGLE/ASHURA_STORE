// Firebase init
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

// Tabs
function switchTab(tab) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));

  document.getElementById(`${tab}Section`).classList.add('active');
  document.getElementById(`${tab}Tab`).classList.add('active');
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

// Auth state check
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    // Load user info
    const uid = user.uid;
    db.ref("users/" + uid).once("value").then(snapshot => {
      const data = snapshot.val();
      document.getElementById("userEmail").textContent = "Email: " + (user.email || "N/A");
      document.getElementById("userPhone").textContent = "Phone: " + (data?.phone || "N/A");
      document.getElementById("userUID").textContent = "UID: " + uid;
      document.getElementById("lastLogin").textContent = "Last Login: " + (user.metadata.lastSignInTime || "N/A");
    });

    // Load products
    db.ref("products").once("value").then(snapshot => {
      const list = document.getElementById("productList");
      list.innerHTML = "";
      snapshot.forEach(child => {
        const product = child.val();
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
          <h3>${product.name}</h3>
          <p>Price: ₹${product.price}</p>
          <button onclick="buyProduct('${child.key}')">Buy</button>
        `;
        list.appendChild(div);
      });
    });

    // Load orders
    db.ref("orders/" + uid).once("value").then(snapshot => {
      const orderList = document.getElementById("orderList");
      orderList.innerHTML = "";
      if (!snapshot.exists()) {
        orderList.innerHTML = "<p>No orders yet.</p>";
        return;
      }
      snapshot.forEach(child => {
        const order = child.val();
        const div = document.createElement("div");
        div.className = "order-item";
        div.innerHTML = `
          <p><strong>Product:</strong> ${order.productName}</p>
          <p><strong>UTR:</strong> ${order.utr}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        `;
        orderList.appendChild(div);
      });
    });
  }
});

// Buy button redirect
function buyProduct(productId) {
  window.location.href = `buy.html?product=${productId}`;
}
