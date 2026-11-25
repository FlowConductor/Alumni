// API routes for job applications.
//   alumni        may create an application (apply)
//   staff / admin may read every application, change a status, or remove one

const express = require('express');
const apiApplicationController = require('../controllers/apiApplication.controller');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const STAFF = ['staff', 'admin'];

router.get('/', requireRole(...STAFF), apiApplicationController.getAll);
router.get('/:id', requireRole(...STAFF), apiApplicationController.getById);

router.post('/', requireRole('alumni'), apiApplicationController.create);
router.put('/:id', requireRole(...STAFF), apiApplicationController.update);
router.patch('/:id', requireRole(...STAFF), apiApplicationController.update);
router.delete('/:id', requireRole(...STAFF), apiApplicationController.remove);

module.exports = router;
