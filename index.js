function toggleDrawer() {
  document.getElementById('drawer').classList.toggle('open');
}

function glowEffect(e) {
  const btn = document.querySelector('.glow-button');
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);
  setTimeout(() => {
    ripple.remove();
  }, 1000);
}
