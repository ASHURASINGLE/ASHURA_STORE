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

function showSection(id) {
  document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function updateQRCode() {
  const link = document.getElementById("qrLink").value;
  db.ref("store/qr").set(link).then(() => {
    alert("QR code updated!");
    document.getElementById("qrPreview").innerHTML = `<img src="${link}" style="max-width:200px;">`;
  });
}

function updateStoreInfo() {
  const name = document.getElementById("storeName").value;
  const desc = document.getElementById("storeDesc").value;
  db.ref("store/info").set({ name, desc }).then(() => {
    alert("Store info updated!");
  });
}

function loadDashboard() {
  db.ref("users").once("value", usersSnap => {
    db.ref("orders").once("value", ordersSnap => {
      const usersCount = usersSnap.numChildren();
      const ordersCount = ordersSnap.numChildren();
      document.getElementById("dashboard").innerHTML = `
        <h2>Dashboard</h2>
        <p>Total Users: ${usersCount}</p>
        <p>Total Orders: ${ordersCount}</p>
      `;
    });
  });
}

window.onload = () => {
  showSection("dashboard");
  loadDashboard();
};
