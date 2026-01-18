const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { rollNumber, phone } = req.body;

    if (!rollNumber || !phone) {
      return res.status(400).json({ message: 'Roll number and phone are required' });
    }

    // Check if user exists with this roll number
    const user = await User.findOne({ rollNumber });
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 3 minutes
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    // Save or update OTP in database
    await OTP.updateOne(
      { rollNumber },
      {
        rollNumber,
        otp,
        phone,
        email: user?.email,
        attempts: 0,
        expiresAt
      },
      { upsert: true }
    );

    // In production, send OTP via SMS/Email
    console.log(`OTP for ${rollNumber}: ${otp}`);
    // TODO: Integrate Twilio or SendGrid for actual SMS/Email

    res.json({
      message: 'OTP sent successfully',
      rollNumber,
      // For demo purposes only - remove in production
      demo_otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { rollNumber, otp } = req.body;

    if (!rollNumber || !otp) {
      return res.status(400).json({ message: 'Roll number and OTP are required' });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ rollNumber });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check max attempts
    if (otpRecord.attempts >= 3) {
      return res.status(400).json({ message: 'Maximum OTP attempts exceeded' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find user
    const user = await User.findOne({ rollNumber });

    if (!user) {
      // New user - return registration needed
      await OTP.deleteOne({ rollNumber });
      return res.json({
        message: 'OTP verified. Please complete registration.',
        status: 'new_user',
        rollNumber
      });
    }

    // Existing user - generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        rollNumber: user.rollNumber,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key',
      { expiresIn: '7d' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Delete OTP
    await OTP.deleteOne({ rollNumber });

    // Log audit
    // TODO: Add audit log

    res.json({
      message: 'Login successful',
      status: 'existing_user',
      token,
      refreshToken,
      user: {
        id: user._id,
        rollNumber: user.rollNumber,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Register new user (after OTP verification)
router.post('/register', async (req, res) => {
  try {
    const { rollNumber, fullName, email, phone, password, role = 'Student', department, course, semester } = req.body;

    if (!rollNumber || !fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ rollNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this roll number already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      rollNumber,
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      department,
      course,
      semester,
      isVerified: true // Verified through OTP
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        rollNumber: user.rollNumber,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        rollNumber: user.rollNumber,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key'
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newToken = jwt.sign(
      {
        userId: user._id,
        rollNumber: user.rollNumber,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // TODO: Add token to blacklist if needed

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

// Verify token (for frontend)
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

module.exports = router;