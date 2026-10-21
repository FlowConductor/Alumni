// Nested API routes under /api/users — exposes resources that belong to a user.
//   GET /api/users/:userId/donations     -> donations made by that user
//   GET /api/users/:userId/job-postings  -> job postings published by that user
//   GET /api/users/:userId/applications  -> job applications made by that user

const express = require('express');
const apiDonationController = require('../controllers/apiDonation.controller');
const apiJobPostingController = require('../controllers/apiJobPosting.controller');
const apiApplicationController = require('../controllers/apiApplication.controller');

const router = express.Router();

router.get('/:userId/donations', apiDonationController.getByUser);
router.get('/:userId/job-postings', apiJobPostingController.getByUser);
router.get('/:userId/applications', apiApplicationController.getByUser);

module.exports = router;
