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

// Update store title
onValue(ref(db, "settings/title"), (snap) => {
  const title = snap.val() || "ASHURA STORE";
  document.title = title;
  document.getElementById("storeTitle").innerText = title;
});

// Show notification banner
onValue(ref(db, "settings/notice"), (snap) => {
  const notice = snap.val();
  if (notice) {
    const banner = document.getElementById("noticeBanner");
    banner.innerText = notice;
    banner.style.display = "block";
  }
});

// Load products
onValue(ref(db, "products"), (snapshot) => {
  const data = snapshot.val();
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  if (data) {
    Object.values(data).forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price}</p>
      `;
      container.appendChild(card);
    });
  } else {
    container.innerHTML = "<p>No products available</p>";
  }
});
