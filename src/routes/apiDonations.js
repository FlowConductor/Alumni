// API routes for donations — financial records, so every route is staff or admin.

const express = require('express');
const apiDonationController = require('../controllers/apiDonation.controller');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const STAFF = ['staff', 'admin'];

router.get('/', requireRole(...STAFF), apiDonationController.getAll);
router.get('/:id', requireRole(...STAFF), apiDonationController.getById);
router.post('/', requireRole(...STAFF), apiDonationController.create);
router.put('/:id', requireRole(...STAFF), apiDonationController.update);
router.patch('/:id', requireRole(...STAFF), apiDonationController.update);
router.delete('/:id', requireRole(...STAFF), apiDonationController.remove);

module.exports = router;
