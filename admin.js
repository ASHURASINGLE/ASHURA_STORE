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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Drawer toggle
document.getElementById("menuToggle").addEventListener("click", () => {
  const drawer = document.getElementById("drawer");
  drawer.classList.toggle("open");
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
});

// Dashboard: Show total users and orders
function updateDashboard() {
  database.ref("users").once("value", snapshot => {
    const users = snapshot.numChildren();
    document.getElementById("totalUsers").innerText = `Total Users: ${users}`;
  });

  database.ref("orders").once("value", snapshot => {
    const orders = snapshot.numChildren();
    document.getElementById("totalOrders").innerText = `Total Orders: ${orders}`;
  });
}
updateDashboard();

// Add Product (with price)
document.getElementById("addProductBtn").addEventListener("click", () => {
  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDesc").value;
  const price = document.getElementById("productPrice").value;
  const imgFile = document.getElementById("productImage").files[0];

  if (!name || !desc || !price || !imgFile) return alert("Fill all fields");

  const reader = new FileReader();
  reader.onload = function (e) {
    const productData = {
      name: name,
      description: desc,
      price: price,
      imageUrl: e.target.result
    };
    const key = database.ref("products").push().key;
    database.ref("products/" + key).set(productData, () => {
      alert("Product Added!");
      document.getElementById("productName").value = "";
      document.getElementById("productDesc").value = "";
      document.getElementById("productPrice").value = "";
      document.getElementById("productImage").value = "";
    });
  };
  reader.readAsDataURL(imgFile);
});

// Upload QR Code
document.getElementById("uploadQRBtn").addEventListener("click", () => {
  const file = document.getElementById("qrImage").files[0];
  if (!file) return alert("Select a QR image");

  const reader = new FileReader();
  reader.onload = function (e) {
    database.ref("store/qr").set(e.target.result, () => {
      alert("QR Code Updated");
      document.getElementById("qrImage").value = "";
      loadQRImage();
    });
  };
  reader.readAsDataURL(file);
});

function loadQRImage() {
  database.ref("store/qr").once("value", snap => {
    const img = snap.val();
    document.getElementById("qrPreview").src = img || "default-qr.png";
  });
}
loadQRImage();

// Store Info Update
document.getElementById("updateInfoBtn").addEventListener("click", () => {
  const name = document.getElementById("storeName").value;
  const desc = document.getElementById("storeDesc").value;

  database.ref("store/info").set({
    name,
    description: desc
  }, () => alert("Store Info Updated"));
});

function loadStoreInfo() {
  database.ref("store/info").once("value", snap => {
    const info = snap.val();
    if (info) {
      document.getElementById("storeName").value = info.name;
      document.getElementById("storeDesc").value = info.description;
    }
  });
}
loadStoreInfo();
