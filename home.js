const auth = firebase.auth();
const db = firebase.database();

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadProducts();
    loadProfile(user.uid);
    loadOrders(user.uid);
  }
});

function loadProducts() {
  const productList = document.getElementById("productList");
  db.ref("products").once("value", snapshot => {
    productList.innerHTML = "";
    snapshot.forEach(child => {
      const product = child.val();
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `<h3>${product.name}</h3><p>₹${product.price}</p>`;
      productList.appendChild(div);
    });
  });
}

function loadOrders(uid) {
  const orderList = document.getElementById("orderList");
  db.ref("orders/" + uid).once("value", snapshot => {
    orderList.innerHTML = "";
    if (!snapshot.exists()) {
      orderList.innerHTML = "No orders found.";
    } else {
      snapshot.forEach(order => {
        const data = order.val();
        const div = document.createElement("div");
        div.className = "order-item";
        div.innerHTML = `<b>${data.productName}</b><br>UTR: ${data.utr}<br>Status: ${data.status}`;
        orderList.appendChild(div);
      });
    }
  });
}

function loadProfile(uid) {
  const profileInfo = document.getElementById("profileInfo");
  const user = auth.currentUser;
  db.ref("users/" + uid).once("value", snapshot => {
    const data = snapshot.val();
    profileInfo.innerHTML = `
      <div class="profile-info">
        <b>Email:</b> ${user.email}<br>
        <b>Phone:</b> ${data ? data.phone : 'Not set'}<br>
        <b>UID:</b> ${user.uid}<br>
        <b>Last Login:</b> ${new Date(user.metadata.lastSignInTime).toLocaleString()}
      </div>`;
  });
}

function logout() {
  auth.signOut().then(() => window.location.href = "index.html");
}

// Tab switching
document.getElementById("homeTab").onclick = () => switchTab("home");
document.getElementById("ordersTab").onclick = () => switchTab("orders");
document.getElementById("profileTab").onclick = () => switchTab("profile");

function switchTab(tab) {
  document.querySelectorAll(".section").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active"));

  document.getElementById(tab + "Section").classList.add("active");
  document.getElementById(tab + "Tab").classList.add("active");
}
