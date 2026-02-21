const express = require('express');
const { getFlags } = require('../controllers/featureFlagController');

const router = express.Router();

router.get('/', getFlags);

module.exports = router;
