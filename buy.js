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
const auth = firebase.auth();

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productDesc = document.getElementById("productDesc");
const continueBtn = document.getElementById("continueBtn");
const paymentSection = document.getElementById("paymentSection");
const qrCodeImage = document.getElementById("qrCodeImage");
const buyerName = document.getElementById("buyerName");
const utrNumber = document.getElementById("utrNumber");
const confirmBtn = document.getElementById("confirmBtn");

// Load Product Details
function loadProductDetails() {
  db.ref("products/" + productId).once("value").then((snapshot) => {
    const data = snapshot.val();
    if (data) {
      productName.innerText = data.name;
      productDesc.innerText = data.description;
      productImage.src = data.image;
    } else {
      alert("Product not found.");
    }
  });
}

// Load QR Code
function loadQRCode() {
  db.ref("qr").once("value").then((snapshot) => {
    if (snapshot.exists()) {
      qrCodeImage.src = snapshot.val();
    }
  });
}

// Event: Continue to Payment
continueBtn.addEventListener("click", () => {
  paymentSection.classList.remove("hidden");
  loadQRCode();
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// Event: Confirm Payment
confirmBtn.addEventListener("click", () => {
  const name = buyerName.value.trim();
  const utr = utrNumber.value.trim();

  if (!name || !utr) {
    alert("Please fill in your name and UTR number.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to confirm purchase.");
    return;
  }

  const orderRef = db.ref("orders").push();
  orderRef.set({
    productId,
    name,
    utr,
    uid: user.uid,
    email: user.email,
    time: new Date().toISOString(),
    status: "Pending"
  }).then(() => {
    alert("Order placed successfully!");
    buyerName.value = "";
    utrNumber.value = "";
    paymentSection.classList.add("hidden");
  });
});

auth.onAuthStateChanged(user => {
  if (user) {
    loadProductDetails();
  } else {
    alert("Please log in to access this page.");
    window.location.href = "index.html";
  }
});
