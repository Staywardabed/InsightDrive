const Driver = require('../models/Driver');

const getDrivers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Driver.find().sort({ avgRating: 1, createdAt: -1 }).skip(skip).limit(limit),
      Driver.countDocuments()
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return res.status(200).json({
      data,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createDriver = async (req, res) => {
  try {
    const { name, vehicleNumber } = req.body;

    if (!name || !vehicleNumber) {
      return res.status(400).json({ message: 'name and vehicleNumber are required' });
    }

    const driver = await Driver.create({ name, vehicleNumber });
    return res.status(201).json({ data: driver });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDrivers,
  createDriver
};
