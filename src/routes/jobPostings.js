// Web routes for job postings — maps /job-postings pages and forms
// to the JobPosting controller.

const express = require('express');
const jobPostingController = require('../controllers/jobPosting.controller');

const router = express.Router();

router.get('/', jobPostingController.list);
router.get('/new', jobPostingController.createForm);
router.post('/', jobPostingController.create);
router.get('/:id', jobPostingController.details);
router.get('/:id/edit', jobPostingController.editForm);
router.post('/:id', jobPostingController.update);
router.post('/:id/delete', jobPostingController.remove);
router.post('/:id/apply', jobPostingController.apply);

module.exports = router;
