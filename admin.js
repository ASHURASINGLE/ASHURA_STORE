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
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

const drawer = document.getElementById("drawer");
const drawerToggle = document.getElementById("drawerToggle");
const drawerClose = document.getElementById("drawerClose");

drawerToggle.onclick = () => drawer.classList.add("open");
drawerClose.onclick = () => drawer.classList.remove("open");

// Access Control (check if user is ASHURA@gmail.com)
auth.onAuthStateChanged(user => {
  if (user && user.email === "ASHURA@gmail.com") {
    loadAdminData();
  } else {
    window.location.href = "index.html";
  }
});

function loadAdminData() {
  // Load store info
  db.ref("store").once("value", snap => {
    const data = snap.val();
    document.getElementById("storeName").value = data?.name || "";
    document.getElementById("storeDescription").value = data?.description || "";
  });

  // Load QR image
  db.ref("qr").once("value", snap => {
    document.getElementById("qrPreview").src = snap.val() || "default-qr.png";
  });

  // Load floating/maintenance notice
  db.ref("notice").once("value", snap => {
    document.getElementById("floatingNotice").value = snap.val()?.floating || "";
    document.getElementById("maintenanceNotice").value = snap.val()?.maintenance || "";
  });

  // Load product list
  db.ref("products").on("value", snap => {
    const list = document.getElementById("productList");
    list.innerHTML = "";
    snap.forEach(child => {
      const p = child.val();
      list.innerHTML += `
        <div class="product-item">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <img src="${p.image}" alt="${p.name}" />
          <button onclick="deleteProduct('${child.key}')">Delete</button>
        </div>
      `;
    });
  });

  // Load user list
  db.ref("users").on("value", snap => {
    const list = document.getElementById("userList");
    list.innerHTML = "";
    snap.forEach(child => {
      const u = child.val();
      list.innerHTML += `
        <div class="user-item">
          <p><strong>Email:</strong> ${u.email}</p>
          <p><strong>Phone:</strong> ${u.phone}</p>
          <p><strong>UID:</strong> ${child.key}</p>
          <button onclick="deleteUser('${child.key}')">Delete</button>
        </div>
      `;
    });
  });

  // Load orders
  db.ref("orders").on("value", snap => {
    const list = document.getElementById("orderList");
    list.innerHTML = "";
    snap.forEach(child => {
      const o = child.val();
      list.innerHTML += `
        <div class="order-item">
          <p><strong>Product:</strong> ${o.productName}</p>
          <p><strong>Email:</strong> ${o.email}</p>
          <p><strong>UTR:</strong> ${o.utr}</p>
        </div>
      `;
    });
  });
}

// Update store info
document.getElementById("updateStore").onclick = () => {
  const name = document.getElementById("storeName").value;
  const description = document.getElementById("storeDescription").value;
  db.ref("store").set({ name, description });
  alert("Store updated");
};

// Update QR
document.getElementById("uploadQR").onchange = e => {
  const file = e.target.files[0];
  const ref = storage.ref("qr.png");
  ref.put(file).then(() => {
    ref.getDownloadURL().then(url => {
      db.ref("qr").set(url);
      document.getElementById("qrPreview").src = url;
    });
  });
};

// Add product
document.getElementById("addProduct").onclick = () => {
  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDesc").value;
  const file = document.getElementById("productImage").files[0];
  const ref = storage.ref("products/" + Date.now());
  ref.put(file).then(() => {
    ref.getDownloadURL().then(url => {
      db.ref("products").push({ name, description: desc, image: url });
    });
  });
};

// Delete product
function deleteProduct(key) {
  db.ref("products/" + key).remove();
}

// Delete user
function deleteUser(uid) {
  db.ref("users/" + uid).remove();
}

// Update notices
document.getElementById("updateNotices").onclick = () => {
  const floating = document.getElementById("floatingNotice").value;
  const maintenance = document.getElementById("maintenanceNotice").value;
  db.ref("notice").set({ floating, maintenance });
  alert("Notices updated");
};

// Logout
document.getElementById("logout").onclick = () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
};
