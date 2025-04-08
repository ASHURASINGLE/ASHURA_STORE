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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Auth check
firebase.auth().onAuthStateChanged(user => {
  if (!user || user.email !== "ashura@gmail.com") {
    window.location.href = "index.html";
  } else {
    loadDashboardData();
  }
});

// Drawer toggle
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("drawer").classList.toggle("open");
});

// Load dashboard stats
function loadDashboardData() {
  db.ref("users").once("value", snapshot => {
    const totalUsers = snapshot.numChildren();
    document.getElementById("totalUsers").textContent = totalUsers;
  });

  db.ref("orders").once("value", snapshot => {
    const totalOrders = snapshot.numChildren();
    document.getElementById("totalOrders").textContent = totalOrders;
  });
}

// Add product
document.getElementById("addProductBtn").addEventListener("click", () => {
  const name = document.getElementById("productName").value;
  const description = document.getElementById("productDesc").value;
  const price = document.getElementById("productPrice").value;
  const file = document.getElementById("productImage").files[0];

  if (!name || !description || !price || !file) {
    alert("All fields are required");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target.result;
    const productId = db.ref("products").push().key;
    const productData = { name, description, price, image: imageUrl, id: productId };
    db.ref("products/" + productId).set(productData, error => {
      if (error) {
        alert("Error saving product");
      } else {
        alert("Product added");
        document.getElementById("productForm").reset();
      }
    });
  };
  reader.readAsDataURL(file);
});

// Upload QR
document.getElementById("qrUploadBtn").addEventListener("click", () => {
  const qrFile = document.getElementById("qrImage").files[0];

  if (!qrFile) return alert("Select a QR image");

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target.result;
    db.ref("settings/qr").set(imageUrl, err => {
      if (!err) {
        document.getElementById("qrPreview").src = imageUrl;
        alert("QR updated!");
      }
    });
  };
  reader.readAsDataURL(qrFile);
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
});
