// Auth middleware - verifies JWT from httpOnly cookie or Authorization header
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

async function auth(req, res, next) {
  try {
    // Try to get token from cookie first, then from Authorization header
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) {
      return res.status(401).json({ error: 'Admin no longer exists' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    next(err);
  }
}

module.exports = auth;