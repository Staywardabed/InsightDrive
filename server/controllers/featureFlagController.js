const FeatureFlag = require('../models/FeatureFlag');

const defaults = {
  driverFeedback: true,
  tripFeedback: true,
  appFeedback: true,
  marshalFeedback: false
};

const getFlags = async (_req, res) => {
  try {
    const flags = await FeatureFlag.find();

    if (!flags.length) {
      const seeded = await FeatureFlag.insertMany(
        Object.entries(defaults).map(([key, enabled]) => ({ key, enabled }))
      );

      const seededMap = seeded.reduce((acc, flag) => {
        acc[flag.key] = flag.enabled;
        return acc;
      }, {});

      return res.status(200).json(seededMap);
    }

    const map = flags.reduce((acc, flag) => {
      acc[flag.key] = flag.enabled;
      return acc;
    }, {});

    return res.status(200).json(map);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getFlags };
