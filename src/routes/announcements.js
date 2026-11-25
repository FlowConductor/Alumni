// Web routes for announcements — reads are public, writes are staff or admin.

const express = require('express');
const announcementController = require('../controllers/announcement.controller');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const STAFF = ['staff', 'admin'];

router.get('/', announcementController.list);

router.get('/new', requireRole(...STAFF), announcementController.createForm);
router.post('/', requireRole(...STAFF), announcementController.create);
router.get('/:id/edit', requireRole(...STAFF), announcementController.editForm);
router.post('/:id', requireRole(...STAFF), announcementController.update);
router.get('/:id', announcementController.details);
router.post('/:id/delete', requireRole(...STAFF), announcementController.remove);

module.exports = router;
