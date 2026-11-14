require('dotenv').config({ quiet: true });
const mysql = require('mysql2/promise');

// One shared connection pool for the whole app.
// Usage in any controller:  const db = require('../../db');
//                           const [rows] = await db.query('SELECT ... WHERE id = ?', [id]);
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;