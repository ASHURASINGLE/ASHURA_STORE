// Background images (replace/add more if you want)
const backgrounds = [
  "https://images.unsplash.com/photo-1605902711622-cfb43c44367f",
  "https://images.unsplash.com/photo-1522199710521-72d69614c702",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
];

// Set random background on load
window.addEventListener("DOMContentLoaded", () => {
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  document.body.style.backgroundImage = `url(${backgrounds[randomIndex]}?auto=compress&cs=tinysrgb&dpr=2&h=1080)`;
});

// Drawer toggle
const menuBtn = document.querySelector(".menu-btn");
const drawer = document.querySelector(".drawer");
const closeBtn = document.querySelector(".close-btn");

menuBtn.addEventListener("click", () => {
  drawer.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  drawer.classList.remove("open");
});

// Button actions
document.getElementById("getStarted").addEventListener("click", () => {
  window.location.href = "login.html";
});

document.getElementById("talkSupport").addEventListener("click", () => {
  window.open("https://wa.me/917636935859", "_blank");
});
