const AppFeedback = require('../models/AppFeedback');

const submitAppFeedback = async (req, res) => {
  try {
    const { rating, tags = [], comment = '' } = req.body;

    if (!Number.isFinite(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5' });
    }

    const existing = await AppFeedback.findOne({ submittedBy: req.user.id }).sort({ updatedAt: -1, createdAt: -1 });
    if (existing) {
      existing.rating = Number(rating);
      existing.tags = tags;
      existing.comment = comment;
      existing.submittedAt = new Date();
      await existing.save();
      await AppFeedback.deleteMany({ submittedBy: req.user.id, _id: { $ne: existing._id } });

      return res.status(200).json({
        message: 'App feedback updated',
        data: existing
      });
    }

    const created = await AppFeedback.create({
      rating: Number(rating),
      tags,
      comment,
      submittedBy: req.user.id
    });

    return res.status(201).json({
      message: 'App feedback submitted',
      data: created
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyAppFeedback = async (req, res) => {
  try {
    const data = await AppFeedback.findOne({ submittedBy: req.user.id }).sort({ updatedAt: -1, createdAt: -1 });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitAppFeedback,
  getMyAppFeedback
};
