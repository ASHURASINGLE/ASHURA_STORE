// home.js - Firebase + Hacker Style UI

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"; import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"; import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = { apiKey: "AIzaSyAugPdSj7R0AAjBLYu6jt2W1CarzTNISPY", authDomain: "ashura-6cb98.firebaseapp.com", databaseURL: "https://ashura-6cb98-default-rtdb.firebaseio.com", projectId: "ashura-6cb98", storageBucket: "ashura-6cb98.appspot.com", messagingSenderId: "990827476073", appId: "1:990827476073:android:833691f1a9f1d4b7a51ef8" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const database = getDatabase(app);

const homeSection = document.getElementById("homeSection"); const ordersSection = document.getElementById("ordersSection"); const profileSection = document.getElementById("profileSection"); const productList = document.getElementById("productList"); const storeTitle = document.getElementById("storeTitle");

function showSection(sectionId) { document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active")); document.querySelectorAll(".navbar button").forEach(btn => btn.classList.remove("active")); document.getElementById(sectionId).classList.add("active"); document.querySelector(button[data-section='${sectionId}']).classList.add("active"); }

document.querySelectorAll(".navbar button").forEach(button => { button.addEventListener("click", () => { const section = button.getAttribute("data-section"); showSection(section); }); });

function renderProducts(products) { productList.innerHTML = ""; products.forEach(product => { const card = document.createElement("div"); card.className = "product-card"; card.innerHTML = <img src="${product.image}" alt="${product.name}" /> <h3>${product.name}</h3> <p>${product.description}</p> <button onclick="location.href='buy.html?id=${product.id}'">Buy</button>; productList.appendChild(card); }); }

function renderOrders(orders) { const container = document.getElementById("ordersSection"); container.innerHTML = orders.map(order => <div class="product-card"> <h3>${order.productName}</h3> <p>UTR: ${order.utr}</p> <p>Status: ${order.status || "Pending"}</p> </div>).join(""); }

function renderProfile(user, userData) { const container = document.getElementById("profileSection"); container.innerHTML = <div class="product-card"> <h3>Email: ${user.email}</h3> <p>Phone: ${userData.phone}</p> <button onclick="logout()">Logout</button> </div>; }

function logout() { signOut(auth).then(() => { window.location.href = "index.html"; }); }

onAuthStateChanged(auth, (user) => { if (!user) { window.location.href = "index.html"; return; }

const uid = user.uid; const userRef = ref(database, users/${uid});

get(userRef).then(snapshot => { if (!snapshot.exists()) { alert("User data not found."); return; } const userData = snapshot.val(); renderProfile(user, userData);

const ordersRef = ref(database, `orders/${uid}`);
onValue(ordersRef, snap => {
  const orderData = snap.val();
  if (orderData) {
    const orders = Object.values(orderData);
    renderOrders(orders);
  }
});

});

const productsRef = ref(database, 'products'); onValue(productsRef, (snapshot) => { const products = snapshot.exists() ? Object.values(snapshot.val()) : []; renderProducts(products); }); });

