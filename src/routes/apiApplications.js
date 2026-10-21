// API routes for job applications — maps /api/applications endpoints
// to the ApiApplication controller (direct routes).

const express = require('express');
const apiApplicationController = require('../controllers/apiApplication.controller');

const router = express.Router();

router.get('/', apiApplicationController.getAll);
router.post('/', apiApplicationController.create);
router.get('/:id', apiApplicationController.getById);
router.put('/:id', apiApplicationController.update);
router.patch('/:id', apiApplicationController.update);
router.delete('/:id', apiApplicationController.remove);

module.exports = router;
