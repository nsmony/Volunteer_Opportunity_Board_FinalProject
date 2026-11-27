const express = require('express');
const controller = require('./browseController');
const validateId = require('../../middleware/validateId');
const { cleanSearch } = require('./browseValidation');

const router = express.Router();

router.get('/opportunities', cleanSearch, controller.list);
router.get('/opportunities/:id', validateId, controller.detail);

module.exports = router;
