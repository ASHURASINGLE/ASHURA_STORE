function toggleDrawer() {
  const drawer = document.getElementById("drawer");
  if (drawer.style.left === "0px") {
    drawer.style.left = "-200px";
  } else {
    drawer.style.left = "0px";
  }
}

function glowButton() {
  const btn = document.querySelector(".start-button");
  btn.style.boxShadow = "0 0 30px red";
  setTimeout(() => {
    btn.style.boxShadow = "0 0 10px red";
  }, 300);
}
