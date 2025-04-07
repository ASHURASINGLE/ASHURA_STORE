import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAugPdSj7R0AAjBLYu6jt2W1CarzTNISPY",
  authDomain: "ashura-6cb98.firebaseapp.com",
  databaseURL: "https://ashura-6cb98-default-rtdb.firebaseio.com",
  projectId: "ashura-6cb98",
  storageBucket: "ashura-6cb98.appspot.com",
  messagingSenderId: "990827476073",
  appId: "1:990827476073:web:833691f1a9f1d4b7a51ef8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const productList = document.getElementById("productList");
const orderList = document.getElementById("orderList");
const profileBox = document.getElementById("profileBox");

function loadProducts() {
  const productsRef = ref(db, "products");
  onValue(productsRef, (snapshot) => {
    productList.innerHTML = "";
    snapshot.forEach((child) => {
      const item = child.val();
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button onclick="location.href='buy.html?id=${child.key}'">Buy</button>
      `;
      productList.appendChild(div);
    });
  });
}

function loadOrders(uid) {
  const ordersRef = ref(db, `orders/${uid}`);
  onValue(ordersRef, (snapshot) => {
    orderList.innerHTML = "<h3>Your Orders</h3>";
    if (!snapshot.exists()) {
      orderList.innerHTML += "<p>No orders found.</p>";
      return;
    }
    snapshot.forEach((child) => {
      const order = child.val();
      orderList.innerHTML += `<p>${order.name} - UTR: ${order.utr}</p>`;
    });
  });
}

function loadProfile(user) {
  const userRef = ref(db, `users/${user.uid}`);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    profileBox.innerHTML = `
      <h3>Profile Details</h3>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${data?.phone || "N/A"}</p>
    `;
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadProducts();
    loadOrders(user.uid);
    loadProfile(user);
  } else {
    window.location.href = "index.html";
  }
});

// Tab switching
document.querySelectorAll(".tabs button").forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".content-section")[idx].classList.add("active");
  });
});
