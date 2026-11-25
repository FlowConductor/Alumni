// API routes for announcements — reads are public, writes are staff or admin.

const express = require('express');
const apiAnnouncementController = require('../controllers/apiAnnouncement.controller');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const STAFF = ['staff', 'admin'];

router.get('/', apiAnnouncementController.getAll);
router.get('/:id', apiAnnouncementController.getById);

router.post('/', requireRole(...STAFF), apiAnnouncementController.create);
router.put('/:id', requireRole(...STAFF), apiAnnouncementController.update);
router.patch('/:id', requireRole(...STAFF), apiAnnouncementController.update);
router.delete('/:id', requireRole(...STAFF), apiAnnouncementController.remove);

module.exports = router;
