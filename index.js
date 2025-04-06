const images = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80'
];

window.onload = () => {
  const hero = document.getElementById('hero');
  const bg = images[Math.floor(Math.random() * images.length)];
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
