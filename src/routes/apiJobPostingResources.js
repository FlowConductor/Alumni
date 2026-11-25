// Nested API routes under /api/job-postings — exposes resources that belong to a
// job posting.
//   GET /api/job-postings/:id/applications -> applications received for a posting
//
// Reading applicants is staff/admin work; an applicant reads their own record
// through /api/applications/:id.

const express = require('express');
const apiApplicationController = require('../controllers/apiApplication.controller');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/:id/applications',
  requireRole('staff', 'admin'),
  apiApplicationController.getByJobPosting
);

module.exports = router;
