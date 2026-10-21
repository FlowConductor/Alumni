// API routes for donations — maps /api/donations endpoints
// to the ApiDonation controller (direct routes).

const express = require('express');
const apiDonationController = require('../controllers/apiDonation.controller');

const router = express.Router();

router.get('/', apiDonationController.getAll);
router.post('/', apiDonationController.create);
router.get('/:id', apiDonationController.getById);
router.put('/:id', apiDonationController.update);
router.patch('/:id', apiDonationController.update);
router.delete('/:id', apiDonationController.remove);

module.exports = router;
