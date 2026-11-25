// Web routes for users — maps /users pages and forms to the User controller.
// Reading the directory needs any signed-in member; writing needs staff or admin;
// deleting needs an administrator (ddd.md section 8).

const express = require('express');
const userController = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const STAFF = ['staff', 'admin'];

router.get('/', requireAuth, userController.list);
router.get('/new', requireRole(...STAFF), userController.createForm);
router.post('/', requireRole(...STAFF), userController.create);
router.get('/:id', requireAuth, userController.details);
router.get('/:id/edit', requireRole(...STAFF), userController.editForm);
router.post('/:id', requireRole(...STAFF), userController.update);
router.post('/:id/delete', requireRole('admin'), userController.remove);

module.exports = router;
