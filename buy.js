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

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const productNameEl = document.getElementById("product-name");
const productDescEl = document.getElementById("product-desc");
const productImgEl = document.getElementById("product-img");
const qrImgEl = document.getElementById("qr-img");

const userNameInput = document.getElementById("user-name");
const userUTRInput = document.getElementById("user-utr");

const confirmBtn = document.getElementById("confirm-btn");

let productId = null;
let productName = "";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

productId = getQueryParam("id");

// Load product
function loadProduct() {
  if (!productId) return;
  db.ref("products/" + productId).once("value", snapshot => {
    if (!snapshot.exists()) return;
    const product = snapshot.val();
    productName = product.name;
    productNameEl.innerText = product.name;
    productDescEl.innerText = product.description || "No description";
    productImgEl.src = product.image || "https://ashurasingle.github.io/ashura_qr.png";
  });

  // Load QR image (owner uploaded or default)
  db.ref("qr").once("value", snapshot => {
    if (snapshot.exists()) {
      qrImgEl.src = snapshot.val().url;
    } else {
      qrImgEl.src = "https://ashurasingle.github.io/ashura_qr.png";
    }
  });
}

// Show step 2 after user clicks continue
function goToStep2() {
  step1.classList.add("hidden");
  step2.classList.remove("hidden");
}

function submitOrder() {
  const name = userNameInput.value.trim();
  const utr = userUTRInput.value.trim();
  if (!name || !utr) {
    alert("Please enter all details");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in.");
    return;
  }

  const orderData = {
    uid: user.uid,
    name,
    utr,
    productId,
    productName,
    status: "Pending",
    email: user.email
  };

  const newOrderRef = db.ref("orders").push();
  newOrderRef.set(orderData, err => {
    if (err) {
      alert("Order failed. Try again.");
    } else {
      alert("Order submitted successfully.");
      window.location.href = "home.html";
    }
  });
}

document.getElementById("continue-btn").addEventListener("click", goToStep2);
confirmBtn.addEventListener("click", submitOrder);

// Init
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadProduct();
  }
});
