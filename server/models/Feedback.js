const mongoose = require('mongoose');

const entityTypes = ['driver', 'trip'];

const feedbackSectionSchema = new mongoose.Schema(
  {
    entity: { type: String, enum: entityTypes, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    tags: [{ type: String, trim: true }],
    comment: { type: String, trim: true }
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sections: {
      type: [feedbackSectionSchema],
      validate: [(arr) => arr.length > 0, 'At least one section is required']
    },
    tags: [{ type: String, trim: true }],
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
