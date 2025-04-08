// Firebase Config
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

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}

function toggleDrawer() {
  document.getElementById('drawer').classList.toggle('hidden');
}

function showSection(id) {
  document.querySelectorAll(".admin-section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  toggleDrawer(); // hide drawer after click
}

function loadDashboard() {
  db.ref("users").once("value", snapshot => {
    document.getElementById("totalUsers").textContent = snapshot.numChildren();
  });
  db.ref("orders").once("value", snapshot => {
    document.getElementById("totalOrders").textContent = snapshot.numChildren();
  });
}

function addProduct() {
  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDescription").value;
  const price = document.getElementById("productPrice").value;
  const file = document.getElementById("productImage").files[0];

  if (!name || !desc || !price || !file) return alert("Fill all fields");

  const reader = new FileReader();
  reader.onload = () => {
    const id = Date.now().toString();
    db.ref("products/" + id).set({
      name, desc, price, image: reader.result
    }).then(() => alert("Product added"));
  };
  reader.readAsDataURL(file);
}

function uploadQR() {
  const file = document.getElementById("qrImage").files[0];
  if (!file) return alert("Select file");

  const reader = new FileReader();
  reader.onload = () => {
    db.ref("qr").set(reader.result).then(() => alert("QR uploaded"));
  };
  reader.readAsDataURL(file);
}

function loadProducts() {
  const container = document.getElementById("productList");
  container.innerHTML = "";
  db.ref("products").once("value", snapshot => {
    snapshot.forEach(child => {
      const p = child.val();
      container.innerHTML += `
        <div class="card">
          <strong>${p.name}</strong><br>
          <small>${p.desc}</small><br>
          Price: ₹${p.price}<br>
          <img src="${p.image}" width="100"/><br>
        </div>
      `;
    });
  });
}

function updateStore() {
  const name = document.getElementById("storeName").value;
  const desc = document.getElementById("storeDesc").value;
  db.ref("store").set({ name, desc }).then(() => alert("Store updated"));
}

function updateNotices() {
  const main = document.getElementById("mainNotice").value;
  const float = document.getElementById("floatingNotice").value;
  db.ref("notice").set({ main, float }).then(() => alert("Notices updated"));
}

firebase.auth().onAuthStateChanged(user => {
  if (!user || user.email !== "ashura@gmail.com") {
    window.location.href = "index.html";
  } else {
    loadDashboard();
    loadProducts();
  }
});
