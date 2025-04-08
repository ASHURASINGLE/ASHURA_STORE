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

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadProducts();
  }
});

function loadProducts() {
  const productList = document.getElementById("productList");
  db.ref("products").on("value", snapshot => {
    productList.innerHTML = "";
    snapshot.forEach(child => {
      const product = child.val();
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: ₹${product.price}</p>
        <button class="buy-btn" onclick="buyProduct('${child.key}')">Buy</button>
      `;
      productList.appendChild(div);
    });
  });
}

function buyProduct(productId) {
  window.location.href = `buy.html?productId=${productId}`;
}

function switchTab(tab) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));

  document.getElementById(`content-${tab}`).classList.add("active");
  document.querySelector(`.nav-btn[onclick*="${tab}"]`).classList.add("active");
}
