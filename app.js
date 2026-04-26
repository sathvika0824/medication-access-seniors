// app.js
// app.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error(err.message);
  else console.log('✅ Connected to SQLite database');
});

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )
`);

// Serve HTML frontend
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>User Info</title>
        <style>
          body { font-family: Arial; margin: 20px; }
          input { margin: 5px 0; padding: 8px; width: 200px; }
          button { padding: 8px 15px; }
          table { border-collapse: collapse; margin-top: 20px; }
          td, th { border: 1px solid #ccc; padding: 8px; }
        </style>
      </head>
      <body>
        <h2>Enter User Info</h2>
        <form action="/add" method="POST">
          <input type="text" name="name" placeholder="Name" required><br>
          <input type="email" name="email" placeholder="Email" required><br>
          <button type="submit">Add User</button>
        </form>

        <h2>All Users</h2>
        <table>
          <tr><th>ID</th><th>Name</th><th>Email</th></tr>
          ${(() => {
            let rows = '';
            db.each('SELECT * FROM users', (err, row) => {
              if (!err) {
                rows += `<tr><td>${row.id}</td><td>${row.name}</td><td>${row.email}</td></tr>`;
              }
            });
            return rows;
          })()}
        </table>
      </body>
    </html>
  `);
});

// Add user route
app.post('/add', (req, res) => {
  const { name, email } = req.body;
  db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], (err) => {
    if (err) console.error(err.message);
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
