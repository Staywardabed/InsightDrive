const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { generateSampleRide, getMyRides, getMyCurrentRide } = require('../controllers/rideController');

const router = express.Router();

router.post('/generate', protect, authorizeRoles('user'), generateSampleRide);
router.get('/mine', protect, authorizeRoles('user'), getMyRides);
router.get('/current', protect, authorizeRoles('user'), getMyCurrentRide);

module.exports = router;
