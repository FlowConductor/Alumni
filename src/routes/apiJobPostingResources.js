// Nested API routes under /api/job-postings — exposes resources that belong
// to a job posting.
//   GET /api/job-postings/:id/applications -> applications received for a posting

const express = require('express');
const apiApplicationController = require('../controllers/apiApplication.controller');

const router = express.Router();

router.get('/:id/applications', apiApplicationController.getByJobPosting);

module.exports = router;
