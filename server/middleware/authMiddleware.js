const jwt = require('jsonwebtoken');
const User = require('../models/User');

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.kind === 'admin' && decoded?.role === 'admin') {
      const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || '');
      if (!adminEmail || normalizeEmail(decoded.email) !== adminEmail) {
        return res.status(401).json({ message: 'Invalid admin token' });
      }

      req.user = {
        id: 'admin',
        name: decoded.name || process.env.ADMIN_NAME || 'System Admin',
        email: adminEmail,
        role: 'admin'
      };

      return next();
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
  };
};

module.exports = { protect, authorizeRoles };
