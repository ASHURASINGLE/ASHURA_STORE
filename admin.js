import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
window.updateStoreTitle = () => {
  const title = document.getElementById("storeTitleInput").value.trim();
  if (!title) return alert("Please enter a title.");
  set(ref(db, "settings/title"), title)
    .then(() => alert("Store title updated!"))
    .catch(err => alert("Error: " + err.message));
};

// Send notice
window.sendNotice = () => {
  const notice = document.getElementById("noticeInput").value.trim();
  if (!notice) return alert("Please enter a message.");
  set(ref(db, "settings/notice"), notice)
    .then(() => alert("Notice sent!"))
    .catch(err => alert("Error: " + err.message));
};

// Add product using public image URL
window.uploadProduct = () => {
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const imageURL = document.getElementById("productImageURL").value.trim();

  if (!name || !price || !imageURL) {
    alert("Please fill all fields.");
    return;
  }

  const productRef = ref(db, "products/" + name.replace(/\s+/g, "_"));
  set(productRef, {
    name,
    price,
    image: imageURL
  })
    .then(() => {
      alert("Product added!");
      document.getElementById("productName").value = "";
      document.getElementById("productPrice").value = "";
      document.getElementById("productImageURL").value = "";
    })
    .catch(err => {
      alert("Error: " + err.message);
    });
};
