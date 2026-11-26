const express = require('express');
const router = express.Router();

const requireLogin = require('../../middleware/requireLogin');
const validateId = require('../../middleware/validateId');
const checkOwnership = require('../../middleware/checkOwnership');
const upload = require('../../middleware/upload');
const validateOpportunity = require('../../middleware/validateOpportunity');
const controller = require('./manageController');

// app.js mounts this BEFORE browseRoutes, so /opportunities/mine is never read as an :id.
router.get('/opportunities/mine', requireLogin, controller.showMine);

router.get('/opportunities/:id/edit',
  requireLogin, validateId, checkOwnership, controller.editForm);

router.post('/opportunities/:id/edit',
  requireLogin, validateId, checkOwnership, upload, validateOpportunity, controller.update);

router.post('/opportunities/:id/delete',
  requireLogin, validateId, checkOwnership, controller.remove);

module.exports = router;