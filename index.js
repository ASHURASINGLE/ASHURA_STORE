const professionalImages = [
  'https://images.unsplash.com/photo-1581090700227-1e8e8e7f0db9?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1612832020764-61d827a5c07c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1587614382346-4ec1f9da246c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80'
];

window.onload = () => {
  const hero = document.getElementById('hero');
  const bg = professionalImages[Math.floor(Math.random() * professionalImages.length)];
  hero.style.backgroundImage = `url('${bg}')`;
};

function startApp() {
  const btn = document.querySelector('button');
  btn.textContent = 'Loading...';
  btn.disabled = true;
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  drawer.classList.toggle('open');
  overlay.classList.toggle('show');
}
