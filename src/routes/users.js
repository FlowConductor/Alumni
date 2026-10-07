// Web routes for users — maps /users pages and forms to the User controller.

const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/', userController.list);
router.post('/', userController.create);
router.get('/:id', userController.details);
router.post('/:id', userController.update);
router.post('/:id/delete', userController.remove);

module.exports = router;
