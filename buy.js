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
const auth = firebase.auth();

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
let productData = {};

if (!productId) {
  alert("No product selected");
  window.location.href = "home.html";
}

// Load product
db.ref("products/" + productId).once("value", snap => {
  productData = snap.val();
  document.getElementById("product-name").innerText = productData.name;
  document.getElementById("product-description").innerText = productData.description;
  document.getElementById("product-image").src = productData.image || "default-product.png";
});

// Load QR code from DB or default
db.ref("store/qr").once("value", snap => {
  if (snap.exists()) {
    document.getElementById("qr-code").src = snap.val();
  }
});

function nextStep() {
  document.getElementById("step1").classList.remove("active");
  document.getElementById("step2").classList.add("active");
}

function submitOrder() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const utr = document.getElementById("utr").value.trim();

  if (!name || !email || !utr) {
    alert("Please fill all fields");
    return;
  }

  auth.onAuthStateChanged(user => {
    if (!user) {
      alert("Please login first");
      window.location.href = "index.html";
      return;
    }

    const orderData = {
      name,
      email,
      utr,
      uid: user.uid,
      productId,
      productName: productData.name,
      status: "Pending",
      timestamp: Date.now()
    };

    db.ref("orders").push(orderData).then(() => {
      alert("Order placed! Admin will verify your payment.");
      window.location.href = "home.html";
    });
  });
}
