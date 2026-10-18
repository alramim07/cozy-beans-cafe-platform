// Olive & Oak Cafe - Express server entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const menuRoutes = require('./routes/menuRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/olive_oak_cafe';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ---------- Security & Middleware ----------
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ---------- Routes ----------
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Public API
app.use('/api/menu', menuRoutes);
app.use('/api/contact', contactRoutes);

// Admin API (protected)
app.use('/api/admin', adminRoutes);

// 404 for unknown API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// ---------- Start ----------
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const server = app.listen(PORT, '127.0.0.1', () => {
      console.log(`Olive & Oak API running on http://localhost:${PORT}`);
      console.log('Server is listening...');
    });
    server.on('error', (err) => {
      console.error('Server listen error:', err);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });