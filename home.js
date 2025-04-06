import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Load store title
onValue(ref(db, "settings/title"), (snap) => {
  const title = snap.val() || "ASHURA STORE";
  document.title = title;
  document.getElementById("storeTitle").innerText = title;
});

// Load notice
onValue(ref(db, "settings/notice"), (snap) => {
  const notice = snap.val();
  document.getElementById("noticeBox").innerText = notice || "";
});

// Load products
onValue(ref(db, "products"), (snapshot) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  const data = snapshot.val();
  if (!data) {
    productList.innerHTML = "<p>No products available</p>";
    return;
  }

  Object.values(data).forEach((product) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
    `;
    productList.appendChild(div);
  });
});
