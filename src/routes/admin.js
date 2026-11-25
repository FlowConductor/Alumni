// Admin routes — the administrator control panel (/admin).
// Every route here needs the admin role: the panel can change roles, which is the
// one capability the matrix in ddd.md section 8 reserves for administrators.

const express = require('express');
const adminController = require('../controllers/admin.controller');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireRole('admin'));

router.get('/', adminController.overview);

router.get('/users', adminController.users);
router.post('/users/:id/role', adminController.updateRole);
router.post('/users/:id/delete', adminController.removeUser);

router.get('/applications', adminController.applications);
router.post('/applications/:id/status', adminController.updateApplicationStatus);
router.post('/applications/:id/delete', adminController.removeApplication);

router.get('/donations', adminController.donations);
router.post('/donations', adminController.createDonation);
router.post('/donations/:id/status', adminController.updateDonationStatus);
router.post('/donations/:id/delete', adminController.removeDonation);

module.exports = router;
