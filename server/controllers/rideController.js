const Driver = require('../models/Driver');
const Ride = require('../models/Ride');

const generateRideCode = () => {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `RIDE-${Date.now()}-${suffix}`;
};

const generateSampleRide = async (req, res) => {
  try {
    const drivers = await Driver.find({}).limit(200);

    if (!drivers.length) {
      return res.status(400).json({ message: 'No drivers available. Please add drivers first.' });
    }

    const randomIndex = Math.floor(Math.random() * drivers.length);
    const assignedDriver = drivers[randomIndex];

    const ride = await Ride.create({
      rideCode: generateRideCode(),
      user: req.user.id,
      driver: assignedDriver._id,
      status: 'generated'
    });

    const populatedRide = await Ride.findById(ride._id).populate('driver');

    return res.status(201).json({ data: populatedRide });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to generate ride' });
  }
};

const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.id })
      .populate('driver')
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ data: rides });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyCurrentRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({ user: req.user.id, status: 'generated' })
      .populate('driver')
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: ride || null });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateSampleRide,
  getMyRides,
  getMyCurrentRide
};
