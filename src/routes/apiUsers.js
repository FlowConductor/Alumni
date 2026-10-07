// API routes for users — maps /api/users endpoints to the ApiUser controller.

const express = require('express');
const apiUserController = require('../controllers/apiUser.controller');

const router = express.Router();

router.get('/', apiUserController.getAll);
router.post('/', apiUserController.create);
router.get('/:id', apiUserController.getById);
router.put('/:id', apiUserController.update);
router.patch('/:id', apiUserController.update);
router.delete('/:id', apiUserController.remove);

module.exports = router;
