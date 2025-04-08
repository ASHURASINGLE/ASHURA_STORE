// Extract product data from URL
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get("name");
const desc = urlParams.get("desc");
const image = urlParams.get("image");

// Inject product details
document.getElementById("productName").textContent = name || "No Name";
document.getElementById("productDescription").textContent = desc || "No Description";
document.getElementById("productImage").src = image || "https://via.placeholder.com/300";

// Set QR code image (admin can update this path from Firebase later)
document.getElementById("qrImage").src = localStorage.getItem("qrImageURL") || "https://ashurasingle.github.io/assets/ashuraqr.jpg";

// Hide payment section initially
document.getElementById("paymentSection").classList.add("hidden");

// Handle Continue to Payment
document.getElementById("continueBtn").addEventListener("click", () => {
  document.getElementById("paymentSection").classList.remove("hidden");
  document.getElementById("continueBtn").classList.add("hidden");
});

// Handle Confirm button
document.getElementById("confirmBtn").addEventListener("click", () => {
  const buyerName = document.getElementById("buyerName").value.trim();
  const utr = document.getElementById("utrNumber").value.trim();

  if (buyerName === "" || utr === "") {
    alert("Please fill out both fields.");
    return;
  }

  const uid = localStorage.getItem("uid") || "guest";
  const productID = Date.now();

  const orderData = {
    name: buyerName,
    utr: utr,
    productName: name,
    productImage: image,
    productDesc: desc,
    time: new Date().toLocaleString()
  };

  // Upload to Firebase Realtime Database
  firebase.database().ref("orders/" + uid + "/" + productID).set(orderData)
    .then(() => {
      alert("Order submitted successfully!");
      window.location.href = "home.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to submit order.");
    });
});
