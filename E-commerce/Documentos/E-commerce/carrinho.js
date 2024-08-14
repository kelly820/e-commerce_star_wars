const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('carrinho.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS Item (id INTEGER PRIMARY KEY, name TEXT, price REAL, description TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS Cart (id INTEGER PRIMARY KEY AUTOINCREMENT, item_id INTEGER, name TEXT, price REAL)");
});

module.exports = db;

const db = require('./db');

class Item {
  static all(callback) {
    db.all("SELECT * FROM Item", callback);
  }

  static find(id, callback) {
    db.get("SELECT * FROM Item WHERE id = ?", id, callback);
  }

  static addToCart(item, callback) {
    const { id, name, price } = item;
    const stmt = db.prepare("INSERT INTO Cart (item_id, name, price) VALUES (?, ?, ?)");
    stmt.run(id, name, price, callback);
    stmt.finalize();
  }

  static getCartItems(callback) {
    db.all("SELECT * FROM Cart", callback);
  }

  static removeFromCart(id, callback) {
    const stmt = db.prepare("DELETE FROM Cart WHERE item_id = ?");
    stmt.run(id, callback);
    stmt.finalize();
  }
}

module.exports = Item;



const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const Item = require('./models/Item');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

app.get('/items', (req, res) => {
  Item.all((err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ items });
  });
});

app.post('/add_to_cart', (req, res) => {
  const itemId = req.body.item_id;
  Item.find(itemId, (err, item) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    Item.addToCart(item, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ status: 'success' });
    });
  });
});

app.post('/remove_from_cart', (req, res) => {
  const itemId = req.body.item_id;
  Item.removeFromCart(itemId, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ status: 'success' });
  });
});

app.get('/cart_items', (req, res) => {
  Item.getCartItems((err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ items });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ecommerce.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

const produto = {
  id: document.getElementById('idProduto').value,
  nome: document.getElementById('nomeProduto').value, 
  preco: parseFloat(document.getElementById('precoProduto').value)
};

fetch('http://127.0.0.1:5000', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(produto)
})
  .then(response => response.json())
  .then(data => {
    console.log('Produto adicionado ao carrinho com sucesso:', data);
  })
  .catch(error => {
    console.error('Erro ao adicionar produto ao carrinho:', error);
  });

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path === '/') {
    loadItems();
  } else if (path === '/cart') {
    loadCartItems();
  }
});

async function loadItems() {
  const response = await fetch('/items');
  const data = await response.json();
  const itemsList = document.getElementById('items-list');
  data.items.forEach(item => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <h2>${item.name}</h2>
      <p>${item.description}</p>
      <p>$${item.price}</p>
      <button onclick="addToCart(${item.id})">Add to Cart</button>
    `;
    itemsList.appendChild(listItem);
  });
}

async function addToCart(itemId) {
  const response = await fetch('/add_to_cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ item_id: itemId })
  });
  const result = await response.json();
  if (result.status === 'success') {
    alert('Item added to cart');
  }
}

async function loadCartItems() {
  const response = await fetch('/cart_items');
  const data = await response.json();
  const cartItemsList = document.getElementById('cart-items-list');
  data.items.forEach(item => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <h2>${item.name}</h2>
      <p>$${item.price}</p>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartItemsList.appendChild(listItem);
  });
}

async function removeFromCart(itemId) {
  const response = await fetch('/remove_from_cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ item_id: itemId })
  });
  const result = await response.json();
  if (result.status === 'success') {
    alert('Item removed from cart');
    document.location.reload(true);
  }
}
