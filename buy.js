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

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const productNameEl = document.getElementById("product-name");
const productDescEl = document.getElementById("product-desc");
const productImgEl = document.getElementById("product-img");
const qrImg = document.getElementById("qr-img");
const confirmBtn = document.getElementById("confirm-btn");

let productName = "";

auth.onAuthStateChanged(user => {
  if (!user) return window.location.href = "index.html";

  db.ref("products/" + productId).once("value").then(snapshot => {
    const data = snapshot.val();
    if (!data) return alert("Product not found");
    productName = data.name;
    productNameEl.textContent = data.name;
    productDescEl.textContent = data.description;
    productImgEl.src = data.imageURL || "https://via.placeholder.com/500x300?text=No+Image";
  });

  db.ref("qr").once("value").then(snap => {
    qrImg.src = snap.val()?.url || "https://ashurasingle.github.io/assets/default-qr.jpg";
  });

  confirmBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const utr = document.getElementById("utr").value.trim();

    if (!name || !utr) return alert("Fill all fields");

    db.ref("orders").push({
      uid: user.uid,
      email: user.email,
      name,
      utr,
      productName,
      productId,
      status: "Pending",
      timestamp: Date.now()
    }).then(() => {
      alert("Order placed. You'll receive a confirmation soon.");
      window.location.href = "home.html";
    });
  });
});

function continueToStep2() {
  step1.style.display = "none";
  step2.style.display = "block";
}
