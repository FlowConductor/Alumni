// Nested API routes under /api/users — exposes resources that belong to a user.
//   GET /api/users/:userId/donations     -> donations made by that user
//   GET /api/users/:userId/job-postings  -> job postings published by that user
//   GET /api/users/:userId/applications  -> job applications made by that user
//
// Donations and applications are personal records, so all three are staff/admin.

const express = require('express');
const apiDonationController = require('../controllers/apiDonation.controller');
const apiJobPostingController = require('../controllers/apiJobPosting.controller');
const apiApplicationController = require('../controllers/apiApplication.controller');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const STAFF = ['staff', 'admin'];

router.get('/:userId/donations', requireRole(...STAFF), apiDonationController.getByUser);
router.get('/:userId/job-postings', requireRole(...STAFF), apiJobPostingController.getByUser);
router.get('/:userId/applications', requireRole(...STAFF), apiApplicationController.getByUser);

module.exports = router;
