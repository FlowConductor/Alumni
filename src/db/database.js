// Shared MySQL connection pool used by the models.
// Configuration comes from environment variables (see .env.example).

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'mis_alumni',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
