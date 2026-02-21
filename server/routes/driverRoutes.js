const express = require('express');
const { getDrivers, createDriver } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getDrivers);
router.post('/', protect, createDriver);

module.exports = router;
