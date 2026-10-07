// API routes for announcements — maps /api/announcements endpoints
// to the ApiAnnouncement controller.

const express = require('express');
const apiAnnouncementController = require('../controllers/apiAnnouncement.controller');

const router = express.Router();

router.get('/', apiAnnouncementController.getAll);
router.post('/', apiAnnouncementController.create);
router.get('/:id', apiAnnouncementController.getById);
router.put('/:id', apiAnnouncementController.update);
router.patch('/:id', apiAnnouncementController.update);
router.delete('/:id', apiAnnouncementController.remove);

module.exports = router;
