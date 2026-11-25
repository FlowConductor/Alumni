// Web routes for job postings — reads are public, writes are staff or admin,
// applying needs a signed-in alumnus (ddd.md section 8).
//
// An employer account cannot publish yet: postings do not record which company
// account owns them, so ownership cannot be checked. See ddd.md section 8.

const express = require('express');
const jobPostingController = require('../controllers/jobPosting.controller');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const STAFF = ['staff', 'admin'];

router.get('/', jobPostingController.list);

router.get('/new', requireRole(...STAFF), jobPostingController.createForm);
router.post('/', requireRole(...STAFF), jobPostingController.create);
router.get('/:id/edit', requireRole(...STAFF), jobPostingController.editForm);
router.post('/:id', requireRole(...STAFF), jobPostingController.update);
router.get('/:id', jobPostingController.details);
router.post('/:id/delete', requireRole(...STAFF), jobPostingController.remove);
router.post('/:id/apply', requireRole('alumni'), jobPostingController.apply);

module.exports = router;
