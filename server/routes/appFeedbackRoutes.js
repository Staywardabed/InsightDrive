const express = require('express');
const { submitAppFeedback, getMyAppFeedback } = require('../controllers/appFeedbackController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/mine', protect, authorizeRoles('user'), getMyAppFeedback);
router.post('/', protect, authorizeRoles('user'), submitAppFeedback);

module.exports = router;
