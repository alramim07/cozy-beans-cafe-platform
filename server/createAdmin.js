// createAdmin.js - creates the admin user from env vars
// Run with: npm run create-admin
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/olive_oak_cafe';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 8) {
  console.error('❌ ADMIN_PASSWORD must be at least 8 characters');
  process.exit(1);
}

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existing) {
      console.log('ℹ️ Admin already exists. Updating password...');
      existing.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await existing.save();
      console.log('✅ Admin password updated');
    } else {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await Admin.create({ email: ADMIN_EMAIL.toLowerCase(), passwordHash });
      console.log('✅ Admin created');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin:', err.message);
    process.exit(1);
  }
}

createAdmin();