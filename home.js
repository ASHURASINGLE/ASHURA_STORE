// home.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"; import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"; import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = { apiKey: "AIzaSyAugPdSj7R0AAjBLYu6jt2W1CarzTNISPY", authDomain: "ashura-6cb98.firebaseapp.com", databaseURL: "https://ashura-6cb98-default-rtdb.firebaseio.com", projectId: "ashura-6cb98", storageBucket: "ashura-6cb98.appspot.com", messagingSenderId: "990827476073", appId: "1:990827476073:android:833691f1a9f1d4b7a51ef8" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getDatabase(app);

const homeTab = document.getElementById("homeTab"); const ordersTab = document.getElementById("ordersTab"); const profileTab = document.getElementById("profileTab");

const homeContent = document.getElementById("homeContent"); const ordersContent = document.getElementById("ordersContent"); const profileContent = document.getElementById("profileContent");

function switchTab(tabName) { homeContent.classList.add("hidden"); ordersContent.classList.add("hidden"); profileContent.classList.add("hidden");

if (tabName === "home") { homeContent.classList.remove("hidden"); } else if (tabName === "orders") { ordersContent.classList.remove("hidden"); loadOrderHistory(); } else if (tabName === "profile") { profileContent.classList.remove("hidden"); loadUserProfile(); } }

homeTab.addEventListener("click", () => switchTab("home")); ordersTab.addEventListener("click", () => switchTab("orders")); profileTab.addEventListener("click", () => switchTab("profile"));

function loadProducts() { const productList = document.getElementById("productList"); const productsRef = ref(db, "products"); onValue(productsRef, (snapshot) => { productList.innerHTML = ""; snapshot.forEach((childSnapshot) => { const product = childSnapshot.val(); const div = document.createElement("div"); div.classList.add("product-item"); div.innerHTML = <img src="${product.image}" alt="${product.name}" /> <h3>${product.name}</h3> <p>${product.description}</p> <button onclick="location.href='buy.html?id=${childSnapshot.key}'">Buy</button>; productList.appendChild(div); }); }); }

function loadOrderHistory() { const orderHistory = document.getElementById("orderHistory"); const user = auth.currentUser; if (!user) return; const ordersRef = ref(db, orders/${user.uid}); onValue(ordersRef, (snapshot) => { orderHistory.innerHTML = ""; if (!snapshot.exists()) { orderHistory.innerHTML = "<p>No orders yet.</p>"; return; } snapshot.forEach((childSnapshot) => { const order = childSnapshot.val(); const div = document.createElement("div"); div.classList.add("order-item"); div.innerHTML = <p><strong>Product:</strong> ${order.productName}</p> <p><strong>UTR:</strong> ${order.utr}</p> <p><strong>Status:</strong> ${order.status}</p>; orderHistory.appendChild(div); }); }); }

function loadUserProfile() { const user = auth.currentUser; if (!user) return;

const userRef = ref(db, users/${user.uid}); onValue(userRef, (snapshot) => { const data = snapshot.val(); const profileInfo = document.getElementById("profileInfo"); profileInfo.innerHTML = ` <h3>Registration Details:</h3> <p><strong>Email:</strong> ${data?.email || user.email}</p> <p><strong>Phone:</strong> ${data?.phone || "Not available"}</p>

<h3>Login Details:</h3>
  <p><strong>UID:</strong> ${user.uid}</p>
  <p><strong>Last Login:</strong> ${user.metadata.lastSignInTime}</p>
`;

}); }

onAuthStateChanged(auth, (user) => { if (!user) { window.location.href = "index.html"; } else { loadProducts(); } });

