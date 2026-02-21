const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    rideCode: { type: String, required: true, unique: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    status: { type: String, enum: ['generated', 'feedback_submitted'], default: 'generated' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);
