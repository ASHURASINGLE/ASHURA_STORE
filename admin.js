const firebaseConfig = {
  apiKey: "AIzaSyAugPdSj7R0AAjBLYu6jt2W1CarzTNISPY",
  authDomain: "https://ashura-6cb98-default-rtdb.firebaseio.com/",
  databaseURL: "https://ashura-6cb98-default-rtdb.firebaseio.com/",
  projectId: "ashura-6cb98",
  storageBucket: "ashura-6cb98.firebasestorage.app",
  messagingSenderId: "990827476073",
  appId: "1:990827476073:android:833691f1a9f1d4b7a51ef8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function showLoading(state) {
  document.getElementById('loading').classList.toggle('hidden', !state);
}

function updateSettings() {
  const name = document.getElementById('storeName').value;
  const notification = document.getElementById('notification').value;
  showLoading(true);
  db.ref('storeSettings').set({ name, notification })
    .then(() => alert('Settings updated!'))
    .finally(() => showLoading(false));
}

function uploadProduct() {
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const file = document.getElementById('productImage').files[0];
  if (!file) return alert('Please select an image.');

  showLoading(true);
  const reader = new FileReader();
  reader.onloadend = () => {
    const product = {
      name,
      price,
      image: reader.result
    };
    db.ref('products').push(product)
      .then(() => alert('Product added!'))
      .finally(() => showLoading(false));
  };
  reader.readAsDataURL(file);
}

function loadUsers() {
  showLoading(true);
  const list = document.getElementById('userList');
  list.innerHTML = '';
  db.ref('users').once('value').then(snapshot => {
    snapshot.forEach(child => {
      const user = child.val();
      const li = document.createElement('li');
      li.textContent = `${user.email} (${user.phone || 'No phone'})`;
      list.appendChild(li);
    });
  }).finally(() => showLoading(false));
}

window.onload = loadUsers;
