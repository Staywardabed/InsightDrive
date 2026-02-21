const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: true,          // must be true for HTTPS
  sameSite: 'none',      // REQUIRED for cross-origin
  maxAge: 24 * 60 * 60 * 1000
};

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || '');

    if (normalizedEmail === adminEmail) {
      return res.status(409).json({ message: 'This email is reserved for system admin' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'user'
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || '');
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    const adminName = process.env.ADMIN_NAME || 'System Admin';

    if (normalizedEmail === adminEmail && password === adminPassword && adminEmail && adminPassword) {
      const token = signToken({
        kind: 'admin',
        role: 'admin',
        name: adminName,
        email: adminEmail
      });

      res.cookie('token', token, cookieOptions);

      return res.status(200).json({
        message: 'Login successful',
        user: { id: 'admin', name: adminName, email: adminEmail, role: 'admin' }
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken({ id: user._id, role: 'user' });
    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
  });
  return res.status(200).json({ message: 'Logout successful' });
};

const me = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = {
  register,
  login,
  logout,
  me
};
