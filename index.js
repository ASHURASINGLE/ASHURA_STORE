const images = [
  "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
  "https://images.unsplash.com/photo-1508923567004-3a6b8004f3d3",
  "https://images.unsplash.com/photo-1580894908360-ec46cf13cf77",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216"
];

function setRandomBackground() {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  document.body.style.backgroundImage = `url('${randomImage}&auto=format&fit=crop&w=1400&q=80')`;
}
setRandomBackground();

function toggleDrawer() {
  document.getElementById("drawer").classList.toggle("open");
}
