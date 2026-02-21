const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    vehicleNumber: { type: String, required: true, unique: true, trim: true },
    avgRating: { type: Number, default: 5, min: 1, max: 5 },
    feedbackCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
