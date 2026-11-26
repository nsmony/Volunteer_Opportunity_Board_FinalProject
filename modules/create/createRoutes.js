const express = require('express');
const router = express.Router();

const requireLogin = require('../../middleware/requireLogin');
const upload = require('../../middleware/upload');
const validateOpportunity = require('../../middleware/validateOpportunity');
const controller = require('./createController');

router.get('/opportunities/new', requireLogin, controller.showForm);
router.post('/opportunities', requireLogin, upload, validateOpportunity, controller.create);

module.exports = router;