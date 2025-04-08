// Firebase initialization (assumes you already initialized Firebase elsewhere)

const user = firebase.auth().currentUser;
const database = firebase.database();

// Show current tab
function showTab(tabName) {
  document.getElementById("homeTab").classList.add("hidden");
  document.getElementById("ordersTab").classList.add("hidden");
  document.getElementById("profileTab").classList.add("hidden");

  document.getElementById(tabName).classList.remove("hidden");

  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabName + "Btn").classList.add("active");
}

// Load products
function loadProducts() {
  const productList = document.getElementById("productList");
  database.ref("products").once("value", snapshot => {
    productList.innerHTML = "";
    snapshot.forEach(child => {
      const data = child.val();
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <h3>${data.name}</h3>
        <p>${data.description}</p>
        <button onclick="buyProduct('${child.key}')">Buy</button>
      `;
      productList.appendChild(card);
    });
  });
}

// Buy action
function buyProduct(productId) {
  window.location.href = `buy.html?product=${productId}`;
}

// Show user profile
function loadUserProfile() {
  if (user) {
    database.ref("users/" + user.uid).once("value", snapshot => {
      const userData = snapshot.val();
      document.getElementById("profileTab").innerHTML = `
        <div class="profile-info">
          <h3>Email:</h3><p>${userData.email}</p>
          <h3>Phone:</h3><p>${userData.phone}</p>
        </div>
      `;
    });
  }
}

// Show user orders
function loadUserOrders() {
  if (user) {
    database.ref("orders/" + user.uid).once("value", snapshot => {
      const orderHistory = document.getElementById("ordersTab");
      orderHistory.innerHTML = "<h3>Order History</h3>";
      snapshot.forEach(child => {
        const order = child.val();
        orderHistory.innerHTML += `
          <div class="order-history">
            <p><strong>Product:</strong> ${order.productName}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
        `;
      });
    });
  }
}

// Auth listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    loadProducts();
    loadUserProfile();
    loadUserOrders();
  } else {
    window.location.href = "index.html";
  }
});
