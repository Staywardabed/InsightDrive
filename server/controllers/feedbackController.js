const Driver = require('../models/Driver');
const Feedback = require('../models/Feedback');
const Ride = require('../models/Ride');
const User = require('../models/User');

const toNumber = (value) => Number(value) || 0;

const submitFeedback = async (req, res) => {
  try {
    const { rideId, driverId, sections = [], tags = [] } = req.body;

    if (!Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ message: 'sections are required' });
    }

    let ride = null;
    let resolvedDriverId = driverId;

    if (rideId) {
      ride = await Ride.findById(rideId);
      if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
      }

      if (String(ride.user) !== String(req.user.id)) {
        return res.status(403).json({ message: 'You can only submit feedback for your own ride' });
      }

      if (ride.status !== 'generated') {
        return res.status(400).json({ message: 'Feedback already submitted for this ride' });
      }

      resolvedDriverId = ride.driver;
    }

    if (!resolvedDriverId) {
      return res.status(400).json({ message: 'rideId or driverId is required' });
    }

    const driver = await Driver.findById(resolvedDriverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const feedback = await Feedback.create({
      driver: resolvedDriverId,
      ride: ride?._id,
      submittedBy: req.user?.id,
      sections,
      tags
    });

    const stats = await Feedback.aggregate([
      { $match: { driver: driver._id } },
      { $unwind: '$sections' },
      { $match: { 'sections.entity': 'driver' } },
      {
        $group: {
          _id: '$driver',
          avgRating: { $avg: '$sections.rating' },
          feedbackCount: { $sum: 1 }
        }
      }
    ]);

    const avgRating = stats.length ? Number(stats[0].avgRating.toFixed(2)) : driver.avgRating;
    const feedbackCount = stats.length ? toNumber(stats[0].feedbackCount) : driver.feedbackCount;

    driver.avgRating = avgRating;
    driver.feedbackCount = feedbackCount;
    await driver.save();

    if (ride) {
      ride.status = 'feedback_submitted';
      await ride.save();
    }

    if (avgRating < 2.5) {
      const io = req.app.get('io');
      io.emit('low-score-alert', {
        driverId: driver._id,
        driverName: driver.name,
        avgRating,
        feedbackCount,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(201).json({
      message: 'Feedback submitted',
      data: feedback,
      driver
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyFeedback = async (req, res) => {
  try {
    const data = await Feedback.find({ submittedBy: req.user.id })
      .populate('driver', 'name vehicleNumber')
      .populate('ride', 'rideCode status createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const isRecentSort = req.query.sortOrder === 'recent';

    const aggregateResult = await Feedback.aggregate([
      {
        $addFields: {
          feedbackTime: { $ifNull: ['$createdAt', '$submittedAt'] },
          avgRating: {
            $cond: [
              { $gt: [{ $size: '$sections' }, 0] },
              { $avg: '$sections.rating' },
              0
            ]
          }
        }
      },
      {
        $sort: isRecentSort
          ? { feedbackTime: -1, _id: -1 }
          : { avgRating: sortOrder, feedbackTime: -1, _id: -1 }
      },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: 'drivers',
                localField: 'driver',
                foreignField: '_id',
                as: 'driver'
              }
            },
            { $unwind: { path: '$driver', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'rides',
                localField: 'ride',
                foreignField: '_id',
                as: 'ride'
              }
            },
            { $unwind: { path: '$ride', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'users',
                localField: 'submittedBy',
                foreignField: '_id',
                as: 'submittedBy'
              }
            },
            { $unwind: { path: '$submittedBy', preserveNullAndEmptyArrays: true } }
          ],
          totalCount: [{ $count: 'total' }]
        }
      }
    ]);

    const data = aggregateResult?.[0]?.data || [];
    const total = aggregateResult?.[0]?.totalCount?.[0]?.total || 0;

    const totalPages = Math.max(Math.ceil(total / limit), 1);
    return res.status(200).json({
      data,
      total,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFeedbackUsers = async (_req, res) => {
  try {
    const users = await User.find({ _id: { $in: await Feedback.distinct('submittedBy') } })
      .select('name email')
      .sort({ email: 1 });

    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDashboardAnalytics = async (_req, res) => {
  try {
    const sentimentBreakdown = await Feedback.aggregate([
      { $unwind: '$sections' },
      {
        $project: {
          bucket: {
            $switch: {
              branches: [
                { case: { $gte: ['$sections.rating', 4] }, then: 'positive' },
                { case: { $gte: ['$sections.rating', 2.5] }, then: 'neutral' }
              ],
              default: 'negative'
            }
          }
        }
      },
      { $group: { _id: '$bucket', value: { $sum: 1 } } }
    ]);

    const since = new Date();
    since.setDate(since.getDate() - 29);

    const trend = await Feedback.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $unwind: '$sections' },
      {
        $group: {
          _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } },
          avgRating: { $avg: '$sections.rating' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    return res.status(200).json({
      sentiment: sentimentBreakdown,
      trend: trend.map((item) => ({ date: item._id.date, value: Number(item.avgRating.toFixed(2)) }))
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getMyFeedback,
  getAllFeedback,
  getFeedbackUsers,
  getDashboardAnalytics
};
