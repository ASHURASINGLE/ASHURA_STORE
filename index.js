function toggleDrawer() {
  const drawer = document.getElementById("drawer");
  drawer.style.left = drawer.style.left === "0px" ? "-250px" : "0px";
}

function createGlow(e) {
  const glow = document.createElement("span");
  glow.classList.add("click-glow");
  glow.style.left = `${e.clientX - 30}px`;
  glow.style.top = `${e.clientY - 30}px`;
  document.body.appendChild(glow);

  setTimeout(() => {
    glow.remove();
  }, 500);
}
