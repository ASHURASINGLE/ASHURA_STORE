const images = [
  'https://wallpapercave.com/wp/wp8449990.jpg',
  'https://wallpapercave.com/wp/wp9079152.jpg',
  'https://wallpapercave.com/wp/wp8841650.jpg',
  'https://wallpapercave.com/wp/wp7370870.jpg',
  'https://wallpapercave.com/wp/wp12385320.jpg'
];

window.onload = () => {
  // Random background
  const hero = document.getElementById('hero');
  const bg = images[Math.floor(Math.random() * images.length)];
  hero.style.backgroundImage = `url('${bg}')`;

  // Create snowflakes
  for (let i = 0; i < 100; i++) {
    let snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.position = 'absolute';
    snowflake.style.top = `${Math.random() * 100}%`;
    snowflake.style.left = `${Math.random() * 100}%`;
    snowflake.style.width = '6px';
    snowflake.style.height = '6px';
    snowflake.style.borderRadius = '50%';
    snowflake.style.background = '#fff';
    snowflake.style.opacity = Math.random();
    snowflake.style.animation = `fall ${5 + Math.random() * 5}s linear infinite`;
    document.getElementById('snow').appendChild(snowflake);
  }
};

function startApp() {
  const btn = document.querySelector('button');
  btn.innerText = "Loading...";
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
