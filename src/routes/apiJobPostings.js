// API routes for job postings — maps /api/job-postings endpoints
// to the ApiJobPosting controller (direct routes).

const express = require('express');
const apiJobPostingController = require('../controllers/apiJobPosting.controller');

const router = express.Router();

router.get('/', apiJobPostingController.getAll);
router.post('/', apiJobPostingController.create);
router.get('/:id', apiJobPostingController.getById);
router.put('/:id', apiJobPostingController.update);
router.patch('/:id', apiJobPostingController.update);
router.delete('/:id', apiJobPostingController.remove);

module.exports = router;
