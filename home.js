import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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
const storage = getStorage(app);

// Change store title
window.updateStoreTitle = () => {
  const title = document.getElementById("storeTitleInput").value.trim();
  if (!title) return alert("Please enter a title.");
  set(ref(db, "settings/title"), title)
    .then(() => alert("Store title updated!"))
    .catch(err => alert("Error: " + err.message));
};

// Send notification
window.sendNotice = () => {
  const notice = document.getElementById("noticeInput").value.trim();
  if (!notice) return alert("Please enter a message.");
  set(ref(db, "settings/notice"), notice)
    .then(() => alert("Notice sent to all users."))
    .catch(err => alert("Error: " + err.message));
};

// Upload product with image
window.uploadProduct = () => {
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const fileInput = document.getElementById("productImage");
  const file = fileInput.files[0];

  if (!name || !price || !file) {
    alert("Please fill all product fields.");
    return;
  }

  const path = `products/${Date.now()}_${file.name}`;
  const storageRef = sRef(storage, path);

  uploadBytes(storageRef, file)
    .then(snapshot => getDownloadURL(snapshot.ref))
    .then(url => {
      const productRef = ref(db, "products/" + name.replace(/\s+/g, "_"));
      return set(productRef, {
        name,
        price,
        image: url
      });
    })
    .then(() => {
      alert("Product added successfully!");
      // Clear inputs
      document.getElementById("productName").value = "";
      document.getElementById("productPrice").value = "";
      document.getElementById("productImage").value = "";
    })
    .catch(err => {
      console.error("Upload Error:", err);
      alert("Upload failed: " + err.message);
    });
};
