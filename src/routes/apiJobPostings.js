// API routes for job postings — reads are public, writes are staff or admin.

const express = require('express');
const apiJobPostingController = require('../controllers/apiJobPosting.controller');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const STAFF = ['staff', 'admin'];

router.get('/', apiJobPostingController.getAll);
router.get('/:id', apiJobPostingController.getById);

router.post('/', requireRole(...STAFF), apiJobPostingController.create);
router.put('/:id', requireRole(...STAFF), apiJobPostingController.update);
router.patch('/:id', requireRole(...STAFF), apiJobPostingController.update);
router.delete('/:id', requireRole(...STAFF), apiJobPostingController.remove);

module.exports = router;
