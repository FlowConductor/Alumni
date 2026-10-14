// Migration runner — applies pending SQL migrations from src/db/migrations
// against the MySQL database, tracking applied ones in a `migrations` table.
// Usage: npm run migrate

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'mis_alumni',
    multipleStatements: true,
  });

  try {
    await connection.query(`CREATE TABLE IF NOT EXISTS migrations (
      id        INT AUTO_INCREMENT PRIMARY KEY,
      name      VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`);

    const [appliedRows] = await connection.query('SELECT name FROM migrations');
    const applied = new Set(appliedRows.map((row) => row.name));

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('No migration files found.');
      return;
    }

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      console.log(`Applying ${file}...`);
      await connection.query(sql);
      await connection.query('INSERT INTO migrations (name) VALUES (?)', [file]);
      console.log(`Applied ${file}`);
    }
  } finally {
    await connection.end();
  }
}

run()
  .then(() => {
    console.log('Migrations complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err.message);
    process.exit(1);
  });
