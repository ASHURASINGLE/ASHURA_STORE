const images = [
  'https://wallpapercave.com/wp/wp8449990.jpg',
  'https://wallpapercave.com/wp/wp9079152.jpg',
  'https://wallpapercave.com/wp/wp8841650.jpg',
  'https://wallpapercave.com/wp/wp7370870.jpg',
  'https://wallpapercave.com/wp/wp12385320.jpg'
];

window.onload = () => {
  const hero = document.getElementById('hero');
  const bg = images[Math.floor(Math.random() * images.length)];
  hero.style.backgroundImage = `url('${bg}')`;
};

function startApp() {
  const button = document.querySelector('button');
  button.innerText = 'Loading...';
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  drawer.classList.toggle('open');
}
