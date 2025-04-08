// home.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAugPdSj7R0AAjBLYu6jt2W1CarzTNISPY",
  authDomain: "ashura-6cb98.firebaseapp.com",
  databaseURL: "https://ashura-6cb98-default-rtdb.firebaseio.com",
  projectId: "ashura-6cb98",
  storageBucket: "ashura-6cb98.appspot.com",
  messagingSenderId: "990827476073",
  appId: "1:990827476073:android:833691f1a9f1d4b7a51ef8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

const homeSection = document.getElementById("homeSection");
const ordersSection = document.getElementById("ordersSection");
const profileSection = document.getElementById("profileSection");
const productList = document.getElementById("productList");
const orderList = document.getElementById("orderList");
const profileBox = document.getElementById("profileBox");
const logoutBtn = document.getElementById("logoutBtn");

function showSection(section) {
  homeSection.classList.add("hidden");
  ordersSection.classList.add("hidden");
  profileSection.classList.add("hidden");
  section.classList.remove("hidden");
}

document.getElementById("tabHome").addEventListener("click", () => showSection(homeSection));
document.getElementById("tabOrders").addEventListener("click", () => showSection(ordersSection));
document.getElementById("tabProfile").addEventListener("click", () => showSection(profileSection));

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = ref(db, `users/${uid}`);

    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      profileBox.innerHTML = `
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${userData?.phone || "-"}</p>
        <p><strong>UID:</strong> ${user.uid}</p>
        <p><strong>Last Login:</strong> ${user.metadata.lastSignInTime}</p>
      `;
    });

    loadProducts();
    loadOrders(uid);
  } else {
    window.location.href = "index.html";
  }
});

function loadProducts() {
  const productsRef = ref(db, "products");
  onValue(productsRef, (snapshot) => {
    const data = snapshot.val();
    productList.innerHTML = "";
    for (const id in data) {
      const p = data[id];
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>${p.price}</p>
        <button onclick="location.href='buy.html?id=${id}'">Buy</button>
      `;
      productList.appendChild(card);
    }
  });
}

function loadOrders(uid) {
  const ordersRef = ref(db, `orders/${uid}`);
  onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    orderList.innerHTML = "";
    if (data) {
      for (const id in data) {
        const o = data[id];
        const item = document.createElement("div");
        item.className = "order-item";
        item.innerHTML = `
          <p><strong>Product:</strong> ${o.product}</p>
          <p><strong>Status:</strong> ${o.status}</p>
        `;
        orderList.appendChild(item);
      }
    } else {
      orderList.innerHTML = "<p>No orders found.</p>";
    }
  });
}


✅ home.js has been fully updated with:

Hacker-style tab navigation: Home, Orders, Profile.

Profile section showing email, phone, UID, last login.

Orders section displaying order history.

Proper logout function with redirect.

Firebase integration for products and user data.


Now, would you like me to update home.css with matching hacker-style UI too?

  
