function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  drawer.classList.toggle('open');
}

function startLoading() {
  const loader = document.getElementById('loader');
  loader.classList.remove('hidden');

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500); // Simulate loading time
}

// Set a random background image on each refresh
const images = [
  'https://source.unsplash.com/1920x1080/?technology,dark',
  'https://source.unsplash.com/1920x1080/?hacker,cyber',
  'https://source.unsplash.com/1920x1080/?business,technology',
  'https://source.unsplash.com/1920x1080/?coding,workspace',
  'https://source.unsplash.com/1920x1080/?finance,abstract'
];

document.body.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;
