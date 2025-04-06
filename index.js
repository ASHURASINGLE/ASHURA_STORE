function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  drawer.classList.toggle('open');
}

function startLoading() {
  document.getElementById("loader").classList.remove("hidden");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
}

// Change background image on refresh
const images = [
  'https://source.unsplash.com/1600x900/?cyber,technology',
  'https://source.unsplash.com/1600x900/?digital,futuristic',
  'https://source.unsplash.com/1600x900/?coding,terminal',
  'https://source.unsplash.com/1600x900/?ai,network',
  'https://source.unsplash.com/1600x900/?server,datacenter'
];
const randomImage = images[Math.floor(Math.random() * images.length)];
document.body.style.backgroundImage = `url(${randomImage})`;
