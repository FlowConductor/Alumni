// Web routes for announcements — maps /announcements pages and forms
// to the Announcement controller.

const express = require('express');
const announcementController = require('../controllers/announcement.controller');

const router = express.Router();

router.get('/', announcementController.list);
router.get('/new', announcementController.createForm);
router.post('/', announcementController.create);
router.get('/:id', announcementController.details);
router.get('/:id/edit', announcementController.editForm);
router.post('/:id', announcementController.update);
router.post('/:id/delete', announcementController.remove);

module.exports = router;
