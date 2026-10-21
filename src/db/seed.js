// Database Seeder — truncates the users, donate, job_postings, and
// job_applications tables and repopulates them with fake records
// from the factories.
// Usage: node src/db/seed.js  (or npm run seed)

require('dotenv').config();
const mysql = require('mysql2/promise');
const userFactory = require('./factories/user.factory');
const donationFactory = require('./factories/donation.factory');
const jobPostingFactory = require('./factories/jobPosting.factory');
const applicationFactory = require('./factories/application.factory');

const USER_COUNT = Number(process.env.SEED_USERS || 20);
const DONATION_COUNT = Number(process.env.SEED_DONATIONS || 40);
const JOB_POSTING_COUNT = Number(process.env.SEED_JOB_POSTINGS || 15);
const APPLICATION_COUNT = Number(process.env.SEED_APPLICATIONS || 20);

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

    console.log(
      `Seeding ${users.length} users, ${DONATION_COUNT} donations, ` +
      `${JOB_POSTING_COUNT} job postings, ${APPLICATION_COUNT} applications...`
    );

    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE job_applications');
    await connection.query('TRUNCATE TABLE job_postings');
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

    const postingRows = jobPostingFactory
      .make(JOB_POSTING_COUNT, userIds)
      .map((p) => [p.posted_by, p.title, p.company, p.description, p.location, p.status]);
    await connection.query(
      'INSERT INTO job_postings (posted_by, title, company, description, location, status) VALUES ?',
      [postingRows]
    );
    const [postingRowsOut] = await connection.query('SELECT id FROM job_postings');
    const postingIds = postingRowsOut.map((row) => row.id);

    const applicationRows = applicationFactory
      .make(APPLICATION_COUNT, userIds, postingIds)
      .map((a) => [a.job_posting_id, a.user_id, a.status, a.cover_letter]);
    await connection.query(
      'INSERT INTO job_applications (job_posting_id, user_id, status, cover_letter) VALUES ?',
      [applicationRows]
    );

    console.log(`Seeded ${users.length} users.`);
    console.log(`Seeded ${donationRows.length} donations.`);
    console.log(`Seeded ${postingRows.length} job postings.`);
    console.log(`Seeded ${applicationRows.length} applications.`);
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
