const mongoose = require('mongoose');

const appFeedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    tags: [{ type: String, trim: true }],
    comment: { type: String, trim: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AppFeedback', appFeedbackSchema);
