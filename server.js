const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'user_management', // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Register route
app.post('/api/register', (req, res) => {
  const { username, surname, email, password, security_code } = req.body;

  if (!username || !surname || !email || !password || !security_code) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const query = 'INSERT INTO users (username, surname, email, password, security_code) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [username, surname, email, password, security_code], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ success: false, message: 'Error registering user' });
    }
    console.log('User registered successfully');
    res.status(200).json({ success: true, message: 'User registered successfully' });
  });
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Both fields are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ success: false, message: 'An error occurred' });
    }

    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid login' });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
