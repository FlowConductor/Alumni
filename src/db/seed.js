// Database Seeder — truncates the users and donate tables and repopulates
// them with fake records from the factories.
// Usage: node src/db/seed.js  (or npm run seed)

require('dotenv').config();
const mysql = require('mysql2/promise');
const userFactory = require('./factories/user.factory');
const donationFactory = require('./factories/donation.factory');

const USER_COUNT = Number(process.env.SEED_USERS || 20);
const DONATION_COUNT = Number(process.env.SEED_DONATIONS || 40);

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
    const users = userFactory.make(USER_COUNT);

    console.log(`Seeding ${users.length} users and ${DONATION_COUNT} donations...`);

    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE donate');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    await connection.query('INSERT INTO users (username, email) VALUES ?', [
      users.map((u) => [u.username, u.email]),
    ]);

    const [userRows] = await connection.query('SELECT id FROM users');
    const userIds = userRows.map((row) => row.id);

    const donationRows = donationFactory
      .make(DONATION_COUNT, userIds)
      .map((d) => [d.user_id, d.amount, d.currency, d.campaign, d.status]);

    await connection.query(
      'INSERT INTO donate (user_id, amount, currency, campaign, status) VALUES ?',
      [donationRows]
    );

    console.log(`Seeded ${users.length} users.`);
    console.log(`Seeded ${donationRows.length} donations.`);
  } finally {
    await connection.end();
  }
}

run()
  .then(() => {
    console.log('Seeding complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  });
