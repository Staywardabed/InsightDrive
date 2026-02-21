const express = require('express');
const {
  submitFeedback,
  getMyFeedback,
  getAllFeedback,
  getFeedbackUsers,
  getDashboardAnalytics
} = require('../controllers/feedbackController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorizeRoles('user'), submitFeedback);
router.get('/mine', protect, authorizeRoles('user'), getMyFeedback);
router.get('/users', protect, authorizeRoles('admin'), getFeedbackUsers);
router.get('/all', protect, authorizeRoles('admin'), getAllFeedback);
router.get('/analytics', protect, authorizeRoles('admin'), getDashboardAnalytics);

module.exports = router;
