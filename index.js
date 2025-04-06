function toggleDrawer() {
  const drawer = document.getElementById("drawer");
  drawer.classList.toggle("open");
}

function startApp() {
  const btn = document.querySelector("button");
  btn.innerText = "Loading...";
  btn.disabled = true;
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
}
