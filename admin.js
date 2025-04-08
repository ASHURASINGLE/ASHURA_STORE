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
const auth = firebase.auth();
const database = firebase.database();

const drawer = document.querySelector('.drawer');
const drawerToggle = document.getElementById('drawerToggle');
const logoutBtn = document.getElementById('logoutBtn');

drawerToggle.addEventListener('click', () => {
  drawer.classList.toggle('open');
});

logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    localStorage.removeItem('ashura_uid');
    window.location.href = "index.html";
  });
});

auth.onAuthStateChanged(user => {
  if (user) {
    if (user.email.toLowerCase() !== "ashura@gmail.com") {
      alert("Access denied. Admin only.");
      window.location.href = "home.html";
    } else {
      localStorage.setItem('ashura_uid', user.uid);
      loadAdminFeatures();
    }
  } else {
    alert("Not logged in.");
    window.location.href = "index.html";
  }
});

function loadAdminFeatures() {
  // Load store info
  const storeRef = database.ref("store/info");
  storeRef.once("value", (snapshot) => {
    const data = snapshot.val();
    document.getElementById("storeName").value = data?.name || "";
    document.getElementById("storeDescription").value = data?.description || "";
  });

  // Update store info
  document.getElementById("updateStoreBtn").addEventListener("click", () => {
    const name = document.getElementById("storeName").value.trim();
    const desc = document.getElementById("storeDescription").value.trim();
    storeRef.set({ name, description: desc });
    alert("Store info updated!");
  });

  // Load and update QR code
  const qrInput = document.getElementById("qrInput");
  const qrPreview = document.getElementById("qrPreview");
  const qrRef = database.ref("store/qr");

  qrRef.once("value", snap => {
    if (snap.exists()) {
      qrPreview.src = snap.val();
    }
  });

  qrInput.addEventListener("change", e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      qrPreview.src = base64;
      qrRef.set(base64);
      alert("QR code updated!");
    };
    if (file) reader.readAsDataURL(file);
  });

  // Load products
  const productList = document.getElementById("productList");
  const productsRef = database.ref("store/products");

  function refreshProducts() {
    productList.innerHTML = "";
    productsRef.once("value", snapshot => {
      snapshot.forEach(child => {
        const data = child.val();
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${data.name}</strong><br>
          ${data.description}<br>
          <img src="${data.image}" style="max-width:100px;"><br>
          <button onclick="deleteProduct('${child.key}')">Delete</button>
        `;
        productList.appendChild(li);
      });
    });
  }

  refreshProducts();

  window.deleteProduct = function (key) {
    productsRef.child(key).remove().then(() => {
      alert("Product deleted");
      refreshProducts();
    });
  };

  // Add product
  document.getElementById("addProductBtn").addEventListener("click", () => {
    const pname = document.getElementById("productName").value.trim();
    const pdesc = document.getElementById("productDesc").value.trim();
    const pimg = document.getElementById("productImgInput").files[0];

    if (!pname || !pdesc || !pimg) {
      alert("Fill all fields");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      const key = productsRef.push().key;
      productsRef.child(key).set({
        name: pname,
        description: pdesc,
        image: base64
      }).then(() => {
        alert("Product added");
        refreshProducts();
        document.getElementById("productName").value = "";
        document.getElementById("productDesc").value = "";
        document.getElementById("productImgInput").value = "";
      });
    };
    reader.readAsDataURL(pimg);
  });

  // Maintenance & Floating Notice
  const maintenanceRef = database.ref("store/maintenance");
  const floatingRef = database.ref("store/notice");

  document.getElementById("maintenanceBtn").addEventListener("click", () => {
    const msg = document.getElementById("maintenanceInput").value.trim();
    maintenanceRef.set(msg);
    alert("Maintenance notice sent");
  });

  document.getElementById("floatingBtn").addEventListener("click", () => {
    const msg = document.getElementById("floatingInput").value.trim();
    floatingRef.set(msg);
    alert("Floating notice sent");
  });
}
