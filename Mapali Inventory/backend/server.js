const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1608@August20',
  database: 'react1'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// CRUD routes for users

// Get all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results); // Return all users
  });
});

// Add a new user
app.post('/users', (req, res) => {
  const { username, password } = req.body;
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      res.status(500).send('Error adding user');
      return;
    }
    res.json({
      id: results.insertId,
      username,
      password,
    });
  });
});

// Update an existing user
app.put('/users/:id', (req, res) => {
  const { newUsername, newPassword } = req.body;
  const { id } = req.params;

  const query = 'UPDATE users SET username = ?, password = ? WHERE id = ?';
  db.query(query, [newUsername, newPassword, id], (err, results) => {
    if (err) {
      res.status(500).send('Error updating user');
      return;
    }
    res.json({
      id,
      username: newUsername,
      password: newPassword,
    });
  });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send('Error deleting user');
      return;
    }
    res.status(200).send('User deleted successfully');
  });
});

// CRUD routes for products

// Get all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching products');
      return;
    }
    res.json(results); // Return all products
  });
});

// Add a new product
app.post('/products', (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  const query = 'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, description, category, price, quantity], (err, results) => {
    if (err) {
      res.status(500).send('Error adding product');
      return;
    }
    res.json({ product: { id: results.insertId, name, description, category, price, quantity } });
  });
});

// Update an existing product
app.put('/products/:id', (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  const query = 'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?';
  db.query(query, [name, description, category, price, quantity, req.params.id], (err, results) => {
    if (err) {
      res.status(500).send('Error updating product');
      return;
    }
    res.json({ message: 'Product updated successfully!' });
  });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).send('Error deleting product');
      return;
    }
    res.json({ message: 'Product deleted successfully!' });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    if (results.length > 0) {
      res.status(409).json({ message: 'User already exists' });
    } else {
      // Insert new user if not exists
      const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.query(insertUserQuery, [username, password], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server error');
        }
        res.status(201).json({ message: 'Registration successful' });
      });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
