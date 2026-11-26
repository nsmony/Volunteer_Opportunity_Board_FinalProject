const express = require('express');
const router = express.Router();

const validateId = require('../../middleware/validateId');
const validateSearch = require('./browseValidation');
const controller = require('./browseController');

// Public pages: no login needed.
router.get('/opportunities', validateSearch, controller.list);
router.get('/opportunities/:id', validateId, controller.detail);

module.exports = router;