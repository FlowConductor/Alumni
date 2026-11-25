// Routes for the signed-in member's own pages (/me).
// Everything here needs a session and nothing else: the handlers work on
// req.session.user.id, so there is no id in the URL to tamper with.

const express = require('express');
const meController = require('../controllers/me.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', meController.profile);
router.get('/edit', meController.editForm);
router.post('/', meController.update);

module.exports = router;
