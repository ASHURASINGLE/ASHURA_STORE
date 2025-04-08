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

const ADMIN_EMAIL = "ASHURA@gmail.com";

// Auth check
auth.onAuthStateChanged(user => {
  if (!user || user.email !== ADMIN_EMAIL) {
    alert("Access denied.");
    window.location.href = "index.html";
  } else {
    loadDashboard();
    loadStoreInfo();
    loadProducts();
  }
});

// Drawer toggle
document.getElementById("drawerBtn").addEventListener("click", () => {
  document.getElementById("drawer").classList.toggle("active");
});

// Switch between admin sections
document.querySelectorAll(".drawer a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const sectionId = e.target.getAttribute("data-section");
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");
    document.getElementById("drawer").classList.remove("active");
  });
});

// Load Dashboard Stats
function loadDashboard() {
  db.ref("users").once("value", snap => {
    document.getElementById("total-users").textContent = snap.numChildren();
  });

  db.ref("orders").once("value", snap => {
    document.getElementById("total-orders").textContent = snap.numChildren();
  });
}

// Update Store Name & Description
document.getElementById("storeForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("storeName").value;
  const desc = document.getElementById("storeDesc").value;
  db.ref("store").set({ name, description: desc }).then(() => {
    alert("Store info updated.");
  });
});

function loadStoreInfo() {
  db.ref("store").once("value", snap => {
    const store = snap.val();
    if (store) {
      document.getElementById("storeName").value = store.name;
      document.getElementById("storeDesc").value = store.description;
    }
  });
}

// Product Management
document.getElementById("productForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const desc = document.getElementById("pdesc").value;
  const image = document.getElementById("pimg").files[0];

  const productRef = db.ref("products").push();
  const key = productRef.key;

  if (image) {
    const imgRef = storage.ref("products/" + key);
    imgRef.put(image).then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        productRef.set({ name, price, description: desc, image: url });
        alert("Product added!");
        loadProducts();
        e.target.reset();
      });
    });
  } else {
    productRef.set({ name, price, description: desc, image: "" });
    alert("Product added!");
    loadProducts();
    e.target.reset();
  }
});

function loadProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";
  db.ref("products").once("value", snap => {
    snap.forEach(child => {
      const p = child.val();
      const div = document.createElement("div");
      div.innerHTML = `
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <img src="${p.image}" width="100"><br>
        <p>${p.description}</p>
        <button onclick="deleteProduct('${child.key}')">Delete</button>
      `;
      div.classList.add("product-item");
      list.appendChild(div);
    });
  });
}

function deleteProduct(key) {
  if (confirm("Delete this product?")) {
    db.ref("products/" + key).remove().then(() => {
      alert("Deleted!");
      loadProducts();
    });
  }
}

// Upload QR Code
document.getElementById("qrForm").addEventListener("submit", e => {
  e.preventDefault();
  const file = document.getElementById("qrimg").files[0];
  if (!file) return alert("Select an image");

  const qrRef = storage.ref("qr.png");
  qrRef.put(file).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      db.ref("qr").set({ url }).then(() => {
        alert("QR updated!");
      });
    });
  });
});

// Notices
document.getElementById("noticeForm").addEventListener("submit", e => {
  e.preventDefault();
  const notice = document.getElementById("notice").value;
  db.ref("notice").set({ text: notice }).then(() => {
    alert("Notice sent.");
  });
});

document.getElementById("floatNoticeForm").addEventListener("submit", e => {
  e.preventDefault();
  const floatText = document.getElementById("floatNotice").value;
  db.ref("floating").set({ text: floatText }).then(() => {
    alert("Floating notice sent.");
  });
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
});
